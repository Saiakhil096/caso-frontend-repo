import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { Grid, Typography, Button, Box, TextField, Paper, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@material-ui/core';
import CurrentRating from './currentRating';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(5),
    flexGrow: 1,
    backgroundColor: grey[50]
  },
  subheading: {
    color: grey[500]
  },
  button: {
    marginTop: theme.spacing(8)
  },
  toggleGroupStyle: {
    flexDirection: 'column'
  },
  gridStyle: {
    marginTop: theme.spacing(1.2)
  },

  backButton: {
    marginLeft: theme.spacing(1.5)
  },
  paperTextfield: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '80%',
    '& > *': {
      margin: theme.spacing(2),
      marginBottom: theme.spacing(1),
      height: theme.spacing(6)
    },
    title: {
      marginTop: theme.spacing(3)
    }
  },
  titleSpacing: {
    marginBottom: theme.spacing(1.5)
  },
  options: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(1),
    padding: theme.spacing(4)
  }
}));

function CurrentPositionOutput(props) {
  const classes = useStyles();

  var filteredDataCopy = props.filteredData;

  const [l2ProcessCopy, setL2ProcessCopy] = useState([]);
  const [values, setValues] = useState('All');
  const [allRecords, setAllRecords] = useState([]);
  const [questions, setQuestions] = useState('');
  const [userData, setUserData] = useState([]);
  const [newdata, setNewData] = useState([]);
  const [ratingInfo, setRatingInfo] = useState([]);
  const [maturityQuestions, setMaturityQuestions] = useState([]);
  const [currentProcess, setCurrentProcess] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [open, setOpen] = React.useState(true);
  let bSelected = true;
  useEffect(() => {
    improvementsBody();
  }, []);

  useEffect(() => {
    businessUnitData(userData);
  }, [userData]);

  useEffect(() => {
    if (props.l2Process && props.l2Process.length > 0) {
      setL2ProcessCopy(props.l2Process);
      setQuestions(props.l2Process[currentProcess].maturity_questions[currentQuestion].question_text);
    }
  }, [props.l2Process]);

  useEffect(() => {
    if (questions !== null) {
      let questionsFound = newdata.filter(j => {
        return questions.indexOf(j.ratingQuestion) !== -1;
      });
      setMaturityQuestions(questionsFound);
    }
    setValues('All');
  }, [newdata, questions]);

  useEffect(() => {
    if (questions !== null) {
      if (filteredDataCopy.length > 0) {
        if (filteredDataCopy[0].User.length > 0) {
          let usersFound = maturityQuestions.filter(j => {
            return filteredDataCopy[0].User.indexOf(j.userName) !== -1;
          });
          if (filteredDataCopy[0].BU.length > 0) {
            let buFound = usersFound.filter(j => {
              return filteredDataCopy[0].BU.indexOf(j.business_unit) !== -1;
            });
            setRatingInfo(buFound);
          } else {
            setRatingInfo(usersFound);
          }
        } else {
          let buFound = maturityQuestions.filter(j => {
            return filteredDataCopy[0].BU.indexOf(j.business_unit) !== -1;
          });
          setRatingInfo(buFound);
        }
      } else {
        setRatingInfo(maturityQuestions);
      }
    } else {
      setRatingInfo([]);
    }
  }, [props.filteredData, maturityQuestions, questions]);

  useEffect(() => {
    if (values) {
      if (values === 'All') {
        setAllRecords(ratingInfo);
      } else {
        let filterRatings = ratingInfo.filter(k => {
          return values.indexOf(k.currentRating) !== -1;
        });

        setAllRecords(filterRatings);
      }
    } else {
      setAllRecords([]);
    }
  }, [ratingInfo, values]);

  var averageValue;
  var ratingAverage;
  var totalReasons;

  if (allRecords > 0) {
    const average = allRecords.map(k => k.currentRating);
    ratingAverage = [].concat(...average);
    const allReasons = allRecords.map(k => {
      return { rating: k.currentRating, ratingReasons: k.ratingReason };
    });
    totalReasons = [].concat(...allReasons);
    var total = 0;
    for (var j = 0; j < ratingAverage.length; j++) {
      total += ratingAverage[j];
    }

    let avg = total / ratingAverage.length;
    averageValue = Math.round(avg);
  } else {
    const average = maturityQuestions.map(k => k.currentRating);
    ratingAverage = [].concat(...average);
    const allReasons = maturityQuestions.map(k => {
      return { rating: k.currentRating, ratingReasons: k.ratingReason };
    });
    totalReasons = [].concat(...allReasons);
    var total = 0;
    for (var j = 0; j < ratingAverage.length; j++) {
      total += ratingAverage[j];
    }

    let avg = total / ratingAverage.length;
    averageValue = Math.round(avg);
  }

  let currentRatingData = props.currentRatingData;

  const improvementsBody = () => {
    let userdata = [];
    props.l2Process.map((process, index) => {
      process.maturity_questions.map((question, index) => {
        currentRatingData.map(rating =>
          rating.maturity_rating.map((cRating, index) => {
            if (cRating.maturity_question.id === question.id) {
              const user = {
                l2process_id: process.id,
                userName: rating.user.username,
                currentRating: cRating.rating,
                ratingReason: cRating.reason,
                ratingQuestion: cRating.maturity_question.question_text,
                business_unit_id: rating.user.business_unit
              };
              userdata.push(user);
            }
          })
        );
      });
    });

    setUserData(userdata);
  };

  const businessUnitData = userdata => {
    props.businessData.map((business, index) => {
      userdata.map((user, index) => {
        if (user.business_unit_id === business.id) {
          user.business_unit = business.unit;
        }
      });
    });

    setNewData(userdata);
  };

  const handleSubNav = index => {
    if (index === currentProcess) {
      setOpen(!open);
    } else {
      if (open === true) {
        setOpen(open);
      } else {
        setOpen(!open);
      }
    }

    setCurrentProcess(index);
    setCurrentQuestion(0);
    setQuestions(l2ProcessCopy[index].maturity_questions[0].question_text);
  };
  const listItemClick = (index, event, newValue) => {
    setCurrentQuestion(index);
    setQuestions(l2ProcessCopy[currentProcess].maturity_questions[index].question_text);
  };

  const handleNextProcess = () => {
    if (currentProcess === l2ProcessCopy.length - 1) {
      if (currentQuestion === l2ProcessCopy[currentProcess].maturity_questions.length - 1) {
        props.onCompletion();
        window.scrollTo(0, 0);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setQuestions(props.l2Process[currentProcess].maturity_questions[currentQuestion + 1].question_text);
        window.scrollTo(0, 0);
      }
    } else {
      if (currentQuestion === l2ProcessCopy[currentProcess].maturity_questions.length - 1) {
        setCurrentProcess(currentProcess + 1);
        let resetIndex = 0;
        let resetProcess = currentProcess + 1;
        setCurrentQuestion(resetIndex);
        setQuestions(props.l2Process[resetProcess].maturity_questions[resetIndex].question_text);
        window.scrollTo(0, 0);
      } else {
        setQuestions(props.l2Process[currentProcess].maturity_questions[currentQuestion + 1].question_text);
        setCurrentQuestion(currentQuestion + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const handlePreviousProcess = () => {
    if (currentProcess === 0) {
      props.onPreviousStep();
    } else {
      setCurrentProcess(currentProcess - 1);
      setCurrentQuestion(0);
      setQuestions(props.l2Process[currentProcess - 1].maturity_questions[0].question_text);
    }
  };

  return (
    <React.Fragment>
      <Grid item xs={12} sm={5} md={3} style={{ backgroundColor: 'white' }}>
        <Grid container className={classes.options}>
          <Typography variant="h6">Select a process:</Typography>
          <Grid container direction="column" alignContent="flexStart">
            <Grid>
              <Grid item container>
                <Grid item style={{ width: '100%' }}>
                  <List component="nav" aria-label="main Level 2 Processes">
                    {l2ProcessCopy.map((items, index) => {
                      let subNav;
                      if (bSelected && items.maturity_questions.length > 0) {
                        subNav = items.maturity_questions.map((item, questionIndex) => {
                          const label = item.question_text;

                          return (
                            <ListItem
                              button
                              selected={index === currentProcess && questionIndex === currentQuestion % 4 ? true : false}
                              key={`subnav-${questionIndex + 1}`}
                              onClick={e => {
                                listItemClick(questionIndex);
                              }}>
                              <ListItemText primary={label} />
                            </ListItem>
                          );
                        });
                      }

                      return (
                        <div>
                          <ListItem
                            key={`nav-item-${index}`}
                            button
                            selected={index === currentProcess ? true : false}
                            onClick={
                              bSelected
                                ? e => {
                                    handleSubNav(index);
                                  }
                                : undefined
                            }>
                            <ListItemText primary={items.title} />

                            {open ? index === currentProcess ? <ExpandLess /> : <ExpandMore /> : <ExpandMore />}
                          </ListItem>
                          {open && index === currentProcess ? <List disablePadding>{subNav}</List> : null}
                        </div>
                      );
                    })}
                  </List>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={7} md={9}>
        <Grid container className={classes.root}>
          <Grid item container direction="column" alignContent="center">
            <Grid container direction="column">
              <Typography variant="h6"> {questions !== null ? questions : ''} </Typography>
              <br />
              <Typography>Filter Ratings</Typography>
            </Grid>
            {l2ProcessCopy[currentProcess] && (
              <Grid>
                <CurrentRating
                  l2ProcessCopy={l2ProcessCopy}
                  values={values}
                  setValues={setValues}
                  ratingAverage={ratingAverage}
                  totalReasons={totalReasons}
                  averageValue={averageValue}
                  maturityQuestions={maturityQuestions}
                  ratingInfo={ratingInfo}
                />
                {allRecords.map((userData, index) => (
                  <Grid>
                    {l2ProcessCopy[currentProcess].maturity_questions[currentQuestion].question_text === userData.ratingQuestion ? (
                      <Grid container>
                        <Grid item>
                          <ListItem>
                            <Typography variant="body2">
                              {userData.userName}-{userData.business_unit}
                            </Typography>
                          </ListItem>
                        </Grid>
                        <Grid item container wrap="wrap">
                          <ListItem>
                            <Paper elevation={0.8} className={classes.paperTextfield}>
                              <TextField disabled rows={2} multiline fullWidth value={userData.ratingReason} />
                            </Paper>
                          </ListItem>
                        </Grid>
                      </Grid>
                    ) : null}
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>

          <Grid item container justify="space-between" alignItems="baseline">
            <Grid item className={classes.backButton}>
              {currentProcess + 1 > 0 && (
                <Button variant="contained" color="primary" onClick={handlePreviousProcess}>
                  {currentProcess === 0 && currentQuestion === 0 ? 'Priorities' : 'Back'}
                </Button>
              )}
            </Grid>
            <Grid item className={classes.button}>
              <Button variant="contained" color="primary" onClick={handleNextProcess}>
                {currentProcess + 1 === l2ProcessCopy.length && currentQuestion + 1 === l2ProcessCopy[currentProcess].maturity_questions.length
                  ? 'Improvements'
                  : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default CurrentPositionOutput;
