import React from 'react';
import { Grid, Typography } from '@material-ui/core';

function EngagementsLeftPane(props) {
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h6">The Other Engagements Form</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" color="textSecondary">
          We want to understand how things are going for the different parts of the business you have interacted with so far. Please highlight what is
          going well or what needs to be improved. Record key inputs from relevant stakeholders.
        </Typography>
      </Grid>
      <Grid item></Grid>
    </Grid>
  );
}

export default EngagementsLeftPane;
