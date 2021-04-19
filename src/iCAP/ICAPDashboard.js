import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography, Paper } from '@material-ui/core';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  ICAPBannerIcon,
  CIAIcon,
  EthnicFriendshipRafikiIcon,
  HelpdeskAnalysisICAPIcon,
  NumberDisplayLightRedIcon,
  NumberDisplaySoftOrangeIcon,
  NumberDisplaySoftYellowGreenIcon,
  NumberDisplayVividBlueIcon,
  CreateInterventionsIcon,
  ChangeAgentTrackerIcon,
  InterventionsGuideLibraryIcon,
  ChangeJourneyIconNew,
  MaintainLocationNeedsAnalysisIcon,
  IcapCollaborateIcon,
  AssignTrainingIcon,
  TrainingAnalysisIcon
} from '../common/CustomIcons';
import { fetchDashboardData } from '../common/API';
import ReactSpeedometer from 'react-d3-speedometer';

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
    maxWidth: '15 rem',
    paddingBottom: 0
  },
  gridStyle2: {
    padding: '10% 7%'
  },
  gridStyle3: {
    padding: '1.1%'
  },
  gridStyle4: {
    padding: '3% 2% 4% 5%'
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

function ICAPDashboard(props) {
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
    fetchDashboardData(props.onMessage).then(result => {
      setDashboardData(result);
    });
  }, []);

  const Banner = encodeURIComponent(renderToStaticMarkup(<ICAPBannerIcon className={classes.icon} />));
  var ethnicFriendshipRafikiIcon = <EthnicFriendshipRafikiIcon className={classes.icon} />;
  var helpdeskAnalysisIcon = <HelpdeskAnalysisICAPIcon className={classes.icon} />;
  var createInterventionsIcon = <CreateInterventionsIcon className={classes.icon} />;
  var trackInterventionsIcon = <ChangeAgentTrackerIcon className={classes.icon} />;
  var interventionsGuideLibraryIcon = <InterventionsGuideLibraryIcon className={classes.icon} />;
  var changeJourneyIcon = <ChangeJourneyIconNew className={classes.icon} />;
  var maintainLocationNeedsAnalysisIcon = <MaintainLocationNeedsAnalysisIcon className={classes.icon} />;
  var assignTrainingIcon = <AssignTrainingIcon className={classes.icon} />;
  var iCapCollaborateIcon = <IcapCollaborateIcon className={classes.icon} />;
  var trainingAnalysisIcon = <TrainingAnalysisIcon className={classes.icon} />;

  return (
    <React.Fragment>
      <Grid container item xs={12} className={classes.root}>
        <Grid item container xs={12} style={{ paddingTop: '2%' }}>
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
                    The heart of the iCAP functions - employee personas allow us to empathise with those impacted when implementing changes that will
                    affect them.
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

        <Grid item container justify="space-evenly" xs={12} style={{ paddingTop: '2%' }}>
          <Grid item xs={4} className={classes.leftGridStyles}>
            <Paper elevation={5} className={classes.cursorStyle}>
              <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/change-impact-assessment">
                <Grid item container xs={12} justify="center" className={classes.gridStyle1}>
                  <Typography>Change Impact Assessment</Typography>
                </Grid>
                <Grid item container xs={12} justify="center" className={classes.gridStyle2}>
                  <CIAIcon className={classes.icon} ciasCount={dashboardData.changeImpactAssessmentsCount} />
                </Grid>
              </Paper>
            </Paper>
          </Grid>
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

        <Grid item container justify="space-evenly" xs={12}>
          <Grid item xs={12}>
            <Typography style={{ paddingLeft: '1%' }}>Co-Create Change Plan</Typography>
          </Grid>

          <Grid item container justify="space-evenly" xs={12}>
            <Grid item xs={4} className={classes.leftGridStyles}>
              <Paper elevation={5} className={classes.cursorStyle}>
                <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/create-intervention">
                  <Grid item container xs={12} justify="center" className={classes.gridStyle1}>
                    Create Interventions
                  </Grid>
                  <Grid item container xs={12} justify="center" className={classes.gridStyle2}>
                    {createInterventionsIcon}
                  </Grid>
                </Paper>
              </Paper>
            </Grid>
            <Grid item xs={8} className={classes.rightGridStyles}>
              <Paper elevation={5} className={classes.cursorStyle}>
                <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/change-calendar">
                  <Grid item container xs={12} justify="center" className={classes.gridStyle3}>
                    The Change Calendar
                  </Grid>
                  <Grid item container xs={12} justify="space-evenly" className={classes.gridStyle4}>
                    {dashboardData.changeCalendar.map((data, index) => (
                      <Grid key={index} item xs={2}>
                        <NumberDisplayVividBlueIcon className={classes.icon} value={data.interventionsCount} />
                        <Typography variant="body1" className={classes.label}>
                          {data.monthName}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Paper>
            </Grid>
          </Grid>

          <Grid item container xs={12} justify="space-evenly">
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

          <Grid item container xs={12} justify="space-evenly">
            <Grid item xs={4} className={classes.leftGridStyles}>
              <Paper elevation={5} className={classes.cursorStyle}>
                <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/intervention-guides">
                  <Grid item container xs={12} justify="center" className={classes.gridStyle1}>
                    Interventions Guide Library
                  </Grid>
                  <Grid item container xs={12} justify="center" className={classes.gridStyle2}>
                    {interventionsGuideLibraryIcon}
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

            <Grid item xs={4} className={classes.leftGridStyles}>
              <Paper elevation={5} className={classes.cursorStyle}>
                <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/training-analysis">
                  <Grid item container xs={12} justify="center" className={classes.gridStyle1}>
                    Assign Training
                  </Grid>
                  <Grid item container xs={12} justify="center" className={classes.gridStyle2}>
                    {assignTrainingIcon}
                  </Grid>
                </Paper>
              </Paper>
            </Grid>
          </Grid>
          <Grid item container xs={12} className={classes.gridStyles}>
            <Paper elevation={5} className={classes.cursorStyle} style={{ width: '100%' }}>
              <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/Business-change-plan">
                <Grid item container xs={12} justify="center" className={classes.gridStyle3}>
                  <Typography>Business Change Plan</Typography>
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

        <Grid container item justify="space-evenly" xs={12}>
          <Grid item xs={12}>
            <Typography style={{ paddingLeft: '1%', paddingBottom: '1%' }}>Business Readiness and Adapt</Typography>
          </Grid>
        </Grid>
        <Grid item container justify="space-evenly" xs={12}>
          <Grid item xs={4} className={classes.leftGridStyles}>
            <Paper elevation={5} className={classes.cursorStyle}>
              <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/change-readiness-survey">
                <Grid item container xs={12} justify="center" className={classes.gridStyle1} style={{ paddingBottom: '4%' }}>
                  Change Readiness Survey
                </Grid>
                <Grid item container xs={12} justify="center" className={classes.gridStyle2}>
                  {trackInterventionsIcon}
                </Grid>
              </Paper>
            </Paper>
          </Grid>
          <Grid item xs={8} className={classes.rightGridStyles}>
            <Paper elevation={5} className={classes.cursorStyle} style={{ height: '100%' }}>
              <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/change-readiness-graphs">
                <Grid item container xs={12} justify="center" className={classes.gridStyle3}>
                  Change Readiness Report
                </Grid>
                <Grid container item xs={12}>
                  <Grid item xs={8} sm={8} md={7} lg={6} container justify="flex-end">
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
                          text: 'Low',
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
                          text: 'High',
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
                  <Grid item container xs={4} sm={4} md={5} lg={6} justify="center" alignItems="center">
                    <NumberDisplayVividBlueIcon className={classes.icon} value={dashboardData.changeReadinessResponses} label="Responses" />
                  </Grid>
                </Grid>
              </Paper>
            </Paper>
          </Grid>
        </Grid>

        <Grid item container justify="space-evenly" xs={12}>
          <Grid item xs={4} className={classes.leftGridStyles}>
            <Paper elevation={5} className={classes.cursorStyle}>
              <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/location-infrastructure">
                <Grid item container xs={12} justify="center" className={classes.gridStyle1}>
                  Location Infrastructure Readiness
                </Grid>
                <Grid item container xs={12} justify="center" className={classes.gridStyle2}>
                  {maintainLocationNeedsAnalysisIcon}
                </Grid>
              </Paper>
            </Paper>
          </Grid>
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
                          {data.location}{' '}
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

        <Grid item container justify="space-evenly" xs={12}>
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

        <Grid item container justify="space-evenly" xs={12}>
          <Grid item xs={8} className={classes.rightGridStyles}>
            <Paper elevation={5} className={classes.cursorStyle}>
              <Paper elevation={0} style={{ textDecoration: 'none' }} component={Link} to="/rollout-progress-tracker">
                <Grid item container xs={12} justify="center" className={classes.gridStyle3}>
                  Rollout Progress Tracker
                </Grid>
                <Grid item container xs={12} justify="space-evenly" className={classes.gridStyle4}>
                  {dashboardData.rolloutProgressTracker.length > 0 ? (
                    dashboardData.rolloutProgressTracker.map((rollout, index) => (
                      <Grid key={index} item xs={2}>
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
          <Grid item xs={4} style={{ padding: '2%' }}>
            <Paper elevation={5} className={classes.cursorStyle}>
              <Paper elevation={0} style={{ textDecoration: 'none' }}>
                <Grid item container xs={12} justify="center" className={classes.gridStyle1}>
                  <Typography>iCAP Collaborate</Typography>
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
              <Paper elevation={0} style={{ textDecoration: 'none' }}>
                <Grid item container xs={12} justify="center" className={classes.gridStyle1}>
                  <Typography>Helpdesk Analysis</Typography>
                </Grid>
                <Grid item container xs={12} justify="center" className={classes.gridStyle2}>
                  {helpdeskAnalysisIcon}
                </Grid>
              </Paper>
            </Paper>
          </Grid>

          <Grid item xs={4} className={classes.leftGridStyles}>
            <Paper elevation={5} className={classes.cursorStyle}>
              <Paper elevation={0} style={{ textDecoration: 'none' }}>
                <Grid item container xs={12} justify="center" className={classes.gridStyle1}>
                  <Typography>Training Analysis</Typography>
                </Grid>
                <Grid item container xs={12} justify="center" className={classes.gridStyle2}>
                  {trainingAnalysisIcon}
                </Grid>
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default ICAPDashboard;
