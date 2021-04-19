import React from 'react';
import { Grid, Typography } from '@material-ui/core';

function Sidebar(props) {
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant="h5">{props.title}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body2" color="textSecondary">
          {props.instructions}
        </Typography>
      </Grid>
      <Grid item container spacing={2}>
        {props.children}
      </Grid>
    </Grid>
  );
}

export default Sidebar;
