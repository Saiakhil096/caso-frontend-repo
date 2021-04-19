import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button, Radio, TextField } from '@material-ui/core';
import { red, amber, yellow, lightGreen, green, grey } from '@material-ui/core/colors';
import { Rating1Icon, Rating2Icon, Rating3Icon, Rating4Icon, Rating5Icon } from '../../common/CustomIcons';

const useStyles = makeStyles(theme => ({
  heading: {
    color: grey[50]
  },
  subheading: {
    color: grey[200]
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
  },
  RatingTextHigh: {
    marginLeft: '6%'
  },
  RatingTextLow: {
    textAlign: 'center'
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
    const regex = new RegExp(/(.*[a-z]){2}/i);

    if (props.rating === null) {
      props.onMessage('You must provide a priority', 'warning');
      return;
    } else if (!props.justification) {
      props.onMessage('You must provide a justification', 'warning');
      return;
    } else if (!regex.test(props.justification)) {
      props.onMessage('You must enter at least 2 characters in your justification', 'warning');
      return;
    } else {
      props.onNextProcess();
    }
  };

  const handleRatingChange = event => {
    const selectedIndex = parseInt(event.target.value);
    const ratingChanged = props.onRatingChange(selectedIndex, props.rating);
    if (!ratingChanged) {
      event.preventDefault();
    }
  };

  const ratingIcons = (index, val, label) => {
    let items = [];
    const checkedIconColor = id => {
      if (id === 0) {
        return <Rating1Icon selected={true} selectedColor={red[500]} fontSize="large" />;
      } else if (id === 1) {
        return <Rating2Icon selected={true} selectedColor={amber[500]} fontSize="large" />;
      } else if (id === 2) {
        return <Rating3Icon selected={true} selectedColor={yellow[500]} fontSize="large" />;
      } else if (id === 3) {
        return <Rating4Icon selected={true} selectedColor={lightGreen[500]} fontSize="large" />;
      } else if (id === 4) {
        return <Rating5Icon selected={true} selectedColor={green[500]} fontSize="large" />;
      }
    };
    const IconColor = id => {
      if (id === 0) {
        return <Rating1Icon fontSize="large" />;
      } else if (id === 1) {
        return <Rating2Icon fontSize="large" />;
      } else if (id === 2) {
        return <Rating3Icon fontSize="large" />;
      } else if (id === 3) {
        return <Rating4Icon fontSize="large" />;
      } else if (id === 4) {
        return <Rating5Icon fontSize="large" />;
      }
    };

    for (let id = index; id <= val; id++) {
      items.push(
        <CustomRadio
          color="primary"
          name="rating"
          value={id}
          checked={props.rating === id}
          onChange={handleRatingChange}
          icon={IconColor(id)}
          checkedIcon={checkedIconColor(id)}
        />
      );
    }
    return (
      <Grid item>
        {items}
        <Typography variant="body2" className={label === 'High' ? classes.RatingTextHigh : classes.RatingTextLow}>
          {label}
        </Typography>
      </Grid>
    );
  };

  return (
    <Grid container direction="column" spacing={2} className={classes.fixedPosition}>
      <Grid item>
        <Typography className={classes.subheading}>
          {props.step} of {props.totalSteps}
        </Typography>
        <Typography variant="h5" className={classes.heading}>
          {props.title}
        </Typography>
      </Grid>
      <Grid item container>
        {ratingIcons(0, 3, 'High')}
        {ratingIcons(4, 4, 'Low')}
      </Grid>
      <Grid item>
        <TextField
          label={<span style={{ color: 'white' }}>Justification *</span>}
          multiline
          fullWidth={true}
          rows={4}
          variant="filled"
          color="secondary"
          value={props.justification}
          onChange={props.onJustificationChange}
          inputProps={{ className: classes.input }}
        />
      </Grid>
      <Grid container item justify="space-between" alignItems="baseline">
        <Grid item>
          {props.step > 1 && (
            <Button variant="contained" color="secondary" className={classes.button} style={{ color: grey[50] }} onClick={props.onPreviousProcess}>
              Back
            </Button>
          )}
        </Grid>
        <Grid item>
          <Button variant="contained" color="secondary" className={classes.button} style={{ color: grey[50] }} onClick={handleNext}>
            {props.step === props.totalSteps ? 'Complete' : 'Next'}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Questions;
