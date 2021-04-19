import React from 'react';
import { Grid, Typography } from '@material-ui/core';

function InterventionLeft(props) {
  return (
    <Grid container direction="column" spacing={4}>
      <Grid item>
        <Typography variant="h6">Interventions Guide Library</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" color="textSecondary">
          A knowledge-building repository about designing and learning more about the change interventions and how to conduct them, curated by
          Capgemini's Change Consultants only for you. Download the content conveniently.
        </Typography>
      </Grid>
    </Grid>
  );
}

export default InterventionLeft;
