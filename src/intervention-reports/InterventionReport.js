import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, Typography, Backdrop, CircularProgress } from '@material-ui/core';
import JobVsIntervention from './JobVsIntervention';
import JobVsTrainings from './JobVsTrainings';
import InterventionStatus from './InterventionStatus';
import JobVsNInterventions from './JobVsNInterventions';
import Monthvsintervention from './Monthvsintervention';
import ChangeVsIntervention from './ChangeVsIntervention';
import ChangeVsInterventionUser from './ChangeVsInterventionUser';
import { fetchInterventionReport, fetchInterventions } from '../common/API';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const useStyles = makeStyles(theme => ({
  fixedPosition: {
    padding: '20px'
  },
  status: {
    marginTop: theme.spacing(4),
    width: '103%',
    height: '93%',
    padding: '20px'
  },
  grid: {
    marginTop: theme.spacing(4)
  },
  box: {
    paddingTop: theme.spacing(3),
    paddingRight: theme.spacing(8),
    paddingLeft: theme.spacing(8)
  },
  tile1: {
    backgroundColor: '#FFFFFF',
    borderColor: '#2B0A3D',
    borderBlockColor: '#2B0A3D',
    height: 45,
    width: '100%'
  },
  border: {
    textAlign: 'center'
  },
  color: {
    textAlign: 'center'
  },
  space: {
    paddingTop: theme.spacing(5)
  }
}));

function InterventionReport(props) {
  let location = useLocation();
  const { onMessage } = props;
  const classes = useStyles();
  const [loading, setLoading] = useState(true);

  const [jobVsInterventionData, setJobVsInterventionData] = useState([]);
  const [jobVsTrainingData, setJobVsTrainingData] = useState([]);
  const [interventionStatusData, setInterventionStatusData] = useState([]);
  const [jobVsNInterventionsData, setJobVsNInterventionsData] = useState([]);
  const [monthvsInterventionData, setMonthvsInterventionData] = useState([]);
  const [ChangeVsInterventionData, setChangeVsInterventionData] = useState([]);
  const [ChangeVsInterventionUserData, setChangeVsInterventionUserData] = useState([]);
  const [interventions, setInterventions] = useState([]);

  //fetching data for Intervention reports
  useEffect(() => {
    Promise.all([fetchInterventionReport(onMessage), fetchInterventions(onMessage, true)]).then(([graphDataJson, data]) => {
      setInterventions(data);
      setJobVsInterventionData([graphDataJson.job_vs_intervention_xaxis, graphDataJson.job_vs_intervention_yaxis]);
      setJobVsInterventionData([
        graphDataJson.job_vs_intervention_xaxis,
        graphDataJson.job_vs_intervention_yaxis[0],
        graphDataJson.job_vs_intervention_yaxis[1]
      ]);
      setJobVsTrainingData([graphDataJson.job_vs_trainings_xaxis, graphDataJson.job_vs_trainings_yaxis_, graphDataJson.job_vs_trainings_profileId]);
      setInterventionStatusData([graphDataJson.intervention_status_xaxis, graphDataJson.intervention_status_yaxis]);
      setJobVsNInterventionsData([graphDataJson.job_vs_nci_xaxis, graphDataJson.job_vs_nci_yaxis]);
      setJobVsNInterventionsData([
        graphDataJson.job_vs_nci_xaxis,
        graphDataJson.job_vs_nci_yaxis[0],
        graphDataJson.job_vs_nci_yaxis[1],
        graphDataJson.job_vs_nci_yaxis[2]
      ]);
      setMonthvsInterventionData([graphDataJson.month_vs_intervention_xaxis, graphDataJson.month_vs_intervention_yaxis]);
      setChangeVsInterventionData([graphDataJson.change_vs_int_xaxis, graphDataJson.change_vs_int_yaxis]);
      setChangeVsInterventionUserData([graphDataJson.change_vs_irb_xaxis, graphDataJson.change_vs_irb_yaxis]);
      setChangeVsInterventionUserData([
        graphDataJson.change_vs_irb_xaxis,
        graphDataJson.change_vs_irb_yaxis[0],
        graphDataJson.change_vs_irb_yaxis[1],
        graphDataJson.change_vs_irb_yaxis[2]
      ]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  if (loading) {
    return (
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else {
    return (
      <React.Fragment>
        <Grid container justify="center" className={classes.box}>
          <Card className={classes.tile1}>
            <Typography className={classes.border}>{interventions.length}</Typography>
            <Typography className={classes.color}>Interventions Planned</Typography>
          </Card>
        </Grid>
        <Grid container direction="row" justify="center" className={classes.fixedPosition}>
          <Grid container direction="row" justify="center" spacing={4} className={classes.space}>
            <Grid item spacing={2} className={classes.space}>
              <Card className={classes.fixedPosition}>
                <JobVsIntervention
                  jobVsInterventionData={jobVsInterventionData}
                  onMessage={props.onMessage}
                  setInterventionTracker={props.setInterventionTracker}
                />
              </Card>
            </Grid>
            <Grid item spacing={2} className={classes.space}>
              <Card className={classes.fixedPosition}>
                <JobVsTrainings jobVsTrainingData={jobVsTrainingData} onMessage={props.onMessage} />
              </Card>
            </Grid>
          </Grid>
          <Grid container direction="row" justify="center" spacing={4} className={classes.space}>
            <Grid item spacing={2} className={classes.space}>
              <Card className={classes.fixedPosition}>
                <InterventionStatus
                  interventionStatusData={interventionStatusData}
                  onMessage={props.onMessage}
                  setInterventionTracker={props.setInterventionTracker}
                />
              </Card>
            </Grid>
            <Grid item spacing={2} className={classes.space}>
              <Card className={classes.fixedPosition}>
                <JobVsNInterventions
                  jobVsNInterventionsData={jobVsNInterventionsData}
                  onMessage={props.onMessage}
                  setInterventionTracker={props.setInterventionTracker}
                />
              </Card>
            </Grid>
          </Grid>
          <Grid container direction="row" justify="center" spacing={4} className={classes.space}>
            <Grid item spacing={2} className={classes.space}>
              <Card className={classes.fixedPosition}>
                <Monthvsintervention
                  monthvsInterventionData={monthvsInterventionData}
                  onMessage={props.onMessage}
                  setInterventionTracker={props.setInterventionTracker}
                />
              </Card>
            </Grid>
            <Grid item spacing={2} className={classes.space}>
              <Card className={classes.fixedPosition}>
                <ChangeVsIntervention
                  ChangeVsInterventionData={ChangeVsInterventionData}
                  onMessage={props.onMessage}
                  setInterventionTracker={props.setInterventionTracker}
                />
              </Card>
            </Grid>
          </Grid>
          <Grid container direction="row" justify="center" spacing={4} className={classes.space}>
            <Grid item spacing={2} className={classes.space}>
              {Cookies.get('role') === 'Programme Users' || Cookies.get('role') === 'Capgemini Users' ? (
                <Card className={classes.fixedPosition}>
                  <ChangeVsInterventionUser
                    ChangeVsInterventionUserData={ChangeVsInterventionUserData}
                    onMessage={props.onMessage}
                    setInterventionTracker={props.setInterventionTracker}
                  />
                </Card>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default InterventionReport;
