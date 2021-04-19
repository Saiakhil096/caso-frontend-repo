import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Grid, Typography, Box, TextField, Paper, ListItem } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    backgroundColor: '#F3F3F3'
  },
  subheading: {
    color: grey[500]
  },
  paper: {
    backgroundColor: 'inherit'
  },
  bottom: {
    marginBottom: theme.spacing(1)
  },
  content: {
    padding: theme.spacing(8)
  },
  toggleGroupStyle: {
    flexDirection: 'column'
  },
  gridStyle: {
    marginTop: theme.spacing(1.2)
  },
  textfieldPadding: {
    borderRadius: '5px 5px 0 0',
    maxHeight: 190
  },
  paperTextfield: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    '& > *': {
      margin: theme.spacing(2),
      marginBottom: theme.spacing(1)
    },
    title: {
      marginTop: theme.spacing(3)
    }
  },
  titleSpacing: {
    marginBottom: theme.spacing(1.5)
  },
  options: {
    marginTop: theme.spacing(8)
  },
  options3: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(5),
    padding: theme.spacing(4)
  }
}));
const toggleStyles = makeStyles(
  {
    root: {
      backgroundColor: 'inherit',
      textTransform: 'none',
      justifyContent: 'flex-start',

      '&$selected': {
        backgroundColor: 'inherit',
        color: '#1381B9',
        disableFocusRipple: 'true',
        '&:hover': {
          backgroundColor: 'inherit',
          color: '#1381B9'
        }
      }
    },
    selected: {}
  },
  { name: 'MuiToggleButton' }
);

function AmbitionSettingResult(props) {
  const classes = useStyles();
  const toggleClass = toggleStyles();
  const [questions, setQuestions] = useState('');
  const [data, setData] = useState([]);
  const [ratingInfo, setRatingInfo] = useState([]);
  const [ambitionQuestions, setAmbitionQuestions] = useState([]);
  var filteredDataCopy = props.filteredData;

  useEffect(() => {
    let questionsFound = data.filter(j => {
      return questions.indexOf(j.question_text) !== -1;
    });
    setAmbitionQuestions(questionsFound);
  }, [data]);

  useEffect(() => {
    if (questions !== null) {
      let questionsFound = data.filter(j => {
        return questions.indexOf(j.question_text) !== -1;
      });
      setAmbitionQuestions(questionsFound);
    }
  }, [data, questions]);
  // filter code
  useEffect(() => {
    if (questions !== null) {
      if (filteredDataCopy.length > 0) {
        if (filteredDataCopy[0].User.length > 0) {
          let usersFound = ambitionQuestions.filter(j => {
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
          let buFound = ambitionQuestions.filter(j => {
            return filteredDataCopy[0].BU.indexOf(j.business_unit) !== -1;
          });
          setRatingInfo(buFound);
        }
      } else {
        setRatingInfo(ambitionQuestions);
      }
    } else {
      setRatingInfo([]);
    }
  }, [filteredDataCopy, ambitionQuestions, questions]);

  const dataBody = () => {
    const userData = [];
    props.ambitionAnswerData.map((answer, index) => {
      props.ambitionQuestionData.map((question, index) => {
        props.businessData.map((business, index) => {
          if (answer.questionnaire_question.id === question.id && answer.user.business_unit === business.id) {
            const user = {
              userName: answer.user.username,
              user_business_unit_id: answer.user.business_unit,
              question_id: question.id,
              question_answer: answer.answer_text,
              question_text: answer.questionnaire_question.question_text,
              business_unit: business.unit
            };
            userData.push(user);
          }
        });
      });
    });
    setData(userData);
    setQuestions(props.ambitionQuestionData.length > 0 ? props.ambitionQuestionData[0].question_text : '');
  };
  useEffect(() => {
    dataBody();
  }, [props.ambitionAnswerData, props.businessData, props.ambitionQuestionData]);

  const handleList = (event, newValue) => {
    setQuestions(newValue);
  };

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={12} sm={5} md={3} style={{ backgroundColor: 'white' }}>
          <Grid container className={classes.options3}>
            <Grid item container alignitems="center">
              <Typography variant="h6">Select a question:</Typography>
            </Grid>
            <Grid container direction="column">
              <Grid container className={classes.bottom}>
                <Grid item container>
                  <Grid item>
                    <ToggleButtonGroup className={classes.toggleGroupStyle} value={questions} exclusive>
                      {props.ambitionQuestionData.map((data, index) => (
                        <ToggleButton
                          style={{ border: 0 }}
                          value={data.question_text}
                          key={data.question_text}
                          className={toggleClass.root}
                          aria-label={data.question_text}
                          onClick={handleList}>
                          {index + 1}.{data.question_text}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={7} md={9} className={classes.root} style={{ flex: 3 }}>
          <Grid container className={classes.root}>
            <Grid item container direction="column" alignContent="center">
              <Grid item container direction="column">
                <Typography variant="h6">{questions !== null ? questions : ''}</Typography>
              </Grid>
              <Grid item container>
                {ratingInfo.map((data, index) => (
                  <Grid item container>
                    <Grid item>
                      <ListItem>
                        <Typography variant="body2">
                          {data.userName}-{data.business_unit}
                        </Typography>
                      </ListItem>
                    </Grid>
                    <Grid item container wrap="wrap">
                      <ListItem>
                        <Paper elevation={0.8} className={classes.paperTextfield}>
                          <TextField disabled fullWidth={true} value={data.question_answer} />
                        </Paper>
                      </ListItem>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
export default AmbitionSettingResult;
