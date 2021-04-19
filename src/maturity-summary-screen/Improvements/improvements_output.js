import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import ImprovementRating from './improvementRating';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { Grid, Typography, Button, Box, Paper, List, ListItem, ListItemText } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(5),
    flexGrow: 1,
    backgroundColor: grey[50]
  },
  subheading: {
    color: grey[500]
  },
  bottom: {
    marginTop: theme.spacing(2)
  },
  button: {
    marginRight: theme.spacing(8),
    marginTop: theme.spacing(8)
  },
  fixedPosition: {
    position: 'sticky',
    top: theme.spacing(2)
  },
  icon: {
    padding: theme.spacing(0.5),
    marginBottom: theme.spacing(2.5)
  },
  titleSpacing: {
    marginBottom: theme.spacing(1)
  },
  toggleGroupStyle: {
    flexDirection: 'column'
  },
  options: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(1)
  }
}));

function ImprovementOutput(props) {
  const classes = useStyles();

  var filteredDataCopy = props.filteredData;

  const [improvementQuestions, setImprovementQuestions] = useState('');
  const [l2ProcessCopy, setL2ProcessCopy] = useState([]);
  const [values, setValues] = useState();
  const [userData, setUserData] = useState([]);
  const [newdata, setNewData] = useState([]);
  const [ratingInfo, setRatingInfo] = useState([]);
  const [allData, setAllData] = useState([]);
  const [maturityQuestions, setMaturityQuestions] = useState([]);
  const [currentProcess, setCurrentProcess] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [open, setOpen] = React.useState(true);
  const totalLength = props.l2Process.length;
  const bSelected = true;
  const handleImprovementQuestions = (event, newValue) => {
    setImprovementQuestions(newValue);
  };
  const history = useHistory();
  useEffect(() => {
    improvementsBody();
  }, []);

  useEffect(() => {
    improvementRatingData(userData);
  }, [userData]);
  useEffect(() => {
    businessUnitData(allData);
  }, [allData]);

  useEffect(() => {
    if (props.l2Process && props.l2Process.length > 0) {
      setL2ProcessCopy(props.l2Process);
      setImprovementQuestions(props.l2Process[currentProcess].maturity_questions[currentQuestion].question_text);
    }
  }, [props.l2Process]);

  useEffect(() => {
    let questionsFound = newdata.filter(j => {
      return improvementQuestions.indexOf(j.ratingQuestion) !== -1;
    });
    setMaturityQuestions(questionsFound);
  }, [newdata]);

  useEffect(() => {
    if (improvementQuestions !== null) {
      let questionsFound = newdata.filter(j => {
        return improvementQuestions.indexOf(j.ratingQuestion) !== -1;
      });
      setMaturityQuestions(questionsFound);
    }
  }, [newdata, improvementQuestions]);

  useEffect(() => {
    if (improvementQuestions !== null) {
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
  }, [props.filteredData, maturityQuestions, improvementQuestions]);

  const improvementsBody = () => {
    var l2ProcessCopy = props.l2Process;
    let userdata = [];
    l2ProcessCopy.map((process, index) => {
      process.maturity_questions.map((question, index) => {
        props.currentRatingData.map(rating =>
          rating.maturity_rating.map((cRating, index) => {
            if (cRating.maturity_question.id === question.id) {
              const user = {
                l2process_id: process.id,
                userName: rating.user.username,
                currentRating: cRating.rating,
                ratingReason: cRating.reason,
                questionId: cRating.maturity_question.id,
                ratingQuestion: cRating.maturity_question.question_text,
                business_unit_id: rating.user.business_unit
              };
              userdata.push(user);
            }
          })
        );
      });
    });
    setL2ProcessCopy(l2ProcessCopy);
    setUserData(userdata);

    setImprovementQuestions(l2ProcessCopy.length > 0 ? l2ProcessCopy[0].maturity_questions[0].question_text : '');
  };
  const improvementRatingData = ratingData => {
    props.improvementData.map(i =>
      i.improvement_rating.map((iRating, index) => {
        userData.map((user, index) => {
          if (user.ratingQuestion === iRating.maturity_question.question_text) {
            user.improvementRating = iRating.rating;
          }
        });
      })
    );
    setAllData(ratingData);
  };
  const businessUnitData = userInfo => {
    props.businessData.map((business, index) => {
      userInfo.map((user, index) => {
        if (user.business_unit_id === business.id) {
          user.business_unit = business.unit;
        }
      });
    });

    setNewData(userInfo);
  };

  const average = ratingInfo.map(k => k.currentRating);
  let ratingAverage = [].concat(...average);
  var total = 0;
  for (var j = 0; j < ratingAverage.length; j++) {
    total += ratingAverage[j];
  }
  let averageValue = total / ratingAverage.length;
  averageValue = Math.round(averageValue);

  const improvementAverage = ratingInfo.map(k => k.improvementRating);
  let totalReasons = [].concat(...improvementAverage);
  var totalImprovements = 0;
  for (var j = 0; j < totalReasons.length; j++) {
    totalImprovements += totalReasons[j];
  }

  let averageImprovements = totalImprovements / totalReasons.length;
  averageImprovements = Math.round(averageImprovements);

  const listItemClick = (index, event, newValue) => {
    setCurrentQuestion(index);
    setImprovementQuestions(l2ProcessCopy[currentProcess].maturity_questions[index].question_text);
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
    setImprovementQuestions(l2ProcessCopy[index].maturity_questions[0].question_text);
  };

  const handleNextProcess = () => {
    if (currentProcess === l2ProcessCopy.length - 1) {
      if (currentQuestion === l2ProcessCopy[currentProcess].maturity_questions.length - 1) {
        history.push('/CapgeminiDashboard');
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setImprovementQuestions(props.l2Process[currentProcess].maturity_questions[currentQuestion + 1].question_text);
      }
    } else {
      if (currentQuestion === l2ProcessCopy[currentProcess].maturity_questions.length - 1) {
        setCurrentProcess(currentProcess + 1);
        let resetIndex = 0;
        let resetProcess = currentProcess + 1;
        setCurrentQuestion(resetIndex);
        setImprovementQuestions(props.l2Process[resetProcess].maturity_questions[resetIndex].question_text);
      } else {
        setImprovementQuestions(props.l2Process[currentProcess].maturity_questions[currentQuestion + 1].question_text);
        setCurrentQuestion(currentQuestion + 1);
      }
    }
  };

  const handlePreviousProcess = () => {
    if (currentProcess === 0) {
      props.onPreviousStep();
    } else {
      setCurrentProcess(currentProcess - 1);
      setCurrentQuestion(0);
      setImprovementQuestions(props.l2Process[currentProcess - 1].maturity_questions[0].question_text);
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
      <Grid xs={12} sm={7} md={9}>
        <Grid container className={classes.root}>
          <Grid item container>
            <Grid container direction="column" alignContent="center">
              <Grid item container direction="column">
                <Typography variant="h6">{improvementQuestions}</Typography>
                <br />
                <Typography>Filter Ratings</Typography>
              </Grid>
              <br />
              <ImprovementRating
                l2ProcessCopy={l2ProcessCopy}
                values={values}
                setValues={setValues}
                ratingAverage={ratingAverage}
                averageImprovements={averageImprovements}
                averageValue={averageValue}
                ratingInfo={ratingInfo}
              />
            </Grid>
          </Grid>

          <Grid item container justify="space-between" alignItems="baseline">
            <Grid item className={classes.button}>
              {currentProcess + 1 > 0 && (
                <Button variant="contained" color="primary" onClick={handlePreviousProcess}>
                  {currentProcess === 0 && currentQuestion === 0 ? 'Current Position' : 'Back'}
                </Button>
              )}
            </Grid>
            <Grid item className={classes.button}>
              {currentProcess + 1 > 0 && (
                <Button variant="contained" color="primary" onClick={handleNextProcess}>
                  {currentProcess + 1 === totalLength && currentQuestion + 1 === props.l2Process[totalLength - 1].maturity_questions.length
                    ? 'Dashboard'
                    : 'Next'}
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default ImprovementOutput;
