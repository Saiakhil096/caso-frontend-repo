import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, Typography, Switch, Select, FormControl, InputLabel, FormControlLabel, Radio, RadioGroup, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Cookies from 'js-cookie';
import { url } from '../common/API';

const useStyles = makeStyles(theme => ({
  headerMargin: {
    marginTop: theme.spacing(2)
  },
  content: {
    padding: theme.spacing(4)
  },
  background: {
    backgroundColor: '#F2F2F2'
  },
  fixedPosition: {
    position: 'sticky',
    top: theme.spacing(2),
    padding: '0px 7%'
  },
  radio: {
    margin: '0px'
  },
  selfAlignCenter: {
    alignSelf: 'center'
  },
  radioGroup: {
    margin: '5px 30px'
  },
  padding: {
    padding: '6px'
  },
  padding2: {
    padding: '6px 6px 6px 33px'
  },
  paddingTop: {
    padding: '20px 0px'
  },
  questionText: {
    overflowWrap: 'anywhere',
    width: '100%'
  },
  textField: {
    width: '100%'
  }
}));

function ChangeReadinessForm(props) {
  const [isAnonymousUser, setIsAnonymousUser] = useState(false);
  const [formData, setFormData] = useState({
    question_answer: [],
    response_date: new Date(),
    project: Cookies.get('project')
  });

  const { onMessage, jobRoleData, keyLocationData, businessUnitData, changeReadinessQuestions, setIsSurveyTaken } = props;

  const classes = useStyles();

  useEffect(() => {
    const userId = isAnonymousUser === false ? Cookies.get('user') : null;
    setFormData({
      ...formData,
      user: userId
    });
  }, [isAnonymousUser]);

  const handleBaseLocationChange = (event, baseLocation) => {
    setFormData({
      ...formData,
      key_location: baseLocation
    });
  };

  const handleBusinessUnitChange = (event, businessUnit) => {
    setFormData({
      ...formData,
      business_unit: businessUnit
    });
  };

  const handleJobRoleChange = (event, jobRole) => {
    setFormData({
      ...formData,
      persona_job_role: jobRole
    });
  };

  const handleSwitchToggle = () => {
    setIsAnonymousUser(!isAnonymousUser);
  };

  const generateQuestions = () => {
    let questions = [];
    changeReadinessQuestions.map((question, index) => {
      questions.push(
        <React.Fragment>
          <Grid item className={classes.paddingTop}>
            <Grid item className={classes.padding}>
              <Typography variant="body1" className={classes.questionText}>
                {index + 1}. {question.question_text}
              </Typography>
            </Grid>
            {question.question_type === 'objective' ? generateRadioButtons(question.id) : generateTextField(question.id)}
          </Grid>
        </React.Fragment>
      );
    });
    return <Grid>{questions}</Grid>;
  };

  const generateRadioButtons = questionId => {
    return (
      <Grid container className={classes.padding2}>
        <Typography variant="body1" className={classes.selfAlignCenter}>
          Strongly Disagree
        </Typography>
        <FormControl>
          <RadioGroup row name="rating" className={classes.radioGroup} onChange={event => onResponseChange(event, questionId)}>
            <FormControlLabel value="1" control={<Radio color="primary" />} label="1" labelPlacement="top" className={classes.radio} />
            <FormControlLabel value="2" control={<Radio color="primary" />} label="2" labelPlacement="top" className={classes.radio} />
            <FormControlLabel value="3" control={<Radio color="primary" />} label="3" labelPlacement="top" className={classes.radio} />
            <FormControlLabel value="4" control={<Radio color="primary" />} label="4" labelPlacement="top" className={classes.radio} />
            <FormControlLabel value="5" control={<Radio color="primary" />} label="5" labelPlacement="top" className={classes.radio} />
          </RadioGroup>
        </FormControl>
        <Typography variant="body1" className={classes.selfAlignCenter}>
          Strongly Agree
        </Typography>
      </Grid>
    );
  };

  const generateTextField = questionId => {
    return (
      <Grid container className={classes.padding2}>
        <FormControl className={classes.textField}>
          <TextField variant="filled" label="Answer" multiline fullWidth={true} rows={4} onChange={event => onResponseChange(event, questionId)} />
        </FormControl>
      </Grid>
    );
  };

  const onResponseChange = (event, questionId) => {
    const newResponse = {
      change_readiness_question: { id: questionId },
      response: event.target.value
    };
    const quesAnsResponse = formData.question_answer;
    const spliceIndex = quesAnsResponse.findIndex(quesAns => {
      return quesAns.change_readiness_question.id === questionId;
    });
    if (spliceIndex != -1) {
      quesAnsResponse.splice(spliceIndex, 1);
      quesAnsResponse.push(newResponse);
    } else {
      quesAnsResponse.push(newResponse);
    }
    setFormData({
      ...formData,
      question_answer: quesAnsResponse
    });
  };

  const onSave = () => {
    if (validateResponse()) {
      submitAnswers();
    } else {
      onMessage('You must answer all the questions', 'warning');
      return;
    }
  };

  const validateResponse = () => {
    return (
      (formData.business_unit || businessUnitData.length === 0) &&
      (formData.key_location || keyLocationData.length === 0) &&
      (formData.persona_job_role || jobRoleData.length === 0) &&
      formData.question_answer.length === changeReadinessQuestions.length &&
      Object.values(formData.question_answer).every(quesAns => quesAns.response != '')
    );
  };

  const submitAnswers = () => {
    const requestHeaders = {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    };
    fetch(new URL('change-readiness-responses', url), {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then(() => {
        setIsSurveyTaken(true);
        onMessage('Your answers have been submitted', 'success');
      })
      .catch(e => {
        props.onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      });
  };

  return (
    <Grid container direction="column" spacing={2} className={classes.fixedPosition}>
      <Grid item>
        <Typography variant="body2">Record Anonymously</Typography>
      </Grid>
      <Grid item>
        <Switch checked={isAnonymousUser} onChange={handleSwitchToggle} color="primary" />
      </Grid>
      <Grid className={classes.paddingTop}>
        <Grid item className={classes.padding}>
          <Typography variant="body1">Which business unit are you a part of?</Typography>
        </Grid>
        <Grid item className={classes.padding}>
          <Autocomplete
            id="business_unit"
            options={businessUnitData}
            value={formData.business_unit}
            autoHighlight
            getOptionLabel={option => option.unit}
            getOptionSelected={(option, value) => option.unit == value.unit}
            onChange={handleBusinessUnitChange}
            renderInput={params => (
              <TextField
                {...params}
                label="Select Answer"
                variant="filled"
                inputProps={{
                  ...params.inputProps
                }}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid className={classes.paddingTop}>
        <Grid item className={classes.padding}>
          <Typography variant="body1">What is your base location?</Typography>
        </Grid>
        <Grid item className={classes.padding}>
          <Autocomplete
            id="base_location"
            options={keyLocationData}
            value={formData.key_location}
            autoHighlight
            getOptionLabel={option => option.location}
            getOptionSelected={(option, value) => option.location == value.location}
            onChange={handleBaseLocationChange}
            renderInput={params => (
              <TextField
                {...params}
                label="Select Answer"
                variant="filled"
                inputProps={{
                  ...params.inputProps
                }}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid className={classes.paddingTop}>
        <Grid item className={classes.padding}>
          <Typography variant="body1">What job role do you represent?</Typography>
        </Grid>
        <Grid item className={classes.padding}>
          <Autocomplete
            id="job_role"
            options={jobRoleData}
            value={formData.persona_job_role}
            autoHighlight
            getOptionLabel={option => option.job_role}
            getOptionSelected={(option, value) => option.job_role == value.job_role}
            onChange={handleJobRoleChange}
            renderInput={params => (
              <TextField
                {...params}
                label="Select Answer"
                variant="filled"
                inputProps={{
                  ...params.inputProps
                }}
              />
            )}
          />
        </Grid>
      </Grid>
      {generateQuestions()}
      <Grid container item justify="space-between" alignItems="baseline">
        <Grid item></Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={onSave}>
            Save
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ChangeReadinessForm;
