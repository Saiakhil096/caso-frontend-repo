import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { Grid, Typography, List, ListItem, ListItemText } from '@material-ui/core';
import { Check as CheckIcon } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  list: {
    width: '100%',
    maxWidth: 360
  }
}));
function AmbitionSettingLeftPane(props) {
  const classes = useStyles();

  const listItemClick = index => {
    props.setStep(index + 1);
    props.setCurrentQuestion(props.questionList[index].question_text);
    props.setCurrentAnswer(props.answerSet[index]);
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h6">Personalise your Customer Education</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" color="textSecondary">
          Tell us more about your organisation, so we can help get you on the right track.
        </Typography>
      </Grid>
      <Grid item>
        <List component="nav" aria-label="main Level 2 Processes" className={classes.list}>
          {props.questionList.map((questions, index) => {
            const label = `Question ${index + 1}`;
            return (
              <ListItem
                onClick={e => {
                  listItemClick(index);
                }}
                key={index}
                button>
                <ListItemText primary={label} />
                {props.answerSet[index] ? <CheckIcon style={{ color: green[500] }} /> : null}
              </ListItem>
            );
          })}
        </List>
      </Grid>
    </Grid>
  );
}

export default AmbitionSettingLeftPane;
