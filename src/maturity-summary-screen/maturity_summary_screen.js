import React, { useEffect } from 'react';
import { makeStyles, Grid, Backdrop, CircularProgress, Stepper, Step, StepButton, Divider, Box } from '@material-ui/core';
import MaturitySummaryOptions from './maturity_summary_options';
import CurrentPositionOutput from './current_position_options/currentposition_output';
import ImprovementOutput from './Improvements/improvements_output';
import Cookies from 'js-cookie';
import { url } from '../common/API';
import PerceptionSummaryScreen from './Perceptions/perception_summary_screen';
import PrioritiesSummaryScreen from './Priorities/priorities_summary_screen';

const useStyles = makeStyles(theme => ({
  stepper: {
    background: 'none'
  },
  paper: {
    height: '25%',
    width: '100%',
    maxHeight: '10rem',
    backgroundColor: 'inherit',
    marginBottom: theme.spacing(2)
  }
}));

function MaturityModelOutput(props) {
  props.setTitle('Maturity Model Assessment Output');
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [openDialog, setOpenDialog] = React.useState(false);
  const steps = getSteps();
  const [loading, setLoading] = React.useState(true);
  const [l2Process, setL2Process] = React.useState([]);
  const [perceptionData, setPerceptionData] = React.useState([]);
  const [prioritiesData, setPrioritiesData] = React.useState([]);
  const [currentRatingData, setCurrentRatingData] = React.useState([]);
  const [improvementData, setImprovementData] = React.useState([]);
  const [maturityQuestionData, setMaturityQuestionData] = React.useState([]);
  const [kpiData, setKpiData] = React.useState([]);
  const [businessData, setBusinessData] = React.useState([]);
  const project = Cookies.get('project');
  const [filteredValue, setFilteredValue] = React.useState([]);

  const handleNextStep = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handlePreviousStep = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  function getSteps() {
    return ['Perceptions', 'Priorities', 'Current Position', 'Improvements'];
  }

  const handleStep = step => () => {
    setActiveStep(step);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <PerceptionSummaryScreen
            onCompletion={handleNextStep}
            l2Process={l2Process}
            step={activeStep + 1}
            activeStep={activeStep}
            setPerceptionData={setPerceptionData}
            perceptionData={perceptionData}
            kpiData={kpiData}
            l2Process={l2Process}
            businessData={businessData}
            onMessage={props.onMessage}
            filteredData={filteredValue}
          />
        );
      case 1:
        return (
          <PrioritiesSummaryScreen
            onCompletion={handleNextStep}
            onPreviousStep={handlePreviousStep}
            step={activeStep + 1}
            activeStep={activeStep}
            l2Process={l2Process}
            setPrioritiesData={setPrioritiesData}
            prioritiesData={prioritiesData}
            onMessage={props.onMessage}
            businessData={businessData}
            kpiData={kpiData}
            onMessage={props.onMessage}
            filteredData={filteredValue}
          />
        );
      case 2:
        return (
          <CurrentPositionOutput
            onMessage={props.onMessage}
            step={activeStep + 1}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            l2Process={l2Process}
            currentRatingData={currentRatingData}
            setCurrentRatingData={setCurrentRatingData}
            setMaturityQuestionData={setMaturityQuestionData}
            improvementData={improvementData}
            filteredData={filteredValue}
            businessData={businessData}
            onCompletion={handleNextStep}
            onPreviousStep={handlePreviousStep}
          />
        );

      case 3:
        return (
          <ImprovementOutput
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
            filteredData={filteredValue}
            businessData={businessData}
            onCompletion={handleNextStep}
            onPreviousStep={handlePreviousStep}
          />
        );
      default:
        throw new Error('Unknown step');
    }
  }

  useEffect(() => {
    fetchRequests(project);
  }, []);

  const fetchRequests = async project => {
    const requestHeaders = {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    };
    const perceptionResponse = fetch(new URL(`perceptions?project=${project}`, url), {
      method: 'get',
      headers: requestHeaders
    });
    const prioritiesResponse = fetch(new URL(`priorities?project=${project}`, url), {
      method: 'get',
      headers: requestHeaders
    });
    const currentPositionResponse = fetch(new URL(`maturity-ratings?project=${project}`, url), {
      method: 'get',
      headers: requestHeaders
    });

    const kpiResponse = fetch(new URL(`kpis?project=${project}`, url), {
      method: 'get',
      headers: requestHeaders
    });

    const businessResponse = fetch(new URL(`business-units?projects=${project}`, url), {
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

    const maturityQuestionResponse = fetch(new URL(`maturity-questions`, url), {
      method: 'get',
      headers: requestHeaders
    });

    const API_CALL = new URL(`improvement-ratings?project=${project}`, url);
    const improvementsResponse = fetch(API_CALL, {
      method: 'get',
      headers: requestHeaders
    });

    Promise.all([
      perceptionResponse,
      l2ProcessResponse,
      kpiResponse,
      businessResponse,
      prioritiesResponse,
      currentPositionResponse,
      maturityQuestionResponse,
      improvementsResponse
    ])
      .then(
        async ([
          perceptionData,
          l2ProcessData,
          kpiData,
          businessData,
          prioritiesData,
          currentPositionData,
          maturityQuestionData,
          improvementsData
        ]) => {
          const perceptionDataJson = await perceptionData.json();
          const l2ProcessDataJson = await l2ProcessData.json();
          const kpiDataJson = await kpiData.json();
          const businessDataJson = await businessData.json();
          const prioritiesDataJson = await prioritiesData.json();
          const currentPositionDataJson = await currentPositionData.json();
          const maturityQuestionDataJson = await maturityQuestionData.json();
          const improvementsDataJson = await improvementsData.json();

          setPerceptionData(perceptionDataJson);
          setL2Process(l2ProcessDataJson);
          setKpiData(kpiDataJson);
          setBusinessData(businessDataJson);
          setPrioritiesData(prioritiesDataJson);
          setCurrentRatingData(currentPositionDataJson);
          setMaturityQuestionData(maturityQuestionDataJson);
          setImprovementData(improvementsDataJson);

          setLoading(false);
        }
      )
      .catch(e => {
        props.onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      });
  };

  const stepper = () => {
    return (
      <Grid>
        <Grid item>
          <Divider />
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepButton onClick={handleStep(index)}>{label}</StepButton>
              </Step>
            ))}
          </Stepper>
          <Divider />
        </Grid>
      </Grid>
    );
  };

  const mainComponent = () => {
    return (
      <Grid container className={classes.stepper} component="main">
        {getStepContent(activeStep)}
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
        <MaturitySummaryOptions
          onMessage={props.onMessage}
          setFilteredValue={setFilteredValue}
          filteredValue={filteredValue}
          activeStep={activeStep}
        />
        {stepper()}
        {mainComponent()}
      </React.Fragment>
    );
  }
}

export default MaturityModelOutput;
