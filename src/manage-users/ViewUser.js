import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Search, MoreVert as MoreVertIcon } from '@material-ui/icons';
import Cookies from 'js-cookie';
import {
  Grid,
  Paper,
  TextField,
  InputAdornment,
  Toolbar,
  Typography,
  Button,
  Table,
  IconButton,
  TableHead,
  TableBody,
  Menu,
  MenuItem,
  TableContainer,
  TableRow,
  TableCell
} from '@material-ui/core';
import { fetchUsers, updateUser } from '../common/API';
import { Link, useRouteMatch, useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  title: {
    flex: '1 1 100%'
  },
  tableWrapper: {
    padding: theme.spacing(2),
    width: '100%',
    minWidth: '750px'
  },

  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3)
  }
}));

function ViewUser(props) {
  const classes = useStyles();
  const inputRef = React.useRef();
  const { url } = useRouteMatch();
  const [cursor, setCursor] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [refreshUsers, setRefreshUsers] = useState(true);
  const [actionList, setActionList] = useState(['Edit User', 'Ambition Setting', 'Delete User']);
  const [actionUser, setActionUser] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { onMessage } = props;
  const history = useHistory();

  useEffect(() => {
    if (refreshUsers) {
      fetchUsers(onMessage)
        .then(data => setUsers(data))
        .then(() => setRefreshUsers(false))
        .catch(e => props.onMessage(e, 'error'));
    }
  }, [refreshUsers]);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const UsersCopy = JSON.parse(JSON.stringify(users));
      const filteredUsers = UsersCopy.filter(user => user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
      setFilteredItems(filteredUsers);
    } else {
      setFilteredItems(users);
      setCursor(false);
    }
  }, [searchTerm, users]);

  const deleteUser = (event, user) => {
    event.preventDefault();
    const oProjects = { projects: [] };
    if (`${user.id}` === Cookies.get('user')) {
      props.onMessage("You can't delete your own account", 'error');
    } else {
      updateUser(user.id, oProjects, props.onMessage)
        .then(data => onMessage(`User "${user.username}" has been deleted successfully`, 'success'))
        .then(() => setRefreshUsers(true))
        .catch(e => console.error(e));
    }
  };

  const addAmbitionSetting = (event, user) => {
    Cookies.set('ambitionSettingUser', user.id);
    history.push('/ambition-setting');
  };

  const editUser = (event, user) => {
    event.preventDefault();
    if (`${user.id}` === Cookies.get('user')) {
      props.onMessage("You can't edit your own account", 'error');
    } else {
      Cookies.set('editUser', user.id);
      history.push(`${url}/edit`);
    }
  };

  const handleAction = (e, newValue) => {
    var user = actionUser;
    if (newValue === 'Edit User') {
      editUser(e, user);
      setActionUser(null);
    }
    if (newValue === 'Delete User') {
      deleteUser(e, user);
      setActionUser(null);
    }
    if (newValue === 'Ambition Setting') {
      addAmbitionSetting(e, user);
      setActionUser(null);
    }
    setRefreshUsers(true);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDropdown = (event, user) => {
    setActionUser(user);
    setAnchorEl(event.currentTarget);
  };
  const TableToolbar = props => {
    return (
      <Toolbar>
        <Typography className={classes.title} variant="h6" id="tableTitle" component="h2">
          Users
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
          <Grid container justify="flex-end" style={{ marginTop: '1cm' }}>
            <Grid item>
              <Button variant="contained" color="primary" component={Link} to={`${url}/create`} data-testid="add-user">
                Add New User
              </Button>
            </Grid>
          </Grid>
          <Paper className={classes.paper}>
            <TableToolbar />
            <TableContainer component={Paper} className={classes.tableWrapper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">User Id</TableCell>
                    <TableCell>User Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell colSpan={2}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody data-testid="tbody-element">
                  {filteredItems.length < 1 ? (
                    <TableRow style={{ height: '50px' }}>
                      <TableCell colSpan={6} align="center">
                        No result found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map(user => (
                      <TableRow key={users.id}>
                        <TableCell component="th" scope="row" align="center">
                          {user.id}
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell align="left">
                          <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={e => {
                              handleDropdown(e, user);
                            }}>
                            <MoreVertIcon />
                          </IconButton>
                          <Menu id="long-menu" anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
                            {actionList.map(option => (
                              <MenuItem key={option} onClick={e => handleAction(e, option)}>
                                {option}
                              </MenuItem>
                            ))}
                          </Menu>
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

export default ViewUser;
