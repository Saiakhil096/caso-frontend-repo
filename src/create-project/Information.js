import React, { useState, useEffect } from 'react';
import { Route, Link as RouterLink, useRouteMatch, useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  List,
  ListItem,
  ListItemSecondaryAction,
  TextField,
  Toolbar,
  Typography,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableContainer,
  TableRow,
  TableCell
} from '@material-ui/core';
import { Star, StarBorder, Delete } from '@material-ui/icons';
import { amber, grey } from '@material-ui/core/colors';
import { fetchClients, updateClient } from '../common/API';

const useStyles = makeStyles(theme => ({
  title: {
    flex: '1 1 100%'
  },
  tableWrapper: {
    padding: theme.spacing(2),
    width: '100%',
    minWidth: 750
  },
  tableRow: {
    cursor: 'pointer'
  },
  paper: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    overflowX: 'auto'
  },
  favourite: {
    color: amber[500]
  },
  formMargin: {
    marginTop: theme.spacing(3)
  },
  subheading: {
    color: grey[600]
  },
  kpi: {
    width: '95%'
  }
}));

function Information(props) {
  const classes = useStyles();

  const { path, url } = useRouteMatch();
  const history = useHistory();

  const [clients, setClients] = useState([]);
  const [clientSelected, setClientSelected] = useState(false);
  const [open, setOpen] = useState(false);
  const [keyLocOpen, setKeyLocOpen] = useState(false);
  const [siteLocOpen, setSiteLocOpen] = useState(false);
  const [buOpen, setBuOpen] = useState(false);
  const [kpiOpen, setKpiOpen] = useState(false);

  useEffect(() => {
    fetchClients(props.onMessage, true).then(data => setClients(data));
  }, []);

  const handleFavourite = (e, index) => {
    e.preventDefault();
    const userId = parseInt(Cookies.get('user'));
    const favourited_by = JSON.parse(JSON.stringify(clients[index].favourited_by));
    const favouritedIndex = favourited_by.findIndex(user => user.id === userId);
    if (favouritedIndex !== -1) {
      favourited_by.splice(favouritedIndex, 1);
    } else {
      favourited_by.push({
        id: userId
      });
    }
    updateClient(clients[index].id, { favourited_by }, props.onMessage).then(() =>
      fetchClients(props.onMessage, false).then(data => setClients(data))
    );
  };

  const TableToolbar = props => {
    return (
      <Toolbar>
        <Typography className={classes.title} variant="h6" id="tableTitle" component="h2">
          Clients
        </Typography>
      </Toolbar>
    );
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleCreateNewClient = () => {
    setClientSelected(false);
    props.onClientChanged('');
  };

  const handleClientSelect = (e, index) => {
    setClientSelected(false);
    props.onClientChanged(clients[index].name);
  };

  const handleAddNewKeyLocation = () => {
    setKeyLocOpen(true);
    const keyLocationsCopy = JSON.parse(JSON.stringify(props.keyLocations));
    keyLocationsCopy.push({
      location: ''
    });
    props.onKeyLocationsChanged(keyLocationsCopy);
  };
  const handleDeleteKeyLocation = (e, index, id) => {
    if (!isNaN(props.projectId) && id !== undefined) {
      props.setDeleteKeyLocations([...props.deleteKeyLocations, id]);
    }
    const keyLocationsCopy = JSON.parse(JSON.stringify(props.keyLocations));
    keyLocationsCopy.splice(index, 1);
    props.onKeyLocationsChanged(keyLocationsCopy);
  };
  const handleChangeKeyLocation = (e, index) => {
    const keyLocationsCopy = JSON.parse(JSON.stringify(props.keyLocations));
    keyLocationsCopy[index].location = e.target.value;
    props.onKeyLocationsChanged(keyLocationsCopy);
  };
  const handleAddNewBusinessUnit = () => {
    setBuOpen(true);
    const businessUnitsCopy = JSON.parse(JSON.stringify(props.businessUnits));
    businessUnitsCopy.push({
      unit: ''
    });
    props.onBusinessUnitsChanged(businessUnitsCopy);
  };
  const handleDeleteBusinessUnit = (e, index, id) => {
    if (!isNaN(props.projectId) && id !== undefined) {
      props.setDeleteBusinessUnits([...props.deleteBusinessUnits, id]);
    }
    const businessUnitsCopy = JSON.parse(JSON.stringify(props.businessUnits));
    businessUnitsCopy.splice(index, 1);
    props.onBusinessUnitsChanged(businessUnitsCopy);
  };
  const handleBusinessUnitChange = (e, index) => {
    const businessUnitsCopy = JSON.parse(JSON.stringify(props.businessUnits));
    businessUnitsCopy[index].unit = e.target.value;
    props.onBusinessUnitsChanged(businessUnitsCopy);
  };
  const handleAddNewSiteLocation = () => {
    setSiteLocOpen(true);
    const siteLocationsCopy = JSON.parse(JSON.stringify(props.siteLocations));
    siteLocationsCopy.push({
      site_location: ''
    });
    props.onSiteLocationsChanged(siteLocationsCopy);
  };
  const handleDeleteSiteLocation = (e, index, id) => {
    if (!isNaN(props.projectId) && id !== undefined) {
      props.setDeleteSiteLocations([...props.deleteSiteLocations, id]);
    }
    const siteLocationsCopy = JSON.parse(JSON.stringify(props.siteLocations));
    siteLocationsCopy.splice(index, 1);
    props.onSiteLocationsChanged(siteLocationsCopy);
  };
  const handleChangeSiteLocation = (e, index) => {
    const siteLocationsCopy = JSON.parse(JSON.stringify(props.siteLocations));
    siteLocationsCopy[index].site_location = e.target.value;
    props.onSiteLocationsChanged(siteLocationsCopy);
  };
  const handleAddNewKpi = () => {
    setKpiOpen(true);
    const kpisCopy = JSON.parse(JSON.stringify(props.kpis));
    kpisCopy.push({
      name: ''
    });
    props.onKpisChanged(kpisCopy);
  };

  const handleDeleteKpi = (e, index, id) => {
    if (!isNaN(props.projectId) && id !== undefined) {
      props.setDeleteKpiIds([...props.deleteKpiIds, id]);
    }
    const kpisCopy = JSON.parse(JSON.stringify(props.kpis));
    kpisCopy.splice(index, 1);
    props.onKpisChanged(kpisCopy);
  };

  const handleKpiChange = (e, index) => {
    const kpisCopy = JSON.parse(JSON.stringify(props.kpis));
    kpisCopy[index].name = e.target.value;
    props.onKpisChanged(kpisCopy);
  };

  const handleBack = () => {
    history.goBack();
  };

  const getHoverText = e => {
    e.target.title = 'Choose this Client';
  };

  const handleNext = () => {
    if (!props.client) {
      props.onMessage('A valid client is required', 'warning');
    } else if (!props.project) {
      props.onMessage('A valid project is required', 'warning');
    } else if (props.kpis.filter(k => !k.name).length > 0) {
      props.onMessage('Invalid KPI', 'warning');
    } else if (props.businessUnits.filter(k => !k.unit).length > 0) {
      props.onMessage('Invalid Business Unit', 'warning');
    } else if (props.siteLocations.filter(k => !k.site_location).length > 0) {
      props.onMessage('Invalid Site Location', 'warning');
    } else if (props.keyLocations.filter(k => !k.location).length > 0) {
      props.onMessage('Invalid Key Location', 'warning');
    } else {
      if (!isNaN(props.projectId)) {
        let kpiCheck = false;
        let buCheck = false;
        let siteLocCheck = false;
        let keyLocCheck = false;
        for (let index = 0; index < props.kpis.length; index++) {
          if (props.projectData.kpis[index] === undefined || props.projectData.kpis[index] === '' || props.projectData.kpis[index] === null) {
            break;
          }
          if (props.kpis[index].name !== props.projectData.kpis[index].name) {
            kpiCheck = true;
            break;
          }
        }
        for (let index = 0; index < props.businessUnits.length; index++) {
          if (
            props.projectData.business_units[index] === undefined ||
            props.projectData.business_units[index] === '' ||
            props.projectData.business_units[index] === null
          ) {
            break;
          }
          if (props.businessUnits[index].unit !== props.projectData.business_units[index].unit) {
            buCheck = true;
            break;
          }
        }
        for (let index = 0; index < props.siteLocations.length; index++) {
          if (
            props.projectData.site_locations[index] === undefined ||
            props.projectData.site_locations[index] === '' ||
            props.projectData.site_locations[index] === null
          ) {
            break;
          }
          if (props.siteLocations[index].site_location !== props.projectData.site_locations[index].site_location) {
            siteLocCheck = true;
            break;
          }
        }
        for (let index = 0; index < props.keyLocations.length; index++) {
          if (
            props.projectData.key_locations[index] === undefined ||
            props.projectData.key_locations[index] === '' ||
            props.projectData.key_locations[index] === null
          ) {
            break;
          }
          if (props.keyLocations[index].location !== props.projectData.key_locations[index].location) {
            keyLocCheck = true;
            break;
          }
        }
        if (
          props.projectData.client.name !== props.client ||
          props.projectData.name !== props.project ||
          kpiCheck === true ||
          buCheck === true ||
          siteLocCheck === true ||
          keyLocCheck === true ||
          props.kpis.length !== props.projectData.kpis.length ||
          props.businessUnits.length !== props.projectData.business_units.length ||
          props.siteLocations.length !== props.projectData.site_locations.length ||
          props.keyLocations.length !== props.projectData.key_locations.length
        ) {
          handleDialogOpen();
        } else {
          props.onCompletion();
        }
      } else {
        props.onCompletion();
      }
    }
  };
  const handleDialogYes = () => {
    props.onCompletion();
  };
  const handleDialogNo = () => {
    props.onClientChanged(props.projectData.client.name);
    props.onProjectChanged(props.projectData.name);
    props.onKpisChanged(props.projectData.kpis);
    props.onBusinessUnitsChanged(props.projectData.business_units);
    props.onKeyLocationsChanged(props.projectData.key_loctions);
    props.onSiteLocationsChanged(props.projectData.site_locations);
    handleDialogClose();
  };
  return (
    <React.Fragment>
      <Route path={`${path}/information`}>
        <Grid item container direction="column" spacing={4} xs={6} className={classes.formMargin}>
          <Grid item>
            <TextField
              fullWidth={true}
              variant="filled"
              required
              label="Client"
              autoFocus
              value={props.client}
              disabled={clientSelected}
              onChange={e => props.onClientChanged(e.target.value)}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth={true}
              variant="filled"
              required
              label="Project Name"
              value={props.project}
              onChange={e => props.onProjectChanged(e.target.value)}
            />
          </Grid>
          <Grid item>
            <Grid item container justify="space-between">
              <Grid item>
                <Typography variant="h5" className={classes.subheading}>
                  {kpiOpen ? <Button onClick={() => setKpiOpen(false)}>-</Button> : <Button onClick={() => setKpiOpen(true)}>+</Button>}
                  Business Outcome KPI
                </Typography>
              </Grid>
              <Grid item>
                <Button color="primary" onClick={handleAddNewKpi}>
                  Add New
                </Button>
              </Grid>
            </Grid>
            {kpiOpen ? (
              <List>
                {props.kpis.map((item, index) => (
                  <ListItem disableGutters>
                    <TextField
                      autoFocus
                      label="KPI"
                      className={classes.kpi}
                      variant="filled"
                      value={item.name}
                      onChange={e => handleKpiChange(e, index)}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete" onClick={e => handleDeleteKpi(e, index, item.id)}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : null}
          </Grid>
          <Grid item>
            <Grid item container justify="space-between">
              <Grid item>
                <Typography variant="h5" className={classes.subheading}>
                  {buOpen ? <Button onClick={() => setBuOpen(false)}>-</Button> : <Button onClick={() => setBuOpen(true)}>+</Button>}
                  Business Units
                </Typography>
              </Grid>
              <Grid item>
                <Button color="primary" onClick={handleAddNewBusinessUnit}>
                  Add New
                </Button>
              </Grid>
            </Grid>
            {buOpen ? (
              <List>
                {props.businessUnits.map((item, index) => (
                  <ListItem disableGutters>
                    <TextField
                      autoFocus
                      label="Business Unit"
                      className={classes.kpi}
                      variant="filled"
                      value={item.unit}
                      onChange={e => handleBusinessUnitChange(e, index)}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete" onClick={e => handleDeleteBusinessUnit(e, index, item.id)}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : null}
          </Grid>
          <Grid item>
            <Grid item container justify="space-between">
              <Grid item>
                <Typography variant="h5" className={classes.subheading}>
                  {siteLocOpen ? <Button onClick={() => setSiteLocOpen(false)}>-</Button> : <Button onClick={() => setSiteLocOpen(true)}>+</Button>}
                  Site Locations
                </Typography>
              </Grid>
              <Grid item>
                <Button color="primary" onClick={handleAddNewSiteLocation}>
                  Add New
                </Button>
              </Grid>
            </Grid>
            {siteLocOpen ? (
              <List>
                {props.siteLocations.map((item, index) => (
                  <ListItem disableGutters>
                    <TextField
                      autoFocus
                      label="Site Location"
                      className={classes.kpi}
                      variant="filled"
                      value={item.site_location}
                      onChange={e => handleChangeSiteLocation(e, index)}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete" onClick={e => handleDeleteSiteLocation(e, index, item.id)}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : null}
          </Grid>
          <Grid item>
            <Grid item container justify="space-between">
              <Grid item>
                <Typography variant="h5" className={classes.subheading}>
                  {keyLocOpen ? <Button onClick={() => setKeyLocOpen(false)}>-</Button> : <Button onClick={() => setKeyLocOpen(true)}>+</Button>}
                  Key Locations
                </Typography>
              </Grid>
              <Grid item>
                <Button color="primary" onClick={handleAddNewKeyLocation}>
                  Add New
                </Button>
              </Grid>
            </Grid>
            {keyLocOpen ? (
              <List>
                {props.keyLocations.map((item, index) => (
                  <ListItem disableGutters>
                    <TextField
                      autoFocus
                      label="Key Location"
                      className={classes.kpi}
                      variant="filled"
                      value={item.location}
                      onChange={e => handleChangeKeyLocation(e, index)}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete" onClick={e => handleDeleteKeyLocation(e, index, item.id)}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            ) : null}
          </Grid>
          <Grid item container justify="space-between" alignItems="baseline">
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleBack}>
                Back
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            </Grid>
          </Grid>
          <Dialog open={open} onClose={handleDialogClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogContent>
              <DialogContentText id="alert-dialog-description">Do you want to save your changes?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Grid container xs={12}>
                <Grid item container justify="flex-start" xs={4}>
                  <Grid item>
                    <Button onClick={handleDialogClose} color="primary" aria-label="close">
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
                <Grid item container justify="flex-end" xs={8}>
                  <Grid item>
                    <Button onClick={handleDialogNo} color="primary">
                      No
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button onClick={handleDialogYes} color="primary" autoFocus>
                      Yes
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </DialogActions>
          </Dialog>
        </Grid>
      </Route>
      <Route exact path={`${path}/`}>
        <Grid item>
          <Grid item container justify="flex-end">
            <Button variant="contained" color="primary" component={RouterLink} to={`${url}/information`} onClick={handleCreateNewClient}>
              Create New
            </Button>
          </Grid>
          <Paper className={classes.paper}>
            <TableToolbar />
            <TableContainer className={classes.tableWrapper}>
              <Table size="small" aria-label="clients table">
                <TableHead>
                  <TableRow>
                    <TableCell>Client</TableCell>
                    <TableCell align="right">Projects</TableCell>
                    <TableCell align="center">Favourite</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clients.map((client, index) => (
                    <TableRow
                      key={client.id}
                      className={classes.tableRow}
                      component={RouterLink}
                      to={`${url}/information`}
                      onClick={e => handleClientSelect(e, index)}>
                      <TableCell component="th" scope="row" onMouseOver={getHoverText}>
                        {client.name}
                      </TableCell>
                      <TableCell align="right">{client.projects.length}</TableCell>
                      <TableCell align="center">
                        <IconButton aria-label="favourite" className={classes.favourite} onClick={e => handleFavourite(e, index)}>
                          {client.favourited_by.find(user => user.id == Cookies.get('user')) ? <Star /> : <StarBorder />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Route>
    </React.Fragment>
  );
}

export default Information;
