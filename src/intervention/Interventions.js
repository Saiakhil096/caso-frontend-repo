import React, { Fragment } from 'react';
import InterventionOptions from './InterventionOptions';

function Interventions(props) {
  props.setTitle('Create Interventions');
  return (
    <Fragment>
      <InterventionOptions onMessage={props.onMessage} />
    </Fragment>
  );
}

export default Interventions;
