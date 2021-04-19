import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { Grid, Backdrop, CircularProgress } from '@material-ui/core';
import PerceptionReadOnly from './perception_readonly';
import PrioritiesReadOnly from './priorities_readonly';
import CurrentPositionReadOnly from './currentposition_readonly';
import ImprovementsReadOnly from './improvements_readonly';
import Cookies from 'js-cookie';
import { url } from '../common/API';

const useStyles = makeStyles(theme => ({
  stepper: {
    background: 'none'
  }
}));

function MaturityModelReadOnly(props) {
  const classes = useStyles();
  props.setTitle('Maturity Model Results');
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();
  const [l2Process, setL2Process] = React.useState([]);
  const [perceptionData, setPereptionData] = React.useState([]);
  const [prioritiesData, setPrioritiesData] = React.useState([]);
  const [currentRatingData, setCurrentRatingData] = React.useState([]);
  const [improvementData, setImprovementData] = React.useState([]);
  const [maturityQuestionData, setMaturityQuestionData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const project = Cookies.get('project');
  const user = Cookies.get('user');

  function getSteps() {
    return ['Perceptions', 'Priorities', 'Current Position', 'Improvements'];
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <PerceptionReadOnly
            onMessage={props.onMessage}
            activeStep={activeStep}
            step={activeStep + 1}
            setActiveStep={setActiveStep}
            l2Process={l2Process}
            setPereptionData={setPereptionData}
            perceptionData={perceptionData}
          />
        );
      case 1:
        return (
          <PrioritiesReadOnly
            onMessage={props.onMessage}
            step={activeStep + 1}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            l2Process={l2Process}
            setPrioritiesData={setPrioritiesData}
            prioritiesData={prioritiesData}
          />
        );
      case 2:
        return (
          <CurrentPositionReadOnly
            onMessage={props.onMessage}
            step={activeStep + 1}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            l2Process={l2Process}
            currentRatingData={currentRatingData}
            setCurrentRatingData={setCurrentRatingData}
            setMaturityQuestionData={setMaturityQuestionData}
            improvementData={improvementData}
          />
        );
      case 3:
        return (
          <ImprovementsReadOnly
            onMessage={props.onMessage}
            step={activeStep + 1}
            setActiveStep={setActiveStep}
            l2Process={l2Process}
            setMaturityQuestionData={setMaturityQuestionData}
            improvementData={improvementData}
            setImprovementData={setImprovementData}
            currentRatingData={currentRatingData}
            setCurrentRatingData={setCurrentRatingData}
            maturityQuestionData={maturityQuestionData}
          />
        );
      default:
        throw new Error('Unknown step');
    }
  }

  useEffect(() => {
    fetchRequests(user, project);
  }, []);

  const fetchRequests = async (user, project) => {
    const requestHeaders = {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    };
    const perceptionResponse = fetch(new URL(`perceptions?user=${user}&&project=${project}`, url), {
      method: 'get',
      headers: requestHeaders
    });
    const prioritiesResponse = fetch(new URL(`priorities?user=${user}&&project=${project}`, url), {
      method: 'get',
      headers: requestHeaders
    });
    const currentPositionResponse = fetch(new URL(`maturity-ratings?user=${user}&&project=${project}`, url), {
      method: 'get',
      headers: requestHeaders
    });

    const maturityQuestionResponse = fetch(new URL(`maturity-questions`, url), {
      method: 'get',
      headers: requestHeaders
    });

    const API_CALL = new URL(`improvement-ratings?user=${user}&&project=${project}`, url);
    const improvementsResponse = fetch(API_CALL, {
      method: 'get',
      headers: requestHeaders
    });
    const PROCESSES_URL = new URL(`l-2-processes?project.id=${project}`, url);
    const l2ProcessResponse = fetch(PROCESSES_URL, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${Cookies.get('jwt')}`
      }
    });

    Promise.all([perceptionResponse, prioritiesResponse, currentPositionResponse, maturityQuestionResponse, improvementsResponse, l2ProcessResponse])
      .then(async ([perceptionData, prioritiesData, currentPositionData, maturityQuestionData, improvementsData, l2ProcessData]) => {
        const perceptionDataJson = await perceptionData.json();
        const prioritiesDataJson = await prioritiesData.json();
        const currentPositionDataJson = await currentPositionData.json();
        const maturityQuestionDataJson = await maturityQuestionData.json();
        const improvementsDataJson = await improvementsData.json();
        const l2ProcessDataJson = await l2ProcessData.json();
        setPereptionData(perceptionDataJson);
        setPrioritiesData(prioritiesDataJson);
        setCurrentRatingData(currentPositionDataJson);
        setMaturityQuestionData(maturityQuestionDataJson);
        setImprovementData(improvementsDataJson);
        setL2Process(l2ProcessDataJson);

        setLoading(false);
      })
      .catch(e => {
        props.onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      });
  };

  const mainComponent = () => {
    return (
      <Grid container className={classes.stepper} component="main">
        {getStepContent(activeStep)}
      </Grid>
    );
  };

  const stepper = () => {
    return (
      <Grid>
        <Grid item>
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
      </Grid>
    );
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
        {stepper()}
        {mainComponent()}
      </React.Fragment>
    );
  }
}

export default MaturityModelReadOnly;
