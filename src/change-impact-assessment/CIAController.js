import React from 'react';
import ChangeImpactAssessment from './ChangeImpactAssessment';
import ViewCIAs from './ViewCIAs';
import { Route, useRouteMatch } from 'react-router-dom';

function CIAController(props) {
  const { path } = useRouteMatch();
  props.setTitle('Change Impact Assessment');
  return (
    <React.Fragment>
      <Route path={`${path}/create`}>
        <ChangeImpactAssessment onMessage={props.onMessage} />
      </Route>
      <Route path={`${path}/view/:id`}>
        <ChangeImpactAssessment onMessage={props.onMessage} />
      </Route>
      <Route exact path={`${path}/`}>
        <ViewCIAs onMessage={props.onMessage} ciaFilter={props.ciaFilter} setCiaFilter={props.setCiaFilter} />
      </Route>
    </React.Fragment>
  );
}

export default CIAController;
