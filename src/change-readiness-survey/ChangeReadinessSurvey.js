import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Backdrop, CircularProgress } from '@material-ui/core';
import Sidebar from './Sidebar';
import ChangeReadinessForm from './ChangeReadinessForm';
import { url, fetchProjectData, fetchChangeReadinessQuestions, fetchChangeReadinessResponse } from '../common/API';
import Cookies from 'js-cookie';
import Exit from './Exit';

const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(4)
  },
  background: {
    backgroundColor: '#F2F2F2'
  }
}));

function ChangeReadinessSurvey(props) {
  const [loading, setLoading] = useState(true);
  const [keyLocationData, setKeyLocationData] = useState([]);
  const [businessUnitData, setBusinessUnitData] = useState([]);
  const [jobRoleData, setJobRoleData] = useState([]);
  const [isSurveyTaken, setIsSurveyTaken] = useState(false);

  const [changeReadinessQuestions, setChangeReadinessQuestions] = useState([]);

  const { onMessage } = props;

  const classes = useStyles();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    Promise.all([
      fetchChangeReadinessResponse(onMessage),
      fetchChangeReadinessQuestions(onMessage),
      fetchProjectData(Cookies.get('project'), onMessage)
    ]).then(async ([changeReadinessResponseDataJson, changeReadinessQuestionDataJson, projectDataJson]) => {
      changeReadinessResponseDataJson[0] != null ? setIsSurveyTaken(true) : setIsSurveyTaken(false);
      setKeyLocationData(projectDataJson.key_locations);
      setBusinessUnitData(projectDataJson.business_units);
      setJobRoleData(projectDataJson.persona_job_roles);
      setChangeReadinessQuestions(changeReadinessQuestionDataJson);

      setLoading(false);
    });
  };

  if (loading) {
    return (
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else if (isSurveyTaken) {
    return <Exit />;
  } else {
    return (
      <React.Fragment>
        <Grid container>
          <Grid item xs={false} sm={3} md={3} className={classes.content}>
            <Sidebar
              title="Change Readiness Survey"
              instructions="Your opinions are valuable to us. Help us understand them better by answering a short survey. Thank you for your participation."
            />
          </Grid>
          <Grid item xs={12} sm={9} md={9} className={`${classes.background} ${classes.content}`}>
            <ChangeReadinessForm
              onMessage={onMessage}
              jobRoleData={jobRoleData}
              keyLocationData={keyLocationData}
              businessUnitData={businessUnitData}
              changeReadinessQuestions={changeReadinessQuestions}
              setIsSurveyTaken={setIsSurveyTaken}
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
export default ChangeReadinessSurvey;
