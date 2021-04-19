import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  TextField,
  Paper,
  Grid,
  Typography,
  IconButton,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Checkbox,
  Tooltip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';

import { Close as CloseIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { fetchProjectSpecificPerceptions, fetchProjectSpecificIdeas, createPerception, createIdea } from '../../common/API';
import { VerySadIcon, SadIcon, OkIcon, HappyIcon, VeryHappyIcon } from '../../common/CustomIcons';
import { red, amber, yellow, lightGreen, green } from '@material-ui/core/colors';
import Smiley from './Smiley';

const useStyles = makeStyles(theme => ({
  paper: {
    background: 'none',
    width: '100%',
    maxWidth: '40rem',
    margin: theme.spacing(1, 'auto'),
    padding: theme.spacing(2),
    boxShadow: 'none'
  }
}));

function PainPoints(props) {
  const classes = useStyles();
  const { onMessage } = props;
  const [open, setOpen] = useState(false);
  const [control, setControl] = useState({
    l_2_process_id: null,
    l_2_type: '',
    control_type: ''
  });

  const [perception, setPerception] = useState({
    l_2_process: {
      title: ''
    },
    pain_points: [],
    rating: null
  });

  const [perceptions, setPerceptions] = useState([]);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [painpointsData, setPainPointsData] = useState([]);
  const [createNew, setCreateNew] = useState(false);
  const [newPerceptionReason, setNewPerceptionReason] = useState('');
  const [newIdeaReason, setNewIdeaReason] = useState('');
  const [refresher, setRefresher] = useState(true);
  const [loader, setLoader] = useState(true);
  const [rating, setRating] = useState(null);

  useEffect(() => {
    if (refresher) {
      if (props.personaId !== undefined) {
        setPainPointsData(props.profile.PainPoints);
      }
      fetchProjectSpecificPerceptions(props.projectId, onMessage).then(data => {
        if (data.length > 0) {
          let perceptionsData = [];
          for (let index = 0; index < data.length; index++) {
            for (let index2 = 0; index2 < data[index].Perception.length; index2++) {
              data[index].Perception[index2].pain_points.map(painpoint => {
                painpoint.rating = data[index].Perception[index2].rating;
              });
              const perception = {
                id: data[index].Perception[index2].id,
                l_2_process: data[index].Perception[index2].l_2_process,

                pain_points: data[index].Perception[index2].pain_points
              };
              perceptionsData.push(perception);
            }
          }

          var output = perceptionsData.reduce(function (acc, cur) {
            // Get the index of the key-value pair.

            var occurs = acc.reduce(function (n, item, i) {
              return item.l_2_process.title === cur.l_2_process.title ? i : n;
            }, -1);

            // If the l_2_process.title is found,
            if (occurs >= 0) {
              // append the current value to its list of values.

              acc[occurs].pain_points.push(...cur.pain_points);

              // Otherwise,
            } else {
              // add the current item to acc (but make sure the value is an array).
              var obj = {
                l_2_process: cur.l_2_process,
                pain_points: cur.pain_points
              };
              acc = acc.concat([obj]);
            }
            return acc;
          }, []);
          setPerceptions(output);
        }

        setRefresher(false);
        setLoader(false);
      });
      fetchProjectSpecificIdeas(props.projectId, onMessage).then(data => {
        data.map(idea => {
          idea.checked = false;
        });
        setIdeas(data);
      });
    }
  }, [refresher]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCreateNew(false);
  };

  const handleAddPerceptions = (perception, controlType) => {
    setControl({
      l_2_process_id: perception.l_2_process.id,
      l_2_type: perception.l_2_process.title,
      control_type: controlType
    });
    perception.pain_points.map(painpoint => {
      painpoint.checked = false;
    });
    for (let index = 0; index < props.profile.PainPoints.length; index++) {
      for (let index2 = 0; index2 < perception.pain_points.length; index2++) {
        if (perception.l_2_process.title !== props.profile.PainPoints[index].contract_stage) {
          break;
        }
        if (perception.pain_points[index2].pain_point_text === props.profile.PainPoints[index].reason) {
          perception.pain_points[index2].checked = true;
        }
      }
    }

    setPerception(perception);
    handleClickOpen();
  };

  const handleAddIdeas = (l_2_process, controlType) => {
    setControl({
      l_2_process_id: l_2_process.id,
      l_2_type: l_2_process.title,
      control_type: controlType
    });
    const filteredData = ideas.filter(idea => {
      return idea.l_2_process.title === l_2_process.title;
    });

    setFilteredIdeas(filteredData);
    handleClickOpen();
  };

  const handlePerceptionCheckBox = (event, id, position) => {
    const values = [...painpointsData];
    if (event.target.checked === false) {
      for (let index = 0; index < values.length; index++) {
        if (perception.pain_points[position].pain_point_text === values[index].reason) {
          perception.pain_points[position].checked = event.target.checked;
          values.splice(index, 1);
          setPainPointsData(values);
          setPerception({
            ...perception
          });
          break;
        }
      }
    } else {
      for (let index = 0; index < perception.pain_points.length; index++) {
        if (perception.pain_points[index].id === id) {
          perception.pain_points[index].checked = event.target.checked;
          if (event.target.checked === true) {
            values.push({
              reason: perception.pain_points[index].pain_point_text,
              rating: perception.pain_points[index].rating,
              contract_stage: control.l_2_type,
              type: control.control_type
            });
          }
          setPainPointsData(values);
          setPerception({
            ...perception
          });
          break;
        }
      }
    }
  };

  const handleIdeasCheckBox = (event, id, position) => {
    const values = [...painpointsData];
    if (event.target.checked === false) {
      for (let index = 0; index < values.length; index++) {
        if (filteredIdeas[position].idea_text === values[index].reason) {
          filteredIdeas[position].checked = event.target.checked;
          values.splice(index, 1);
          setPainPointsData(values);
          setFilteredIdeas(filteredIdeas);
          break;
        }
      }
    } else {
      for (let index = 0; index < filteredIdeas.length; index++) {
        if (filteredIdeas[index].id === id) {
          filteredIdeas[index].checked = event.target.checked;
          if (event.target.checked === true) {
            values.push({
              reason: filteredIdeas[index].idea_text,
              rating: null,
              contract_stage: control.l_2_type,
              type: control.control_type
            });
          }
          setPainPointsData(values);
          setFilteredIdeas(filteredIdeas);
          break;
        }
      }
    }
  };

  const handleDeletePerception = (perception, position) => {
    const values = [...painpointsData];
    for (let index = 0; index < perception.pain_points.length; index++) {
      if (perception.pain_points[index].pain_point_text === values[position].reason) {
        perception.pain_points[index].checked = false;
        values.splice(position, 1);
        props.setProfile({
          ...props.profile,
          PainPoints: values
        });
        setPainPointsData(values);
        setPerception({
          ...perception
        });
        break;
      }
    }
  };

  const handleDeleteIdea = position => {
    const values = [...painpointsData];
    for (let index = 0; index < ideas.length; index++) {
      if (ideas[index].idea_text === values[position].reason) {
        ideas[index].checked = false;
        values.splice(position, 1);
        props.setProfile({
          ...props.profile,
          PainPoints: values
        });
        setPainPointsData(values);
        setIdeas(ideas);
        break;
      }
    }
  };

  const handleCreateNew = () => {
    setCreateNew(true);
  };

  const handleBack = () => {
    setCreateNew(false);
  };
  const handleSave = () => {
    props.setProfile({
      ...props.profile,
      PainPoints: painpointsData
    });
    handleClose();
  };

  const handleRatingChange = event => {
    setRating(event.target.value);
  };

  const handleCreateNewPerception = () => {
    if (newPerceptionReason === '') {
      onMessage('Cannot create a blank Perception! Please enter data and save', 'error');
    } else {
      const newPerception = {
        Perception: [
          {
            rating: rating,
            pain_points: [
              {
                pain_point_text: newPerceptionReason
              }
            ],
            l_2_process: perception.l_2_process.id
          }
        ],
        user: props.userId,
        project: props.projectId
      };
      createPerception(newPerception, onMessage).then(() => {
        onMessage('Perception Created Successfully', 'success');
        handleClose(false);
        setRefresher(true);
      });
    }
  };

  const handleCreateNewIdea = () => {
    if (newIdeaReason === '') {
      onMessage('Cannot create a blank Idea! Please enter data and save', 'error');
    } else {
      const newIdea = {
        idea_text: newIdeaReason,
        l_2_process: control.l_2_process_id,
        user: props.userId,
        project: props.projectId
      };
      createIdea(newIdea, onMessage).then(() => {
        onMessage('Idea Created Successfully', 'success');
        handleClose();
        setRefresher(true);
      });
    }
  };

  const getToken = (index, selected) => {
    switch (index) {
      case 0:
        return <VerySadIcon key={index} selected={selected} selectedColor={red[500]} fontSize="large" />;
      case 1:
        return <SadIcon key={index} selected={selected} selectedColor={amber[500]} fontSize="large" />;
      case 2:
        return <OkIcon key={index} selected={selected} selectedColor={yellow[500]} fontSize="large" />;
      case 3:
        return <HappyIcon key={index} selected={selected} selectedColor={lightGreen[500]} fontSize="large" />;
      case 4:
        return <VeryHappyIcon key={index} selected={selected} selectedColor={green[500]} fontSize="large" />;
      default:
        return '';
    }
  };

  return (
    <React.Fragment>
      <Paper component="form" className={classes.paper}>
        {loader ? (
          <Grid container justify="center">
            <CircularProgress />
          </Grid>
        ) : (
          <Grid container spacing={10}>
            {perceptions.length > 0
              ? perceptions.map((perception, index) => {
                  return (
                    <Grid key={index} item xs={12}>
                      <Typography gutterBottom>{perception.l_2_process.title}</Typography>
                      <Box style={{ backgroundColor: '#F1F1F1', height: '100%' }}>
                        <Grid item container justify="space-between" style={{ padding: 20 }}>
                          <Grid item xs={10}>
                            <Typography>Things That Don’t Work For Me</Typography>
                          </Grid>
                          <Grid item xs={2} container justify="center">
                            <Button
                              color="primary"
                              onClick={() => {
                                handleAddPerceptions(perception, 'Things That Don’t Work For Me');
                              }}>
                              Add New
                            </Button>
                          </Grid>
                        </Grid>

                        <Grid item container spacing={2}>
                          {props.profile.PainPoints.map((painpoint, index) => {
                            if (painpoint.contract_stage === perception.l_2_process.title && painpoint.type === 'Things That Don’t Work For Me') {
                              return (
                                <Grid key={index} item container xs={12}>
                                  <Grid item container xs={2} justify="center">
                                    {getToken(painpoint.rating, true)}
                                  </Grid>
                                  <Grid style={{ backgroundColor: '#FBFBFB', padding: 10 }} item xs={8}>
                                    <Typography>{painpoint.reason}</Typography>
                                  </Grid>
                                  <Grid item container xs={2} justify="center">
                                    <Tooltip title="Delete" arrow>
                                      <IconButton aria-label="delete" color="primary" onClick={() => handleDeletePerception(perception, index)}>
                                        <DeleteIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </Grid>
                                </Grid>
                              );
                            }
                          })}
                        </Grid>

                        <Grid item container justify="space-between" style={{ padding: 20 }}>
                          <Grid item xs={10}>
                            <Typography>I Need / Want / Expect</Typography>
                          </Grid>
                          <Grid item xs={2} container justify="center">
                            <Button
                              color="primary"
                              onClick={() => {
                                handleAddIdeas(perception.l_2_process, 'I Need / Want / Expect');
                              }}>
                              Add New
                            </Button>
                          </Grid>
                        </Grid>
                        <Grid item container spacing={2}>
                          {props.profile.PainPoints.map((painpoint, index) => {
                            if (painpoint.contract_stage === perception.l_2_process.title && painpoint.type === 'I Need / Want / Expect') {
                              return (
                                <Grid key={index} item container xs={12}>
                                  <Grid item container xs={2} justify="center"></Grid>
                                  <Grid style={{ backgroundColor: '#FBFBFB', padding: 10 }} item xs={8}>
                                    <Typography>{painpoint.reason}</Typography>
                                  </Grid>
                                  <Grid item container xs={2} justify="center">
                                    <Tooltip title="Delete" arrow>
                                      <IconButton aria-label="delete" color="primary" onClick={() => handleDeleteIdea(index)}>
                                        <DeleteIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </Grid>
                                </Grid>
                              );
                            }
                          })}
                        </Grid>
                      </Box>
                    </Grid>
                  );
                })
              : null}
          </Grid>
        )}
      </Paper>

      <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose} aria-labelledby="dialog-title">
        <DialogTitle id="dialog-title">
          <Grid container item xs={12}>
            <Grid item container xs={11} justify="center">
              <Typography align="center" style={{ padding: 15 }}>
                {control.l_2_type}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton aria-label="search" onClick={handleClose} color="primary">
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          {createNew ? (
            <Paper component="form" className={classes.paper}>
              {control.control_type === 'Things That Don’t Work For Me' ? (
                <Grid container spacing={3}>
                  <Grid item container xs={12} spacing={2}>
                    <Grid item container xs={12}>
                      <Typography style={{ padding: 10 }}>Perception</Typography>
                    </Grid>
                    <Box>
                      <Smiley rating={rating} onRateChange={handleRatingChange} />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth margin="normal" variant="filled">
                      <TextField
                        required
                        id="reason"
                        label="Reason"
                        color="primary"
                        variant="filled"
                        onChange={e => setNewPerceptionReason(e.target.value)}
                        value={newPerceptionReason}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={3}>
                  <Grid item container xs={12} spacing={2}>
                    <Grid item container xs={12} justify="center">
                      <Typography style={{ padding: 10 }}>New Idea Creation</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth margin="normal" variant="filled">
                        <TextField
                          required
                          id="reason"
                          label="Reason"
                          color="primary"
                          variant="filled"
                          onChange={e => setNewIdeaReason(e.target.value)}
                          value={newIdeaReason}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Paper>
          ) : (
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '10%' }}></TableCell>
                    {control.control_type === 'Things That Don’t Work For Me' ? (
                      <TableCell style={{ width: '15%' }} align="center">
                        Perception
                      </TableCell>
                    ) : null}
                    <TableCell>Reason</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {control.control_type === 'Things That Don’t Work For Me'
                    ? perception.pain_points.map((pain_point, index) => (
                        <TableRow key={pain_point.id}>
                          <TableCell component="th" scope="row">
                            <Checkbox
                              name="temp"
                              checked={pain_point.checked}
                              onChange={event => handlePerceptionCheckBox(event, pain_point.id, index)}
                              color="primary"
                            />
                          </TableCell>
                          <TableCell align="center">{getToken(pain_point.rating, true)}</TableCell>
                          <TableCell>{pain_point.pain_point_text}</TableCell>
                        </TableRow>
                      ))
                    : filteredIdeas.map((idea, index) => (
                        <TableRow key={idea.id}>
                          <TableCell component="th" scope="row">
                            <Checkbox
                              name="temp"
                              checked={idea.checked}
                              onChange={event => handleIdeasCheckBox(event, idea.id, index)}
                              color="primary"
                            />
                          </TableCell>

                          <TableCell>{idea.idea_text}</TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        {createNew ? (
          <DialogActions>
            <Grid container xs={12}>
              <Grid item container xs={2} justify="flex-end">
                <Button onClick={handleBack} variant="contained" color="primary">
                  Back
                </Button>
              </Grid>
              <Grid item container xs={8}></Grid>
              <Grid item container xs={2}>
                {control.control_type === 'Things That Don’t Work For Me' ? (
                  <Button onClick={handleCreateNewPerception} variant="contained" color="primary">
                    Save
                  </Button>
                ) : (
                  <Button onClick={handleCreateNewIdea} variant="contained" color="primary">
                    Save
                  </Button>
                )}
              </Grid>
            </Grid>
          </DialogActions>
        ) : (
          <DialogActions>
            <Button onClick={handleCreateNew} variant="contained" color="primary">
              Create New
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </React.Fragment>
  );
}

export default PainPoints;
