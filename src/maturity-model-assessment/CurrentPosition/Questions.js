import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { red, amber, yellow, lightGreen, green, grey } from '@material-ui/core/colors';
import { Grid, Divider, Typography, Button, Radio, TextField } from '@material-ui/core';
import {
  TokenIcon,
  Rating1Icon,
  Rating2Icon,
  Rating3Icon,
  Rating4Icon,
  Rating5Icon,
  VerySadIcon,
  SadIcon,
  OkIcon,
  HappyIcon,
  VeryHappyIcon
} from '../../common/CustomIcons';

const useStyles = makeStyles(theme => ({
  heading: {
    color: grey[50]
  },
  subheading: {
    color: grey[200]
  },
  container: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '0.5rem 1rem'
  },
  input: {
    color: grey[50]
  },
  button: {
    backgroundColor: 'rgba(224, 224, 224, 0.65)'
  },
  fixedPosition: {
    position: 'sticky',
    top: theme.spacing(2)
  }
}));

function Questions(props) {
  const classes = useStyles();
  const CustomRadio = withStyles(({ palette, spacing }) => ({
    root: {
      color: grey[500]
    }
  }))(props => <Radio color="default" {...props} />);

  const handleNext = () => {
    if (props.maturityRating.rating === null) {
      props.onMessage('You must provide a rating', 'warning');
      return;
    } else {
      props.onNextQuestion();
    }
  };

  const handleReasonChange = event => {
    props.onSetReason(event.target.value);
  };

  const handleRatingChange = event => {
    const selectedIndex = parseInt(event.target.value);
    const ratingChanged = props.onRatingChange(selectedIndex);
    if (!ratingChanged) {
      event.preventDefault();
    }
  };
  const ratingIcons = (index, val, label) => {
    let items = [];
    const checkedIconColor = id => {
      if (id === 0) {
        return <TokenIcon selected={true} selectedColor={grey[50]} fontSize="large" />;
      } else if (id === 1) {
        return <TokenIcon selected={true} selectedColor={grey[50]} fontSize="large" />;
      } else if (id === 2) {
        return <TokenIcon selected={true} selectedColor={grey[50]} fontSize="large" />;
      } else if (id === 3) {
        return <TokenIcon selected={true} selectedColor={grey[50]} fontSize="large" />;
      } else if (id === 4) {
        return <TokenIcon selected={true} selectedColor={grey[50]} fontSize="large" />;
      }
    };

    for (let id = index; id <= val; id++) {
      items.push(
        <CustomRadio
          color="primary"
          name="rating"
          value={id}
          checked={props.maturityRating.rating === id}
          onChange={handleRatingChange}
          icon={<TokenIcon transparent fontSize="large" />}
          checkedIcon={checkedIconColor(id)}
        />
      );
    }
    return (
      <Grid item>
        {items}
        <Typography variant="body2" style={{ marginLeft: '9%' }}>
          {label}
        </Typography>
      </Grid>
    );
  };
  return (
    <Grid container direction="column" spacing={2} className={classes.fixedPosition}>
      <Grid item>
        <Grid item container alignItems="center" className={classes.container}>
          <Typography variant="h5">{props.process.title}</Typography>
          <Divider variant="middle" orientation="vertical" flexItem />
          <Grid item>
            {(() => {
              switch (props.perception.rating) {
                default:
                  return;
                case 0:
                  return <VerySadIcon selected={true} selectedColor={red[500]} fontSize="large" />;
                case 1:
                  return <SadIcon selected={true} selectedColor={amber[500]} fontSize="large" />;
                case 2:
                  return <OkIcon selected={true} selectedColor={yellow[500]} fontSize="large" />;
                case 3:
                  return <HappyIcon selected={true} selectedColor={lightGreen[500]} fontSize="large" />;
                case 4:
                  return <VeryHappyIcon selected={true} selectedColor={green[500]} fontSize="large" />;
              }
            })()}
          </Grid>
          <Divider variant="middle" orientation="vertical" flexItem />
          <Grid item>
            <Typography align="center" variant="h5">
              {props.perception.pain_points.length}
            </Typography>
            <Typography variant="body2">Reasons</Typography>
          </Grid>
          <Divider variant="middle" orientation="vertical" flexItem />
          <Grid item>
            {(() => {
              switch (props.priority.rating) {
                default:
                  return;
                case 0:
                  return <Rating1Icon selected={true} selectedColor={red[500]} fontSize="large" />;
                case 1:
                  return <Rating2Icon selected={true} selectedColor={amber[500]} fontSize="large" />;
                case 2:
                  return <Rating3Icon selected={true} selectedColor={yellow[500]} fontSize="large" />;
                case 3:
                  return <Rating4Icon selected={true} selectedColor={lightGreen[500]} fontSize="large" />;
                case 4:
                  return <Rating5Icon selected={true} selectedColor={green[500]} fontSize="large" />;
              }
            })()}
          </Grid>
          <Divider variant="middle" orientation="vertical" flexItem />
          <Grid item>
            {(() => {
              switch (props.priority.rating) {
                default:
                  return;
                case 0:
                  return <Typography variant="body2">This is the highest priority because...</Typography>;
                case 1:
                  return <Typography variant="body2">This is high priority because...</Typography>;
                case 2:
                  return <Typography variant="body2">This is medium priority because...</Typography>;
                case 3:
                  return <Typography variant="body2">This is low priority because...</Typography>;
                case 4:
                  return <Typography variant="body2">This is the lowest priority because...</Typography>;
              }
            })()}
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Typography className={classes.subheading}>
          {props.question + 1} of {props.totalQuestions} Questions
        </Typography>
        <Typography className={classes.heading} variant="h5">
          {props.maturityQuestion.question_text}
        </Typography>
      </Grid>
      <Grid item container>
        {ratingIcons(0, 1, 'Low')}
        {ratingIcons(2, 3, 'Good')}
        {ratingIcons(4, 4, 'Leading')}
      </Grid>
      <Grid item className={classes.questions}>
        <Grid item>
          <TextField
            label={<span style={{ color: 'white' }}>Reason</span>}
            multiline
            fullWidth={true}
            rows={4}
            variant="filled"
            color="secondary"
            value={props.maturityRating.reason}
            inputProps={{ className: classes.input }}
            onChange={handleReasonChange}
            placeholder="Why did you select this rating?"
          />
        </Grid>
      </Grid>
      <Grid item container justify="space-between" alignItems="baseline">
        <Grid item>
          {props.question % props.totalQuestions >= 1 && (
            <Button variant="contained" className={classes.button} style={{ color: grey[50] }} onClick={props.onPreviousQuestion}>
              Back
            </Button>
          )}
        </Grid>
        <Grid item>
          <Button variant="contained" className={classes.button} style={{ color: grey[50] }} onClick={handleNext}>
            {props.step === props.totalSteps - 1 && (props.question + 1) % props.totalQuestions === 0 ? 'Complete' : 'Next'}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Questions;
