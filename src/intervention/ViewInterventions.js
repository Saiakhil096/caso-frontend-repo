import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Toolbar,
  Typography,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  Table,
  TableHead,
  TableBody,
  TableContainer,
  TableRow,
  TableCell
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { fetchInterventions } from '../common/API';

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
  }
}));

function ViewInterventions(props) {
  const classes = useStyles();
  const [interventions, setInterventions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const { onMessage } = props;
  const [cursor, setCursor] = useState(false);

  useEffect(() => {
    fetchInterventions(onMessage, true).then(data => {
      setInterventions(data);
    });
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const interventionsCopy = JSON.parse(JSON.stringify(interventions));
      const filteredInvterventions = interventionsCopy.filter(
        intervention =>
          intervention.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          intervention.users
            .map(i => i.username)
            .toString()
            .toLowerCase()
            .indexOf(searchTerm.toLowerCase()) !== -1 ||
          intervention.persona_job_roles
            .map(i => i.job_role)
            .toString()
            .toLowerCase()
            .indexOf(searchTerm.toLowerCase()) !== -1 ||
          intervention.release_category.category.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          intervention.SectionHeader.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
      );
      setFilteredItems(filteredInvterventions);
    } else {
      setFilteredItems(interventions);
      setCursor(false);
    }
  }, [searchTerm, interventions]);

  const TableToolbar = () => {
    return (
      <Toolbar>
        <Typography className={classes.title} variant="h6" id="tableTitle" component="h2">
          Interventions
        </Typography>
        <TextField
          value={searchTerm}
          autoFocus={cursor}
          onBlur={() => {
            setCursor(false);
          }}
          onChange={e => {
            setCursor(true);
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

  return (
    <React.Fragment>
      <Grid container justify="center">
        <Grid item>
          <Paper className={classes.paper}>
            <TableToolbar />
            <TableContainer component={Paper} className={classes.tableWrapper}>
              <Table size="small" aria-label="projects table">
                <TableHead>
                  <TableRow>
                    <TableCell>Name of Intervention</TableCell>
                    <TableCell>Change Agent</TableCell>
                    <TableCell>Employee</TableCell>
                    <TableCell>Release Category</TableCell>
                    <TableCell>Sub Heading </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody data-testid="tbody-element">
                  {filteredItems.length < 1 ? (
                    <TableRow style={{ height: '50px' }} className={classes.tableRow} hover>
                      <TableCell colSpan={6} align="center">
                        No result found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((intervention, index) => (
                      <TableRow key={intervention.id} className={classes.tableRow} hover>
                        <TableCell>{intervention.name}</TableCell>
                        <TableCell>{intervention.users.map(i => i.username).join(' , ')}</TableCell>
                        <TableCell>{intervention.persona_job_roles.map(i => i.job_role).join(' , ')}</TableCell>
                        <TableCell>{intervention.release_category.category}</TableCell>
                        <TableCell>{intervention.SectionHeader.split('_').join(' ')}</TableCell>
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

export default ViewInterventions;
