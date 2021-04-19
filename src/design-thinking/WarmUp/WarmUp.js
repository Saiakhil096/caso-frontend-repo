import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { Grid, Button, TextField, Typography } from '@material-ui/core';
import Sidebar from '../Sidebar';

const useStyles = makeStyles(theme => ({
  headerMargin: {
    marginTop: theme.spacing(2)
  },
  content: {
    padding: theme.spacing(4)
  },
  background: {
    backgroundColor: '#1381B9'
  },
  button: {
    backgroundColor: 'rgba(224, 224, 224, 0.65)',
    color: grey[50]
  },
  textColor: {
    color: grey[50]
  },
  centerPosition: {
    position: 'sticky',
    top: theme.spacing(2),
    marginTop: '15%'
  }
}));

function WarmUp(props) {
  const [idea, setIdea] = React.useState('');
  const { handleNextStep, onMessage } = props;

  const classes = useStyles();

  const onIdeaChange = event => {
    setIdea(event.target.value);
  };

  const onNextStep = () => {
    const regex = new RegExp(/(.*[a-z]){2}/i);

    if (!idea) {
      onMessage('You must provide an idea', 'warning');
      return;
    } else if (!regex.test(idea)) {
      onMessage('You must enter at least 2 characters in your idea', 'warning');
      return;
    } else {
      handleNextStep();
    }
  };

  return (
    <React.Fragment>
      <Grid item xs={12} sm={5} md={4} className={classes.content}>
        <Sidebar
          title="Warm Up"
          instructions_main="We all suffer from cognitive bias. In this exercise, we are going to warm up for blue sky thinking throughout this section. Please select one location and one technology, and below list your ideas on how you would use that technology to improve your experience at the location."
          instructions_ex="For example, I would love a robot who sprays on my sun cream for me whilst at the beach.">
          <Grid item xs={12}>
            <Typography className={classes.headerMargin} variant="h5">
              Select a location:
            </Typography>
            <Grid item>
              <Typography variant="body2" color="textSecondary">
                The Beach
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Ice Cream Shop
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Airport
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Shoe Store
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.headerMargin} variant="h5">
              Select a technology:
            </Typography>
            <Grid item>
              <Typography variant="body2" color="textSecondary">
                iPad
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Robots
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Machine Learning
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Apple Watch
              </Typography>
            </Grid>
          </Grid>
        </Sidebar>
      </Grid>
      <Grid item xs={12} sm={7} md={8} className={`${classes.background} ${classes.content}`}>
        <Grid container direction="column" spacing={2} className={classes.centerPosition}>
          <Grid item>
            <Typography variant="h5" className={classes.textColor}>
              Please list your idea below, the crazier the better
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              label="Crazy Idea*"
              multiline
              fullWidth={true}
              rows={4}
              variant="filled"
              color="secondary"
              value={idea}
              onChange={onIdeaChange}
              inputProps={{ className: classes.textColor }}
            />
          </Grid>
          <Grid container item justify="space-between" alignItems="baseline">
            <Grid item></Grid>
            <Grid item>
              <Button variant="contained" color="secondary" className={classes.button} onClick={onNextStep}>
                Next
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
export default WarmUp;
