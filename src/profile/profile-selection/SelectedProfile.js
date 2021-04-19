import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink, useParams, useRouteMatch } from 'react-router-dom';
import { Grid, Box, Paper, Typography, AppBar, Tab, Tabs, Button, CircularProgress, Backdrop } from '@material-ui/core';
import { AccountCircleOutlined as AccountCircleOutlinedIcon } from '@material-ui/icons';
import GeneralProfile from './GeneralProfile';
import PerceptionProfile from './PerceptionProfile';
import ProjectSummary from './ProjectSummary';
import { fetchPersona } from '../../common/API';
import PdfGenerator from './PdfGenerator';

const useStyles = makeStyles(theme => ({
  leftPaperStyles: {
    background: 'none',
    width: '100%',
    margin: theme.spacing(5, 'auto'),
    padding: theme.spacing(2)
  },
  rightPaperStyles: {
    background: 'none',
    width: '100%',
    margin: theme.spacing(5, 'auto')
  },
  profileIcon: {
    width: '8rem',
    height: 'auto',
    display: 'block',
    margin: '1rem auto',
    color: '#0070ad'
  },
  disabled: {
    color: theme.palette.text.disabled
  },
  tabStyles: {
    background: 'none',
    width: '100%',
    margin: theme.spacing(5, 'auto'),
    padding: theme.spacing(2)
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`} {...other}>
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function SelectedProfile(props) {
  const classes = useStyles();
  const { onMessage } = props;
  const { url } = useRouteMatch();
  const [tabIndex, setTabIndex] = useState(0);
  const [projectId, setProjectId] = useState();
  const [profileData, setProfileData] = useState({
    id: null,
    persona_job_role: {
      job_role: ''
    },
    grades: [],
    key_skills: [],
    system_accesses: [],
    key_locations: [],
    key_motivations: [],
    work_environment: '',
    access_to_corporate_wifi: '',
    licence_to_operate: '',
    licence_to_operate_confidence_level: 0
  });
  const [painpointsData, setPainPointsData] = useState([]);
  const [overallPerceptionRating, setOverallPerceptionRating] = useState(null);
  const [loader, setLoader] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    fetchPersona(id, onMessage).then(data => {
      setProfileData(data);
      setProjectId(data.project.id);
      let ratingValues = [];
      var output = data.PainPoints.reduce(function (acc, cur) {
        // Get the index of the key-value pair.
        if (cur.type === 'Things That Don’t Work For Me') {
          ratingValues.push(cur.rating);
        }
        var occurs = acc.reduce(function (n, item, i) {
          return item.contract_stage === cur.contract_stage ? i : n;
        }, -1);

        // If the l_2_process.title is found,
        if (occurs >= 0) {
          // append the current value to its list of values.
          var obj = {
            reason: cur.reason,
            rating: cur.rating
          };
          if (cur.type === 'Things That Don’t Work For Me') {
            acc[occurs].painpointsThatDontWorkForMe.push(obj);
          } else {
            acc[occurs].painpointsINeed.push(obj);
          }

          // Otherwise,
        } else {
          // add the current item to acc (but make sure the value is an array).

          if (cur.type === 'Things That Don’t Work For Me') {
            var obj = {
              contract_stage: cur.contract_stage,
              painpointsThatDontWorkForMe: [{ reason: cur.reason, rating: cur.rating }],
              painpointsINeed: []
            };
            acc = acc.concat([obj]);
          } else {
            var obj = {
              contract_stage: cur.contract_stage,
              painpointsThatDontWorkForMe: [],
              painpointsINeed: [{ reason: cur.reason, rating: cur.rating }]
            };
            acc = acc.concat([obj]);
          }
        }
        return acc;
      }, []);
      let average = null;
      if (ratingValues.length > 0) {
        average = ratingValues.reduce((a, b) => a + b) / ratingValues.length;
        setOverallPerceptionRating(Math.round(average));
      }
      setPainPointsData(output);

      setLoader(false);
      props.setTitle(data.persona_job_role.job_role + ' Persona');
    });
  }, []);

  const handleTabIndexChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleDownloadPersona = () => {
    PdfGenerator(profileData, painpointsData, overallPerceptionRating);
  };

  return loader ? (
    <Backdrop open={loader}>
      <CircularProgress color="inherit" />
    </Backdrop>
  ) : (
    <Grid container item xs={12}>
      <Grid item xs={3}>
        <Box ml={3} mr={2}>
          <Paper elevation={10} className={classes.leftPaperStyles}>
            <Grid item>
              <AccountCircleOutlinedIcon className={classes.profileIcon} />
            </Grid>
            <Grid item container xs={12} spacing={4} style={{ padding: 10 }}>
              <Grid item xs={12}>
                <Typography className={classes.disabled}>Name</Typography>
                <Typography>{profileData.profile_name}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography className={classes.disabled}>Persona Job Role</Typography>
                <Typography>{profileData.persona_job_role.job_role}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography className={classes.disabled}>No. of Employees in Role</Typography>
                <Typography>{profileData.number_of_employees_in_role}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography className={classes.disabled}>Typical Grade</Typography>
                <Typography>
                  {profileData.grades.map((grade, index) => {
                    return profileData.grades.length - 1 !== index ? grade.grade_title + '-' : grade.grade_title;
                  })}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
        <Grid container item xs={12} spacing={2}>
          <Grid item xs={12}>
            <Box ml={3}>
              <Button data-testid="create-new" fullWidth variant="contained" color="primary" component={RouterLink} to={`${url}/edit-persona/`}>
                EDIT PERSONA
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box ml={3}>
              <Button data-testid="create-new" fullWidth variant="contained" color="primary" onClick={handleDownloadPersona}>
                DOWNLOAD PERSONA
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={9}>
        <Box ml={2} mr={3}>
          <Paper elevation={10} className={classes.rightPaperStyles}>
            <AppBar position="static" color="default" style={{ paddingTop: '10px' }}>
              <Tabs value={tabIndex} onChange={handleTabIndexChange} indicatorColor="primary" textColor="primary">
                <Tab label="General" />
                <Tab label="Perception and Opportunities" />
                <Tab label="Persona Summary" />
              </Tabs>
            </AppBar>
            <Box style={{ padding: 10 }}>
              <TabPanel value={tabIndex} index={0}>
                <GeneralProfile profileData={profileData} overallPerceptionRating={overallPerceptionRating} />
              </TabPanel>
              <TabPanel value={tabIndex} index={1}>
                <PerceptionProfile painpointsData={painpointsData} />
              </TabPanel>
              <TabPanel value={tabIndex} index={2}>
                <ProjectSummary
                  personaId={profileData.id}
                  personaJobRoleId={profileData.persona_job_role.id}
                  projectId={projectId}
                  onMessage={onMessage}
                />
              </TabPanel>
            </Box>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
}

export default SelectedProfile;
