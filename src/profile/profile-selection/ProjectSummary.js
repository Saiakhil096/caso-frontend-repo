import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Box, Paper, Typography, Button, Backdrop, CircularProgress } from '@material-ui/core';
import { ArrowForward as ArrowForwardIcon } from '@material-ui/icons';
import {
  fetchPersonaSpecificTrainings,
  fetchPersonaSpecificCIAs,
  fetchPersonaSpecificInterventions,
  fetchChangeReadinessScore,
  fetchTrainingGroups
} from '../../common/API';
import TableView from './TableView';
import ReactSpeedometer from 'react-d3-speedometer';
import GroupIcon from './GroupIcon';

const useStyles = makeStyles(theme => ({
  disabled: {
    color: theme.palette.text.disabled
  },
  trainingPaperStyles: {
    background: 'none',
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(2),
      width: theme.spacing(32),
      padding: '10px 5px',
      '&.MuiPaper-outlined': {
        border: '2px solid rgba(0, 0, 0, 0.12)'
      }
    }
  },
  buttonStyles: {
    '&.MuiButton-root': {
      textTransform: 'inherit'
    },
    paddingTop: 0
  }
}));

function ProjectSummary(props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [trainingGroups, setTrainingGroups] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [personaSpecificCIAs, setPersonaSpecificCIAs] = useState([]);
  const [personaSpecificCJIs, setPersonaSpecificCJIs] = useState([]);
  const [changeReadinesScore, setChangeReadinesScore] = useState(0);
  const ciaHeadCells = [
    { id: 'id', float: 'left', label: 'Id', minWidth: 50 },
    { id: 'workshop_name', float: 'left', label: 'Workshop Name', minWidth: 190 },
    { id: 'l_2_process.title', float: 'left', label: 'L2 Process', minWidth: 150 },
    { id: 'l_3_process.title', float: 'left', label: 'L3 Process', minWidth: 150 },
    { id: 'as_is', float: 'left', label: 'As Is', minWidth: 230 },
    { id: 'to_be', float: 'left', label: 'To Be', minWidth: 230 },
    {
      id: 'business_change_impact',
      float: 'left',

      label: 'Business Change Impact',
      minWidth: 250
    }
  ];

  const cjiHeadCells = [
    { id: 'id', float: 'left', label: 'Id', minWidth: 50 },
    { id: 'SectionHeader', float: 'left', label: 'Section', minWidth: 170 },
    { id: 'release_category.category', float: 'left', label: 'Release', minWidth: 150 },
    { id: 'name', float: 'left', label: 'Name', minWidth: 230 },
    { id: 'Intent', float: 'left', label: 'Intent', minWidth: 220 }
  ];

  useEffect(() => {
    Promise.all([
      fetchPersonaSpecificTrainings(props.personaId, props.projectId, props.onMessage),
      fetchPersonaSpecificCIAs(props.personaId, props.projectId, props.onMessage),
      fetchPersonaSpecificInterventions(props.personaJobRoleId, props.projectId, props.onMessage),
      fetchChangeReadinessScore(props.personaJobRoleId, props.projectId, props.onMessage),
      fetchTrainingGroups(props.onMessage)
    ])
      .then(([trainings, cias, interventions, readinessScore, trainingGroups]) => {
        if (trainings.length > 0) {
          setTrainings(trainings[0].trainings);
        }
        setPersonaSpecificCIAs(cias);
        setPersonaSpecificCJIs(interventions);
        setChangeReadinesScore(readinessScore);
        setTrainingGroups(trainingGroups);

        setLoading(false);
      })
      .catch(err => props.onMessage(err, 'error'));
  }, []);

  const renderTrainingGroupIcon = training => {
    const groupFound = trainingGroups.find(group => {
      return group.id == training.training_group;
    });
    return <GroupIcon icon={groupFound.group_icon} className={classes.margin} />;
  };

  if (loading) {
    return (
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else {
    return (
      <React.Fragment>
        <Grid container item xs={12} spacing={2}>
          <Grid container item xs={12} spacing={1}>
            <Grid item xs={12}>
              <Typography className={classes.disabled}>Training Analysis</Typography>
            </Grid>
            {trainings.length > 0 ? (
              <Grid item xs={12} className={classes.trainingPaperStyles}>
                {trainings.map((training, index) => {
                  return (
                    <Paper key={index} elevation={2} variant="outlined">
                      <Grid direction="column" container justify="center">
                        <Typography variant="subtitle1" style={{ margin: 'auto' }}>
                          {training.training_name}
                        </Typography>
                        <Typography variant="body2" style={{ margin: 'auto' }}>
                          {training.training_description}
                        </Typography>
                        {renderTrainingGroupIcon(training)}
                      </Grid>
                    </Paper>
                  );
                })}
              </Grid>
            ) : (
              <Grid container item xs={12} justify="center">
                No Trainings to display
              </Grid>
            )}

            <Grid item container xs={12} justify="flex-end">
              <Box mr={2}>
                <Button
                  className={classes.buttonStyles}
                  color="primary"
                  size="large"
                  endIcon={<ArrowForwardIcon size="medium" />}
                  component={RouterLink}
                  to="/training-analysis">
                  Training Analysis App
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12}>
              <Typography className={classes.disabled}>Business Change Impact Assessments</Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper>
                <TableView data={personaSpecificCIAs} viewType="CIAs" headCells={ciaHeadCells} />
              </Paper>
            </Grid>
            <Grid item container xs={12} justify="flex-end">
              <Button
                className={classes.buttonStyles}
                color="primary"
                size="large"
                endIcon={<ArrowForwardIcon size="medium" />}
                component={RouterLink}
                to="/change-impact-assessment">
                Change Impact Assessments App
              </Button>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12}>
              <Typography className={classes.disabled}>Change Journey Interventions</Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper>
                <TableView data={personaSpecificCJIs} viewType="interventions" headCells={cjiHeadCells} />
              </Paper>
            </Grid>
            <Grid item container xs={12} justify="flex-end">
              <Button
                className={classes.buttonStyles}
                color="primary"
                size="large"
                component={RouterLink}
                to={`/change-journey/${props.personaJobRoleId}`}
                endIcon={<ArrowForwardIcon size="medium" />}>
                Change Journey Interventions App
              </Button>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12}>
              <Typography className={classes.disabled}>Employee Change Readiness Score</Typography>
            </Grid>
            <Grid item xs={12} container justify="center">
              <ReactSpeedometer
                width={500}
                needleHeightRatio={0.8}
                maxValue={5}
                value={changeReadinesScore}
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
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default ProjectSummary;
