import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Grid, Backdrop, CircularProgress } from '@material-ui/core';
import QuestionTile from './QuestionTile';
import {
  createQuestionnaireAnswer,
  fetchQuestionnaireQuestions,
  updateUser,
  fetchAmbitionSettingAnswers,
  updateQuestionnaireAnswers,
  fetchUser
} from '../common/API';
import ThankYouPage from './ThankYouPage';
import AmbitionSettingLeftPane from './AmbitionSettingLeftPane';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(15, 8)
  }
}));

function AmbitionSetting(props) {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [exit, setExit] = useState(false);
  const [questionList, setQuestionList] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState();
  const [currentQuestion, setCurrentQuestion] = useState();
  const [loading, setLoading] = React.useState(true);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [step, setStep] = useState(1);
  const [answerSet, setAnswerSet] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const [operation, setOperation] = useState('POST');
  const history = useHistory();

  useEffect(() => {
    fetchAmbitionSettingAnswers(props.onMessage, props.user)
      .then(data => {
        if (data.length > 0) {
          setCurrentQuestion(data[0].questionnaire_question.question_text);
          setCurrentAnswer(data[0].answer_text);
          data.map((item, index) => {
            questionList.push(item.questionnaire_question);
            answerSet.push(item.answer_text);
          });
          setAnswerList(data);
          setTotalQuestions(data.length);
          setOperation('PUT');
          setLoading(false);
        } else {
          fetchQuestionnaireQuestions(props.onMessage)
            .then(data => {
              setQuestionList(data);
              if (data.length > 0) setCurrentQuestion(data[0].question_text);
              setTotalQuestions(data.length);
              setEmptyAnswers(data.length);
              setLoading(false);
            })
            .catch(e => {
              props.onMessage(e, 'error');
            });
        }
      })
      .catch(e => {
        props.onMessage(e, 'error');
      });
  }, []);

  const setEmptyAnswers = datalength => {
    var arr = new Array(datalength);
    for (let index = 0; index < arr.length; index++) {
      arr[index] = '';
    }
    setAnswerSet(arr);
  };

  function checkAllAnswers() {
    for (let index = 0; index < answerSet.length; index++) {
      const element = answerSet[index];
      if (element === '') {
        return false;
      }
    }
    return true;
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleNextStep = e => {
    setOpenDialog(true);
  };

  const handleCloseDialogAccept = () => {
    if (checkAllAnswers()) {
      Promise.all(
        questionList.map((item, index) => {
          if (operation === 'POST') {
            const data = {
              user: props.user,
              project: Cookies.get('project'),
              answer_text: answerSet[index],
              questionnaire_question: item
            };
            return createQuestionnaireAnswer(data, props.onMessage);
          } else {
            const data = {
              id: answerList[index].id,
              user: props.user,
              project: Cookies.get('project'),
              answer_text: answerSet[index],
              questionnaire_question: item
            };
            return updateQuestionnaireAnswers(data, props.onMessage);
          }
        })
      )
        .then(() => {
          props.onMessage('Successfully added your response', 'success');
          setCompleted();
        })
        .catch(e => props.onMessage(e, 'error'));
    } else {
      props.onMessage('Please answer all the questions', 'error');
    }

    setOpenDialog(false);
  };

  const setCompleted = () => {
    if (props.user != Cookies.get('user')) {
      Cookies.remove('ambitionSettingUser');
      history.push('/manage-users');
    } else {
      var user = Cookies.get('user');
      var project = Cookies.get('project');
      fetchUser(props.onMessage, user)
        .then(data => {
          data.ambition_setting.map((item, index) => {
            if (project === String(item.project.id)) {
              data.ambition_setting[index].status = 'completed';
            }
          });
          updateUser(user, data, props.onMessage)
            .then(data => {
              setExit(true);
            })
            .catch(e => {
              props.onMessage(`Error: ${e}`, 'error');
            });
        })
        .catch(e => props.onMessage(e, 'error'));
    }
  };

  const nextQuestion = e => {
    e.preventDefault();
    if (currentAnswer === '') {
      props.onMessage('Please fill the required field', 'error');
    } else {
      if (currentAnswer.length < 2 && step != 2) {
        props.onMessage('You must enter at least 2 characters per question', 'warning');
      } else {
        const answersCopy = JSON.parse(JSON.stringify(answerSet));
        answersCopy[step - 1] = currentAnswer;
        setAnswerSet(answersCopy);
        if (step != totalQuestions) {
          setCurrentAnswer(answerSet[step]);
          setCurrentQuestion(questionList[step].question_text);
          setStep(step + 1);
        } else {
          handleNextStep(answerSet, questionList);
          // handleNextStep(answerSet, questionList);
        }
      }
    }
  };

  const prevQuestion = e => {
    e.preventDefault();
    setCurrentAnswer(answerSet[step - 2]);
    setCurrentQuestion(questionList[step - 2].question_text);
    setStep(step - 1);
  };

  const confirmationDialog = () => {
    return (
      <Dialog open={openDialog} onClose={handleCloseDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Proceed to Next Step</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure you want to save your answers?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button data-testid="dialog-no" onClick={handleCloseDialog} color="primary">
            No
          </Button>
          <Button data-testid="dialog-yes" onClick={handleCloseDialogAccept} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  if (exit) {
    return (
      <React.Fragment>
        <ThankYouPage onMessage={props.onMessage} />
      </React.Fragment>
    );
  } else {
    if (loading) {
      return (
        <Backdrop open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    } else {
      return (
        <React.Fragment>
          <Grid container style={{ height: '100%' }}>
            <Grid item sm={4} className={classes.content}>
              <AmbitionSettingLeftPane
                questionList={questionList}
                step={step}
                answerSet={answerSet}
                setCurrentQuestion={setCurrentQuestion}
                setCurrentAnswer={setCurrentAnswer}
                onMessage={props.onMessage}
                setStep={setStep}
              />
            </Grid>
            <QuestionTile
              onMessage={props.onMessage}
              handleNextStep={handleNextStep}
              questionList={questionList}
              currentQuestion={currentQuestion}
              currentAnswer={currentAnswer}
              setCurrentQuestion={setCurrentQuestion}
              setCurrentAnswer={setCurrentAnswer}
              nextQuestion={nextQuestion}
              prevQuestion={prevQuestion}
              step={step}
              totalQuestions={totalQuestions}
            />
          </Grid>
          {confirmationDialog()}
        </React.Fragment>
      );
    }
  }
}

export default AmbitionSetting;
