import React from 'react';
import Profile from './profile-creation/Profile';
import ViewProfiles from './profile-selection/ViewProfiles';
import SelectedProfile from './profile-selection/SelectedProfile';
import { Route, useRouteMatch } from 'react-router-dom';

function ProfileController(props) {
  const { path } = useRouteMatch();

  return (
    <React.Fragment>
      <Route path={`${path}/create`}>
        <Profile onMessage={props.onMessage} setTitle={props.setTitle} />
      </Route>
      <Route path={`${path}/detailed-view/:id/edit-persona/`}>
        <Profile onMessage={props.onMessage} setTitle={props.setTitle} />
      </Route>
      <Route exact path={`${path}/detailed-view/:id`}>
        <SelectedProfile onMessage={props.onMessage} setTitle={props.setTitle} />
      </Route>
      <Route exact path={`${path}/`}>
        <ViewProfiles onMessage={props.onMessage} setTitle={props.setTitle} />
      </Route>
    </React.Fragment>
  );
}

export default ProfileController;
