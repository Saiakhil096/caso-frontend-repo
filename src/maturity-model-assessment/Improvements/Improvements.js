import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { lightBlue, green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import Questions from './Questions';
import Sidebar from '../Sidebar';
import { TokenIcon } from '../../common/CustomIcons';
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
  content: {
    padding: theme.spacing(4)
  },
  background: {
    backgroundColor: '#4c3768'
  }
}));

function Improvements(props) {
  const classes = useStyles();

  const [currentProcess, setCurrentProcess] = useState();
  const [tokenPool, setTokenPool] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [perceptions, setPerceptions] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [maturityQuestions, setMaturityQuestions] = useState([]);
  const [maturityRatings, setMaturityRatings] = useState([]);
  const [improvementRatings, setImprovementRatings] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const {
    sendResponse,
    onMessage,
    setActiveStep,
    activeStep,
    setSendResponse,
    l2Process,
    perceptionData,
    prioritiesData,
    currentRatingData,
    setImprovementData,
    setCompleted
  } = props;

  useEffect(() => {
    if (l2Process && l2Process.length > 0) {
      const requestHeaders = {
        Authorization: `Bearer ${Cookies.get('jwt')}`
      };

      const p1 = perceptionData;

      const p2 = prioritiesData;

      const p3 = currentRatingData;

      Promise.all([p1, p2, p3])
        .then(data => {
          setProcesses(l2Process);
          setPerceptions(data[0][0] ? data[0][0].Perception : []);
          setPriorities(data[1][0] ? data[1][0].Priority : []);
          const maturityRatings = data[2][0] ? data[2][0].maturity_rating : [];
          setMaturityRatings(maturityRatings);
          setImprovementRatings(prevState =>
            prevState.concat(
              maturityRatings.map(rating => {
                return {
                  rating: rating === 4 ? rating : null,
                  maturity_question: {
                    id: rating.maturity_question.id
                  }
                };
              })
            )
          );
          setIsLoaded(true);
          setCurrentProcess(0);
        })
        .catch(e => {
          onMessage(e, 'error');
        });
    }
  }, [l2Process]);

  useEffect(() => {
    if (isLoaded) {
      fetchMaturityQuestions(processes[currentProcess].id);
    }
  }, [currentProcess]);

  useEffect(() => {
    if (maturityQuestions.length > 0) {
      calculateTokens();
    }
  }, [maturityQuestions]);

  //componentDidUpdate
  useEffect(() => {
    if (sendResponse) {
      submitAnswers();
    }
  }, [sendResponse]);

  const fetchMaturityQuestions = l2ProcessId => {
    return fetch(new URL(`maturity-questions?l_2_process=${l2ProcessId}`, url), {
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
        setMaturityQuestions(data);
      })
      .catch(e => {
        props.onMessage(e, 'error');
      });
  };

  const calculateTokens = () => {
    const processesCopy = JSON.parse(JSON.stringify(processes));
    const leading = 4;
    const answerRange = 5;
    const noOfQuestions = 4;
    const improvementsPercentage = 50;
    const actualGaps = {};
    const maxGaps = {};
    maturityRatings.forEach(maturityRating => {
      if (!actualGaps[maturityRating.maturity_question.l_2_process]) {
        actualGaps[maturityRating.maturity_question.l_2_process] = 0;
      }
      actualGaps[maturityRating.maturity_question.l_2_process] += leading - maturityRating.rating;
    });
    for (let prop in actualGaps) {
      maxGaps[prop] = actualGaps[prop] - priorities.find(priority => priority.l_2_process.id === processesCopy[currentProcess].id).rating;
    }
    const sumOfActualGaps = Object.values(actualGaps).reduce((a, b) => a + b, 0);
    const sumOfMaxGaps = Object.values(maxGaps).reduce((a, b) => a + b, 0);
    const maxVotes = Math.max(...Object.values(maxGaps));
    const minVotes = 0;
    const currentProcessId = processesCopy[currentProcess].id;
    const ratio = maxGaps[currentProcessId] / sumOfMaxGaps;
    const totalActualGaps = answerRange * noOfQuestions * processesCopy.length - sumOfActualGaps;
    const votesAllowed = (totalActualGaps / 100) * improvementsPercentage;
    var tokenTotal = Math.floor(Math.min(Math.max(votesAllowed * ratio, minVotes), maxVotes));
    if (tokenTotal > actualGaps[currentProcessId]) tokenTotal = actualGaps[currentProcessId];
    processesCopy[currentProcess].tokenTotal = tokenTotal;
    setProcesses(processesCopy);
    const tokenPoolCopy = [...tokenPool, tokenTotal];
    setTokenPool(tokenPoolCopy);
  };

  const submitAnswers = () => {
    const API_CALL = new URL('improvement-ratings', url);
    const requestHeaders = {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    };
    fetch(API_CALL, {
      method: 'post',
      headers: requestHeaders,
      body: JSON.stringify({ improvement_rating: improvementRatings, user: Cookies.get('user'), project: Cookies.get('project') })
    })
      .then(response => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then(() => {
        onMessage('Your answers have been submitted', 'success');
        setImprovementData([{ improvement_rating: improvementRatings, user: Cookies.get('user'), project: Cookies.get('project') }]);
        setSendResponse(false);
        setCompleted();
      })
      .catch(e => {
        props.onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      });
  };

  const handleNextProcess = () => {
    if (currentProcess === processes.length - 1) {
      props.onCompletion();
    } else {
      setCurrentQuestionsToComplete();
      setCurrentProcess(currentProcess + 1);
    }
  };

  const listItemClick = index => {
    setCurrentProcess(index);
  };

  const setCurrentQuestionsToComplete = () => {
    const processesCopy = JSON.parse(JSON.stringify(processes));
    processesCopy[currentProcess].questionsComplete = true;
    setProcesses(processesCopy);
  };

  const handlePreviousProcess = () => {
    setCurrentProcess(currentProcess - 1);
  };

  const handleRatingChange = (selectedIndex, questionIndex) => {
    const improvementRatingsCopy = JSON.parse(JSON.stringify(improvementRatings));
    if (selectedIndex === improvementRatingsCopy[questionIndex].rating) {
      improvementRatingsCopy[questionIndex].rating = null;
    } else {
      improvementRatingsCopy[questionIndex].rating = selectedIndex;
    }
    const allocatedTokens = improvementRatingsCopy.reduce((total, improvementRating) => {
      if (improvementRating.rating && maturityQuestions.find(q => q.id === improvementRating.maturity_question.id)) {
        let maturityRating = maturityRatings.find(o => o.maturity_question.id === improvementRating.maturity_question.id);
        return total + (improvementRating.rating - maturityRating.rating);
      } else {
        return total;
      }
    }, 0);
    const tokenTotal = processes[currentProcess].tokenTotal;
    if (allocatedTokens > processes[currentProcess].tokenTotal) {
      return false;
    }
    const tokenPoolCopy = [...tokenPool];
    tokenPoolCopy[currentProcess] = Math.abs(tokenTotal - allocatedTokens);
    setTokenPool(tokenPoolCopy);
    setImprovementRatings(improvementRatingsCopy);
    return true;
  };

  return (
    <React.Fragment>
      <Grid item xs={false} sm={7} md={4} className={classes.content}>
        <Sidebar
          title="Identifying Your Target State Maturity"
          instructions="Through the inputs that you have provided in the previous steps, you have been given a set amount of Improvement Votes to use which are highlighted below. Please select where you want to use these improvement votes within the questions. In some situations you will receive 0 improvement points so in that instance please continue to the next step.">
          <Grid item>
            <Typography className={classes.headerMargin} variant="h5">
              Improvement Points
            </Typography>
          </Grid>
          <Grid item container spacing={1}>
            {(() => {
              let items = [];
              for (let i = 0; i < tokenPool[currentProcess]; i++) {
                items.push(
                  <Grid item>
                    <TokenIcon selected={tokenPool[currentProcess] > 0} selectedColor={lightBlue['A100']} fontSize="large" />
                  </Grid>
                );
              }
              return items;
            })()}
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              These Improvement points are for the questions on this page only.
            </Typography>
          </Grid>
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

                  return (
                    <ListItem
                      key={index}
                      button
                      selected={bSelected}
                      onClick={e => {
                        listItemClick(index);
                      }}>
                      <ListItemText classes={{ primary: linkClass }} primary={item.title} />

                      {item.questionsComplete && (
                        <ListItemIcon classes={{ root: classes.listIcon }}>
                          <CheckIcon style={{ color: green[500] }} />
                        </ListItemIcon>
                      )}
                    </ListItem>
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
          maturityQuestions.length > 0 &&
          maturityRatings.length > 0 &&
          improvementRatings.length > 0 && (
            <Questions
              process={processes[currentProcess]}
              perception={perceptions[currentProcess]}
              priority={priorities[currentProcess]}
              maturityQuestions={maturityQuestions}
              maturityRatings={maturityRatings}
              improvementRatings={improvementRatings}
              step={currentProcess + 1}
              totalSteps={processes.length}
              remainingTokens={tokenPool[currentProcess]}
              onNextProcess={handleNextProcess}
              onPreviousProcess={handlePreviousProcess}
              onRatingClick={handleRatingChange}
              onMessage={props.onMessage}
            />
          )}
      </Grid>
    </React.Fragment>
  );
}

export default Improvements;
