import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Grid,
  Paper,
  Button,
  Typography,
  MenuItem,
  Backdrop,
  CircularProgress,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import Cookies from 'js-cookie';
import GroupIcon from './GroupIcon';
import { useParams } from 'react-router-dom';
import { fetchUserTrainings, fetchTrainingGroups, url } from '../common/API';

const useStyles = makeStyles(theme => ({
  paper: {
    margin: '20px',
    width: '380px',
    backgroundColor: '#F5F5F5',
    border: '1px solid #c1c1c1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  paper1: {
    margin: '20px',
    width: '380px',
    border: '1px solid #c1c1c1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  container1: {
    borderBottom: '1px solid #616161',
    backgroundColor: '#F5F5F5',
    padding: '20px'
  },
  container: {
    borderBottom: '1px solid #616161',
    padding: '20px'
  },
  margin: {
    margin: '10px'
  },
  margin2: {
    margin: '20px'
  },
  formControl: {
    margin: theme.spacing(2),
    minWidth: 300
  },
  select: {
    placeSelf: 'flex-end'
  }
}));
function AssignTraining(props) {
  const classes = useStyles();
  const { onMessage, setTitle } = props;
  const [selectedUserTrainings, setSelectedUserTrainings] = useState([]);
  const [trainingGroups, setTrainingGroups] = useState([]);
  const [assignableTrainings, setAssignableTrainings] = useState([]);
  const [currentUserTrainings, setCurrentUserTrainings] = useState([]);
  const [checked, setChecked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState();
  const { userId, id } = useParams();
  setTitle('Assign Training');

  useEffect(() => {
    Promise.all([fetchUserTrainings(onMessage), fetchTrainingGroups(onMessage)]).then(([userTrainingDataJson, trainingGroupDataJson]) => {
      setTrainingGroups(trainingGroupDataJson);
      userTrainingDataJson.map(userTraining => {
        if (userTraining.user_profile.id === Number(userId)) {
          setProfileName(userTraining.user_profile.profile_name);
          setCurrentUserTrainings(userTraining.trainings);
        }
        const selectedGroup = trainingGroupDataJson.find(trainingGroup => {
          return trainingGroup.persona_job_roles.find(jobRole => {
            if (jobRole.id == id) {
              setAssignableTrainings(trainingGroup.trainings);
              return trainingGroup;
            }
          });
        });

        const selectedUserTrainings = userTrainingDataJson.find(userTraining => {
          return userTraining.user_profile.id == Number(userId);
        });
        selectedUserTrainings != null ? setSelectedUserTrainings(selectedUserTrainings) : setSelectedUserTrainings([]);

        const checkedArray = trainingGroupDataJson.map(group => {
          if (selectedGroup != null) return selectedGroup == group ? true : false;
        });
        setChecked(checkedArray);
      });
      setLoading(false);
    });
  }, []);

  const handleAssignTraining = (event, training) => {
    if (currentUserTrainings != null) {
      selectedUserTrainings.trainings.push(training);
      fetch(new URL(`user-trainings/${selectedUserTrainings.id}`, url), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${Cookies.get('jwt')}`
        },
        body: JSON.stringify({
          trainings: selectedUserTrainings.trainings
        })
      })
        .then(response => {
          if (!response.ok) throw response;
          return response.json();
        })
        .then(response => {
          onMessage('Training has been assigned', 'success');
          setCurrentUserTrainings(selectedUserTrainings.trainings);
        })
        .catch(e => {
          onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
        });
    } else {
      fetch(new URL(`user-trainings`, url), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Cookies.get('jwt')}`
        },
        body: JSON.stringify({
          user_profile: id,
          trainings: training,
          project: Cookies.get('project')
        })
      })
        .then(response => {
          if (!response.ok) throw response;
          return response.json();
        })
        .then(response => {
          onMessage('Training has been assigned', 'success');
          setCurrentUserTrainings(response.trainings);
          setSelectedUserTrainings(response);
        })
        .catch(e => {
          onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
        });
    }
  };
  const handleUnassignTraining = (event, training) => {
    var index = selectedUserTrainings.trainings.indexOf(training);
    if (index > -1) {
      selectedUserTrainings.trainings.splice(index, 1);
    }
    fetch(new URL(`user-trainings/${selectedUserTrainings.id}`, url), {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${Cookies.get('jwt')}`
      },
      body: JSON.stringify({
        trainings: selectedUserTrainings.trainings
      })
    })
      .then(response => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then(response => {
        onMessage('Training has been unassigned', 'success');
        setCurrentUserTrainings(selectedUserTrainings.trainings);
      })
      .catch(e => {
        onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      });
  };

  const handleChange = (event, index) => {
    setLoading(true);
    checked[index] = !checked[index];
    setChecked([...checked, (checked[index] = checked[index])]);
    const selectedTrainings = trainingGroups.reduce((result, group, index) => {
      if (checked[index] == true) {
        return result.concat(group.trainings);
      } else {
        return result;
      }
    }, []);
    setAssignableTrainings(selectedTrainings);
    setLoading(false);
  };
  const renderTrainingGroupIcon = training => {
    const groupFound = trainingGroups.find(group => {
      return group.id == training.training_group;
    });
    return <GroupIcon icon={groupFound.group_icon} className={classes.margin} />;
  };

  const generateButton = training => {
    if (currentUserTrainings != null) {
      let isTrainingAssigned = currentUserTrainings.find(userTraining => {
        return userTraining.id == training.id;
      });
      let buttonType = isTrainingAssigned != null ? 'unassign' : 'assign';
      return buttonType;
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
        <Grid container direction="column">
          <Grid container direction="column" className={classes.container1}>
            <Typography variant="h6" className={classes.margin2}>
              Assigned Training Courses ( {profileName} )
            </Typography>
            <Grid container direction="row" className={classes.trainingContainer}>
              {currentUserTrainings != null
                ? currentUserTrainings.map((training, index) => {
                    return (
                      <Paper key={index} className={classes.paper1}>
                        <Typography variant="subtitle1" className={classes.margin}>
                          {training.training_name}
                        </Typography>
                        <Typography variant="body2" className={classes.margin}>
                          {training.training_description}
                        </Typography>
                        {renderTrainingGroupIcon(training)}
                        <Button
                          disableElevation
                          variant="outlined"
                          color="primary"
                          onClick={event => handleUnassignTraining(event, training)}
                          className={classes.margin}>
                          Unassign
                        </Button>
                      </Paper>
                    );
                  })
                : null}
            </Grid>
          </Grid>
          <Grid container direction="column" className={classes.container}>
            <Grid item className={classes.select}>
              <FormControl className={classes.formControl}>
                <InputLabel>Select Training Group </InputLabel>
                <Select>
                  <FormGroup>
                    {trainingGroups.map((group, index) => {
                      return (
                        <MenuItem key={index}>
                          <FormControlLabel
                            control={<Checkbox checked={checked[index]} color="primary" onChange={event => handleChange(event, index)} />}
                            label={group.group_name}
                          />
                        </MenuItem>
                      );
                    })}
                  </FormGroup>
                </Select>
              </FormControl>
            </Grid>
            <Typography variant="h6" className={classes.margin2}>
              Training Courses
            </Typography>
            <Grid container direction="row" className={classes.trainingContainer}>
              {assignableTrainings.map((training, index) => (
                <Paper key={index} className={classes.paper} direction="row">
                  <Typography variant="subtitle1" className={classes.margin}>
                    {training.training_name}
                  </Typography>
                  <Typography variant="body2" className={classes.margin}>
                    {training.training_description}
                  </Typography>
                  {renderTrainingGroupIcon(training)}
                  {generateButton(training) === 'unassign' ? (
                    <Button
                      disableElevation
                      variant="outlined"
                      color="primary"
                      onClick={event => handleUnassignTraining(event, training)}
                      className={classes.margin}>
                      Unassign
                    </Button>
                  ) : (
                    <Button
                      disableElevation
                      variant="contained"
                      color="primary"
                      onClick={event => handleAssignTraining(event, training)}
                      className={classes.margin}>
                      Assign
                    </Button>
                  )}
                </Paper>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default AssignTraining;
