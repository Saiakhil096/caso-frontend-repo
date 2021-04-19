import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  List,
  ListItem,
  Collapse,
  ListItemSecondaryAction,
  TextField,
  Typography,
  IconButton,
  Button,
  Grid
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  subheading: {
    color: grey[600]
  },
  listNumber: {
    paddingRight: theme.spacing(1)
  },
  nested: {
    paddingLeft: theme.spacing(4)
  },
  processMargin: {
    marginBottom: theme.spacing(4)
  },
  textfield: {
    width: '95%'
  },
  button: {
    marginBottom: '16px'
  }
}));

function MaturityModel(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleAddNewL2Process = () => {
    const l2ProcessesCopy = JSON.parse(JSON.stringify(props.l2Processes));
    l2ProcessesCopy.push({
      title: '',
      maturity_questions: [
        {
          question_text: ''
        }
      ]
    });
    props.onL2ProcessesChanged(l2ProcessesCopy);
  };

  const handleL2ProcessChange = (e, index) => {
    const l2ProcessesCopy = JSON.parse(JSON.stringify(props.l2Processes));
    l2ProcessesCopy[index].title = e.target.value;
    props.onL2ProcessesChanged(l2ProcessesCopy);
  };

  const handleDeleteL2Process = (e, index, l2Item) => {
    if (!isNaN(props.projectId) && l2Item !== undefined) {
      props.setDeleteL2ProcessIds([...props.deleteL2ProcessIds, l2Item.id]);
      const mQIds = [];
      l2Item.maturity_questions.map(item => {
        mQIds.push(item.id);
      });
      props.setDeleteMaturityQIds(mQIds);
    }
    const l2ProcessesCopy = JSON.parse(JSON.stringify(props.l2Processes));
    l2ProcessesCopy.splice(index, 1);
    props.onL2ProcessesChanged(l2ProcessesCopy);
  };

  const handleAddNewMaturityQuestion = (e, index) => {
    const l2ProcessesCopy = JSON.parse(JSON.stringify(props.l2Processes));
    l2ProcessesCopy[index].maturity_questions.push({
      question_text: ''
    });
    props.onL2ProcessesChanged(l2ProcessesCopy);
  };

  const handleMaturityQuestionChange = (e, processIndex, questionIndex) => {
    const l2ProcessesCopy = JSON.parse(JSON.stringify(props.l2Processes));
    l2ProcessesCopy[processIndex].maturity_questions[questionIndex].question_text = e.target.value;
    props.onL2ProcessesChanged(l2ProcessesCopy);
  };

  const handleDeleteMaturityQuestion = (e, processIndex, questionIndex, id) => {
    if (!isNaN(props.projectId) && id !== undefined) {
      props.setDeleteMaturityQIds([...props.deleteMaturityQIds, id]);
    }
    const l2ProcessesCopy = JSON.parse(JSON.stringify(props.l2Processes));
    l2ProcessesCopy[processIndex].maturity_questions.splice(questionIndex, 1);
    props.onL2ProcessesChanged(l2ProcessesCopy);
  };

  const handleDialogYes = () => {
    props.onCompletion();
  };

  const handleDialogNo = () => {
    props.onL2ProcessesChanged(props.l2processesCopy);
    handleDialogClose();
  };

  const handleDialogCancel = () => {
    handleDialogClose();
  };

  const handleNext = () => {
    if (props.l2Processes.length === 0 || props.l2Processes.filter(p => !p.title).length > 0) {
      props.onMessage('At least one valid L2 Process is required', 'warning');
    } else if (
      props.l2Processes.filter(p => p.maturity_questions.length < 1 || p.maturity_questions.filter(q => !q.question_text).length > 0).length > 0
    ) {
      props.onMessage('For each L2 process atleast 1 maturity question is required', 'warning');
    } else {
      if (!isNaN(props.projectId)) {
        let l2ProcessCheck = false;
        let mQuestionCheck = false;
        for (let index = 0; index < props.l2Processes.length; index++) {
          if (props.l2processesCopy[index] === undefined || props.l2processesCopy[index] === '' || props.l2processesCopy[index] === null) {
            break;
          }
          if (props.l2Processes[index].title !== props.l2processesCopy[index].title) {
            l2ProcessCheck = true;
            break;
          } else {
            if (props.l2Processes[index].maturity_questions.length !== props.l2processesCopy[index].maturity_questions.length) {
              mQuestionCheck = true;
              break;
            }
            for (let mIndex = 0; mIndex < props.l2Processes[index].maturity_questions.length; mIndex++) {
              if (
                props.l2processesCopy[index].maturity_questions[mIndex] === undefined ||
                props.l2processesCopy[index].maturity_questions[mIndex] === '' ||
                props.l2processesCopy[index].maturity_questions[mIndex] === null
              ) {
                break;
              }

              if (
                props.l2Processes[index].maturity_questions[mIndex].question_text !==
                props.l2processesCopy[index].maturity_questions[mIndex].question_text
              ) {
                mQuestionCheck = true;
                break;
              }
            }
          }
        }

        if (mQuestionCheck === true || l2ProcessCheck === true || props.l2Processes.length !== props.l2processesCopy.length) {
          handleDialogOpen();
        } else {
          props.onCompletion();
        }
      } else {
        props.onCompletion();
      }
    }
  };

  return (
    <React.Fragment>
      <Grid item container xs={6}>
        <Grid item container justify="space-between">
          <Grid item>
            <Typography variant="h6" className={classes.subheading}>
              L2 Processes
            </Typography>
          </Grid>
          <Grid item>
            <Button color="primary" onClick={handleAddNewL2Process}>
              Add New L2 Process
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <List>
            {props.l2Processes.map((item, processIndex) => (
              <React.Fragment>
                <ListItem disableGutters>
                  <Typography className={classes.listNumber}>{`${processIndex + 1}.`}</Typography>
                  <TextField
                    label="L2 Process"
                    className={classes.textfield}
                    variant="filled"
                    value={item.title}
                    onChange={e => handleL2ProcessChange(e, processIndex)}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={e => handleDeleteL2Process(e, processIndex, item)}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Collapse className={classes.processMargin} in timeout="auto" unmountOnExit>
                  <Grid item container justify="space-between">
                    <Grid item>
                      <Typography variant="h6" className={`${classes.subheading} ${classes.nested}`}>
                        Maturity Questions
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Button color="primary" onClick={e => handleAddNewMaturityQuestion(e, processIndex)}>
                        Add New Question
                      </Button>
                    </Grid>
                  </Grid>
                  <List component="div" disablePadding>
                    {item.maturity_questions.map((question, questionIndex) => (
                      <ListItem className={classes.nested}>
                        <Typography className={classes.listNumber}>{`${questionIndex + 1}.`}</Typography>
                        <TextField
                          label="Maturity Question"
                          className={classes.textfield}
                          variant="filled"
                          value={question.question_text}
                          onChange={e => handleMaturityQuestionChange(e, processIndex, questionIndex)}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={e => handleDeleteMaturityQuestion(e, processIndex, questionIndex, question.id)}>
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </Grid>
        <Grid container justify="space-between" alignItems="baseline" className={classes.button}>
          <Grid item>
            <Button variant="contained" color="primary" onClick={props.onBack}>
              Back
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleNext}>
              Confirm updates
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
                  <Button onClick={handleDialogCancel} color="primary" aria-label="close">
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
    </React.Fragment>
  );
}

export default MaturityModel;
