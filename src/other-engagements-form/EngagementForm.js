import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import EngagementsLeftPane from './EngagementsLeftPane';
import EngagementsReportsTile from './EngagementsReportsTile';

const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(8, 8)
  }
}));

function EngagementForm(props) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Grid container>
        <Grid item sm={4} className={classes.content}>
          <EngagementsLeftPane />
        </Grid>
        <EngagementsReportsTile onMessage={props.onMessage} />
      </Grid>
    </React.Fragment>
  );
}

export default EngagementForm;
