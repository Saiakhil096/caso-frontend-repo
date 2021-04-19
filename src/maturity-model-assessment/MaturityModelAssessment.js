import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Stepper,
  Step,
  StepLabel,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@material-ui/core';
import Perceptions from './Perceptions/Perceptions';
import CurrentPosition from './CurrentPosition/CurrentPosition';
import Priorities from './Priorities/Priorities';
import Improvements from './Improvements/Improvements';
import Exit from './Exit';
import {
  fetchPerceptions,
  fetchMaturityRatings,
  fetchPriorities,
  fetchProjectSpecificL2Process,
  fetchImprovementRatings,
  fetchUser,
  updateUser
} from '../common/API';

const useStyles = makeStyles(theme => ({
  stepper: {
    background: 'none'
  }
}));

function MaturityModelAssessment(props) {
  const classes = useStyles();

  const steps = ['Perceptions', 'Priorities', 'Current Position', 'Improvements'];

  const [activeStep, setActiveStep] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [sendResponse, setSendResponse] = useState(false);
  const [l2Process, setL2Process] = useState([]);
  const [loading, setLoading] = useState(true);
  const [perceptionData, setPereptionData] = useState([]);
  const [prioritiesData, setPrioritiesData] = useState([]);
  const [currentRatingData, setCurrentRatingData] = useState([]);
  const [improvementData, setImprovementData] = useState([]);

  useEffect(() => {
    if (l2Process.length === 0) fetchRequests();
  }, [l2Process]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleNextStep = () => {
    setOpenDialog(true);
  };

  const handleCloseDialogAccept = () => {
    setSendResponse(true);
    setOpenDialog(false);
  };

  const setCompleted = () => {
    var user = Cookies.get('user');
    var project = Cookies.get('project');
    fetchUser(props.onMessage, user)
      .then(data => {
        data.maturity_model.map((item, index) => {
          if (project === String(item.project.id)) {
            data.maturity_model[index].status = 'completed';
          }
        });
        updateUser(user, data, props.onMessage)
          .then(data => {
            setActiveStep(activeStep + 1);
          })
          .catch(e => {
            props.onMessage(`Error: ${e}`, 'error');
          });
      })
      .catch(e => props.onMessage(e, 'error'));
  };

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <Perceptions
            onCompletion={handleNextStep}
            onMessage={props.onMessage}
            setSendResponse={setSendResponse}
            sendResponse={sendResponse}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            l2Process={l2Process}
            setPereptionData={setPereptionData}
          />
        );
      case 1:
        return (
          <Priorities
            onCompletion={handleNextStep}
            onMessage={props.onMessage}
            setSendResponse={setSendResponse}
            sendResponse={sendResponse}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            l2Process={l2Process}
            setPrioritiesData={setPrioritiesData}
          />
        );
      case 2:
        return (
          <CurrentPosition
            onCompletion={handleNextStep}
            onMessage={props.onMessage}
            setSendResponse={setSendResponse}
            sendResponse={sendResponse}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            l2Process={l2Process}
            perceptionData={perceptionData}
            prioritiesData={prioritiesData}
            setCurrentRatingData={setCurrentRatingData}
          />
        );
      case 3:
        return (
          <Improvements
            onCompletion={handleNextStep}
            onMessage={props.onMessage}
            setSendResponse={setSendResponse}
            sendResponse={sendResponse}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            l2Process={l2Process}
            perceptionData={perceptionData}
            prioritiesData={prioritiesData}
            currentRatingData={currentRatingData}
            setImprovementData={setImprovementData}
            setCompleted={setCompleted}
          />
        );
      case 4:
        return <Exit />;
      default:
        throw new Error('Unknown step');
    }
  };

  const fetchRequests = async () => {
    Promise.all([
      fetchPerceptions(props.onMessage),
      fetchPriorities(props.onMessage),
      fetchMaturityRatings(props.onMessage),
      fetchImprovementRatings(props.onMessage),
      fetchProjectSpecificL2Process(Cookies.get('project'), props.onMessage)
    ])
      .then(async ([perceptionDataJson, prioritiesDataJson, maturityRatingDataJson, improvementRatingDataJson, l2ProcessDataJson]) => {
        setPereptionData(perceptionDataJson);
        setPrioritiesData(prioritiesDataJson);
        setCurrentRatingData(maturityRatingDataJson);
        setImprovementData(improvementRatingDataJson);
        setL2Process(l2ProcessDataJson);

        if (improvementRatingDataJson.length > 0) {
          setActiveStep(4);
        } else if (maturityRatingDataJson.length > 0) {
          setActiveStep(3);
        } else if (prioritiesDataJson.length > 0) {
          setActiveStep(2);
        } else if (perceptionDataJson.length > 0) {
          setActiveStep(1);
        } else {
          setActiveStep(0);
        }

        setLoading(false);
      })
      .catch(e => {
        props.onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      });
  };

  const mainComponent = () => {
    return (
      <Grid container component="main">
        {getStepContent(activeStep)}
      </Grid>
    );
  };

  const renderStepper = () => {
    if (activeStep < 4) {
      return (
        <Grid item>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
      );
    }
  };

  const confirmationDialog = () => {
    return (
      <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Proceed to Next Step</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure you want to proceed to next step?</DialogContentText>
          <DialogContentText id="alert-dialog-description">By clicking yes, you will not be able to return to this screen.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            No
          </Button>
          <Button onClick={handleCloseDialogAccept} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
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
        {renderStepper()}
        {mainComponent()}
        {confirmationDialog()}
      </React.Fragment>
    );
  }
}

export default MaturityModelAssessment;
