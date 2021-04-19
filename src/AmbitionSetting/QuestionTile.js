import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { Grid, Typography, TextField, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(18, 10)
  },
  background: {
    backgroundColor: '#1381B9'
  },
  subheading: {
    color: grey[200]
  },
  button: {
    backgroundColor: 'rgba(224, 224, 224, 0.65)',
    color: grey[50]
  },
  text: {
    borderRadius: '5px 5px 0 0',
    maxHeight: 190,
    backgroundColor: 'rgba(224, 224, 224, 0.65)'
  },
  input: {
    color: grey[50]
  }
}));
function QuestionTile(props) {
  const classes = useStyles();

  return (
    <Grid item sm className={`${classes.background} ${classes.content}`}>
      <Grid item>
        <Typography className={classes.subheading}>
          {props.step} of {props.totalQuestions}
        </Typography>
      </Grid>
      <Grid item container direction="column" spacing={4} xs={10}>
        <Grid item>
          <Typography variant="h6" className={classes.subheading}>
            {props.currentQuestion}
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            required
            className={classes.text}
            multiline={props.step > 2}
            rows={3}
            label="Answer"
            autoFocus={true}
            fullWidth={true}
            variant="filled"
            value={props.currentAnswer}
            color="secondary"
            type="text"
            inputProps={{ 'data-testid': 'answer', className: classes.input }}
            onChange={e => props.setCurrentAnswer(e.target.value)}
          />
        </Grid>
        <Grid item container alignItems="baseline" justify="space-between">
          <Grid item>
            {props.step > 1 ? (
              <Button variant="contained" data-testid="back-btn" onClick={props.prevQuestion} className={classes.button}>
                Back
              </Button>
            ) : null}
          </Grid>
          <Grid item>
            <Button variant="contained" data-testid="next-btn" onClick={props.nextQuestion} className={classes.button}>
              Next
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default QuestionTile;
