import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, TextField, CircularProgress, Backdrop } from '@material-ui/core';
import { Paper, Typography, Menu, MenuItem, Toolbar, IconButton } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import FilterListIcon from '@material-ui/icons/FilterList';
import Slider from '@material-ui/core/Slider';
import {
  fetchProjectData,
  updateLocationInfrastructureReadiness,
  fetchLocationInfrastructureTasks,
  createLocationInfrastructureReadiness,
  fetchUsersCount,
  fetchAllLocationInfrastructureReadiness
} from '../common/API';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(theme => ({
  title: {
    flex: '1 1 100%'
  },
  rightToolbar: {
    marginLeft: 'auto',
    marginRight: 120
  },
  title: {
    flex: '1 1 100%',
    marginLeft: 140
  },
  menu: {
    width: '16ch'
  },
  formMargin: {
    marginLeft: theme.spacing(10)
  },

  paddingsave: {
    paddingBottom: theme.spacing(6)
  },

  margin: {
    marginTop: theme.spacing(5)
  },
  marginBottom: {
    marginBottom: theme.spacing(5)
  },
  subheading: {
    color: grey[600]
  },
  nested: {
    paddingLeft: theme.spacing(12),
    paddingRight: theme.spacing(4),
    paddingUp: theme.spacing(6),
    paddingBottom: theme.spacing(4)
  },
  button: {
    paddingRight: theme.spacing(10),
    paddingLeft: theme.spacing(40)
  },

  textfield: {
    style: { backgroundColor: 'white' },
    width: '100%'
  },
  text: {
    paddingTop: theme.spacing(2)
  },
  paper: {
    width: '100%',
    margin: theme.spacing(6, 'auto'),
    padding: theme.spacing(2),
    backgroundColor: grey[100]
  },
  grid: {
    marginLeft: theme.spacing(10),
    marginTop: theme.spacing(2)
  }
}));
const marks = [
  {
    value: 0,
    label: '0'
  },
  {
    value: 100,
    label: '100'
  }
];

function LocationInfrastructure(props) {
  const classes = useStyles();
  const [baseLocationList, setBaseLocationList] = useState([]);
  const [businessUnitList, setBusinessUnitList] = useState([]);
  const [searchLocation, setSearchLocation] = useState(null);
  const [reportList, setReportList] = useState([]);
  const [report, setReport] = useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loading2, setLoading2] = React.useState(true);
  const [employeeCount, setEmployeeCount] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const project = Cookies.get('project');
  const [searchBusinessUnit, setSearchBusinessUnit] = useState(null);
  const [refresh, setRefresh] = useState(true);
  const [task, setTask] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchProjectData(project, props.onMessage),
      fetchAllLocationInfrastructureReadiness(project, props.onMessage),
      fetchUsersCount(project, null, null, props.onMessage)
    ])
      .then(([projectdata, data, count]) => {
        setBaseLocationList(projectdata.key_locations);
        setBusinessUnitList(projectdata.business_units);
        if (data.length > 0) {
          setReportList(data);
        }
        setEmployeeCount(count);
        setReport(reportList);
        setRefresh(false);
        setLoading(false);
      })
      .catch(e => {
        props.onMessage(`Error: ${e}`, 'error');
      });
  }, [refresh]);

  useEffect(() => {
    const reportJson = JSON.parse(JSON.stringify(report));
    var reportCopy1 = reportJson;
    if (task != null) {
      reportCopy1.map((item, index) => {
        item.report = item.report.filter((item1, index) => item1.location_infrastructure_task.title === task);
      });
      setReportList(reportCopy1);
    }
    if (searchLocation == null && searchBusinessUnit == null) {
      if (task === null) {
        setRefresh(true);
      }
    }
    if (searchLocation !== null) {
      fetchUsersCount(project, null, searchLocation.id, props.onMessage).then(count => {
        setEmployeeCount(count);
      });
      reportCopy1 = reportCopy1.filter(report => report.key_location.id == searchLocation.id);
      setReportList(reportCopy1);
    }
    if (searchBusinessUnit !== null) {
      fetchUsersCount(project, searchBusinessUnit.id, null, props.onMessage).then(count => {
        setEmployeeCount(count);
      });
      reportCopy1 = reportCopy1.filter(report => report.business_unit.id == searchBusinessUnit.id);
      setReportList(reportCopy1);
    }
    if (searchLocation != null && searchBusinessUnit != null) {
      fetchUsersCount(project, searchBusinessUnit.id, searchLocation.id, props.onMessage).then(count => {
        setEmployeeCount(count);
      });
    }
    if (searchBusinessUnit !== null && searchLocation !== null && reportCopy1.length == 0) {
      fetchLocationInfrastructureTasks(project, props.onMessage).then(data1 => {
        var reportCopy = [];
        var obj = {
          business_unit: searchBusinessUnit,
          key_location: searchLocation,
          project: project,
          report: []
        };
        data1.map((item, index) => {
          var taskCopy = {
            risks: '',
            actions: '',
            status: 0,
            location_infrastructure_task: item
          };
          obj.report.push(taskCopy);
        });
        reportCopy.push(obj);
        setReportList(reportCopy);
      });
    }
    setLoading2(false);
  }, [searchBusinessUnit, searchLocation, task]);

  useEffect(() => {
    if (report.length > 0) {
      if (props.locInfraFilter != null) {
        if (props.locInfraFilter.business_unit) {
          businessUnitList.map((item, index) => {
            if (props.locInfraFilter.business_unit === item.unit) {
              setSearchBusinessUnit(item);
            }
          });
        }
        if (props.locInfraFilter.location) {
          baseLocationList.map((item, index) => {
            if (props.locInfraFilter.location === item.location) {
              setSearchLocation(item);
            }
          });
        }
        if (props.locInfraFilter.task) {
          setTask(props.locInfraFilter.task);
        }
        props.setLocInfraFilter(null);
      }
    }
  }, [report]);

  const handleMenuOpen = event => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleRisk = (e, reportIndex, itemIndex) => {
    const reportListCopy = [...reportList];
    reportListCopy[reportIndex].report[itemIndex].risks = e.target.value;
    setReportList(reportListCopy);
  };

  const handleAction = (e, reportIndex, itemIndex) => {
    const reportListCopy = [...reportList];
    reportListCopy[reportIndex].report[itemIndex].actions = e.target.value;
    setReportList(reportListCopy);
  };

  const onSlideChange = (e, reportIndex, itemIndex, newValue) => {
    const reportListCopy = [...reportList];
    reportListCopy[reportIndex].report[itemIndex].status = newValue;
    setReportList(reportListCopy);
  };

  const onSave = e => {
    if (reportList[0].id) {
      updateLocationInfrastructureReadiness(reportList[0], reportList[0].id, props.onMessage).then(() => {
        props.onMessage('Record Saved Successfully', 'success');
      });
    } else {
      createLocationInfrastructureReadiness(reportList[0], props.onMessage).then(() => {
        props.onMessage('Record Saved Successfully', 'success');
      });
    }
  };

  if (loading) {
    return (
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else {
    return (
      <React.Fragment>
        <Toolbar>
          <Typography className={classes.title} variant="h5">
            Results
          </Typography>

          <IconButton className={classes.rightToolbar} onClick={handleMenuOpen}>
            <FilterListIcon fontSize="large" />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={menuAnchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
            open={menuOpen}
            onClose={() => setMenuAnchorEl(null)}>
            <MenuItem>
              <Autocomplete
                className={classes.menu}
                id="location"
                options={baseLocationList.map((item, index) => item)}
                value={searchLocation}
                autoHighlight
                getOptionLabel={option => option.location}
                getOptionSelected={(option, value) => option.location === value.location}
                onChange={(e, newValue) => setSearchLocation(newValue)}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Location"
                    inputProps={{
                      ...params.inputProps
                    }}
                  />
                )}
              />
            </MenuItem>
            <MenuItem>
              <Autocomplete
                className={classes.menu}
                id="bussiness_unit"
                options={businessUnitList.map((item, index) => item)}
                value={searchBusinessUnit}
                getOptionLabel={option => option.unit}
                getOptionSelected={(option, value) => option.unit === value.unit}
                onChange={(e, newValue) => setSearchBusinessUnit(newValue)}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Business Unit"
                    inputProps={{
                      ...params.inputProps
                    }}
                  />
                )}
              />
            </MenuItem>
          </Menu>
        </Toolbar>

        <Grid container justify="center" direction="column" className={classes.margin}>
          <Paper>
            <Grid item container spacing={4} xs={11} className={classes.grid}>
              {loading2 ? (
                <Backdrop open={loading}>
                  <CircularProgress color="inherit" />
                </Backdrop>
              ) : (
                <Grid item container justify="center" direction="column" spacing={4} xs={11} className={classes.formMargin}>
                  {reportList.length > 0 ? (
                    <Grid item>
                      <Grid item>
                        <Typography>Number Of Employees: {employeeCount} </Typography>
                      </Grid>
                      <Grid item>
                        {reportList.map((item, reportIndex) =>
                          item.report.map((data, itemIndex) => (
                            <Paper className={classes.paper} key={itemIndex}>
                              <Grid container justify="space-between" spacing={2} className={classes.text}>
                                <Grid item>
                                  <Typography>{data.location_infrastructure_task.title}</Typography>
                                </Grid>
                                <Grid item xs={7}>
                                  <TextField
                                    label="Risks"
                                    value={data.risks}
                                    fullWidth
                                    variant="filled"
                                    onChange={e => handleRisk(e, reportIndex, itemIndex)}></TextField>
                                </Grid>
                              </Grid>
                              <Grid container justify="space-between" spacing={2} className={classes.text}>
                                <Grid item xs={3}>
                                  <Typography id="discrete-slider-custom" gutterBottom>
                                    Status
                                  </Typography>
                                  <Slider
                                    value={data.status}
                                    aria-labelledby="discrete-slider-custom"
                                    step={10}
                                    valueLabelDisplay="auto"
                                    marks={marks}
                                    onChange={(e, newValue) => onSlideChange(e, reportIndex, itemIndex, newValue)}
                                  />
                                </Grid>
                                <Grid item xs={7}>
                                  <TextField
                                    label="Actions"
                                    value={data.actions}
                                    fullWidth
                                    variant="filled"
                                    onChange={e => handleAction(e, reportIndex, itemIndex)}></TextField>
                                </Grid>
                              </Grid>
                            </Paper>
                          ))
                        )}
                      </Grid>
                      <Grid item container justify="flex-end" className={classes.paddingsave}>
                        <Button variant="contained" color="primary" onClick={onSave}>
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid item style={{ paddingBottom: '50px' }}>
                      <Typography variant="h4" align="center">
                        No Results Found
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </React.Fragment>
    );
  }
}

export default LocationInfrastructure;
