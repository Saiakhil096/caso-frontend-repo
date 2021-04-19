import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { Grid, Typography, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@material-ui/core';
import { Check as CheckIcon, ExpandLess, ExpandMore } from '@material-ui/icons';
import Questions from './Questions';
import Sidebar from '../Sidebar';
import { url } from '../../common/API';

const useStyles = makeStyles(theme => ({
  headerMargin: {
    marginTop: theme.spacing(2)
  },
  list: {
    width: '100%',
    maxWidth: 360
  },
  activeListItem: {
    color: 'black'
  },
  listItem: {
    color: '#858585'
  },
  listIcon: {
    marginLeft: theme.spacing(2)
  },
  subNav: {
    width: '100%',
    maxWidth: 360
  },
  nested: {
    paddingLeft: theme.spacing(4)
  },
  content: {
    padding: theme.spacing(4)
  },
  background: {
    backgroundColor: '#89C64F'
  }
}));

function CurrentPosition(props) {
  const classes = useStyles();

  const [currentProcess, setCurrentProcess] = useState(0);
  const [currentProcessQues, setCurrentProcessQues] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [processes, setProcesses] = useState([]);
  const [perceptions, setPerceptions] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [maturityQuestions, setMaturityQuestions] = useState([]);
  const [maturityRatings, setMaturityRatings] = useState([]);
  const [open, setOpen] = React.useState(true);
  const {
    sendResponse,
    onMessage,
    setActiveStep,
    activeStep,
    l2Process,
    setSendResponse,
    perceptionData,
    prioritiesData,
    setCurrentRatingData
  } = props;

  const handleSubNav = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (l2Process && l2Process.length > 0) {
      setProcesses(l2Process);
      fetchMaturityQuestions(l2Process[0].id);

      const requestHeaders = {
        Authorization: `Bearer ${Cookies.get('jwt')}`
      };
      setPerceptions(perceptionData[0] ? perceptionData[0].Perception : []);
      setPriorities(prioritiesData[0] ? prioritiesData[0].Priority : []);
    }
  }, [activeStep, l2Process]);

  const fetchMaturityQuestions = l2ProcessId => {
    return fetch(new URL('maturity-questions?l_2_process=' + l2ProcessId, url), {
      method: 'get',
      headers: {
        Authorization: `Bearer ${Cookies.get('jwt')}`
      }
    })
      .then(response => {
        if (!response.ok) throw response;
        return response.json();
      })
      .catch(e => {
        props.onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      })
      .then(data => {
        setMaturityRatings(
          maturityRatings.concat(
            data.map(question => {
              return {
                rating: null,
                reason: '',
                maturity_question: { id: question.id }
              };
            })
          )
        );
        setMaturityQuestions(data);
      })
      .catch(e => {
        props.onMessage(e, 'error');
      });
  };

  //componentDidUpdate
  useEffect(() => {
    if (sendResponse) {
      submitAnswers();
    }
  }, [sendResponse]);

  const submitAnswers = () => {
    const API_CALL = new URL('maturity-ratings', url);
    const requestHeaders = {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    };
    fetch(API_CALL, {
      method: 'post',
      headers: requestHeaders,
      body: JSON.stringify({ maturity_rating: maturityRatings, user: Cookies.get('user'), project: Cookies.get('project') })
    })
      .then(response => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then(data => {
        onMessage('Your answers have been submitted', 'success');
        setCurrentRatingData([{ maturity_rating: data.maturity_rating, user: Cookies.get('user'), project: Cookies.get('project') }]);
        setSendResponse(false);
        setActiveStep(activeStep + 1);
      })
      .catch(e => {
        props.onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      })
      .catch(e => {
        props.onMessage(e, 'error');
      });
  };

  const handleNextQuestion = () => {
    const nextQuestionIndex = currentQuestion + 1;
    if (nextQuestionIndex === maturityRatings.length) {
      handleNextProcess(nextQuestionIndex);
    } else {
      setCurrentQuestion(nextQuestionIndex);
    }
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestion(currentQuestion - 1);
  };

  const handleNextProcess = nextQuestionIndex => {
    if (maturityRatings.filter(o => o.rating === null).length > 0) {
      props.onMessage('You must provide a rating for each L2 process question', 'warning');
    } else if (currentProcess === processes.length - 1) {
      props.onCompletion();
    } else {
      setCurrentProcessQues(maturityRatings.length);
      const nextProcessIndex = currentProcess + 1;
      fetchMaturityQuestions(processes[nextProcessIndex].id).then(() => {
        setCurrentQuestionsToComplete();
        setCurrentProcess(nextProcessIndex);
        setCurrentQuestion(nextQuestionIndex);
      });
    }
  };

  const listItemClick = index => {
    setCurrentQuestion(index);
  };

  const setCurrentQuestionsToComplete = () => {
    const processesCopy = JSON.parse(JSON.stringify(processes));
    processesCopy[currentProcess].questionsComplete = true;
    setProcesses(processesCopy);
  };

  const handleReasonChange = sReason => {
    const maturityRatingsCopy = JSON.parse(JSON.stringify(maturityRatings));
    maturityRatingsCopy[currentQuestion].reason = sReason;
    setMaturityRatings(maturityRatingsCopy);
  };

  const handleRatingChange = selectedIndex => {
    const maturityRatingsCopy = JSON.parse(JSON.stringify(maturityRatings));
    maturityRatingsCopy[currentQuestion].rating = selectedIndex;
    setMaturityRatings(maturityRatingsCopy);
  };

  return (
    <React.Fragment>
      <Grid item xs={false} sm={7} md={4} className={classes.content}>
        <Sidebar
          title="Setting the Current Position of Maturity"
          instructions="We want to understand the Ways of Working within the Contract Life Cycle Management Process. There are 4 questions per process for you to select the current level of maturity. This is based on your perception. Please highlight any reasons behind your selection.">
          <Grid container direction="column" item spacing={1}>
            <Grid item>
              <Typography className={classes.headerMargin} variant="h5">
                Process Checklist
              </Typography>
            </Grid>
            <Grid item>
              <List component="nav" aria-label="main Level 2 Processes" className={classes.list}>
                {processes.map((item, index) => {
                  const bSelected = currentProcess === index;
                  const linkClass = bSelected ? classes.activeListItem : classes.listItem;
                  const icon = item.questionsComplete ? <CheckIcon style={{ color: green[500] }} /> : '';

                  let subNav;
                  if (bSelected && maturityQuestions.length > 0 && maturityRatings.length > 0) {
                    const value = maturityRatings.length - maturityQuestions.length;
                    const subNavRatings = maturityRatings.slice(Math.max(value, 0));
                    subNav = maturityQuestions.map((item, questionIndex) => {
                      const label = `Q${questionIndex + 1}`;
                      const bQuestionSelected =
                        currentProcessQues === 0 ? currentQuestion === questionIndex : currentQuestion - currentProcessQues === questionIndex;
                      const bAnswered = subNavRatings[questionIndex].rating !== null;
                      return (
                        <ListItem
                          button
                          className={classes.nested}
                          selected={bQuestionSelected}
                          key={`subnav-${questionIndex + 1}`}
                          onClick={e => {
                            listItemClick(currentProcessQues === 0 ? questionIndex : currentProcessQues + questionIndex);
                          }}>
                          <ListItemText classes={{ primary: linkClass }} primary={label} />

                          {bAnswered && (
                            <ListItemIcon classes={{ root: classes.listIcon }}>
                              <CheckIcon style={{ color: green[500] }} />
                            </ListItemIcon>
                          )}
                        </ListItem>
                      );
                    });
                  }

                  return (
                    <div>
                      <ListItem
                        key={`nav-item-${index}`}
                        button
                        selected={bSelected}
                        disabled={!bSelected}
                        onClick={bSelected ? handleSubNav : undefined}>
                        <ListItemText classes={{ primary: linkClass }} primary={item.title} />

                        <ListItemIcon classes={{ root: classes.listIcon }}>{icon}</ListItemIcon>

                        {bSelected && (open ? <ExpandLess /> : <ExpandMore />)}
                      </ListItem>
                      {bSelected && (
                        <Collapse in={open} timeout="auto" unmountOnExit component="div" classes={{ wrapper: classes.subNav }}>
                          <List disablePadding className={classes.list}>
                            {subNav}
                          </List>
                        </Collapse>
                      )}
                    </div>
                  );
                })}
              </List>
            </Grid>
          </Grid>
        </Sidebar>
      </Grid>
      <Grid item xs={12} sm={5} md={8} className={`${classes.background} ${classes.content}`}>
        {processes[currentProcess] &&
          perceptions[currentProcess] &&
          priorities[currentProcess] &&
          (currentProcessQues === 0 ? maturityQuestions[currentQuestion] : maturityQuestions[currentQuestion - currentProcessQues]) &&
          maturityRatings[currentQuestion] && (
            <Questions
              process={processes[currentProcess]}
              perception={perceptions[currentProcess]}
              priority={priorities[currentProcess]}
              maturityQuestion={
                currentProcessQues === 0 ? maturityQuestions[currentQuestion] : maturityQuestions[currentQuestion - currentProcessQues]
              }
              totalQuestions={maturityQuestions.length}
              maturityRating={maturityRatings[currentQuestion]}
              question={currentProcessQues === 0 ? currentQuestion : currentQuestion - currentProcessQues}
              step={currentProcess}
              totalSteps={processes.length}
              onNextQuestion={handleNextQuestion}
              onPreviousQuestion={handlePreviousQuestion}
              onRatingChange={handleRatingChange}
              onSetReason={handleReasonChange}
              onMessage={props.onMessage}
            />
          )}
      </Grid>
    </React.Fragment>
  );
}

export default CurrentPosition;
