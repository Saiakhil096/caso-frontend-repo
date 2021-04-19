import React from 'react';
import BusinessChangePlan from './BusinessChangePlan';
import ChangeImpactAssessment from '../change-impact-assessment/ChangeImpactAssessment';
import CreateBcp from './CreateNewBcp';
import { Route, useRouteMatch } from 'react-router-dom';

function BCPController(props) {
  const { path } = useRouteMatch();
  props.setTitle('Business Change Plan');
  return (
    <React.Fragment>
      <Route path={`${path}/create`}>
        <CreateBcp onMessage={props.onMessage} />
      </Route>
      <Route path={`${path}/view/:id`}>
        <ChangeImpactAssessment onMessage={props.onMessage} />
      </Route>
      <Route exact path={`${path}/`}>
        <BusinessChangePlan onMessage={props.onMessage} />
      </Route>
    </React.Fragment>
  );
}

export default BCPController;
