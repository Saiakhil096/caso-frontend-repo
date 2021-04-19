import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  List,
  ListItem,
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
  question: {
    width: '95%'
  }
}));

function AmbitionSetting(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleAddNewQuestion = () => {
    const questionsCopy = JSON.parse(JSON.stringify(props.questionnaireQs));
    questionsCopy.push({
      question_text: ''
    });
    props.onQuestionnaireQsChanged(questionsCopy);
  };

  const handleDeleteQuestion = (e, index, id) => {
    if (!isNaN(props.projectId) && id !== undefined) {
      props.setDeleteQuestionnaireIds([...props.deleteQuestionnaireIds, id]);
    }
    const questionsCopy = JSON.parse(JSON.stringify(props.questionnaireQs));
    questionsCopy.splice(index, 1);
    props.onQuestionnaireQsChanged(questionsCopy);
  };

  const handleQuestionChange = (e, index) => {
    const questionsCopy = JSON.parse(JSON.stringify(props.questionnaireQs));
    questionsCopy[index].question_text = e.target.value;
    props.onQuestionnaireQsChanged(questionsCopy);
  };

  const handleDialogYes = () => {
    props.onCompletion();
  };
  const handleDialogNo = () => {
    props.onQuestionnaireQsChanged(props.projectData.questionnaire_questions);
    handleDialogClose();
  };
  const handleDialogCancel = () => {
    handleDialogClose();
  };

  const handleNext = () => {
    if (props.questionnaireQs.length === 0 || props.questionnaireQs.filter(q => !q.question_text).length > 0) {
      props.onMessage('The question field cannot be left blank', 'warning');
    } else {
      if (!isNaN(props.projectId)) {
        let questionCheck = false;
        for (let index = 0; index < props.questionnaireQs.length; index++) {
          if (
            props.projectData.questionnaire_questions[index] === undefined ||
            props.projectData.questionnaire_questions[index] === '' ||
            props.projectData.questionnaire_questions[index] === null
          ) {
            break;
          }
          if (props.questionnaireQs[index].question_text !== props.projectData.questionnaire_questions[index].question_text) {
            questionCheck = true;
            break;
          }
        }
        if (questionCheck === true || props.questionnaireQs.length !== props.projectData.questionnaire_questions.length) {
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
      <Grid item container spacing={4} direction="column" xs={6}>
        <Grid item container justify="space-between">
          <Grid item>
            <Typography variant="h5" className={classes.subheading}>
              Ambition Setting Questions
            </Typography>
          </Grid>
          <Grid item>
            <Button onClick={handleAddNewQuestion} color="primary">
              Add New
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <List>
            {props.questionnaireQs.map((item, index) => (
              <ListItem disableGutters>
                <Typography className={classes.listNumber}>{`${index + 1}.`}</Typography>
                <TextField
                  label="Question"
                  autoFocus
                  className={classes.question}
                  variant="filled"
                  value={item.question_text}
                  onChange={e => handleQuestionChange(e, index)}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={e => handleDeleteQuestion(e, index, item.id)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>
        <Grid item container justify="space-between" alignItems="baseline">
          <Grid item>
            <Button variant="contained" color="primary" onClick={props.onBack}>
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

export default AmbitionSetting;
