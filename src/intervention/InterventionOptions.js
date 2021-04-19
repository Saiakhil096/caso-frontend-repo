import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { fetchReleaseCategory, createIntervention, fetchProjectData, fetchIntervention, updateIntervention, fetchUserRoles } from '../common/API';
import { makeStyles, TextField, Grid, Paper, Button, Chip, Typography, Checkbox } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon, CheckBox as CheckBoxIcon } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  paper: {
    width: '100%',
    maxWidth: '30rem',
    alignSelf: 'center',
    backgroundColor: 'inherit',
    marginBottom: theme.spacing(2)
  },
  textfieldstyle: {
    width: '100%',
    marginTop: theme.spacing(2)
  },
  datepickerstyle: {
    width: '100%',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
}));

const InterventionOptions = props => {
  const classes = useStyles();
  const [releaseCategoriesList, setReleaseCategoriesList] = useState([]);
  const [personaJobList, setPersonaJobList] = useState([]);
  const [agentsList, setAgentsList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [releaseCategory, setReleaseCategory] = useState(null);
  const [intent, setIntent] = useState(null);
  const [interventionName, setInterventionName] = useState('');
  const [jobRole, setJobRole] = useState([]);
  const [sectionHeader, setSectionHeader] = useState(null);
  const [agentsSelected, setAgentsSelected] = useState([]);
  const [interventionId, setInterventionId] = useState();

  const sectionHeadersList = [
    { SectionHeader_Value: 'Contact_and_Awareness', SectionHeader_Input: 'Contact and Awareness' },
    { SectionHeader_Value: 'Understanding', SectionHeader_Input: 'Understanding' },
    { SectionHeader_Value: 'Expectations', SectionHeader_Input: 'Expectations' },
    { SectionHeader_Value: 'Reinforcement', SectionHeader_Input: 'Reinforcement' },
    { SectionHeader_Value: 'Adoption', SectionHeader_Input: 'Adoption' }
  ];
  const intentsList = [{ IntentValue: 'Adaptive' }, { IntentValue: 'Resistant' }];

  const [inputLocale, setInputLocale] = useState('en_GB');
  const localeFormat = { en_US: 'MM/dd/yyyy', en_GB: 'dd/MM/yyyy' };
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  useEffect(() => {
    var str = window.location.pathname;
    var res = str.split('/');
    const _id = res[res.length - 1];
    setInterventionId(parseInt(_id));

    if (!isNaN(_id)) {
      fetchIntervention(_id, props.onMessage)
        .then(data => {
          setSelectedDate(data.date);
          setInterventionName(data.name);
          var sectionHeaderObject = { SectionHeader_Value: `${data.SectionHeader}`, SectionHeader_Input: `${data.SectionHeader}` };
          setSectionHeader(sectionHeaderObject);
          var releaseCategoryObject = { release: data.release_category.category, id: data.release_category.id };
          setReleaseCategory(releaseCategoryObject);
          var personaJobRoleObject = data.persona_job_roles.map(i => {
            return { employee: i.job_role, id: i.id };
          });
          setJobRole(personaJobRoleObject);
          var intentbject = { IntentValue: `${data.Intent}` };
          setIntent(intentbject);
          var agentsObject = data.users.map(i => {
            return { id: i.id, agentName: i.username, agentEmail: i.email };
          });
          setAgentsSelected(agentsObject);
        })
        .catch(e => props.onMessage(e, 'error'));
    }

    setInputLocale(Cookies.get('locale'));
    Promise.all([fetchReleaseCategory(props.onMessage), fetchProjectData(Cookies.get('project'), props.onMessage), fetchUserRoles(props.onMessage)])
      .then(data => {
        setReleaseCategoriesList(
          data[0]
            ? data[0].map(i => {
                return { release: i.category, id: i.id };
              })
            : []
        );
        if (data[1]) {
          var jobRoleCopy = [{ employee: 'All', id: null }];
          data[1].persona_job_roles.map(i => {
            jobRoleCopy.push({ employee: i.job_role, id: i.id });
          });
          setPersonaJobList(jobRoleCopy);
        }

        if (data[1]) {
          var userCopy = [];
          data[1].members.map(i => {
            data[2].roles.map(userRole => {
              if (userRole.name === 'Change Agent' || userRole.name === 'Leadership Team') {
                if (i.role === userRole.id) {
                  userCopy.push({
                    id: i.id,
                    agentName: i.username,
                    agentEmail: i.email,
                    //agentLocation: i.base_location.location,
                    role: userRole.name
                  });
                }
              }
            });
          });
          setAgentsList(userCopy);
        }
      })
      .catch(e => {
        props.onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      });
  }, []);

  const handleCreateIntervention = () => {
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (selectedDate === null) {
      props.onMessage('Please select a date', 'error');
      return;
    } else if (selectedDate < currentDate) {
      props.onMessage('Date cannot be in the past', 'error');
      return;
    } else if (!sectionHeader) {
      props.onMessage('Please select a value for Section Header', 'error');
      return;
    } else if (!releaseCategory) {
      props.onMessage('Please select a value for Release Category', 'error');
      return;
    } else if (interventionName.length < 1) {
      props.onMessage('Please select a value for Intervention Name', 'error');
      return;
    } else if (jobRole.length < 0) {
      props.onMessage('Please select a value for Persona Job Role', 'error');
      return;
    } else if (!intent) {
      props.onMessage('Please select a value for intent', 'error');
      return;
    } else if (agentsSelected.length < 0) {
      props.onMessage('Please add agents to continue', 'error');
      return;
    } else {
      var jobRoleCopy = [];
      if (jobRole[0].employee === 'All') {
        personaJobList.map((item, index) => {
          if (item.employee != 'All') {
            jobRoleCopy.push(item);
          }
        });
      } else {
        jobRoleCopy = jobRole;
      }
      const raw = JSON.stringify({
        project: Cookies.get('project'),
        date: selectedDate,
        SectionHeader: sectionHeader.SectionHeader_Value,
        release_category: releaseCategory.id,
        name: interventionName,
        persona_job_roles: jobRoleCopy
          .map(i => {
            return i.id;
          })
          .toString()
          .split(','),
        Intent: intent.IntentValue,
        users: agentsSelected
          .map(i => {
            return i.id;
          })
          .toString()
          .split(',')
      });
      if (interventionId) {
        updateIntervention(interventionId, raw, props.onMessage)
          .then(() => {
            props.onMessage('Intervention updated successfully', 'success');
          })
          .catch(e => {
            props.onMessage(`Error in creating interventions: ${e.statusText}`, 'error');
          });
      } else {
        createIntervention(raw, props.onMessage)
          .then(() => {
            props.onMessage('Intervention created successfully', 'success');
          })
          .catch(e => {
            props.onMessage(`Error in creating interventions: ${e.statusText}`, 'error');
          });
      }
      setSelectedDate(null);
      setReleaseCategory(null);
      setIntent(null);
      setInterventionName('');
      setJobRole([]);
      setSectionHeader(null);
      setAgentsSelected([]);
    }
  };

  const handleJobRoleChange = (event, newValue) => {
    var arr1 = [];
    var arr2 = [];

    newValue.map((item, index) => {
      if (item.employee != 'All') {
        arr1.push(item);
      } else {
        arr2.push(item);
      }
    });
    if (arr2.length > 0) {
      setJobRole(arr2);
    } else {
      setJobRole(arr1);
    }
  };

  return (
    <React.Fragment>
      <Paper className={classes.paper} elevation={0}>
        <form>
          <MuiPickersUtilsProvider utils={DateFnsUtils} justify="space-around">
            <KeyboardDatePicker
              margin="normal"
              inputVariant="filled"
              id="date_picker"
              label="Date"
              placeholder={localeFormat[inputLocale].toUpperCase()}
              // minDateMessage="Date cannot be in the past"
              format={localeFormat[inputLocale]}
              onChange={date => {
                setSelectedDate(date);
              }}
              value={selectedDate}
              className={classes.datepickerstyle}
              // disablePast
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
            />
          </MuiPickersUtilsProvider>

          <Autocomplete
            id="intervention_header"
            options={sectionHeadersList}
            value={sectionHeader}
            autoHighlight
            getOptionLabel={option => option.SectionHeader_Input}
            getOptionSelected={(option, value) => option.SectionHeader_Input === value.SectionHeader_Input}
            onChange={(event, newValue) => {
              setSectionHeader(newValue);
            }}
            renderInput={params => (
              <TextField
                {...params}
                label="Section Header of Intervention"
                variant="filled"
                inputProps={{
                  ...params.inputProps
                }}
              />
            )}
          />
          <TextField
            className={classes.textfieldstyle}
            id="intervention_name"
            label="Name of Intervention"
            value={interventionName}
            type="search"
            variant="filled"
            onChange={event => {
              event.target.value ? setInterventionName(event.target.value) : setInterventionName('');
            }}
          />

          <Autocomplete
            id="intervention-release-category"
            options={releaseCategoriesList}
            value={releaseCategory}
            autoHighlight
            getOptionLabel={option => option.release}
            getOptionSelected={(option, value) => option.release === value.release}
            onChange={(e, newValue) => setReleaseCategory(newValue)}
            renderInput={params => {
              return (
                <TextField
                  className={classes.textfieldstyle}
                  {...params}
                  label="Release Category"
                  variant="filled"
                  inputProps={{
                    ...params.inputProps
                  }}
                />
              );
            }}
          />

          <Autocomplete
            multiple
            includeInputInList
            id="intervention-persona-job-role"
            options={personaJobList}
            value={jobRole}
            autoHighlight
            getOptionLabel={option => option.employee}
            getOptionSelected={(option, value) => option.employee === value.employee}
            onChange={(event, newValue) => {
              handleJobRoleChange(event, newValue);
            }}
            renderOption={(option, state) => {
              const selectJobIndex = jobRole.findIndex(job => job.employee.toLowerCase() === 'all');
              if (selectJobIndex > -1) {
                state.selected = true;
              }
              return (
                <React.Fragment>
                  <Checkbox color="primary" icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={state.selected} />
                  {option.employee}
                </React.Fragment>
              );
            }}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => <Chip label={option.employee} variant="outlined" {...getTagProps({ index })} />)
            }
            renderInput={params => (
              <TextField
                className={classes.textfieldstyle}
                {...params}
                label="Persona Job Role"
                variant="filled"
                inputProps={{
                  ...params.inputProps
                }}
              />
            )}
          />

          <Autocomplete
            id="intervention-intent"
            options={intentsList}
            value={intent}
            autoHighlight
            getOptionLabel={option => option.IntentValue}
            getOptionSelected={(option, value) => option.IntentValue === value.IntentValue}
            onChange={(event, newValue) => {
              setIntent(newValue);
            }}
            renderInput={params => (
              <TextField
                className={classes.textfieldstyle}
                {...params}
                label="Intent"
                variant="filled"
                inputProps={{
                  ...params.inputProps
                }}
              />
            )}
          />

          <Autocomplete
            multiple
            includeInputInList
            filterSelectedOptions
            id="intervention-add-agents"
            options={agentsList}
            value={agentsSelected}
            getOptionLabel={option => option.agentName}
            getOptionSelected={(option, value) => option.agentName === value.agentName}
            onChange={(event, newValue) => {
              setAgentsSelected(newValue);
            }}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => <Chip label={option.agentName} variant="outlined" {...getTagProps({ index })} />)
            }
            renderOption={option => {
              return (
                <Grid container alignItems="center">
                  {option.role === 'Change Agent' ? (
                    <Grid item xs>
                      {option.agentName},{option.role}
                      <Typography variant="body2" color="textSecondary">
                        {option.agentEmail}
                      </Typography>
                    </Grid>
                  ) : (
                    <Grid item xs style={{ color: 'green' }}>
                      {option.agentName},{option.role}
                      <Typography variant="body2" color="textSecondary">
                        {option.agentEmail}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              );
            }}
            renderInput={params => (
              <TextField {...params} className={classes.datepickerstyle} variant="filled" label="Add Change Agents and Leaders" />
            )}
          />

          <Grid container justify="flex-end">
            {interventionId ? (
              <Grid item>
                <Button variant="contained" color="primary" onClick={e => handleCreateIntervention()}>
                  Update
                </Button>
              </Grid>
            ) : (
              <Grid item>
                <Button variant="contained" color="primary" onClick={e => handleCreateIntervention()}>
                  Create
                </Button>
              </Grid>
            )}
          </Grid>
        </form>
      </Paper>
    </React.Fragment>
  );
};

export default InterventionOptions;
