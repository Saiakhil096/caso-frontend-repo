import 'date-fns';
import Cookies from 'js-cookie';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ToggleButton, ToggleButtonGroup, Autocomplete, createFilterOptions } from '@material-ui/lab';
import { makeStyles, TextField, Grid, Paper, Button, Box, Typography, Chip, Checkbox } from '@material-ui/core';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { fetchReleaseCategory, fetchInterventions, fetchProjectData } from '../common/API';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon, CheckBox as CheckBoxIcon } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  columnStyle: {
    backgroundColor: 'inherit',
    width: '100%',
    marginTop: theme.spacing(1)
  },
  paper: {
    width: '100%',
    maxWidth: '75rem',
    alignSelf: 'center',
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: 'inherit',
    maxHeight: '100%',
    height: '80%',
    display: 'flex'
  },
  toggleGroupStyle: {
    flexDirection: 'column',
    exclusive: 'false',
    marginLeft: theme.spacing(2),
    width: '100%',
    backgroundColor: 'inherit',
    marginBottom: theme.spacing(5)
  },
  buttonStyle: {
    marginTop: theme.spacing(10)
  }
}));

const toggleStyles = makeStyles(
  {
    root: {
      color: '#1381B9',
      textTransform: 'none',
      marginTop: '10px',
      height: '30px',
      width: '70%',
      '&$selected': {
        backgroundColor: '#1381B9',
        color: 'white',
        '&:hover': {
          backgroundColor: '#1381B9',
          color: 'white'
        }
      }
    },
    selected: {}
  },
  { name: 'MuiToggleButton' }
);

const ChangeCalendar = props => {
  props.setTitle('Change Calendar');
  const classes = useStyles();
  const toggleClass = toggleStyles();
  const locales = { 'en-US': require('date-fns/locale/en-US') };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
  });

  const [releaseCategoriesList, setReleaseCategoriesList] = useState([]);
  const [personaJobList, setPersonaJobList] = useState([]);
  const [releaseCategory, setReleaseCategory] = useState([]);
  const [jobRole, setJobRole] = useState([]);
  const [jobValue, setJobValue] = useState([]);
  const [interventionName, setInterventionName] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [allSelected, setAllSelected] = useState('');
  const handleRollout = (event, newValue) => {
    setReleaseCategory(newValue);
  };

  const filter = createFilterOptions();

  useEffect(() => {
    Promise.all([
      fetchReleaseCategory(props.onMessage),
      fetchProjectData(Cookies.get('project'), props.onMessage),
      fetchInterventions(props.onMessage, false)
    ])
      .then(data => {
        setReleaseCategoriesList(
          data[0]
            ? data[0].map(i => {
                return i.category;
              })
            : []
        );

        setPersonaJobList(
          data[1]
            ? data[1].persona_job_roles.map(i => {
                return i.job_role;
              })
            : []
        );
        setInterventionName(
          data[2]
            ? data[2].map(i => {
                return {
                  intervention_category: i.release_category.category,
                  intervention_role: i.persona_job_roles.map(j => {
                    return j.job_role;
                  }),
                  interventionDate: i.date,
                  intervention: i.name
                };
              })
            : []
        );
      })
      .catch(e => {
        props.onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      });
  }, []);

  useEffect(() => {
    setAllSelected(personaJobList.length === jobRole.length);

    const categoriesFound = interventionName.filter(interventions => releaseCategory.indexOf(interventions.intervention_category) !== -1);
    if (jobRole.length > 0) {
      if (categoriesFound.length > 0) {
        const categoriesCopy = JSON.parse(JSON.stringify(categoriesFound));

        let interventionsFound = categoriesCopy.map(j => {
          const roleFoundStatus = j.intervention_role.filter(k => {
            return jobRole.indexOf(k) != -1;
          });
          return roleFoundStatus.length ? j : null;
        });
        interventionsFound = interventionsFound.filter(el => {
          return el != null;
        });
        setFilteredItems(interventionsFound);
      } else {
        let interventionsFound = interventionName.map(j => {
          const roleFoundStatus = j.intervention_role.filter(k => {
            return jobRole.indexOf(k) != -1;
          });
          return roleFoundStatus.length ? j : null;
        });
        interventionsFound = interventionsFound.filter(el => {
          return el != null;
        });

        setFilteredItems(interventionsFound);
      }
    } else {
      if (releaseCategory.length > 0) {
        setFilteredItems(categoriesFound);
      } else {
        setFilteredItems(interventionName);
      }
    }
  }, [releaseCategory, jobRole, jobValue, interventionName]);

  useEffect(() => {
    const calendarEvents = filteredItems.map(i => {
      return { title: i.intervention, start: i.interventionDate, end: i.interventionDate, allDay: 'true' };
    });
    setEvents(calendarEvents);
  }, [filteredItems]);

  const handleClearOptions = () => {
    setJobRole([]);
    setJobValue([]);
  };

  const handleSelectAll = (isSelected, reason, value) => {
    if (isSelected) {
      setJobRole(personaJobList);
    } else {
      if (reason === 'select-option') {
        if (value.option === 'All') {
          setJobValue(result1);
          setJobRole(personaJobList);
        } else {
          let result = [];
          result = jobRole.filter(el => el !== value.option);
          setJobValue(result);
          setJobRole(result);
        }
      } else {
        handleClearOptions();
      }
    }
  };

  const handleToggleSelectAll = (reason, value) => {
    handleSelectAll && handleSelectAll(!allSelected, reason, value);
  };

  const result1 = ['All'];

  const handleToggleOption = jobRole => {
    if (jobRole.length === personaJobList.length) {
      setJobRole(jobRole);
      setJobValue(result1);
    } else {
      setJobValue(jobRole);
      setJobRole(jobRole);
    }
  };
  const handleChange = (event, jobRole, reason, value) => {
    setAllSelected(personaJobList.length === jobRole.length);
    if (reason === 'select-option' || reason === 'remove-option') {
      if (jobRole.find(option => option === 'All')) {
        setJobValue(result1);
        handleToggleSelectAll(reason, value);
      } else {
        handleToggleOption && handleToggleOption(jobRole);
      }
    } else if (reason === 'clear') {
      handleClearOptions && handleClearOptions();
    }
  };
  return (
    <React.Fragment>
      <Paper className={classes.paper} elevation={0}>
        <Box display="flex" p={1} m={1}>
          <Box style={{ flex: 1 }} mr={5} flexDirection="row">
            <Grid container>
              <Paper className={classes.columnStyle} elevation={0}>
                <Typography variant="subtitle1">Select Rollout</Typography>
                <ToggleButtonGroup className={classes.toggleGroupStyle} value={releaseCategory} onChange={handleRollout}>
                  {releaseCategoriesList.map(i => (
                    <ToggleButton
                      value={i}
                      key={i}
                      style={{ border: '2px solid rgb(19, 129, 185)', borderRadius: '30px' }}
                      className={toggleClass.root}
                      aria-label={i}>
                      {i}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Paper>
            </Grid>
            <Grid container>
              <Paper className={classes.columnStyle} elevation={0}>
                <Autocomplete
                  multiple
                  id="select-job-roles"
                  options={personaJobList}
                  value={jobValue}
                  limitTags={2}
                  getOptionLabel={option => option}
                  getOptionSelected={(option, value) => option === value}
                  onChange={handleChange}
                  renderOption={(option, { selected }) => {
                    let selectJobIndex = jobValue.findIndex(Role => Role.toLowerCase() === 'all');
                    const allSelected = jobRole.length === personaJobList.length;
                    const selectAllProps = selectJobIndex > -1 ? { checked: allSelected } : {};

                    return (
                      <React.Fragment>
                        <Checkbox
                          color="primary"
                          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                          checkedIcon={<CheckBoxIcon fontSize="small" />}
                          checked={selected}
                          {...selectAllProps}
                        />
                        {option}
                      </React.Fragment>
                    );
                  }}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => <Chip color="primary" label={option} variant="outlined" {...getTagProps({ index })} />)
                  }
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    return ['All', ...filtered];
                  }}
                  renderInput={params => (
                    <TextField
                      {...params}
                      style={{ maxHeight: '100px', overflow: 'auto', width: '300px' }}
                      variant="filled"
                      label="Select Persona Job Roles"
                    />
                  )}
                />
              </Paper>
              <Grid container>
                <Button variant="contained" color="primary" component={RouterLink} to="/create-intervention" className={classes.buttonStyle}>
                  Create New Intervention
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Box style={{ flex: 3 }} flexDirection="row">
            <Calendar
              events={events}
              startAccessor="start"
              endAccessor="end"
              localizer={localizer}
              views={['month', 'week', 'work_week', 'day', 'agenda']}
            />
          </Box>
        </Box>
      </Paper>
    </React.Fragment>
  );
};

export default ChangeCalendar;
