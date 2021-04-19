import React, { useState, useEffect } from 'react';
import { Link as RouterLink, Redirect, withRouter, useLocation, useHistory, useRouteMatch } from 'react-router-dom';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Grid, Typography, Button, Menu, MenuItem, IconButton } from '@material-ui/core';
import SignIn from './SignIn';
import LandingArea from './LandingArea';
import ClientDashboard from '../Client/Dashboard';
import Capgemini_Logo from '../assets/Capgemini_Logo.svg';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon, AccountCircle } from '@material-ui/icons';
import { fetchAmbitionSettingAnswers } from '../common/API';
import ICAPLeaderShipDashboard from '../iCAP/ICAPLeaderShipDashboard';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexFlow: 'column',
    height: '100vh'
  },
  body: {
    display: 'flex',
    flexFlow: 'column',
    height: '100vh',
    overflow: 'auto'
  },
  logo: {
    display: 'flex',
    height: 70,
    marginRight: theme.spacing(2)
  },
  account: {
    color: '#0070ad'
  },
  icon: {
    marginTop: '12pt',
    marginBottom: '12pt',
    cursor: 'pointer',
    width: '5rem',
    height: '2rem'
  },
  toptobottombuttonroot: {
    position: 'fixed',
    top: theme.spacing(1),
    right: theme.spacing(1.5),
    rotate: '90deg',
    borderRadius: '5%',
    backgroundColor: '#70c1d4'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  change: {
    marginLeft: 'auto',
    marginRight: -12,
    padding: theme.spacing(1)
  },
  title: {
    flexGrow: 1,
    textAlign: 'center'
  },
  title1: {
    flexGrow: 0.75,
    textAlign: 'center'
  }
}));

function Dashboard(props) {
  const classes = useStyles();
  const { url } = useRouteMatch();

  const [isProgrammeUsers, setIsProgrammeUsers] = useState(Cookies.get('jwt') && Cookies.get('user'));
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const [title, setTitle] = useState('Capgemini Advisory Services Online');
  const [iconHome, setIconHome] = useState(true);
  const [iconBack, setIconBack] = useState(true);
  const [changeProject, setChangeProject] = useState(true);
  const location = useLocation();
  const history = useHistory();
  const [showScroll, setShowScroll] = useState(false);
  const [currentTaskStep, setCurrentTaskStep] = useState(0);
  const [interventionTracker, setInterventionTracker] = useState(null);
  const [ciaFilter, setCiaFilter] = useState(null);
  const [locInfraFilter, setLocInfraFilter] = useState(null);
  const [screen, setScreen] = useState('Admin');

  useEffect(() => {
    const userRole = Cookies.get('role');
    setIconHome(true);
    setIconBack(true);
    setChangeProject(false);

    if (location.pathname != '/ambition-setting') {
      Cookies.remove('ambitionSettingUser');
    }

    switch (location.pathname) {
      case '/':
        if (userRole === 'Capgemini Users') {
          //here/
          setIconHome(false);
          setTitle('Capgemini Advisory Services Online');
        }
        setIconBack(false);
        setTitle('Capgemini Advisory Services Online');
        break;
      case '/CapgeminiDashboard':
        setChangeProject(true);
        setIconBack(false);
        setTitle(Cookies.get('projectname'));
        break;
      case '/manage-users':
        setTitle('Manage Users');
        break;
      case '/ActivityOutput':
        setTitle('Activity Output');
        break;
      case '/manage-users/create':
        setTitle('Create New Users');
        break;
      case '/manage-users/edit':
        setTitle(' Edit User');
        break;
      case '/data-export':
        setTitle('Export Data');
        break;
      case '/location-infrastructure':
        setTitle('Location Infrastructure Readiness');
        break;
      case '/location-infrastructure-graphs':
        setTitle('Location Readiness Reports');
        break;
      case '/change-readiness-survey':
        setTitle('Change Readiness Survey');
        break;
      case '/maturity-model-assessment':
        setTitle('Maturity Model Workshop Page');
        break;
      case '/change-readiness-graphs':
        setTitle('Change Readiness Report');
        break;
      case '/design-thinking':
        setTitle('Design Thinking');
        break;
      case '/design-thinking-results':
        setTitle('Design Thinking Results');
        break;
      case '/CreateProject':
        setTitle('Create Project');
        break;
      case '/CreateProject/information':
        setTitle('Create Project');
        break;
      case '/change-impact-assessment-reports':
        setTitle('Change Impact Assessment Reports');
        break;
      case '/rollout-progress-tracker':
        setTitle('Design Rollout Progress Tracker');
        break;
      case '/ambition-setting-output':
        setTitle('Ambition Setting Output');
        break;
      case '/design-thinking-output':
        setTitle('Design Thinking Output');
        break;
      case '/other-engagements-form':
        setTitle('Other Engagements Form');
        break;
      case '/other-engagements-comments':
        setTitle('Other Engagements Review');
        break;
      case '/intervention-reports':
        setTitle('Intervention Reports');
        break;
      case '/training-analysis':
        setTitle('Training Analysis');
        break;
      case '/intervention-guides':
        setTitle('Intervention Guides Library');
        break;
      case '/change-journey':
        setTitle('Change Journey');
        break;
      case '/icap-dashboard':
        setTitle('iCAP Dashboard');
        break;
      default:
        setTitle('Capgemini Advisory Services Online');
    }
  }, [location]);

  const handleSignedIn = response => {
    Cookies.set('jwt', response.jwt);
    Cookies.set('user', response.user.id);
    Cookies.set('username', response.user.username);
    Cookies.set('role', response.user.role.name);
    Cookies.set('locale', response.user.locale);
    if (response.user.role.name !== 'Capgemini Users' && response.user.projects.length > 0) {
      //here/
      Cookies.set('project', response.user.projects[0].id);
    }
    setIsProgrammeUsers(true);
    if (response.user.role.name === 'Capgemini Users') {
      //here/
      setIconHome(false);
    }
  };

  const handleSignedOut = () => {
    Cookies.remove('jwt');
    Cookies.remove('user');
    Cookies.remove('username');
    Cookies.remove('role');
    Cookies.remove('project');
    Cookies.remove('locale');
    Cookies.remove('ambitionSettingUser');
    setMenuAnchorEl(null);
    setIsProgrammeUsers(false);
    setScreen('Admin');
  };

  const handleMenuOpen = event => {
    setMenuAnchorEl(event.currentTarget);
  };

  const homeIcon = () => {
    const userRole = Cookies.get('role');
    let path = '';
    setCurrentTaskStep(0);
    setScreen('Admin');

    if (userRole === 'Capgemini Users') {
      if (location.pathname === '/CreateProject' || location.pathname === '/CreateProject/information') {
        path = '';
      } else {
        path = 'CapgeminiDashboard';
      }
    }

    return props.history.push('/' + path);
  };

  const backIcon = () => {
    //history.goBack();
    if (currentTaskStep === 0) {
      history.goBack();
    } else {
      setCurrentTaskStep(currentTaskStep - 1);
    }
  };

  const renderDashboard = () => {
    const userRole = Cookies.get('role');

    if (userRole === 'Capgemini Users') {
      //here
      return (
        <LandingArea
          onMessage={props.onMessage}
          setTitle={setTitle}
          currentTaskStep={currentTaskStep}
          setCurrentTaskStep={setCurrentTaskStep}
          interventionTracker={interventionTracker}
          setInterventionTracker={setInterventionTracker}
          ciaFilter={ciaFilter}
          setCiaFilter={setCiaFilter}
          locInfraFilter={locInfraFilter}
          setLocInfraFilter={setLocInfraFilter}
          screen={screen}
          setScreen={setScreen}
        />
      );
    } else if (userRole === 'Leadership Team') {
      return (
        <ICAPLeaderShipDashboard
          onMessage={props.onMessage}
          setTitle={setTitle}
          interventionTracker={interventionTracker}
          setInterventionTracker={setInterventionTracker}
          ciaFilter={ciaFilter}
          setCiaFilter={setCiaFilter}
          locInfraFilter={locInfraFilter}
          setLocInfraFilter={setLocInfraFilter}
        />
      );
    } else {
      return (
        <ClientDashboard
          onMessage={props.onMessage}
          setTitle={setTitle}
          interventionTracker={interventionTracker}
          setInterventionTracker={setInterventionTracker}
          ciaFilter={ciaFilter}
          setCiaFilter={setCiaFilter}
          locInfraFilter={locInfraFilter}
          setLocInfraFilter={setLocInfraFilter}
        />
      );
    }
  };

  const handleClick = () => {
    var user = Cookies.get('user');
    Cookies.set('ambitionSettingUser', user);
    fetchAmbitionSettingAnswers(props.onMessage, user)
      .then(data => {
        if (data.length > 0) {
          history.push('/ambition-resultpage');
        } else {
          history.push('/ambition-setting');
        }
      })
      .catch(e => {
        props.onMessage(`Error: ${e}`, 'error');
      });
    setMenuAnchorEl(null);
  };

  function getTitle(title) {
    switch (title) {
      case '/profiles':
      case '/create-profile':
      case '/view-profile':
        return 'Profile Selection';
      default:
        return 'Capgemini Advisory Services Online';
    }
  }

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth', disableHysteresis: true, threshold: 100 });
  };
  window.addEventListener('scroll', checkScrollTop);

  return (
    <React.Fragment>
      <div className={classes.root}>
        <AppBar position="static" color="inherit">
          <Toolbar>
            <img src={Capgemini_Logo} alt="Capgemini Logo" className={classes.logo} />
            {isProgrammeUsers && iconBack ? (
              <>
                <ArrowBackIcon
                  color="primary"
                  className={classes.icon}
                  onClick={e => {
                    backIcon();
                  }}
                />
              </>
            ) : (
              <></>
            )}
            {isProgrammeUsers && iconHome ? (
              <>
                <HomeIcon
                  color="primary"
                  className={classes.icon}
                  onClick={e => {
                    homeIcon();
                  }}
                />
              </>
            ) : (
              <></>
            )}
            {changeProject ? (
              <Typography variant="h5" className={classes.title}>
                {title}
              </Typography>
            ) : (
              <Typography variant="h5" className={classes.title1}>
                {title}
              </Typography>
            )}

            <section className={classes.change}>
              {isProgrammeUsers && changeProject ? (
                <>
                  <Button color="primary" component={RouterLink} to={`${url}`}>
                    change project
                  </Button>
                </>
              ) : (
                <></>
              )}
            </section>
            <section className={classes.rightToolbar}>
              {isProgrammeUsers && (
                <div>
                  <Button
                    color="default"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    className={`${classes.menu} ${classes.account}`}
                    onClick={handleMenuOpen}
                    startIcon={<AccountCircle />}>
                    {Cookies.get('username')}
                  </Button>
                  <Menu
                    id="menu-appbar"
                    anchorEl={menuAnchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right'
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right'
                    }}
                    open={menuOpen}
                    onClose={() => setMenuAnchorEl(null)}>
                    {window.location.pathname === '/CapgeminiDashboard' ? (
                      <div>
                        <MenuItem onClick={e => handleClick()}>Ambition Setting</MenuItem>

                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/maturity-model-assessment">
                          Maturity Model Assessment
                        </MenuItem>
                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/maturity-model-assessment-readonly">
                          Maturity Model Results
                        </MenuItem>

                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/design-thinking">
                          Design Thinking
                        </MenuItem>

                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/design-thinking-results">
                          Design Thinking Results
                        </MenuItem>

                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/change-readiness-survey">
                          Change Readiness Survey
                        </MenuItem>
                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/rollout-progress-tracker">
                          Rollout Progress Tracker
                        </MenuItem>

                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/change-readiness-graphs">
                          Change Readiness Report
                        </MenuItem>

                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/interventions">
                          View Interventions
                        </MenuItem>

                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/intervention-reports">
                          Intervention Reports
                        </MenuItem>

                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/change-impact-assessment">
                          Change Impact Assessment
                        </MenuItem>
                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/change-impact-assessment-reports">
                          Change Impact Assessment Reports
                        </MenuItem>
                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/intervention-tracker">
                          Intervention Tracker
                        </MenuItem>

                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/programme-dashboard">
                          Programme Dashboard
                        </MenuItem>

                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/Business-change-plan">
                          Business Change Plan
                        </MenuItem>
                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/create-intervention">
                          Create Interventions
                        </MenuItem>
                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/intervention-guides">
                          Intervention Guides
                        </MenuItem>

                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/change-journey">
                          Change Journey
                        </MenuItem>
                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/other-engagements-form">
                          Other Engagement Forms
                        </MenuItem>
                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/other-engagements-comments">
                          Other Engagement Form Reviews
                        </MenuItem>

                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/training-analysis">
                          Training Analysis
                        </MenuItem>
                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/profile">
                          Persona
                        </MenuItem>

                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/location-infrastructure">
                          Location Infrastructure Readiness
                        </MenuItem>
                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/location-infrastructure-graphs">
                          Location Infrastructure Readiness Reports
                        </MenuItem>
                        <MenuItem onClick={() => setMenuAnchorEl(null)} component={RouterLink} to="/change-calendar">
                          Change Calendar
                        </MenuItem>
                      </div>
                    ) : null}
                    <MenuItem onClick={handleSignedOut} component={RouterLink} to="/">
                      Sign out
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </section>
          </Toolbar>
        </AppBar>
        <div className={classes.body}>
          {isProgrammeUsers ? renderDashboard() : [<SignIn onMessage={props.onMessage} onSignedIn={handleSignedIn} />, <Redirect from="*" to="/" />]}
        </div>
      </div>

      <Grid container style={{ display: showScroll ? 'flex' : 'none' }}>
        <Button variant="outlined" color="#4ea3c2" className="scrollTop" className={classes.toptobottombuttonroot} onClick={scrollTop}>
          To Top
        </Button>
      </Grid>
    </React.Fragment>
  );
}

export default withRouter(Dashboard);
