import React, { useState, useEffect } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography, Paper } from '@material-ui/core';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  ICAPBannerIcon,
  EthnicFriendshipRafikiIcon,
  HelpdeskAnalysisICAPIcon,
  NumberDisplayLightRedIcon,
  NumberDisplaySoftOrangeIcon,
  NumberDisplaySoftYellowGreenIcon,
  NumberDisplayVividBlueIcon,
  CreateInterventionsIcon,
  ChangeAgentTrackerIcon,
  ChangeJourneyIconNew,
  IcapCollaborateIcon,
  TrainingAnalysisIcon,
  QuestionnaireIcon
} from '../common/CustomIcons';
import { fetchDashboardData } from '../common/API';
import ReactSpeedometer from 'react-d3-speedometer';
import MaturityModelAssessment from '../maturity-model-assessment/MaturityModelAssessment';
import DesignThinking from '../design-thinking/DesignThinking';
import Interventions from '../intervention/Interventions';
import LocationInfrastructure from '../location-infrastructure/LocationInfrastructure';
import InterventionGuides from '../intervention-guides/InterventionGuides';
import AmbitionSetting from '../AmbitionSetting/AmbitionSetting';
import AmbitionSettingResultPage from '../AmbitionSetting/AmbitionSettingResultPage';
import EngagementsForm from '../other-engagements-form/EngagementForm';
import CIAController from '../change-impact-assessment/CIAController';
import ProfileController from '../profile/ProfileController';
import InterventionTracker from '../intervention/InterventionTracker';
import ChangeJourney from '../change-journey/ChangeJourney';
import TrainingAnalysis from '../training-analysis/TrainingAnalysis';
import ChangeReadinessSurvey from '../change-readiness-survey/ChangeReadinessSurvey';
import CIAreports from '../change-impact-assessment/change-impact-assesment-reports/CIAreports';
import ChangeCalendar from '../change-calendar/ChangeCalendar';
import Charts from '../change-readiness-survey/Charts/Charts';
import OutputScreen from '../other-engagements-form/OutputScreen';
import LocationCharts from '../location-infrastructure/Charts/LocationCharts';
import RolloutTracker from '../rollout-progress-tracker/RolloutTracker';
import InterventionReport from '../intervention-reports/InterventionReport';
import BCPController from '../Business-change-plan/BCPController';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4, 0)
  },
  box: {
    width: '100%',
    padding: theme.spacing(1, 0),
    backgroundColor: 'white'
  },
  gridItem: {
    marginBottom: theme.spacing(3),
    maxWidth: '25rem'
  },
  icon: {
    width: '8rem',
    height: 'auto',
    display: 'block'
  },
  paperStyles: {
    width: '96%',
    margin: 'auto'
  },

  cursorStyle: {
    cursor: 'pointer',
    height: '100%'
  },
  leftGridStyles: {
    padding: '2%',
    textDecoration: 'none',
    maxWidth: '80rem'
  },
  rightGridStyles: {
    padding: '2%',
    maxWidth: '150rem',
    textDecoration: 'none'
  },
  gridStyle1: {
    padding: '5%',
    paddingBottom: 0
  },
  gridStyle2: {
    padding: '10% 7%'
  },
  gridStyle3: {
    padding: '2.5%'
  },
  gridStyle4: {
    padding: '3% 2% 2% 5%'
  },
  gridStyles: {
    padding: '2%',
    textDecoration: 'none'
  },
  label: {
    marginTop: '-28px',
    alignSelf: 'flex-start'
  }
}));

function ICAPLeaderShipDashboard(props) {
  const classes = useStyles();

  const [dashboardData, setDashboardData] = useState({
    changeImpactAssessmentsCount: '',
    changeImpactWeightLowPercentage: '',
    changeImpactWeightMediumPercentage: '',
    changeImpactWeightHighPercentage: '',
    changeCalendar: [],
    interventionsPendingPercentage: '',
    interventionsNotDuePercentage: '',
    interventionsDonePercentage: '',
    locationWiseReadinessPercentages: [],
    otherEngagementReports: [],
    rolloutProgressTracker: [],
    changeReadinessScore: 0,
    changeReadinessResponses: 0,
    businessChangePlan: []
  });

  useEffect(() => {
    fetchDashboardData(props.onMessage).then(result => setDashboardData(result));
  }, []);

  const Banner = encodeURIComponent(renderToStaticMarkup(<ICAPBannerIcon className={classes.icon} />));
  var ethnicFriendshipRafikiIcon = <EthnicFriendshipRafikiIcon className={classes.icon} />;
  var helpdeskAnalysisIcon = <HelpdeskAnalysisICAPIcon className={classes.icon} />;
  var createInterventionsIcon = <CreateInterventionsIcon className={classes.icon} />;
  var trackInterventionsIcon = <ChangeAgentTrackerIcon className={classes.icon} />;
  var changeJourneyIcon = <ChangeJourneyIconNew className={classes.icon} />;
  var iCapCollaborateIcon = <IcapCollaborateIcon className={classes.icon} />;
  var trainingAnalysisIcon = <TrainingAnalysisIcon className={classes.icon} />;

  return (
    <React.Fragment>
      <Switch>
        <Route path="/create-intervention">
          <Interventions onMessage={props.onMessage} setTitle={props.setTitle} />
        </Route>
        <Route path="/intervention-tracker">
          <InterventionTracker
            onMessage={props.onMessage}
            setTitle={props.setTitle}
            interventionTracker={props.interventionTracker}
            setInterventionTracker={props.setInterventionTracker}
          />
        </Route>
        <Route path="/intervention-guides">
          <InterventionGuides onMessage={props.onMessage} setTitle={props.setTitle} />
        </Route>
        <Route path="/location-infrastructure">
          <LocationInfrastructure
            onMessage={props.onMessage}
            setTitle={props.setTitle}
            locInfraFilter={props.locInfraFilter}
            setLocInfraFilter={props.setLocInfraFilter}
          />
        </Route>
        <Route path="/maturity-model-assessment">
          <MaturityModelAssessment onMessage={props.onMessage} />
        </Route>
        <Route path="/design-thinking">
          <DesignThinking onMessage={props.onMessage} />
        </Route>
        <Route path="/ambition-setting">
          <AmbitionSetting onMessage={props.onMessage} user={Cookies.get('user')} />
        </Route>
        <Route path="/ambition-resultpage">
          <AmbitionSettingResultPage onMessage={props.onMessage} user={Cookies.get('user')} project={Cookies.get('project')} />
        </Route>
        <Route path="/other-engagements-form">
          <EngagementsForm onMessage={props.onMessage} setTitle={props.setTitle} />
        </Route>
        <Route path="/change-impact-assessment">
          <CIAController onMessage={props.onMessage} setTitle={props.setTitle} ciaFilter={props.ciaFilter} setCiaFilter={props.setCiaFilter} />
        </Route>
        <Route path="/profile">
          <ProfileController onMessage={props.onMessage} setTitle={props.setTitle} />
        </Route>
        <Route path="/change-journey">
          <ChangeJourney onMessage={props.onMessage} setTitle={props.setTitle} />
        </Route>
        <Route path="/training-analysis">
          <TrainingAnalysis onMessage={props.onMessage} setTitle={props.setTitle} />
        </Route>
        <Route path="/change-readiness-survey">
          <ChangeReadinessSurvey onMessage={props.onMessage} setTitle={props.setTitle} />
        </Route>
        <Route path="/change-impact-assessment-reports">
          <CIAreports onMessage={props.onMessage} setTitle={props.setTitle} setCiaFilter={props.setCiaFilter} />
        </Route>
        <Route path="/change-calendar">
          <ChangeCalendar onMessage={props.onMessage} setTitle={props.setTitle} />
        </Route>
        <Route path="/Business-change-plan">
          <BCPController onMessage={props.onMessage} setTitle={props.setTitle} />
        </Route>
        <Route path="/change-readiness-graphs">
          <Charts onMessage={props.onMessage} />
        </Route>
        <Route path="/other-engagements-comments">
          <OutputScreen onMessage={props.onMessage} />
        </Route>
        <Route path="/location-infrastructure-graphs">
          <LocationCharts onMessage={props.onMessage} setLocInfraFilter={props.setLocInfraFilter} />
        </Route>
        <Route path="/rollout-progress-tracker">
          <RolloutTracker onMessage={props.onMessage} />
        </Route>
        <Route path="/intervention-reports">
          <InterventionReport onMessage={props.onMessage} setTitle={props.setTitle} setInterventionTracker={props.setInterventionTracker} />
        </Route>
        <Route exact path="/">
          <Grid container item xs={12} className={classes.root}>
            <Grid container item xs={12}>
              <Grid item xs={12}>
                <Typography style={{ paddingLeft: '1%', paddingBottom: '1%' }}>Setting the Ambition</Typography>
              </Grid>
            </Grid>
            <Grid item container justify="space-evenly" xs={12}>
              <Grid item xs={4} className={classes.leftGridStyles}>
                <Paper elevation={5} className={classes.cursorStyle}>
                  <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/ambition-setting">
                    <Grid item container xs={12} justify="center" className={classes.gridStyle1}>
                      Ambition Setting
                    </Grid>
                    <Grid item container xs={12} justify="center" className={classes.gridStyle2}>
                      <QuestionnaireIcon className={classes.icon} />
                    </Grid>
                  </Paper>
                </Paper>
              </Grid>
              <Grid item xs={8} className={classes.rightGridStyles}>
                <Paper elevation={0} style={{ background: 'inherit' }} className={classes.cursorStyle}>
                  <Grid item container xs={12} justify="center" className={classes.gridStyle3}></Grid>
                </Paper>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography style={{ paddingLeft: '1%', paddingBottom: '2%' }}>Understanding the Change</Typography>
              <Paper
                component="div"
                elevation={5}
                className={classes.paperStyles}
                style={{
                  backgroundImage: `url('data:image/svg+xml;utf8, ${Banner}')`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover'
                }}>
                <Grid item container xs={12} spacing={2}>
                  <Grid item xs={6} style={{ paddingTop: '4%' }}>
                    <Typography gutterBottom align="center" variant="h5" component="h2">
                      Employee Personas
                    </Typography>
                  </Grid>
                  <Grid item xs={6}></Grid>
                  <Grid item container xs={12} style={{ paddingBottom: '4%' }}>
                    <Grid container item xs={3} justify="flex-end">
                      {ethnicFriendshipRafikiIcon}
                    </Grid>
                    <Grid container item xs={4} justify="flex-start" alignItems="center">
                      <Typography variant="body2" color="textSecondary" component="p">
                        The heart of the iCAP functions - employee personas allow us to empathise with those impacted when implementing changes that
                        will affect them.
                      </Typography>
                    </Grid>
                    <Grid item container xs={5} justify="center" alignItems="center">
                      <Button variant="contained" color="primary" size="large" component={Link} to="/profile">
                        View Personas
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item container xs={12} style={{ paddingTop: '2%' }}>
              <Grid item xs={8} className={classes.rightGridStyles}>
                <Paper elevation={5} className={classes.cursorStyle}>
                  <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/change-impact-assessment-reports">
                    <Grid item container xs={12} justify="center" className={classes.gridStyle3}>
                      Change Impact Assessment Reports
                    </Grid>
                    <Grid item container xs={12} justify="center" className={classes.gridStyle4}>
                      <Grid item container xs={4} justify="center">
                        <NumberDisplayLightRedIcon
                          className={classes.icon}
                          value={dashboardData.changeImpactWeightLowPercentage}
                          label="Low"
                          xposition="5"
                        />
                      </Grid>
                      <Grid item container xs={4} justify="center">
                        <NumberDisplaySoftOrangeIcon
                          className={classes.icon}
                          value={dashboardData.changeImpactWeightMediumPercentage}
                          label="Medium"
                          xposition="2"
                        />
                      </Grid>
                      <Grid item container xs={4} justify="center">
                        <NumberDisplaySoftYellowGreenIcon
                          className={classes.icon}
                          value={dashboardData.changeImpactWeightHighPercentage}
                          label="High"
                          xposition="5"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Paper>
              </Grid>
            </Grid>

            <Grid container item xs={12}>
              <Grid item xs={12}>
                <Typography style={{ paddingLeft: '1%' }}>Co-Create Change Plan</Typography>
              </Grid>
              <Grid item container xs={12}>
                <Grid item xs={8} className={classes.rightGridStyles}>
                  <Paper elevation={5} className={classes.cursorStyle}>
                    <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/change-calendar">
                      <Grid item container xs={12} justify="center" className={classes.gridStyle3}>
                        The Change Calendar
                      </Grid>
                      <Grid item container xs={12} justify="space-evenly" className={classes.gridStyle4}>
                        {dashboardData.changeCalendar.map((data, index) => (
                          <Grid key={index} item container xs={2}>
                            <NumberDisplayVividBlueIcon className={classes.icon} value={data.interventionsCount} label={data.monthName} />
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </Paper>
                </Grid>
                <Grid item xs={4} className={classes.leftGridStyles}>
                  <Paper elevation={5} className={classes.cursorStyle}>
                    <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/change-journey">
                      <Grid item container xs={12} justify="center" className={classes.gridStyle1}>
                        Change Journey
                      </Grid>
                      <Grid item container xs={12} justify="center" className={classes.gridStyle2}>
                        {changeJourneyIcon}
                      </Grid>
                    </Paper>
                  </Paper>
                </Grid>
              </Grid>

              <Grid item container xs={12} className={classes.gridStyles}>
                <Paper elevation={5} style={{ width: '100%' }} className={classes.cursorStyle}>
                  <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/Business-change-plan">
                    <Grid item container xs={12} justify="center" className={classes.gridStyle3}>
                      Business Change Plan
                    </Grid>
                    <Grid item container xs={12} justify="space-evenly" className={classes.gridStyle4}>
                      {dashboardData.businessChangePlan.map((data, index) => (
                        <Grid key={index} item xs={1}>
                          <NumberDisplayVividBlueIcon className={classes.icon} value={data.activityCount} />
                          <Typography variant="body1" className={classes.label}>
                            {data.name}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Paper>
              </Grid>
            </Grid>

            <Grid item container xs={12}>
              <Grid item xs={4} className={classes.leftGridStyles}>
                <Paper elevation={5} className={classes.cursorStyle}>
                  <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/intervention-tracker">
                    <Grid item container xs={12} justify="center" className={classes.gridStyle1}>
                      <Typography>Track Interventions</Typography>
                    </Grid>
                    <Grid item container xs={12} justify="center" className={classes.gridStyle2}>
                      {trackInterventionsIcon}
                    </Grid>
                  </Paper>
                </Paper>
              </Grid>
              <Grid item xs={8} className={classes.rightGridStyles}>
                <Paper elevation={5} className={classes.cursorStyle}>
                  <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/intervention-reports">
                    <Grid item container xs={12} justify="center" className={classes.gridStyle3}>
                      Intervention Reports
                    </Grid>
                    <Grid item container xs={12} justify="center" className={classes.gridStyle4}>
                      <Grid item container xs={4} justify="center">
                        <NumberDisplayLightRedIcon
                          className={classes.icon}
                          value={dashboardData.interventionsPendingPercentage}
                          label="Pending"
                          xposition="2"
                        />
                      </Grid>
                      <Grid item container xs={4} justify="center">
                        <NumberDisplaySoftOrangeIcon
                          className={classes.icon}
                          value={dashboardData.interventionsNotDuePercentage}
                          label="Not Due"
                          xposition="2"
                        />
                      </Grid>
                      <Grid item container xs={4} justify="center">
                        <NumberDisplaySoftYellowGreenIcon
                          className={classes.icon}
                          value={dashboardData.interventionsDonePercentage}
                          label="Completed"
                          xposition="1"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Paper>
              </Grid>
            </Grid>

            <Grid container item xs={12}>
              <Grid item xs={12}>
                <Typography style={{ paddingLeft: '1%', paddingBottom: '1%' }}>Business Readiness and Adapt</Typography>
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item xs={8} className={classes.rightGridStyles}>
                <Paper elevation={5} className={classes.cursorStyle} style={{ height: '100%' }}>
                  <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/change-readiness-graphs">
                    <Grid item container xs={12} justify="center" className={classes.gridStyle3}>
                      Change Readiness Report
                    </Grid>
                    <Grid container item xs={12}>
                      <Grid item xs={6} container justify="flex-end">
                        <ReactSpeedometer
                          width={300}
                          height={190}
                          needleHeightRatio={0.8}
                          maxValue={5}
                          value={dashboardData.changeReadinessScore}
                          valueFormat={'d'}
                          currentValueText="Change Readiness Score"
                          customSegmentLabels={[
                            {
                              position: 'INSIDE',
                              color: '#555'
                            },
                            {
                              position: 'INSIDE',
                              color: '#555'
                            },
                            {
                              position: 'INSIDE',
                              color: '#555',
                              fontSize: '19px'
                            },
                            {
                              position: 'INSIDE',
                              color: '#555'
                            },
                            {
                              position: 'INSIDE',
                              color: '#555'
                            }
                          ]}
                          ringWidth={47}
                          needleTransitionDuration={3333}
                          needleTransition="easeElastic"
                          needleColor={'#707070'}
                          textColor={'#d8dee9'}
                        />
                      </Grid>
                      <Grid item container xs={6} justify="center" alignItems="center">
                        <NumberDisplayVividBlueIcon className={classes.icon} value={dashboardData.changeReadinessResponses} label="Responses" />
                      </Grid>
                    </Grid>
                  </Paper>
                </Paper>
              </Grid>
              <Grid item xs={4} style={{ padding: '2%' }}>
                <Paper elevation={5} className={classes.cursorStyle}>
                  <Paper elevation={0} style={{ textDecoration: 'none' }}>
                    <Grid item container xs={12} justify="center" className={classes.gridStyle1} style={{ paddingBottom: '4%' }}>
                      iCAP Collaborate
                    </Grid>
                    <Grid item container xs={12} justify="center" className={classes.gridStyle2}>
                      {iCapCollaborateIcon}
                    </Grid>
                  </Paper>
                </Paper>
              </Grid>
            </Grid>

            <Grid item container xs={12}>
              <Grid item xs={4} className={classes.leftGridStyles}>
                <Paper elevation={5} className={classes.cursorStyle}>
                  <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/other-engagements-form">
                    <Grid item container xs={12} justify="center" className={classes.gridStyle1}>
                      Other Engagements Form
                    </Grid>
                    <Grid item container xs={12} justify="center" className={classes.gridStyle2}>
                      {createInterventionsIcon}
                    </Grid>
                  </Paper>
                </Paper>
              </Grid>
              <Grid item xs={8} className={classes.rightGridStyles}>
                <Paper elevation={5} className={classes.cursorStyle}>
                  <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/other-engagements-comments">
                    <Grid item container xs={12} justify="center" className={classes.gridStyle3}>
                      Other Engagements Reports
                    </Grid>
                    <Grid item container xs={12} justify="space-evenly" className={classes.gridStyle4}>
                      {dashboardData.otherEngagementReports.length > 0 ? (
                        dashboardData.otherEngagementReports.map((report, index) => (
                          <Grid key={index} item xs={2}>
                            <NumberDisplayVividBlueIcon className={classes.icon} value={report.count} />
                            <Typography variant="body1" className={classes.label}>
                              {report.bu_unit}
                            </Typography>
                          </Grid>
                        ))
                      ) : (
                        <Grid> No data to display </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Paper>
              </Grid>
            </Grid>

            <Grid item container xs={12}>
              <Grid item xs={8} className={classes.rightGridStyles}>
                <Paper elevation={5} className={classes.cursorStyle}>
                  <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/location-infrastructure-graphs">
                    <Grid item container xs={12} justify="center" className={classes.gridStyle3}>
                      Location Needs Analysis
                    </Grid>
                    <Grid item container xs={12} justify="space-evenly" className={classes.gridStyle4}>
                      {dashboardData.locationWiseReadinessPercentages.length > 0 ? (
                        dashboardData.locationWiseReadinessPercentages.map((data, index) => (
                          <Grid key={index} item xs={2}>
                            <NumberDisplayVividBlueIcon className={classes.icon} value={data.percentage} />
                            <Typography variant="body1" className={classes.label}>
                              {data.location}
                            </Typography>
                          </Grid>
                        ))
                      ) : (
                        <Grid> No data to display </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Paper>
              </Grid>
              <Grid item xs={4} className={classes.leftGridStyles}>
                <Paper elevation={5} className={classes.cursorStyle}>
                  <Paper elevation={0} style={{ textDecoration: 'none' }}>
                    <Grid item container xs={12} justify="center" className={classes.gridStyle1}>
                      Helpdesk Analysis
                    </Grid>
                    <Grid item container xs={12} justify="center" className={classes.gridStyle2}>
                      {helpdeskAnalysisIcon}
                    </Grid>
                  </Paper>
                </Paper>
              </Grid>
            </Grid>

            <Grid item container xs={12}>
              <Grid item xs={8} className={classes.rightGridStyles}>
                <Paper elevation={5} className={classes.cursorStyle}>
                  <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/rollout-progress-tracker">
                    <Grid item container xs={12} justify="center" className={classes.gridStyle3}>
                      Rollout Progress Tracker
                    </Grid>
                    <Grid item container xs={12} justify="space-evenly" className={classes.gridStyle4}>
                      {dashboardData.rolloutProgressTracker.length > 0 ? (
                        dashboardData.rolloutProgressTracker.map((rollout, index) => (
                          <Grid key={index} item container xs={2}>
                            <NumberDisplayVividBlueIcon className={classes.icon} value={rollout.averagePercentage} />
                            <Typography variant="body1" className={classes.label}>
                              {rollout.rollout_title}
                            </Typography>
                          </Grid>
                        ))
                      ) : (
                        <Grid> No data to display </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Paper>
              </Grid>

              <Grid item xs={4} className={classes.leftGridStyles}>
                <Paper elevation={5} className={classes.cursorStyle}>
                  <Paper elevation={0} style={{ textDecoration: 'none' }}>
                    <Grid item container xs={12} justify="center" className={classes.gridStyle1}>
                      Training Analysis
                    </Grid>
                    <Grid item container xs={12} justify="center" className={classes.gridStyle2}>
                      {trainingAnalysisIcon}
                    </Grid>
                  </Paper>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Route>
      </Switch>
    </React.Fragment>
  );
}

export default ICAPLeaderShipDashboard;
