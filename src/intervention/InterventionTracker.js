import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import DateFnsUtils from '@date-io/date-fns';
import {
  Grid,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Link,
  Paper,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  IconButton
} from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { grey } from '@material-ui/core/colors';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { fetchProjectData, fetchInterventions, fetchUserRoles, fetchReleaseCategory, updateIntervention } from '../common/API';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Link as RouterLink } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';

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
  button: {
    paddingRight: theme.spacing(10),
    paddingLeft: theme.spacing(40)
  },
  button1: {
    marginBottom: '12px'
  },
  paper: {
    width: '100%',
    margin: theme.spacing(3, 7),
    padding: theme.spacing(2),
    backgroundColor: grey[100]
  },
  datepickerstyle: {
    width: '100%'
  },
  statusMargin: {
    marginLeft: theme.spacing(9)
  },
  result: {
    marginTop: '12px',
    marginLeft: '57px'
  }
}));

function InterventionTracker(props) {
  const classes = useStyles();
  const { onMessage } = props;
  const [open, setOpen] = useState(false);
  const [filterText, setFilterText] = useState('Show Additional Filters');
  const [inputLocale, setInputLocale] = useState('en_GB');
  const localeFormat = { en_US: 'MM/dd/yyyy', en_GB: 'dd/MM/yyyy' };
  const [selectedDate, setSelectedDate] = useState(null);
  const [interventions, setInterventions] = useState([]);
  const [changeAgent, setChangeAgent] = useState(null);
  const [changeAgentList, setChangeAgentList] = useState([]);
  const [interventionType, setInterventionType] = useState(null);
  const [interventionTypeList, setInterventionTypeList] = useState([
    { InterventionType_Value: 'Contact_and_Awareness' },
    { InterventionType_Value: 'Understanding' },
    { InterventionType_Value: 'Expectations' },
    { InterventionType_Value: 'Reinforcement' },
    { InterventionType_Value: 'Adoption' }
  ]);
  const [personaJobRole, setPersonaJobRole] = useState(null);
  const [personaJobRoleList, setPersonaJobRoleList] = useState([]);
  const [engagementCampaign, setEngagementCampaign] = useState(null);
  const [engagementCampaignList, setEngagementCampaignList] = useState([]);
  const [intent, setIntent] = useState(null);
  const [intentList, setIntentList] = useState([{ IntentValue: 'Adaptive' }, { IntentValue: 'Resistant' }]);
  const [releaseCategory, setReleaseCategory] = useState(null);
  const [releaseCategoriesList, setReleaseCategoriesList] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchObject, setSearchObject] = useState(null);
  const [filter, setFilter] = useState(false);
  const [status, setStatus] = useState(null);
  const [refresh, setRefresh] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const currentDate = new Date();

  props.setTitle('Intervention Tracker');

  useEffect(() => {
    if (refresh) {
      Promise.all([
        fetchInterventions(props.onMessage, true),
        fetchProjectData(Cookies.get('project'), props.onMessage),
        fetchUserRoles(props.onMessage),
        fetchReleaseCategory(props.onMessage)
      ])
        .then(([allInterventions, projectdata, userRoles, categories]) => {
          setInterventions(allInterventions);

          if (projectdata) {
            var userCopy = [];
            projectdata.members.map(i => {
              userRoles.roles.map(userRole => {
                if (userRole.name === 'Change Agent' || userRole.name === 'Leadership Team') {
                  if (i.role === userRole.id) {
                    userCopy.push(i);
                  }
                }
              });
            });
            setChangeAgentList(userCopy);
          }
          allInterventions.map(intervention => {
            if (intervention.status != 'Done') {
              var date1 = new Date(intervention.date).setHours(0, 0, 0, 0);
              var date2 = new Date().setHours(0, 0, 0, 0);
              if (date1 < date2) {
                intervention.status = 'Pending';
              } else {
                intervention.status = 'Not_Due';
              }
            }
            engagementCampaignList.push(intervention.name);
          });

          setReleaseCategoriesList(
            categories.map(i => {
              return { release: i.category, id: i.id };
            })
          );

          setPersonaJobRoleList(projectdata.persona_job_roles);
        })
        .catch(e => props.onMessage(e, 'error'));
    }
    setRefresh(false);
  }, [refresh]);

  useEffect(() => {
    if (changeAgent) {
    } else {
      setFilteredItems(interventions);
      setDataFetched(true);
    }
  }, [interventions]);

  useEffect(() => {
    if (filter) {
      const interventionsCopy = JSON.parse(JSON.stringify(interventions));
      var filteredInterventions = interventionsCopy;

      if (searchObject.change_Agent != null) {
        filteredInterventions = filterByUsersInterventions(searchObject.change_Agent, filteredInterventions);
      }
      if (searchObject.intervention_type != null) {
        filteredInterventions = filteredInterventions.filter(item => item.SectionHeader === searchObject.intervention_type.InterventionType_Value);
      }
      if (searchObject.Engagement != null) {
        filteredInterventions = filteredInterventions.filter(item => item.name === searchObject.Engagement);
      }
      if (searchObject.job_role != null) {
        filteredInterventions = filterByJobRoleInterventions(searchObject.job_role, filteredInterventions);
      }
      if (searchObject.intent != null) {
        filteredInterventions = filteredInterventions.filter(item => item.Intent === searchObject.intent.IntentValue);
      }
      if (searchObject.status != null) {
        filteredInterventions = filteredInterventions.filter(item => item.status === searchObject.status);
      }
      if (searchObject.cate_gory != null) {
        filteredInterventions = filteredInterventions.filter(item => item.release_category.category === searchObject.cate_gory.release);
      }
      if (searchObject.date != null) {
        filteredInterventions = filteredInterventions.filter(item => {
          var date1 = new Date(item.date).setHours(0, 0, 0, 0);
          var date2 = new Date(searchObject.date).setHours(0, 0, 0, 0);
          if (date1 === date2) {
            return item;
          }
        });
      }
      if (searchObject.month) {
        filteredInterventions = filteredInterventions.filter(item => {
          var month1 = new Date(item.date).getMonth();
          const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
          ];
          var month2 = monthNames.indexOf(searchObject.month);
          if (month1 === month2) {
            return item;
          }
        });
      }
      setFilteredItems(filteredInterventions);
      setFilter(false);
    } else {
      setFilteredItems(interventions);
    }
  }, [searchObject, interventions]);

  useEffect(() => {
    if (filteredItems.length > 0) {
      if (props.interventionTracker != null) {
        interventionReport(props.interventionTracker);
      }
    }
  }, [filteredItems]);

  const interventionReport = object => {
    if (object.intervention_type) {
      setInterventionType(object.intervention_type);
    }
    if (object.job_role) {
      setPersonaJobRole(object.job_role);
    }
    if (object.Engagement) {
      setEngagementCampaign(object.Engagement);
      handleClick();
    }
    if (object.intent) {
      setIntent(object.intent);
      handleClick();
    }
    if (object.status) {
      if (object.status === 'Not Due') {
        object.status = 'Not_Due';
        setStatus('Not_Due');
      } else {
        setStatus(object.status);
      }
    }
    if (object.cate_gory) {
      setReleaseCategory(object.cate_gory);
      handleClick();
    }
    const searchObjectCopy = {
      change_Agent: object.change_Agent,
      intervention_type: object.intervention_type,
      job_role: object.job_role,
      date: object.date,
      Engagement: object.Engagement,
      intent: object.intent,
      status: object.status,
      cate_gory: object.cate_gory,
      month: object.month
    };
    setSearchObject(searchObjectCopy);
    setFilter(true);
    props.setInterventionTracker(null);
  };

  const filterByUsersInterventions = (object, interventions) => {
    var arr = [];
    interventions.map((intervention, index) => {
      intervention.users.map((user, index) => {
        if (object.username) {
          if (user.username === object.username) {
            arr.push(intervention);
          }
        } else {
          if (user.name === object.name) {
            arr.push(intervention);
            setChangeAgent(user);
          }
        }
      });
    });

    return arr;
  };

  const filterByJobRoleInterventions = (object, interventions) => {
    var arr = [];
    interventions.map((intervention, index) => {
      intervention.persona_job_roles.map((jobrole, index) => {
        if (jobrole.job_role === object.job_role) {
          arr.push(intervention);
        }
      });
    });

    return arr;
  };

  const handleClick = () => {
    setOpen(!open);
    if (open) {
      setFilterText('Show Additional Filters');
    } else {
      setFilterText('Hide Additional Filters');
    }
  };

  const handleStatus = e => {
    setStatus(e.target.value);
  };

  const handleInterventionStatus = (index, value) => {
    const filteredItemsCopy = JSON.parse(JSON.stringify(filteredItems));
    const item = filteredItemsCopy[index];
    filteredItemsCopy[index].status = value;
    updateIntervention(item.id, JSON.stringify(item), onMessage).then(data => {
      setRefresh(true);
    });

    setFilteredItems(filteredItemsCopy);
  };

  const handleSearch = () => {
    if (
      changeAgent === null &&
      interventionType === null &&
      personaJobRole === null &&
      selectedDate === null &&
      engagementCampaign === null &&
      intent === null &&
      status === null &&
      releaseCategory === null
    ) {
      props.onMessage('None of the filter has been Selected', 'warning');
    } else {
      const searchObjectCopy = {
        change_Agent: changeAgent,
        intervention_type: interventionType,
        job_role: personaJobRole,
        date: selectedDate,
        Engagement: engagementCampaign,
        intent: intent,
        status: status,
        cate_gory: releaseCategory
      };
      setSearchObject(searchObjectCopy);
      setFilter(true);
    }
  };

  return (
    <React.Fragment>
      <Grid container justify="center" direction="column">
        <Grid item container spacing={1} xs={12} className={classes.nested}>
          <Grid item>
            <Typography variant="h6" id="tableTitle" component="h2">
              Search Criteria
            </Typography>
          </Grid>
          <Grid item container justify="space-between" spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth variant="filled">
                <Autocomplete
                  id="Change_Agent"
                  value={changeAgent}
                  options={changeAgentList}
                  getOptionLabel={option => option.username}
                  onChange={(e, newValue) => setChangeAgent(newValue)}
                  renderInput={params => <TextField required {...params} label="Change Agent" variant="filled" />}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="filled">
                <Autocomplete
                  id="Intervention_Type"
                  value={interventionType}
                  options={interventionTypeList}
                  getOptionLabel={option => option.InterventionType_Value}
                  onChange={(e, newValue) => setInterventionType(newValue)}
                  renderInput={params => <TextField required {...params} label="Intervention Type" variant="filled" />}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="filled">
                <Autocomplete
                  id="Persona_Job_Role"
                  value={personaJobRole}
                  options={personaJobRoleList}
                  getOptionLabel={option => option.job_role}
                  onChange={(e, newValue) => setPersonaJobRole(newValue)}
                  renderInput={params => <TextField required {...params} label="Persona Job Role" variant="filled" />}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl component="fieldset" fullWidth variant="filled">
                <FormLabel component="legend">Status</FormLabel>
                <RadioGroup row aria-label="status" name="status" value={status} onChange={e => handleStatus(e)}>
                  <FormControlLabel value="Pending" control={<Radio color="primary" />} label="Pending" />
                  <FormControlLabel value="Not_Due" control={<Radio color="primary" />} label="Not Due" />
                  <FormControlLabel value="Done" control={<Radio color="primary" />} label="Done" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Grid item container xs={12} justify="center">
            <List>
              <ListItem button onClick={handleClick}>
                <ListItemText primary={filterText} />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
            </List>
          </Grid>
          {open ? (
            <Grid item container justify="space-between" spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth variant="filled">
                  <MuiPickersUtilsProvider utils={DateFnsUtils} justify="space-around">
                    <KeyboardDatePicker
                      inputVariant="filled"
                      id="date_picker"
                      label="Date"
                      placeholder={localeFormat[inputLocale].toUpperCase()}
                      format={localeFormat[inputLocale]}
                      onChange={date => {
                        setSelectedDate(date);
                      }}
                      value={selectedDate}
                      className={classes.datepickerstyle}
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="filled">
                  <Autocomplete
                    id="Engagement_Campaign"
                    value={engagementCampaign}
                    options={engagementCampaignList}
                    getOptionLabel={option => option}
                    onChange={(e, newValue) => setEngagementCampaign(newValue)}
                    renderInput={params => <TextField {...params} label="Engagement Campaign" variant="filled" />}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="filled">
                  <Autocomplete
                    id="Intent"
                    value={intent}
                    options={intentList}
                    getOptionLabel={option => option.IntentValue}
                    onChange={(e, newValue) => setIntent(newValue)}
                    renderInput={params => <TextField {...params} label="Intent" variant="filled" />}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="filled">
                  <Autocomplete
                    id="Release_Category"
                    value={releaseCategory}
                    options={releaseCategoriesList}
                    getOptionLabel={option => option.release}
                    getOptionSelected={(option, value) => option.release === value.release}
                    onChange={(e, newValue) => setReleaseCategory(newValue)}
                    renderInput={params => <TextField {...params} label="Release Category" variant="filled" />}
                  />
                </FormControl>
              </Grid>
            </Grid>
          ) : null}
          <Grid item container justify="flex-end">
            <Button variant="contained" color="primary" className={classes.button1} onClick={e => handleSearch()}>
              Search
            </Button>
          </Grid>
        </Grid>

        <Paper>
          <Grid item xs={11}>
            {filteredItems.length === 0 ? (
              <Grid item className={classes.result}>
                <Typography variant="h6" component="h2" align="center">
                  No Results Found
                </Typography>
              </Grid>
            ) : (
              <Grid item className={classes.result}>
                <Typography variant="h6" component="h2">
                  Results({filteredItems.length})
                </Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              {filteredItems.map((item, index) => (
                <Paper key={index} className={classes.paper}>
                  <Grid item container xs={12} direction="row" justify="center" spacing={2}>
                    <Grid item container spacing={5} direction="column" justify="space-between" xs={4}>
                      <Grid item>
                        <Typography color="textSecondary">ID</Typography>
                        <Typography>{item.id}</Typography>
                      </Grid>

                      <Grid item>
                        <Typography color="textSecondary">Date</Typography>
                        <Typography>{item.date}</Typography>
                      </Grid>

                      <Grid item>
                        <Typography color="textSecondary">Engagement Campaign</Typography>
                        <Typography>{item.name}</Typography>
                      </Grid>

                      <Grid item>
                        <Typography color="textSecondary">Release Category</Typography>
                        <Typography>{item.release_category.category}</Typography>
                      </Grid>
                    </Grid>

                    <Grid item container spacing={5} direction="column" xs={4}>
                      <Grid item>
                        <Typography color="textSecondary">Intervention Type</Typography>
                        <Typography>{item.SectionHeader}</Typography>
                      </Grid>

                      <Grid item>
                        <Typography color="textSecondary">Persona Job Role</Typography>
                        {item.persona_job_roles.map((job, index) => (
                          <Typography key={index}>{job.job_role}</Typography>
                        ))}
                      </Grid>

                      <Grid item>
                        <Typography color="textSecondary">Intent</Typography>
                        <Typography> {item.Intent}</Typography>
                      </Grid>

                      <Grid item>
                        <Typography color="textSecondary">Change Agent</Typography>
                        {item.users.map((user, index) => (
                          <Typography key={index}>
                            {index + 1}. {user.username}
                          </Typography>
                        ))}
                      </Grid>
                    </Grid>

                    <Divider orientation="vertical" flexItem />
                    <Grid item container className={classes.statusMargin} justify="center" direction="column" xs={4}>
                      <Grid item>
                        <FormControl component="fieldset">
                          <FormLabel component="legend">Change Status</FormLabel>
                          <RadioGroup
                            aria-label="change_status"
                            name="change_status"
                            value={item.status}
                            onChange={e => handleInterventionStatus(index, e.target.value)}>
                            <FormControlLabel value="Pending" control={<Radio color="primary" />} label="Pending" />
                            <FormControlLabel value="Not_Due" control={<Radio color="primary" />} label="Not Due" />
                            <FormControlLabel value="Done" control={<Radio color="primary" />} label="Done" />
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                      <br />
                      <br />

                      <Grid item>
                        <Typography variant="body1" color="primary">
                          <Link component={RouterLink} to={`create-intervention/${item.id}`}>
                            Edit Intervention
                          </Link>
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </React.Fragment>
  );
}

export default InterventionTracker;
