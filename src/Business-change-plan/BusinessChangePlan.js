import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { fetchProjectData, updateKeyActivity, fetchKeyActivities } from '../common/API';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import LaunchIcon from '@material-ui/icons/Launch';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  Button,
  TextField,
  IconButton,
  Paper,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Backdrop,
  CircularProgress,
  FormLabel
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(theme => ({
  title: {
    flex: '1 1 100%'
  },
  subheading: {
    color: grey[600]
  },
  nested: {
    paddingLeft: theme.spacing(6),
    paddingRight: theme.spacing(4)
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  button: {
    paddingRight: theme.spacing(10),
    paddingLeft: theme.spacing(40)
  },
  statusMargin: {
    marginLeft: theme.spacing(9)
  }
}));

function BusinessChangePlan(props) {
  const history = useHistory();
  const { url } = useRouteMatch();
  const classes = useStyles();
  const [l2processes, setL2Processes] = useState(null);
  const [l2processesList, setL2ProcessesList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [StatusList, setStatusList] = useState(['Pending', 'Done', 'Not Due']);
  const [backdropOpen, setBackDropOpen] = React.useState(false);
  const [category, setCategory] = useState(null);
  const [businessUnits, setBusinessUnits] = useState(null);
  const [businessUnitsList, setBusinessUnitsList] = useState([]);
  const [businessLoc, setBusinessLoc] = useState(null);
  const [businessLocList, setBusinessLocList] = useState([]);
  const [searchObject, setSearchObject] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [CIAs, setCIAs] = useState(null);
  const [filter, setFilter] = useState(false);
  const [status, setStatus] = useState(null);
  const { onMessage } = props;
  useEffect(() => {
    fetchProjectData(Cookies.get('project'), onMessage)
      .then(data => {
        setCategoryList(data.business_change_plan_categories);
        setL2ProcessesList(data.l_2_processes);
        setBusinessUnitsList(data.business_units);
        setBusinessLocList(data.key_locations);
      })
      .catch(error => {
        onMessage(error, 'error');
      });
  }, []);
  useEffect(() => {
    fetchKeyActivities(Cookies.get('project'), onMessage, true).then(data => {
      if (CIAs === null) setFilteredItems(data);
      setCIAs(data);
    });
  }, [status]);

  const handleSave = () => {
    setBackDropOpen(true);
    Promise.all(
      filteredItems.map(key => {
        if (key.status == 'Not Due') {
          updateKeyActivity(
            key.id,
            {
              key_activity: key.key_activity,
              status: 'Not_Due',
              business_change_plan_category: key.business_change_plan_category
            },
            props.onMessage
          );
        } else {
          updateKeyActivity(
            key.id,
            {
              key_activity: key.key_activity,
              status: key.status,
              business_change_plan_category: key.business_change_plan_category
            },
            props.onMessage
          );
        }
      })
    ).then(res => {
      setBackDropOpen(false);
      onMessage('Record Updated Successfully', 'success');
    });
  };

  useEffect(() => {
    if (filter) {
      const CIAsData = JSON.parse(JSON.stringify(CIAs));
      var CIAsCopy = CIAsData;
      if (searchObject.Business_Unit != null) {
        CIAsCopy = filterByBusinessUnit(searchObject.Business_Unit, CIAsCopy);
      }
      if (searchObject.Location != null) {
        CIAsCopy = filterByLocation(searchObject.Location, CIAsCopy);
      }
      if (searchObject.L2_Process != null) {
        CIAsCopy = filterByL_2_Process(searchObject.L2_Process, CIAsCopy);
      }
      if (searchObject.Category != null) {
        CIAsCopy = filterByCategory(searchObject.Category, CIAsCopy);
      }
      if (searchObject.status != null) {
        CIAsCopy = filterByStatus(searchObject.status, CIAsCopy);
      }
      setFilteredItems(CIAsCopy);
      setFilter(false);
    }
  }, [searchObject]);
  const filterByStatus = (object, CIAsCopy) => {
    var arr = [];
    CIAsCopy.map((CIACopy, index) => {
      if (CIACopy.status === object) {
        arr.push(CIAsCopy[index]);
      }
    });
    return arr;
  };
  const filterByCategory = (object, CIAsCopy) => {
    var arr = [];
    CIAsCopy.map((CIACopy, index) => {
      if (CIACopy.business_change_plan_category.category_name === object.category_name) {
        arr.push(CIAsCopy[index]);
      }
    });
    return arr;
  };
  const filterByL_2_Process = (object, CIAsCopy) => {
    var arr = [];
    CIAsCopy.map((item, index) => {
      if (item.l_2_process.title === object.title) {
        arr.push(CIAsCopy[index]);
      }
    });
    return arr;
  };
  const filterByLocation = (object, CIAsCopy) => {
    var arr = [];
    CIAsCopy.map((CIACopy, index) => {
      CIACopy.key_locations.map((loc, index) => {
        if (loc.location === object.location) {
          arr.push(CIACopy);
        }
      });
    });
    return arr;
  };

  const filterByBusinessUnit = (object, CIAsCopy) => {
    var arr = [];
    CIAsCopy.map((CIACopy, index) => {
      CIACopy.business_units.map((business_unit, index) => {
        if (business_unit.unit === object.unit) {
          arr.push(CIACopy);
        }
      });
    });
    return arr;
  };

  const handleStatus = e => {
    if (e.target.value === status) {
      setStatus(null);
    } else {
      setStatus(e.target.value);
    }
  };
  const handleSearch = () => {
    if (category === null && businessUnits === null && businessLoc === null && status === null && l2processes === null) {
      const searchObjectCopy = {
        Category: category,
        Business_Unit: businessUnits,
        Location: businessLoc,
        L2_Process: l2processes,
        status: status
      };

      setSearchObject(searchObjectCopy);
      setFilter(true);
      props.onMessage('None of the filter has been Selected', 'warning');
    } else {
      const searchObjectCopy = {
        Category: category,
        Business_Unit: businessUnits,
        Location: businessLoc,
        L2_Process: l2processes,
        status: status
      };

      setSearchObject(searchObjectCopy);
      setFilter(true);
    }
  };

  const handleDataStatus = (event, id, newValue) => {
    const newFilterVal = [...filteredItems];
    newFilterVal[id].status = newValue;
    setFilteredItems(newFilterVal);
  };

  const handleDataCategory = (event, id, newValue) => {
    const newFilterVal = [...filteredItems];
    newFilterVal[id].business_change_plan_category = newValue;
    setFilteredItems(newFilterVal);
  };
  const handleActivityChange = (e, id) => {
    const newFilterVal = [...filteredItems];
    newFilterVal[id].key_activity = e.target.value;
    setFilteredItems(newFilterVal);
  };
  return (
    <React.Fragment>
      <Grid container justify="center" direction="column" style={{ marginTop: 25 }}>
        <Grid item container spacing={6} xs={12} className={classes.nested}>
          <Grid item>
            <Typography variant="h6" id="tableTitle" component="h2">
              Search Criteria
            </Typography>
          </Grid>

          <Grid item container justify="space-between" spacing={6}>
            <Grid item xs={4}>
              <FormControl fullWidth variant="filled">
                <Autocomplete
                  id="category"
                  value={category}
                  options={categoryList}
                  getOptionLabel={option => option.category_name}
                  onChange={(e, newValue) => setCategory(newValue)}
                  renderInput={params => <TextField {...params} label="Category" variant="filled" />}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="filled">
                <Autocomplete
                  id="Business_Unit"
                  value={businessUnits}
                  options={businessUnitsList}
                  getOptionLabel={option => option.unit}
                  onChange={(e, newValue) => setBusinessUnits(newValue)}
                  renderInput={params => <TextField {...params} label="Business Unit" variant="filled" />}
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="filled">
                <Autocomplete
                  id="Location"
                  value={businessLoc}
                  options={businessLocList}
                  getOptionLabel={option => option.location}
                  onChange={(e, newValue) => setBusinessLoc(newValue)}
                  renderInput={params => <TextField {...params} label="Location" variant="filled" />}
                />
              </FormControl>
            </Grid>

            <Grid item container xs={12} style={{ marginBottom: '1%' }}>
              <Grid item xs={4}>
                <FormControl fullWidth variant="filled" style={{ width: '90%' }}>
                  <Autocomplete
                    id="l_2_process"
                    value={l2processes}
                    options={l2processesList}
                    getOptionLabel={option => option.title}
                    onChange={(e, newValue) => setL2Processes(newValue)}
                    renderInput={params => <TextField {...params} label="Level 2 Process" variant="filled" />}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <FormControl component="fieldset" fullWidth variant="filled" style={{ marginLeft: '3%' }}>
                  <FormLabel component="legend">Status</FormLabel>
                  <RadioGroup row aria-label="status" name="status" defaultValue="" value={status}>
                    <FormControlLabel value="Pending" control={<Radio onClick={e => handleStatus(e)} color="primary" />} label="Pending" />
                    <FormControlLabel value="Not_Due" control={<Radio onClick={e => handleStatus(e)} color="primary" />} label="Not Due" />
                    <FormControlLabel value="Done" control={<Radio onClick={e => handleStatus(e)} color="primary" />} label="Done" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={4} style={{ textAlign: 'center', marginTop: '1%' }}>
                <Button variant="contained" color="primary" onClick={e => handleSearch()}>
                  Search
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Paper>
          {filteredItems ? (
            <Grid item xs={12} container justify="space-between" style={{ marginTop: 50 }}>
              <Grid item xs={3} style={{ marginLeft: '4%' }}>
                <Typography variant="h6">Result({filteredItems.length})</Typography>
              </Grid>
              <Grid item xs={3} style={{ textAlign: 'center', marginRight: '1%' }}>
                <Button color="primary" component={RouterLink} to={`${url}/create`}>
                  Create New
                </Button>
              </Grid>
            </Grid>
          ) : null}

          {filteredItems ? (
            <Grid item xs={12} container style={{ marginTop: 20 }}>
              <Grid item xs={1} />
              <Grid item xs={4}>
                <Typography variant="h6">Activities</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography variant="h6">Open CIA</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="h6">Category</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="h6">Status</Typography>
              </Grid>
            </Grid>
          ) : null}

          {filteredItems &&
            filteredItems.map((item, index) => (
              <Grid item xs={12} spacing={2} container style={{ alignItems: 'center' }}>
                <Grid item xs={1} />
                <Grid item xs={5} style={{ marginTop: '0.6%' }}>
                  <TextField
                    value={item.key_activity}
                    id="as_is"
                    color="primary"
                    variant="filled"
                    onChange={e => handleActivityChange(e, index)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {item.change_impact_assessment !== null ? (
                            <IconButton component={RouterLink} to={`${url}/view/${item.change_impact_assessment.id}`} style={{ color: 'blue' }}>
                              <LaunchIcon />
                            </IconButton>
                          ) : (
                            <IconButton style={{ color: 'grey' }} disabled>
                              <LaunchIcon />
                            </IconButton>
                          )}
                        </InputAdornment>
                      )
                    }}
                    style={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Autocomplete
                    id="category"
                    value={item.business_change_plan_category}
                    options={categoryList}
                    getOptionLabel={option => option.category_name}
                    getOptionSelected={(option, value) => value.category_name === option.category_name}
                    onChange={(e, newValue) => handleDataCategory(e, index, newValue)}
                    renderInput={params => <TextField {...params} variant="filled" margin="normal" />}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Autocomplete
                    id="status"
                    value={item.status == 'Not_Due' ? 'Not Due' : item.status}
                    options={StatusList}
                    getOptionLabel={option => option}
                    onChange={(e, newValue) => handleDataStatus(e, index, newValue)}
                    renderInput={params => <TextField {...params} variant="filled" margin="normal" />}
                  />
                </Grid>
                <Grid item xs={1} />
              </Grid>
            ))}

          {filteredItems && filteredItems.length > 0 ? (
            <Grid item xs={12} container justify="space-between" style={{ marginTop: 50 }}>
              <Grid item xs={10} />

              <Grid item xs={2} style={{ textAlign: 'center' }}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                  Save
                </Button>
              </Grid>
            </Grid>
          ) : null}
        </Paper>
      </Grid>

      <Backdrop className={classes.backdrop} open={backdropOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment>
  );
}

export default BusinessChangePlan;
