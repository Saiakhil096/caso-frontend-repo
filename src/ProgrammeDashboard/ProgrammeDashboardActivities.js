import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import Cookies from 'js-cookie';
import { Grid, Typography, Button, TextField, Divider, FormControl, Link, FormControlLabel, RadioGroup, Radio, FormLabel } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import {
  fetchCategories,
  fetchSubCategories,
  fetchActivities,
  fetchSpecificSubCategories,
  createActivities,
  updateActivities,
  fetchProjectData
} from '../common/API';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  title: {
    flex: '1 1 100%'
  },
  root: {
    flex: 'wrap',
    align: 'center',
    marginTop: '0.5cm',
    '& > *': {
      margin: theme.spacing(2.0)
    }
  },
  headerMargin: {
    marginLeft: '3.7cm',
    marginTop: '1cm'
  },
  margin: {
    marginTop: '1.5cm'
  },
  link: {
    marginLeft: '26cm',
    marginTop: '1cm'
  },
  content: {
    marginTop: '0.4cm',
    '& > *': {
      margin: theme.spacing(1.0)
    }
  },
  background: {
    backgroundColor: '#F2F2F2'
  },
  textfield: {
    backgroundColor: '#FFFFFF',
    width: '100%'
  },
  divider: {
    backgroundColor: 'black'
  },
  menuText: {
    marginLeft: '0.3cm',
    marginRight: '11%'
  },
  result: {
    marginLeft: '0.1cm',
    marginRight: '12%'
  },
  button: {
    paddingRight: '3.7cm',
    marginTop: '1cm',
    paddingBottom: '1cm'
  }
}));

function ProgrammeDashboardActivities(props) {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState(null);
  const [inputLocale, setInputLocale] = useState('en_GB');
  const localeFormat = { en_US: 'MM/dd/yyyy', en_GB: 'dd/MM/yyyy' };
  const [categoryList, setCategoryList] = useState([]);
  const [subCategory, setSubCategory] = useState(null);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [activities, setActivities] = useState([]);
  const [owner, setOwner] = useState(null);
  const [ownerList, setOwnerList] = useState([]);
  const [status, setStatus] = useState(null);
  const [statusList, setStatusList] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filter, setFilter] = useState(false);
  const [searchObject, setSearchObject] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('');
  const project = Cookies.get('project');

  useEffect(() => {
    var str = window.location.pathname;
    var res = str.split('/');
    const _category = res[res.length - 1];
    setCurrentCategory(_category);
    fetchCategories(props.onMessage, Cookies.get('project'))
      .then(categories => {
        setCategoryList(categories);
        if (_category === 'Overall%20View') {
          props.setTitle('Overall View');
          fetchSubCategories(categories, props.onMessage)
            .then(sCategories => {
              setSubCategoryList(sCategories);
              fetchActivities(sCategories, props.onMessage)
                .then(sActivities => {
                  setActivities(sActivities);
                })
                .catch(e => props.onMessage(e, 'Error'));
            })
            .catch(e => props.onMessage(e, 'Error'));
        } else {
          fetchSpecificSubCategories(_category, props.onMessage)
            .then(sCategories => {
              props.setTitle(sCategories[0].category.category);

              setSubCategoryList(sCategories);
              fetchActivities(sCategories, props.onMessage)
                .then(sActivities => {
                  setActivities(sActivities);
                })
                .catch(e => props.onMessage(e, 'Error'));
            })
            .catch(e => props.onMessage(e, 'Error'));
        }
        setStatusList(['Completed', 'Pending', 'Not Due']);
      })
      .catch(e => props.onMessage(e, 'Error'));
  }, []);

  useEffect(() => {
    fetchProjectData(project, props.onMessage)
      .then(data => {
        setOwnerList(data.members);
      })
      .catch(e => props.onMessage(e, 'Error'));
  }, []);

  useEffect(() => {
    if (filter) {
      const activitiesCopy = JSON.parse(JSON.stringify(activities));
      var filteredActivities = activitiesCopy;
      if (searchObject.sub_category != null) {
        filteredActivities = filteredActivities.filter(item => item.sub_category.name === searchObject.sub_category.name);
      }
      if (searchObject.Owner != null) {
        filteredActivities = filteredActivities.filter(item => {
          if (item.owner) {
            return item.owner.username === searchObject.Owner.username;
          }
        });
      }
      if (searchObject.status != null) {
        filteredActivities = filteredActivities.filter(item => item.status === searchObject.status);
      }
      if (searchObject.due_date != null) {
        filteredActivities = filteredActivities.filter(item => {
          var date1 = new Date(item.due_date).setHours(0, 0, 0, 0);
          var date2 = new Date(searchObject.due_date).setHours(0, 0, 0, 0);
          if (date1 === date2) {
            return item;
          }
        });
      }

      setFilteredItems(filteredActivities);
      setFilter(false);
    } else {
      setFilteredItems(activities);
    }
  }, [searchObject, activities]);

  const createNewActivity = () => {
    const activityCopy = JSON.parse(JSON.stringify(activities));
    var object = {
      name: '',
      due_date: null,
      sub_category: null,
      status: null,
      owner: null
    };
    activityCopy.push(object);
    setActivities(activityCopy);
  };

  const handleSubCategory = (newValue, index) => {
    const activityCopy = JSON.parse(JSON.stringify(activities));
    activityCopy[index].sub_category = newValue;
    setActivities(activityCopy);
  };

  const handleActivityName = (e, index) => {
    const activityCopy = JSON.parse(JSON.stringify(activities));
    activityCopy[index].name = e.target.value;
    setActivities(activityCopy);
  };

  const handleOwner = (newValue, index) => {
    const activityCopy = JSON.parse(JSON.stringify(activities));
    activityCopy[index].owner = newValue;
    setActivities(activityCopy);
  };

  const handleDate = (date, index) => {
    const activityCopy = JSON.parse(JSON.stringify(activities));
    activityCopy[index].due_date = date;
    setActivities(activityCopy);
  };

  const handleStatus = (newValue, index) => {
    const activityCopy = JSON.parse(JSON.stringify(activities));
    if (newValue === 'Not Due') {
      activityCopy[index].status = 'Not_Due';
    } else {
      activityCopy[index].status = newValue;
    }

    setActivities(activityCopy);
  };

  const handleSave = () => {
    Promise.all(
      activities.map((item, index) => {
        if (item.id) {
          var body = JSON.stringify(item);
          return updateActivities(item.id, body, props.onMessage);
        } else {
          var body = item;
          return createActivities(body, props.onMessage);
        }
      })
    )
      .then()
      .catch();
    props.onMessage('Data saved Successfully.');
  };

  const handleSearch = () => {
    if (subCategory === null && owner === null && selectedDate === null && status === null) {
      props.onMessage('None of the above filters has been selected.', 'warning');
    } else {
      const searchObjectCopy = {
        sub_category: subCategory,
        Owner: owner,
        due_date: selectedDate,
        status: status
      };
      setSearchObject(searchObjectCopy);
      setFilter(true);
    }
  };

  const handleSearchStatus = e => {
    if (e.target.value === status) {
      setStatus(null);
    } else {
      setStatus(e.target.value);
    }
  };

  return (
    <React.Fragment>
      <Grid container justify="center" direction="column">
        <Grid item container className={classes.background}>
          <Typography className={classes.headerMargin} variant="h6">
            Search Criteria
          </Typography>
          <Grid item container justify="center" className={classes.root}>
            <Grid item xs={3}>
              <FormControl fullWidth variant="filled">
                <Autocomplete
                  id="Sub-Category"
                  value={subCategory}
                  options={subCategoryList}
                  getOptionLabel={option => option.name}
                  getOptionSelected={(option, value) => option.name === value.name}
                  onChange={(e, newValue) => setSubCategory(newValue)}
                  renderInput={params => <TextField {...params} label="Sub-Category" className={classes.textfield} variant="filled" />}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth variant="filled">
                <Autocomplete
                  id="Owner"
                  value={owner}
                  options={ownerList}
                  getOptionLabel={option => option.username}
                  getOptionSelected={(option, value) => option.username === value.username}
                  onChange={(e, newValue) => setOwner(newValue)}
                  renderInput={params => <TextField {...params} label="Owner" className={classes.textfield} variant="filled" />}
                />
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth variant="filled">
                <MuiPickersUtilsProvider utils={DateFnsUtils} justify="space-around">
                  <KeyboardDatePicker
                    inputVariant="filled"
                    id="date_picker"
                    label="Due Date"
                    placeholder={localeFormat[inputLocale].toUpperCase()}
                    format={localeFormat[inputLocale]}
                    onChange={date => {
                      setSelectedDate(date);
                    }}
                    value={selectedDate}
                    className={`${classes.datepickerstyle} ${classes.textfield}`}
                    KeyboardButtonProps={{
                      'aria-label': 'change date'
                    }}
                  />
                </MuiPickersUtilsProvider>
              </FormControl>
            </Grid>
            <Grid item sm={8} style={{ paddingLeft: '110px' }}>
              <FormControl component="fieldset" fullWidth variant="filled">
                <FormLabel component="legend">Status</FormLabel>
                <RadioGroup row aria-label="status" name="status" value={status} onChange={e => handleSearchStatus(e)}>
                  <FormControlLabel value="Pending" control={<Radio color="primary" onClick={e => handleSearchStatus(e)} />} label="Pending" />
                  <FormControlLabel value="Not_Due" control={<Radio color="primary" onClick={e => handleSearchStatus(e)} />} label="Not Due" />
                  <FormControlLabel value="Completed" control={<Radio color="primary" onClick={e => handleSearchStatus(e)} />} label="Done" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <Button variant="contained" size="large" color="primary" onClick={e => handleSearch()}>
                Search
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Divider orientation="horizontal" classes={{ root: classes.divider }} flexItem />

        <Grid item container>
          <Grid container xs={12} direction="row" className={classes.margin}>
            <Grid item container xs={9} style={{ paddingLeft: '130px' }}>
              {filteredItems.length === 0 ? (
                <Grid item>
                  <Typography variant="h6" component="h2" align="center">
                    No Results Found
                  </Typography>
                </Grid>
              ) : (
                <Grid item>
                  <Typography variant="h6" component="h2">
                    Results({filteredItems.length})
                  </Typography>
                </Grid>
              )}
            </Grid>
            <Grid item container xs={3} style={{ paddingLeft: '105px' }}>
              <Grid item>
                <Link component={RouterLink} onClick={() => createNewActivity()}>
                  <h3>Create New</h3>
                </Link>
              </Grid>
            </Grid>
          </Grid>

          <Grid item container>
            <Grid container direction="column" justify="center" className={classes.headerMargin}>
              {filteredItems ? (
                <Grid item xs={12} container direction="row">
                  <Grid item xs={2}>
                    <Typography className={classes.menuText}>Sub-Category</Typography>
                  </Grid>
                  <Grid item xs={2} style={{ paddingLeft: '25px' }}>
                    <Typography className={classes.result}>Activities</Typography>
                  </Grid>
                  <Grid item xs={2} style={{ paddingLeft: '38px' }}>
                    <Typography className={classes.result}>Owner</Typography>
                  </Grid>
                  <Grid item xs={2} style={{ paddingLeft: '48px' }}>
                    <Typography className={classes.menuText}>Due Date</Typography>
                  </Grid>
                  <Grid item xs={2} style={{ paddingLeft: '60px' }}>
                    <Typography className={classes.menuText}>Status</Typography>
                  </Grid>
                </Grid>
              ) : null}

              {filteredItems &&
                filteredItems.map((item, index) => (
                  <Grid item container direction="row" className={classes.content} key={index}>
                    <Grid item xs={2}>
                      <FormControl fullWidth variant="filled">
                        <Autocomplete
                          value={item.sub_category}
                          options={subCategoryList}
                          getOptionLabel={option => option.name}
                          getOptionSelected={(option, value) => option.name === value.name}
                          onChange={(e, newValue) => handleSubCategory(newValue, index)}
                          renderInput={params => <TextField {...params} className={classes.textfield} variant="filled" />}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                      <FormControl fullWidth variant="filled">
                        <TextField
                          className={classes.textfield}
                          value={item.name}
                          type="search"
                          variant="filled"
                          onChange={e => {
                            handleActivityName(e, index);
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                      <FormControl fullWidth variant="filled">
                        <Autocomplete
                          value={item.owner}
                          options={ownerList}
                          getOptionLabel={option => option.username}
                          getOptionSelected={(option, value) => option.username === value.username}
                          onChange={(e, newValue) => handleOwner(newValue, index)}
                          renderInput={params => <TextField {...params} className={classes.textfield} variant="filled" />}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                      <FormControl fullWidth variant="filled">
                        <MuiPickersUtilsProvider utils={DateFnsUtils} justify="space-around">
                          <KeyboardDatePicker
                            inputVariant="filled"
                            placeholder={localeFormat[inputLocale].toUpperCase()}
                            format={localeFormat[inputLocale]}
                            onChange={date => {
                              handleDate(date, index);
                            }}
                            value={item.due_date}
                            className={`${classes.datepickerstyle} ${classes.textfield}`}
                            KeyboardButtonProps={{
                              'aria-label': 'change date'
                            }}
                          />
                        </MuiPickersUtilsProvider>
                      </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                      <FormControl fullWidth variant="filled">
                        <Autocomplete
                          value={item.status == 'Not_Due' ? 'Not Due' : item.status}
                          options={statusList}
                          getOptionLabel={option => option}
                          getOptionSelected={(option, value) => option === value}
                          onChange={(e, newValue) => handleStatus(newValue, index)}
                          renderInput={params => <TextField {...params} className={classes.textfield} variant="filled" />}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                ))}
            </Grid>
            {filteredItems && filteredItems.length > 0 ? (
              <Grid item container className={classes.button} justify="flex-end">
                <Button variant="contained" size="large" color="primary" onClick={e => handleSave()}>
                  Save
                </Button>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default ProgrammeDashboardActivities;
