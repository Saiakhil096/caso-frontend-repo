import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { amber } from '@material-ui/core/colors';
import {
  Table,
  TableHead,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  Button,
  Toolbar,
  Typography,
  IconButton,
  Grid,
  Paper,
  TextField,
  InputAdornment
} from '@material-ui/core';
import { Star, StarBorder, Search } from '@material-ui/icons';
import { fetchPersonas, updatePersona } from '../../common/API';

const useStyles = makeStyles(theme => ({
  title: {
    flex: '1 1 100%'
  },
  tableWrapper: {
    padding: theme.spacing(2),
    width: '100%',
    minWidth: '750px'
  },
  tableRow: {
    cursor: 'pointer'
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  },
  favourite: {
    color: amber[500]
  }
}));

const theme = createMuiTheme({
  typography: {
    body1: {
      fontWeight: 500,
      fontSize: 16
    }
  }
});

function ViewProfiles(props) {
  const classes = useStyles();
  const { url } = useRouteMatch();
  const [userProfiles, setUserProfiles] = useState([]);
  const [cursor, setCursor] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  props.setTitle('Persona Selection');
  useEffect(() => {
    fetchPersonas(props.onMessage, true).then(data => setUserProfiles(data));
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const UserProfilesCopy = JSON.parse(JSON.stringify(userProfiles));
      const filteredUserProfiles = UserProfilesCopy.filter(
        userProfile =>
          (userProfile.profile_name && userProfile.profile_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) ||
          (userProfile.persona_job_role.job_role && userProfile.persona_job_role.job_role.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
      );
      setFilteredItems(filteredUserProfiles);
    } else {
      setFilteredItems(userProfiles);
    }
  }, [searchTerm, userProfiles]);

  const TableToolbar = () => {
    return (
      <Toolbar>
        <Typography className={classes.title} variant="h6" id="tableTitle" component="h2">
          Profiles
        </Typography>
        <TextField
          autoFocus
          value={searchTerm}
          onFocus={e => (e.target.selectionStart = cursor)}
          onChange={e => {
            setCursor(e.target.selectionStart);
            setSearchTerm(e.target.value);
          }}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            )
          }}
        />
      </Toolbar>
    );
  };

  const handleFavourite = (e, index) => {
    e.preventDefault();
    const userId = parseInt(Cookies.get('user'));
    const favourited_by = JSON.parse(JSON.stringify(userProfiles[index].favourited_by));
    const favouritedIndex = favourited_by.findIndex(user => user.id === userId);
    if (favouritedIndex !== -1) {
      favourited_by.splice(favouritedIndex, 1);
    } else {
      favourited_by.push({
        id: userId
      });
    }
    updatePersona(userProfiles[index].id, { favourited_by }, props.onMessage).then(() =>
      fetchPersonas(props.onMessage, false).then(data => setUserProfiles(data))
    );
  };

  return (
    <React.Fragment>
      <Grid container justify="center">
        <Grid item>
          <Grid item container justify="flex-end" style={{ marginTop: '1cm' }}>
            <Button data-testid="create-new" variant="contained" color="primary" component={RouterLink} to={`${url}/create`}>
              Create New
            </Button>
          </Grid>
          <Paper className={classes.paper}>
            <TableToolbar />
            <TableContainer component={Paper} className={classes.tableWrapper}>
              <Table size="small" aria-label="Profiles table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <ThemeProvider theme={theme}>
                        <Typography>Id</Typography>
                      </ThemeProvider>
                    </TableCell>
                    <TableCell>
                      <ThemeProvider theme={theme}>
                        <Typography>Persona Job Role</Typography>
                      </ThemeProvider>
                    </TableCell>
                    <TableCell>
                      <ThemeProvider theme={theme}>
                        <Typography>Persona Name</Typography>
                      </ThemeProvider>
                    </TableCell>
                    <TableCell align="center">
                      <ThemeProvider theme={theme}>
                        <Typography>Favourite</Typography>
                      </ThemeProvider>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredItems.length < 1 ? (
                    <TableRow style={{ height: '50px' }} className={classes.tableRow} hover>
                      <TableCell colSpan={6} align="center">
                        No result found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((userProfile, index) => (
                      <TableRow
                        key={userProfile.id}
                        className={classes.tableRow}
                        hover
                        component={RouterLink}
                        to={`${url}/detailed-view/${userProfile.id}`}>
                        <TableCell>{userProfile.id}</TableCell>
                        <TableCell>{userProfile.persona_job_role !== null ? userProfile.persona_job_role.job_role : null}</TableCell>
                        <TableCell>{userProfile.profile_name}</TableCell>
                        <TableCell align="center">
                          <IconButton aria-label="favourite" className={classes.favourite} onClick={e => handleFavourite(e, index)}>
                            {userProfile.favourited_by.find(user => user.id === parseInt(Cookies.get('user'))) ? <Star /> : <StarBorder />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default ViewProfiles;
