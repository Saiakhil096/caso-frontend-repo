import React from 'react';
import CreateUser from './CreateUser';
import ViewUser from './ViewUser';
import EditUser from './EditUser';
import { Route, useRouteMatch } from 'react-router-dom';

function UserController(props) {
  const { path } = useRouteMatch();
  return (
    <React.Fragment>
      <Route path={`${path}/create`}>
        <CreateUser onMessage={props.onMessage} />
      </Route>
      <Route path={`${path}/edit`}>
        <EditUser onMessage={props.onMessage} />
      </Route>
      <Route exact path={`${path}`}>
        <ViewUser onMessage={props.onMessage} />
      </Route>
    </React.Fragment>
  );
}

export default UserController;
