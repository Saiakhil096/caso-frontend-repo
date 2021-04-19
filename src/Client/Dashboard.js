import React, { useState, useEffect } from 'react';
import { Link, Route, Switch, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardActions, Button, Grid, Typography, Box, IconButton, Paper } from '@material-ui/core';
import { Close as CloseIcon, Info as InfoIcon } from '@material-ui/icons';
import {
  QuestionnaireIcon,
  MaturityModelAssessmentIcon,
  DesignThinkingIcon,
  ICAPBannerIcon,
  NumberDisplayVividBlueIcon
} from '../common/CustomIcons';
import MaturityModelAssessment from '../maturity-model-assessment/MaturityModelAssessment';
import DesignThinking from '../design-thinking/DesignThinking';
import Interventions from '../intervention/Interventions';
import LocationInfrastructure from '../location-infrastructure/LocationInfrastructure';
import InterventionGuides from '../intervention-guides/InterventionGuides';
import AmbitionSetting from '../AmbitionSetting/AmbitionSetting';
import AmbitionSettingResultPage from '../AmbitionSetting/AmbitionSettingResultPage';
import MaturityModelReadOnly from '../maturity-model-assessment-readonly/maturitymodel_readonly';
import { fetchUser, updateUser, fetchCategories, fetchCategoriesReports } from '../common/API';
import EngagementsForm from '../other-engagements-form/EngagementForm';
import { renderToStaticMarkup } from 'react-dom/server';
import ICAPDashboard from '../iCAP/ICAPDashboard';
import CIAController from '../change-impact-assessment/CIAController';
import ProfileController from '../profile/ProfileController';
import InterventionTracker from '../intervention/InterventionTracker';
import ChangeJourney from '../change-journey/ChangeJourney';
import TrainingAnalysis from '../training-analysis/TrainingAnalysis';
import ChangeReadinessSurvey from '../change-readiness-survey/ChangeReadinessSurvey';
import CIAreports from '../change-impact-assessment/change-impact-assesment-reports/CIAreports';
import ChangeCalendar from '../change-calendar/ChangeCalendar';
import Charts from '../change-readiness-survey/Charts/Charts';
import LocationCharts from '../location-infrastructure/Charts/LocationCharts';
import OutputScreen from '../other-engagements-form/OutputScreen';
import RolloutTracker from '../rollout-progress-tracker/RolloutTracker';
import InterventionReport from '../intervention-reports/InterventionReport';
import DesignThinkingResults from '../design-thinking/design-thinking-results/DesignThinkinResults';
import BCPController from '../Business-change-plan/BCPController';
import ProgrammeDashboard from '../ProgrammeDashboard/ProgrammeDashboard';

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
    marginTop: theme.spacing(1),
    marginLeft: '1px',
    marginBottom: theme.spacing(1),
    maxWidth: '23rem'
  },
  icon: {
    width: '8rem',
    height: 'auto',
    display: 'block',
    margin: '1rem'
  },
  paperStyles: {
    width: '95%',
    margin: 'auto'
  },
  label: {
    marginTop: '-48px',
    marginLeft: '28px',
    alignSelf: 'flex-start'
  }
}));

function Dashboard(props) {
  const classes = useStyles();
  const userRole = Cookies.get('role');
  const [messageBar, setMessageBar] = useState('');
  const [ambitionSettingStatus, setAmbitionSettingStatus] = useState();
  const [maturityModelStatus, setMaturityModelStatus] = useState();
  const [designThinkingStatus, setDesignThinkingStatus] = useState();
  const [categoryList, setCategoryList] = useState([{ id: 'Overall View', category: 'Overall View', count: 0 }]);
  const [resultDataList, setResultDataList] = useState([{ category: 'Overall View', count: 0 }]);
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const project = Cookies.get('project');

  const Banner = encodeURIComponent(renderToStaticMarkup(<ICAPBannerIcon className={classes.icon} />));

  useEffect(() => {
    var user = Cookies.get('user');
    fetchUser(props.onMessage, user)
      .then(data => {
        setUserData(data);
        data.ambition_setting.map((item, index) => {
          if (project === String(item.project.id)) {
            setAmbitionSettingStatus(item.status);
          }
        });
        data.maturity_model.map((item, index) => {
          if (project === String(item.project.id)) {
            setMaturityModelStatus(item.status);
          }
        });
        data.design_thinking.map((item, index) => {
          if (project === String(item.project.id)) {
            setDesignThinkingStatus(item.status);
          }
        });
      })
      .catch(e => {
        props.onMessage(`Error: ${e}`, 'error');
      });
  }, [location]);

  useEffect(() => {
    const x = [];
    fetchCategories(props.onMessage, Cookies.get('project'))
      .then(categories => {
        categoryList.push({ id: 'Business Change', category: 'Business Change', count: 0 });
        categories.map((item, index) => {
          item.count = 0;
          categoryList.push(item);
        });

        categoryList.map(category => {
          fetchCategoriesReports(props.onMessage, category.id).then(data => {
            category.count = data.activityCount;
          });
        });
        setLoading(false);
      })
      .catch(e => props.onMessage(e, 'Error'));
  }, []);

  const updateUserStatus = (e, item) => {
    if (item.id === 'ambition-setting' && item.status != 'completed') {
      var data1 = null;
      userData.ambition_setting.map((item, index) => {
        if (project === String(item.project.id)) {
          userData.ambition_setting[index].status = 'inprogress';
          data1 = userData;
        }
      });
      if (data1 === null) {
        userData.ambition_setting.push({ project: project, status: 'inprogress' });
        data1 = userData;
      }
      updateUser(Cookies.get('user'), data1, props.onMessage)
        .then()
        .catch(e => {
          props.onMessage(`Error: ${e}`, 'error');
        });
    }
    if (item.id === 'maturity-model-assessment' && item.status != 'completed') {
      var data = null;
      userData.maturity_model.map((item, index) => {
        if (project === String(item.project.id)) {
          userData.maturity_model[index].status = 'inprogress';
          data = userData;
        }
      });
      if (data === null) {
        userData.maturity_model.push({ project: project, status: 'inprogress' });
        data = userData;
      }
      updateUser(Cookies.get('user'), data, props.onMessage)
        .then()
        .catch(e => {
          props.onMessage(`Error: ${e}`, 'error');
        });
    }
    if (item.id === 'design-thinking' && item.status != 'completed') {
      var data = null;
      userData.design_thinking.map((item, index) => {
        if (project === String(item.project.id)) {
          userData.design_thinking[index].status = 'inprogress';
          data = userData;
        }
      });
      if (data === null) {
        userData.design_thinking.push({ project: project, status: 'inprogress' });
        data = userData;
      }
      updateUser(Cookies.get('user'), data, props.onMessage)
        .then()
        .catch(e => {
          props.onMessage(`Error: ${e}`, 'error');
        });
    }
  };

  const renderMessageBar = () => {
    return messageBar.length > 0 ? (
      <Box className={classes.box} color="textSecondary">
        <IconButton>
          <InfoIcon color="primary" />
        </IconButton>
        {messageBar}
        <IconButton>
          <CloseIcon color="primary" />
        </IconButton>
      </Box>
    ) : null;
  };

  const renderCards = () => {
    const cards = [
      {
        id: 'ambition-setting',
        title: 'Ambition Setting',
        description: "First things first, Let's get to know more about you and your business.",
        route: ambitionSettingStatus != 'completed' ? '/ambition-setting' : '/ambition-resultpage',
        status: ambitionSettingStatus,
        disabled: false
      },
      {
        id: 'maturity-model-assessment',
        title: 'Maturity Model Assessment',
        description: 'Help us identify your current position and the maturity of your business.',
        disabled: false,
        status: maturityModelStatus,
        route: maturityModelStatus != 'completed' ? '/maturity-model-assessment' : '/maturity-model-assessment-readonly'
      },
      {
        id: 'design-thinking',
        title: 'Design Thinking',
        description: 'Lets get creative and collect some ideas on how to get to your target maturity.',
        disabled: maturityModelStatus != 'completed' ? true : false,
        status: designThinkingStatus,
        route: designThinkingStatus != 'completed' ? '/design-thinking' : '/design-thinking-results'
      }
    ];

    return cards.map((activity, index) => {
      var icon;
      switch (index) {
        case 0:
          icon = <QuestionnaireIcon className={classes.icon} />;
          break;
        case 1:
          icon = <MaturityModelAssessmentIcon className={classes.icon} />;
          break;
        case 2:
        default:
          icon = <DesignThinkingIcon className={classes.icon} />;
          break;
      }

      const button = (
        <Button
          variant="contained"
          fullWidth
          color="primary"
          disabled={activity.disabled}
          component={Link}
          to={activity.route}
          onClick={e => updateUserStatus(e, activity)}>
          {activity.status === 'completed' ? 'Yay Completed!' : activity.status === 'inprogress' ? 'Resume Activity' : 'Start Activity'}
        </Button>
      );

      return (
        <Grid item xs={4} component={Card} className={classes.gridItem} data-testid={`card-${index}`} key={`card-${index}`}>
          <CardContent>
            {icon}
            <Typography gutterBottom variant="h5" align="center" component="h2" color="textSecondary" style={{ fontWeight: 800 }}>
              {`${index + 1}. ${activity.title}`}
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center" component="p">
              {activity.description}
            </Typography>
          </CardContent>
          <CardActions>{button}</CardActions>
        </Grid>
      );
    });
  };

  const renderTiles = () => {
    if (loading) {
    } else {
      return (
        <React.Fragment>
          {renderMessageBar()}
          <Grid item xs={12} style={{ padding: '2.5%' }}>
            <Paper component="div" elevation={5} style={{ padding: '0.5%' }} align="center">
              <Grid item container xs={12} justify="center" style={{ padding: '1%', paddingBottom: '1%' }}>
                <Typography color="textSecondary" style={{ fontWeight: 800 }}>
                  Advisory Activities
                </Typography>
              </Grid>
              <Grid container direction="row" justify="space-evenly">
                {renderCards()}
              </Grid>
            </Paper>
          </Grid>
          {userRole === 'Basic User' ? null : (
            <React.Fragment>
              <Paper
                component="div"
                elevation={5}
                className={classes.paperStyles}
                style={{
                  backgroundImage: `url('data:image/svg+xml;utf8, ${Banner}')`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover'
                }}>
                <Grid item container xs={12}>
                  <Grid item container xs={8} style={{ paddingLeft: '12%', paddingTop: '8%', paddingBottom: '8%' }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      align="center"
                      component="h2"
                      color="textSecondary"
                      style={{ fontWeight: 800, fontSize: '2.0rem' }}>
                      CHANGE ADOPTION PLATFORM
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      A complete Change Management Solution to help you accelerate the pace of change and increase adoption, to enable you to extract
                      the maximum value of your transformation create the employee experience, understand the change, evaluate change readiness and
                      create tailored change journeys all through iCAP's novel persona based approach.
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    container
                    xs={4}
                    justify="center"
                    alignItems="center"
                    style={{ paddingTop: '7%', paddingRight: '11%', paddingBottom: '7%' }}>
                    <Button variant="contained" color="primary" size="large" component={Link} to="/icap-dashboard">
                      Open iCAP Dashboard
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
              {userRole == 'Programme Users' || userRole == 'Capgemini Users' ? (
                <React.Fragment>
                  <Grid
                    item
                    container
                    xs={12}
                    style={{ padding: '2%', paddingLeft: '2.5%', paddingRight: '2.5%', textDecoration: 'none' }}
                    component={Link}
                    to="/programme-dashboard">
                    <Paper elevation={5} style={{ width: '100%' }}>
                      <Grid item container xs={12} justify="center" style={{ padding: '1%', paddingLeft: 30, paddingBottom: 0 }}>
                        <Typography color="textSecondary" style={{ fontWeight: 800 }}>
                          Programme Dashboard
                        </Typography>
                      </Grid>

                      <Grid item container xs={12} justify="space-evenly" style={{ padding: '2%', paddingBottom: 0 }}>
                        {categoryList.map((result, index) => (
                          <Grid key={index} item container xs={1}>
                            <NumberDisplayVividBlueIcon className={classes.icon} value={result.count} />
                            <Typography className={classes.label} variant="body1" style={{ paddingBottom: 8 }}>
                              {result.category}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </Grid>
                </React.Fragment>
              ) : null}
            </React.Fragment>
          )}
        </React.Fragment>
      );
    }
  };

  return (
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
      <Route path="/maturity-model-assessment-readonly">
        <MaturityModelReadOnly onMessage={props.onMessage} setTitle={props.setTitle} />
      </Route>
      <Route path="/design-thinking">
        <DesignThinking onMessage={props.onMessage} />
      </Route>
      <Route path="/design-thinking-results">
        <DesignThinkingResults onMessage={props.onMessage} />
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
      <Route path="/Business-change-plan">
        <BCPController onMessage={props.onMessage} setTitle={props.setTitle} />
      </Route>
      <Route path="/icap-dashboard">
        <ICAPDashboard onMessage={props.onMessage} />
      </Route>
      <Route path="/change-impact-assessment-reports">
        <CIAreports onMessage={props.onMessage} setTitle={props.setTitle} setCiaFilter={props.setCiaFilter} />
      </Route>
      <Route path="/programme-dashboard">
        <ProgrammeDashboard onMessage={props.onMessage} setTitle={props.setTitle} />
      </Route>
      <Route path="/change-calendar">
        <ChangeCalendar onMessage={props.onMessage} setTitle={props.setTitle} />
      </Route>
      <Route path="/change-readiness-graphs">
        <Charts onMessage={props.onMessage} />
      </Route>
      <Route path="/location-infrastructure-graphs">
        <LocationCharts onMessage={props.onMessage} setLocInfraFilter={props.setLocInfraFilter} />
      </Route>
      <Route path="/other-engagements-comments">
        <OutputScreen onMessage={props.onMessage} />
      </Route>
      <Route path="/rollout-progress-tracker">
        <RolloutTracker onMessage={props.onMessage} />
      </Route>
      <Route path="/intervention-reports">
        <InterventionReport onMessage={props.onMessage} setTitle={props.setTitle} setInterventionTracker={props.setInterventionTracker} />
      </Route>
      <Route exact path="/CapgeminiDashboard">
        {renderTiles()}
      </Route>
      <Route exact path="/">
        <Grid className={classes.root}>{renderTiles()}</Grid>
      </Route>
    </Switch>
  );
}

export default Dashboard;
