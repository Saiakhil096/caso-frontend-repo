import React from 'react';
import { Grid } from '@material-ui/core';
import TrainingTable from './TrainingTable';
import AssignTraining from './AssignTraining';
import { Route, useRouteMatch } from 'react-router-dom';

function TrainingAnalysis(props) {
  const { path } = useRouteMatch();
  const { onMessage, setTitle } = props;

  return (
    <React.Fragment>
      <Route exact path={`${path}/`}>
        <Grid container justify="center">
          <TrainingTable onMessage={onMessage} />
        </Grid>
      </Route>
      <Route exact path={`${path}/:userId/assign-training/:id`}>
        <Grid>
          <AssignTraining setTitle={setTitle} onMessage={onMessage} />
        </Grid>
      </Route>
    </React.Fragment>
  );
}

export default TrainingAnalysis;
