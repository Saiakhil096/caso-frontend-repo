import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import {
  fetchPerceptions,
  fetchMaturityRatings,
  fetchPriorities,
  fetchProjectSpecificL2Process,
  fetchImprovementRatings,
  fetchIdeas,
  fetchFeasibilityVotes,
  fetchValueVotes,
  fetchUser,
  updateUser
} from '../common/API';
import {
  Grid,
  Stepper,
  Step,
  StepLabel,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  Button,
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@material-ui/core';
import Exit from './Exit';
import WarmUp from './WarmUp/WarmUp';
import Ideate from './Ideate/Ideate';
import Feasibility from './Feasibility/Feasibility';
import Value from './Value/Value';

const useStyles = makeStyles(theme => ({
  stepper: {
    background: 'none'
  }
}));

function DesignThinking(props) {
  const { onMessage } = props;
  const classes = useStyles();

  const steps = ['Warm Up', 'Ideate', 'Feasability', 'Priorities'];

  const [activeStep, setActiveStep] = useState(0);
  const [l2ProcessList, setL2ProcessList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [perceptionData, setPereptionData] = useState([]);
  const [prioritiesData, setPrioritiesData] = useState([]);
  const [maturityRatingData, setMaturityRatingData] = useState([]);
  const [improvementRatingData, setImprovementRatingData] = useState([]);
  const [ideasData, setIdeasData] = useState([]);
  const [isCompleteStepDialogBoxOpen, setIsCompleteStepDialogBoxOpen] = useState(false);
  const [sendResponse, setSendResponse] = useState(false);
  const [currentProcessIndex, setCurrentProcessIndex] = useState(0);

  const closeCompleteStepDialogBox = () => {
    setIsCompleteStepDialogBoxOpen(false);
  };

  const handleNextStep = () => {
    setIsCompleteStepDialogBoxOpen(true);
  };

  const handleAccept = () => {
    if (activeStep === 0 || activeStep === 1) {
      setActiveStep(activeStep + 1);
    }
    if (activeStep === 2 || activeStep === 3) {
      setSendResponse(true);
    }
    setIsCompleteStepDialogBoxOpen(false);
  };

  const setCompleted = () => {
    var user = Cookies.get('user');
    var project = Cookies.get('project');
    fetchUser(props.onMessage, user)
      .then(data => {
        data.design_thinking.map((item, index) => {
          if (project === String(item.project.id)) {
            data.design_thinking[index].status = 'completed';
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

  useEffect(() => {
    if (l2ProcessList.length === 0) fetchRequests();
  }, [l2ProcessList]);

  const fetchRequests = async () => {
    Promise.all([
      fetchPerceptions(onMessage),
      fetchPriorities(onMessage),
      fetchMaturityRatings(onMessage),
      fetchImprovementRatings(onMessage),
      fetchProjectSpecificL2Process(Cookies.get('project'), onMessage),
      fetchIdeas(onMessage),
      fetchFeasibilityVotes(onMessage),
      fetchValueVotes(onMessage)
    ])
      .then(
        async ([
          perceptionDataJson,
          prioritiesDataJson,
          maturityRatingDataJson,
          improvementRatingDataJson,
          l2ProcessDataJson,
          ideasDataJson,
          feasibilityVotesDataJson,
          valueVotesDataJson
        ]) => {
          var temp = perceptionDataJson;
          var perceptionCopy = perceptionDataJson[0].Perception;
          if (temp.length > 0) {
            for (let index = 1; index < temp.length; index++) {
              const element = temp[index];
              perceptionCopy.map((item1, index1) => {
                element.Perception.map((item2, index2) => {
                  if (item1.l_2_process.id == item2.l_2_process.id) {
                    item2.pain_points.map((item3, index3) => {
                      perceptionCopy[index1].pain_points.push(item3);
                    });
                    perceptionCopy[index1].rating += item2.rating;
                    perceptionCopy[index1].rating = perceptionCopy[index1].rating / 2;
                  }
                });
              });
            }
          }

          setPereptionData(perceptionCopy);
          setPrioritiesData(prioritiesDataJson[0].Priority);
          setMaturityRatingData(maturityRatingDataJson[0].maturity_rating);
          setImprovementRatingData(improvementRatingDataJson[0].improvement_rating);
          setL2ProcessList(l2ProcessDataJson);
          setIdeasData(ideasDataJson);

          if (valueVotesDataJson.length > 0) {
            setActiveStep(4);
          } else if (feasibilityVotesDataJson.length > 0) {
            setActiveStep(3);
          } else if (ideasDataJson.length > 0) {
            setActiveStep(1);
            l2ProcessDataJson.map((process, index) => {
              if (ideasDataJson[ideasDataJson.length - 1].l_2_process.id === process.id) {
                setCurrentProcessIndex(index);
              }
            });
          } else {
            setActiveStep(0);
          }

          setLoading(false);
        }
      )
      .catch(e => {
        onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      });
  };

  const getStepContent = step => {
    switch (step) {
      case 0:
        return <WarmUp handleNextStep={handleNextStep} onMessage={onMessage} />;
      case 1:
        return (
          <Ideate
            onMessage={onMessage}
            l2ProcessList={l2ProcessList}
            perceptions={perceptionData}
            priorities={prioritiesData}
            maturityRatings={maturityRatingData}
            improvementRatings={improvementRatingData}
            fetchedIdeas={ideasData}
            handleNextStep={handleNextStep}
            currentProcessIndex={currentProcessIndex}
            setCurrentProcessIndex={setCurrentProcessIndex}
          />
        );
      case 2:
        return (
          <Feasibility
            handleNextStep={handleNextStep}
            onMessage={onMessage}
            l2ProcessList={l2ProcessList}
            setSendResponse={setSendResponse}
            sendResponse={sendResponse}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
          />
        );
      case 3:
        return (
          <Value
            handleNextStep={handleNextStep}
            onMessage={onMessage}
            l2ProcessList={l2ProcessList}
            setSendResponse={setSendResponse}
            sendResponse={sendResponse}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setCompleted={setCompleted}
          />
        );
      case 4:
        return <Exit />;
      default:
        throw new Error('Unknown step');
    }
  };

  const confirmationDialog = () => {
    return (
      <Dialog open={isCompleteStepDialogBoxOpen} onClose={closeCompleteStepDialogBox}>
        <DialogTitle>Proceed to Next Step</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to proceed to next step?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCompleteStepDialogBox} color="primary">
            No
          </Button>
          <Button onClick={handleAccept} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
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

export default DesignThinking;
