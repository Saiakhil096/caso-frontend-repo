import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Switch, Route, Link, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { amber } from '@material-ui/core/colors';
import {
  Table,
  TableHead,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Toolbar,
  Typography,
  IconButton
} from '@material-ui/core';
import { Star, StarBorder, Search } from '@material-ui/icons';
import { fetchProjects, updateProject } from '../common/API';
import Interventions from '../intervention/Interventions';
import MaturityModelAssessment from '../maturity-model-assessment/MaturityModelAssessment';
import DesignThinking from '../design-thinking/DesignThinking';
import CIAController from '../change-impact-assessment/CIAController';
import ViewUser from '../manage-users/ViewUser';
import ActivityOutput from '../activity-output/ActivityOutput';
import CreateUser from '../manage-users/CreateUser';
import DataExport from '../data-export/DataExport';

import CapgeminiDashboard from '../dashboard/CapgeminiDashboard';
import CreateProject from '../create-project/CreateProject';
import ChangeJourney from '../change-journey/ChangeJourney';
import LocationInfrastructure from '../location-infrastructure/LocationInfrastructure';
import LocationCharts from '../location-infrastructure/Charts/LocationCharts';
import ProfileController from '../profile/ProfileController';
import RolloutTracker from '../rollout-progress-tracker/RolloutTracker';
import UserController from '../manage-users/UserController';
import InterventionGuides from '../intervention-guides/InterventionGuides';
import ChangeReadinessSurvey from '../change-readiness-survey/ChangeReadinessSurvey';
import AmbitionSetting from '../AmbitionSetting/AmbitionSetting';
import ViewInterventions from '../intervention/ViewInterventions';
import TrainingAnalysis from '../training-analysis/TrainingAnalysis';
import EngagementsForm from '../other-engagements-form/EngagementForm';
import OutputScreen from '../other-engagements-form/OutputScreen';
import Charts from '../change-readiness-survey/Charts/Charts';
import InterventionReport from '../intervention-reports/InterventionReport';
import AmbitionSettingResultPage from '../AmbitionSetting/AmbitionSettingResultPage';
import AmbitionSettingOutput from '../ambition-setting-output/AmbitionSettingOutput';
import DesignThinkingOutput from '../design-thinking/design-thinking-output/DesignThinkingOutput';
import DesignThinkingResults from '../design-thinking/design-thinking-results/DesignThinkinResults';
import InterventionTracker from '../intervention/InterventionTracker';
import CIAreports from '../change-impact-assessment/change-impact-assesment-reports/CIAreports';
import ChangeCalendar from '../change-calendar/ChangeCalendar';
import BCPController from '../Business-change-plan/BCPController';

import ICAPDashboard from '../iCAP/ICAPDashboard';
import MaturityModelReadOnly from '../maturity-model-assessment-readonly/maturitymodel_readonly';
import MaturityModelOutput from '../maturity-summary-screen/maturity_summary_screen';
import ProgrammeDashboard from '../ProgrammeDashboard/ProgrammeDashboard';
import ProgrammeDashboardActivities from '../ProgrammeDashboard/ProgrammeDashboardActivities';

const useStyles = makeStyles(theme => ({
  title: {
    flex: '1 1 100%'
  },
  tableWrapper: {
    padding: theme.spacing(2),
    width: '100%',
    minWidth: '750px'
  },
  tableRow: {
    cursor: 'pointer'
  },
  favourite: {
    color: amber[500]
  },
  margin: {
    marginTop: theme.spacing(4)
  },
  paper: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3)
  }
}));

function LandingArea(props) {
  const classes = useStyles();
  const [cursor, setCursor] = useState();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [refreshProjects, setRefreshProjects] = useState(true);
  const [reProject, setReProject] = useState(false);
  const { onMessage } = props;

  useEffect(() => {
    if (refreshProjects || reProject) {
      fetchProjects(onMessage, true).then(data => {
        setProjects(data);
      });
      setRefreshProjects(false);
      setReProject(false);
    }
  }, [refreshProjects, reProject]);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const projectsCopy = JSON.parse(JSON.stringify(projects));
      const filteredProjects = projectsCopy.filter(
        project =>
          project.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          project.client.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          project.status.toLowerCase().indexOf(searchTerm.toLowerCase().replace(/ /g, '')) !== -1
      );
      setFilteredItems(filteredProjects);
    } else {
      setFilteredItems(projects);
    }
  }, [searchTerm, projects]);

  const handleClick = () => {
    Cookies.set('title', 'Create Project');
  };

  const TableToolbar = props => {
    return (
      <Toolbar>
        <Typography className={classes.title} variant="h6" id="tableTitle" component="h2">
          Projects
        </Typography>
        <TextField
          autoFocus
          value={searchTerm}
          onFocus={e => (e.target.selectionStart = cursor)}
          onChange={e => {
            setCursor(e.target.selectionStart);
            setSearchTerm(e.target.value);
          }}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            )
          }}
        />
      </Toolbar>
    );
  };

  const handleFavourite = (e, index) => {
    e.preventDefault();
    const userId = parseInt(Cookies.get('user'));
    const favourited_by = JSON.parse(JSON.stringify(projects[index].favourited_by));
    const favouritedIndex = favourited_by.findIndex(user => user.id === userId);
    if (favouritedIndex !== -1) {
      favourited_by.splice(favouritedIndex, 1);
    } else {
      favourited_by.push({ id: userId });
    }
    updateProject(projects[index].id, { favourited_by }, props.onMessage).then(() =>
      fetchProjects(props.onMessage, false).then(data => setProjects(data))
    );
  };

  const handleProjectClick = (e, index) => {
    Cookies.set('project', filteredItems[index].id);
    Cookies.set('client', filteredItems[index].client.name);
    Cookies.set('projectname', filteredItems[index].name);
  };

  const pageNotFound = () => {
    props.onMessage('404: Page Not Found', 'error');
    return <Redirect from="*" to="/" />;
  };

  return (
    <React.Fragment>
      <Switch>
        <Route path="/create-intervention">
          <Interventions onMessage={props.onMessage} setTitle={props.setTitle} />
        </Route>

        <Route path="/maturity-model-assessment">
          <MaturityModelAssessment onMessage={props.onMessage} />
        </Route>
        <Route path="/design-thinking">
          <DesignThinking onMessage={props.onMessage} />
        </Route>
        <Route path="/design-thinking-results">
          <DesignThinkingResults onMessage={props.onMessage} setTitle={props.setTitle} />
        </Route>
        <Route path="/interventions">
          <ViewInterventions onMessage={props.onMessage} />
        </Route>
        <Route path="/intervention-reports">
          <InterventionReport onMessage={props.onMessage} setTitle={props.setTitle} setInterventionTracker={props.setInterventionTracker} />
        </Route>
        <Route path="/change-readiness-graphs">
          <Charts onMessage={props.onMessage} />
        </Route>
        <Route path="/change-impact-assessment">
          <CIAController onMessage={props.onMessage} setTitle={props.setTitle} ciaFilter={props.ciaFilter} setCiaFilter={props.setCiaFilter} />
        </Route>
        <Route path="/Business-change-plan">
          <BCPController onMessage={props.onMessage} setTitle={props.setTitle} />
        </Route>

        <Route path="/change-impact-assessment-reports">
          <CIAreports onMessage={props.onMessage} setTitle={props.setTitle} setCiaFilter={props.setCiaFilter} />
        </Route>
        <Route path="/change-calendar">
          <ChangeCalendar onMessage={props.onMessage} setTitle={props.setTitle} />
        </Route>
        <Route path="/change-readiness-survey">
          <ChangeReadinessSurvey onMessage={props.onMessage} />
        </Route>
        <Route path="/ViewUser">
          <ViewUser onMessage={props.onMessage} />
        </Route>

        <Route path="/create-user">
          <CreateUser onMessage={props.onMessage} />
        </Route>
        <Route path="/training-analysis">
          <TrainingAnalysis onMessage={props.onMessage} setTitle={props.setTitle} />
        </Route>
        <Route path="/maturity-model-assessment-readonly">
          <MaturityModelReadOnly onMessage={props.onMessage} setTitle={props.setTitle} />
        </Route>
        <Route path="/profile">
          <ProfileController onMessage={props.onMessage} setTitle={props.setTitle} />
        </Route>
        <Route path="/maturity-model-assessment-output">
          <MaturityModelOutput onMessage={props.onMessage} setTitle={props.setTitle} />
        </Route>

        <Route path="/intervention-tracker">
          <InterventionTracker
            onMessage={props.onMessage}
            setTitle={props.setTitle}
            interventionTracker={props.interventionTracker}
            setInterventionTracker={props.setInterventionTracker}
          />
        </Route>

        <Route path="/programme-dashboard">
          <ProgrammeDashboard onMessage={props.onMessage} setTitle={props.setTitle} />
        </Route>

        <Route path="/programme-dashboard-activities/:category">
          <ProgrammeDashboardActivities onMessage={props.onMessage} setTitle={props.setTitle} />
        </Route>

        <Route path="/icap-dashboard">
          <ICAPDashboard onMessage={props.onMessage} />
        </Route>
        <Route exact path="/">
          <Grid container justify="center" className={classes.margin}>
            <Grid item>
              <Grid item container justify="flex-end">
                <Button variant="contained" component={Link} onClick={e => handleClick()} color="primary" to="/CreateProject">
                  Create New
                </Button>
              </Grid>
              <Paper className={classes.paper}>
                <TableToolbar />
                <TableContainer component={Paper} className={classes.tableWrapper}>
                  <Table size="small" aria-label="projects table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="right">Project Id</TableCell>
                        <TableCell>Client</TableCell>
                        <TableCell>Project Name</TableCell>
                        <TableCell align="right">Members</TableCell>
                        <TableCell align="center">Status</TableCell>
                        <TableCell align="center">Favourite</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody data-testid="tbody-element">
                      {filteredItems.length < 1 ? (
                        <TableRow style={{ height: '50px' }} className={classes.tableRow} hover>
                          <TableCell colSpan={6} align="center">
                            No result found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredItems.map((project, index) => (
                          <TableRow
                            key={project.id}
                            className={classes.tableRow}
                            hover
                            component={Link}
                            to="/CapgeminiDashboard"
                            onClick={e => handleProjectClick(e, index)}>
                            <TableCell component="th" scope="row" align="right">
                              {project.id}
                            </TableCell>
                            <TableCell>{project.client.name}</TableCell>
                            <TableCell>{project.name}</TableCell>
                            <TableCell align="right">{project.members.length}</TableCell>
                            <TableCell align="center">
                              {project.status === 'completed' ? 'Completed' : project.status === 'inprogress' ? 'In Progress' : 'Not Started'}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton aria-label="favourite" className={classes.favourite} onClick={e => handleFavourite(e, index)}>
                                {project.favourited_by.find(user => user.id === parseInt(Cookies.get('user'))) ? <Star /> : <StarBorder />}
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Route>
        <Route path="/CapgeminiDashboard">
          <CapgeminiDashboard onMessage={props.onMessage} setTitle={props.setTitle} screen={props.screen} setScreen={props.setScreen} />
        </Route>
        <Route path="/other-engagements-comments">
          <OutputScreen onMessage={props.onMessage} />
        </Route>
        <Route path="/CreateProject">
          <CreateProject
            onMessage={props.onMessage}
            setRefreshProjects={val => setRefreshProjects(val)}
            setTitle={props.setTitle}
            currentTaskStep={props.currentTaskStep}
            setCurrentTaskStep={props.setCurrentTaskStep}
          />
        </Route>
        <Route path="/change-journey/:id">
          <ChangeJourney onMessage={props.onMessage} />
        </Route>
        <Route path="/change-journey">
          <ChangeJourney onMessage={props.onMessage} />
        </Route>
        <Route path="/rollout-progress-tracker">
          <RolloutTracker onMessage={props.onMessage} />
        </Route>
        <Route path="/ambition-setting-output">
          <AmbitionSettingOutput onMessage={props.onMessage} />
        </Route>
        <Route path="/design-thinking-output">
          <DesignThinkingOutput onMessage={props.onMessage} />
        </Route>
        <Route path="/location-infrastructure">
          <LocationInfrastructure onMessage={props.onMessage} locInfraFilter={props.locInfraFilter} setLocInfraFilter={props.setLocInfraFilter} />
        </Route>
        <Route path="/location-infrastructure-graphs">
          <LocationCharts onMessage={props.onMessage} setLocInfraFilter={props.setLocInfraFilter} />
        </Route>
        <Route path="/data-export">
          <DataExport onMessage={props.onMessage} />
        </Route>

        <Route path="/intervention-guides">
          <InterventionGuides onMessage={props.onMessage} />
        </Route>
        <Route path="/view-project">
          <CreateProject
            onMessage={props.onMessage}
            for={'edit'}
            setReProject={setReProject}
            reProject={reProject}
            setRefreshProjects={val => setRefreshProjects(val)}
            setTitle={props.setTitle}
            currentTaskStep={props.currentTaskStep}
            setCurrentTaskStep={props.setCurrentTaskStep}
          />
        </Route>
        <Route path="/other-engagements-form">
          <EngagementsForm onMessage={props.onMessage} />
        </Route>
        <Route path="/manage-users">
          <UserController onMessage={props.onMessage} />
        </Route>
        <Route path="/ActivityOutput">
          <ActivityOutput onMessage={props.onMessage} />
        </Route>
        <Route path="/ambition-setting">
          <AmbitionSetting
            onMessage={props.onMessage}
            user={Cookies.get('ambitionSettingUser') ? Cookies.get('ambitionSettingUser') : Cookies.get('user')}
          />
        </Route>
        <Route path="/ambition-resultpage">
          <AmbitionSettingResultPage onMessage={props.onMessage} user={Cookies.get('user')} project={Cookies.get('project')} />
        </Route>
        <Route path="*" exact={true} component={pageNotFound} />
      </Switch>
    </React.Fragment>
  );
}
export default LandingArea;
