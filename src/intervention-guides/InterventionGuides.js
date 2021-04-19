import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { fetchInterventionGuides } from '../common/API';
import InterventionTile from './InterventionTile';
import InterventionLeft from './InterventionLeft';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#f4f4f3'
  },
  center: {
    justifyContent: 'center'
  },
  content: {
    backgroundColor: 'white',
    padding: theme.spacing(2)
  }
}));

function InterventionGuides(props) {
  const classes = useStyles();
  const [interventions, setInterventions] = useState([]);
  const { onMessage } = props;

  useEffect(() => {
    fetchInterventionGuides(onMessage).then(data => setInterventions(data));
  }, []);

  return (
    <React.Fragment>
      <Grid item container className={classes.root}>
        <Grid item container sm={4} className={classes.content}>
          <InterventionLeft />
        </Grid>
        <Grid item container sm={8} className={classes.center}>
          {interventions == null || interventions.length < 1 ? (
            <Typography gutterBottom variant="body2" color="textSecondary" align="left" component="p"></Typography>
          ) : (
            interventions.map(data => {
              if (data.guide.length != 0) {
                return <InterventionTile title={data.title} description={data.description} guide={data.guide} onMessage={props.onMessage} />;
              }
            })
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default InterventionGuides;
