import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button, List, ListItem, ListItemText, CircularProgress, Backdrop } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import MaturityOverview from './MaturityOverview/MaturityOverview';
import IdeationBoard from './IdeationBoard/IdeationBoard';
import Sidebar from '../Sidebar';
import { url } from '../../common/API';
import Cookies from 'js-cookie';

const useStyles = makeStyles(theme => ({
  headerMargin: {
    marginTop: theme.spacing(2)
  },
  activeListItem: {
    color: 'black'
  },
  listItem: {
    color: '#858585'
  },
  content: {
    padding: theme.spacing(4)
  },
  background: {
    backgroundColor: '#F2F2F2'
  },
  toggleContainer: {
    justifyContent: 'center'
  }
}));

const toggleStyles = makeStyles(
  {
    root: {
      backgroundColor: '#ffffff',
      color: '#1381B9',
      '&$selected': {
        color: '#ffffff',
        backgroundColor: '#1381B9',
        '&:hover': {
          backgroundColor: '#1381B9',
          color: '#ffffff'
        }
      }
    },
    selected: {}
  },
  { name: 'MuiToggleButton' }
);

function Ideate(props) {
  const [loading, setLoading] = React.useState(true);
  const [maturityQuestions, setMaturityQuestions] = useState([]);
  const [screen, setScreen] = useState('maturityOverview');
  const [ideas, setIdeas] = useState([]);
  const {
    l2ProcessList,
    perceptions,
    priorities,
    maturityRatings,
    improvementRatings,
    onMessage,
    fetchedIdeas,
    handleNextStep,
    currentProcessIndex,
    setCurrentProcessIndex
  } = props;

  const classes = useStyles();
  const toggleClass = toggleStyles();

  useEffect(() => {
    fetchMaturityQuestions(l2ProcessList[currentProcessIndex].id);
  }, [currentProcessIndex]);

  useEffect(() => {
    setIdeas(fetchedIdeas);
  }, [fetchedIdeas]);

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
        onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      })
      .then(data => {
        setMaturityQuestions(data);
        setLoading(false);
      })
      .catch(e => {
        onMessage(e, 'error');
      });
  };

  const getNormalizedMaturityRating = processIndex => {
    const normalizer = 9 / 5;
    let currentMaturityRating = getMaturityRatingForProcess(processIndex);
    return Math.round(
      (currentMaturityRating.reduce((sum, rating) => {
        return sum + rating.rating + 1;
        //ratings saved in the backend are one less than the ratings fed by user
      }, 0) /
        currentMaturityRating.length) *
        normalizer
    );
  };

  const getNormalizedImprovementRating = processIndex => {
    const normalizer = 9 / 5;
    let ImprovementRating = getImprovementRatingForProcess(processIndex);
    let improvementArrayLength = 0;
    return Math.round(
      (ImprovementRating.reduce((sum, rating) => {
        if (rating.rating != null) {
          improvementArrayLength = improvementArrayLength + 1;
          sum = sum + rating.rating + 1;
          //ratings saved in the backend are one less than the ratings fed by user
        }
        return sum;
      }, 0) /
        improvementArrayLength) *
        normalizer
    );
  };

  const getPerceptionsForProcess = processIndex => {
    return perceptions.find(perception => perception.l_2_process.id == l2ProcessList[processIndex].id);
  };

  const getMaturityRatingForProcess = processIndex => {
    return maturityRatings.filter(rating => rating.maturity_question.l_2_process == l2ProcessList[processIndex].id);
  };

  const getImprovementRatingForProcess = processIndex => {
    return improvementRatings.filter(rating => rating.maturity_question.l_2_process == l2ProcessList[processIndex].id);
  };

  const getPrioritiesForProcess = processIndex => {
    return priorities.find(priority => priority.l_2_process.id == l2ProcessList[processIndex].id);
  };

  const handleNextProcess = () => {
    onclick = 'IdeationBoard()';
    if (currentProcessIndex === l2ProcessList.length - 1) {
      if (ideas.length === 0) {
        onMessage('You must provide at least one idea for any L2 process in the Ideation Board', 'warning');
      } else {
        handleNextStep();
      }
    } else {
      if (screen == 'maturityOverview') {
        setScreen('ideationBoard');
      } else {
        setCurrentProcessIndex(currentProcessIndex + 1);
      }
    }
  };

  const handlePreviousProcess = () => {
    setCurrentProcessIndex(currentProcessIndex - 1);
  };

  const handleLinkClick = (event, index) => {
    setCurrentProcessIndex(index);
  };

  const handleScreenChange = (event, newScreen) => {
    if (newScreen !== null) {
      setScreen(newScreen);
    }
  };

  const loadScreen = () => {
    if (screen === 'maturityOverview') return displayMaturityOverview();
    else if (screen === 'ideationBoard') return displayIdeationBoard();
  };

  const displayMaturityOverview = () => {
    return (
      <MaturityOverview
        currentProcess={l2ProcessList[currentProcessIndex]}
        perception={getPerceptionsForProcess(currentProcessIndex)}
        getNormalizedImprovementRating={getNormalizedImprovementRating(currentProcessIndex)}
        getNormalizedMaturityRating={getNormalizedMaturityRating(currentProcessIndex)}
        priority={getPrioritiesForProcess(currentProcessIndex)}
        maturityRatings={getMaturityRatingForProcess(currentProcessIndex)}
        improvementRatings={getImprovementRatingForProcess(currentProcessIndex)}
        maturityQuestions={maturityQuestions}
        totalProcesses={l2ProcessList.length}
        currentProcessIndex={currentProcessIndex}
        onMessage={onMessage}
      />
    );
  };
  const displayIdeationBoard = () => {
    return (
      <IdeationBoard
        currentProcess={l2ProcessList[currentProcessIndex]}
        currentProcessIndex={currentProcessIndex}
        totalProcesses={l2ProcessList.length}
        onMessage={onMessage}
        l2ProcessList={l2ProcessList}
        setIdeas={setIdeas}
        ideas={ideas}
        perception={getPerceptionsForProcess(currentProcessIndex)}
      />
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
        <Grid item xs={false} sm={5} md={4} className={classes.content}>
          <Sidebar
            title="Ideation - Idea Creation"
            instructions_main="Take your crazy and creative ideas from the warm up exercise and use that blue sky thinking for your own organisation. Using the technologies mentioned, think of ideas for your different process areas, remember to forget any constraints at the moment. What would your work ideal look like if anything was possible?">
            <Grid container direction="column" item spacing={1}>
              <Grid item>
                <Typography className={classes.headerMargin} variant="h5">
                  Process Checklist
                </Typography>
              </Grid>
              <Grid item>
                <List className={classes.list}>
                  {l2ProcessList.map((item, index) => {
                    const bSelected = currentProcessIndex === index;
                    const linkClass = bSelected ? classes.activeListItem : classes.listItem;
                    return (
                      <ListItem key={index} button selected={bSelected} onClick={e => handleLinkClick(e, index)}>
                        <ListItemText classes={{ primary: linkClass }} primary={item.title} />
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
            </Grid>
          </Sidebar>
        </Grid>
        <Grid item xs={12} sm={7} md={8} className={`${classes.background} ${classes.content}`}>
          <Grid container className={classes.toggleContainer}>
            <ToggleButtonGroup value={screen} exclusive onChange={handleScreenChange}>
              <ToggleButton value="maturityOverview" className={toggleClass.root}>
                Maturity Overview
              </ToggleButton>
              <ToggleButton value="ideationBoard" className={toggleClass.root}>
                Ideation Board
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid>{loadScreen()}</Grid>
          <Grid item container justify="space-between" alignItems="baseline">
            <Grid item>
              {currentProcessIndex > 0 && (
                <Button variant="contained" color="primary" onClick={handlePreviousProcess}>
                  Back
                </Button>
              )}
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleNextProcess}>
                {currentProcessIndex === l2ProcessList.length - 1 ? 'Submit Ideas' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default Ideate;
