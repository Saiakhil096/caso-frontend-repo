import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';
import { url } from '../common/API';
import { Grid, ListItem, ListItemText, List, FormControl } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import AmbitionSettingResult from './AmbitionSettingResult';
import Cookies from 'js-cookie';
import { fetchUsers, fetchBussinessUnits } from '../common/API';

const useStyles = makeStyles(theme => ({
  background: {
    backgroundColor: '#C0C0C0'
  },
  paper: {
    backgroundColor: 'inherit'
  },
  buttonalign: {
    justifyContent: 'flex-end',
    display: 'flex'
  },
  styling: {
    marginTop: '5px',
    marginBottom: '5px'
  },
  textfieldstyle: {
    width: '20rem',
    marginLeft: theme.spacing(2),
    height: '6rem',
    overflow: 'auto'
  }
}));

function AmbitionSettingOutput(props) {
  const classes = useStyles();
  const [answerSet, setAnswerSet] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState();
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [step, setStep] = useState(1);
  const [questionList, setQuestionList] = useState([]);
  const [businessUnitList, setBusinessUnitList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [users, setUsers] = useState([]);
  const [businessUnits, setBusinessUnits] = useState([]);
  const [businessData, setBusinessData] = React.useState([]);
  const [filteredValue, setFilteredValue] = React.useState([]);
  const [ambitionAnswerData, setAmbitionAnswerData] = React.useState([]);
  const [ambitionQuestionData, setAmbitionQuestionData] = React.useState([]);
  const [filterText, setFilterText] = useState('Hide Filter Tab');
  const [open, setOpen] = useState(false);
  const project = Cookies.get('project');
  const [loading, setLoading] = React.useState(true);
  const [filteredDatas, setFilteredDatas] = useState([]);

  let filteredDataCopy = [];

  const handleFilteredData = () => {
    if (filteredDatas.length > 0) {
      if (businessUnits.length < 1 && users.length < 1) {
        setFilteredValue([]);
      } else {
        setFilteredValue(filteredDatas);
      }
    }
  };

  const handleClick = () => {
    setOpen(!open);
    if (open) {
      setFilterText('Hide Filter Tab');
    } else {
      setFilterText('Show Filter Tab');
    }
  };

  useEffect(() => {
    fetchRequests(project);
  }, []);

  const fetchRequests = async project => {
    const requestHeaders = {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    };
    const ambitionAnswerResponse = fetch(new URL(`questionnaire-answers?project=${project}`, url), {
      method: 'get',
      headers: requestHeaders
    });
    const businessResponse = fetch(new URL(`business-units?projects=${project}`, url), {
      method: 'get',
      headers: requestHeaders
    });
    const ambitionQuestionResponse = fetch(new URL(`questionnaire-questions?project.id=${project}`, url), {
      method: 'get',
      headers: requestHeaders
    });
    Promise.all([ambitionAnswerResponse, ambitionQuestionResponse, businessResponse])
      .then(async ([ambitionAnswerData, ambitionQuestionData, businessData]) => {
        const ambitionAnswerDataJson = await ambitionAnswerData.json();
        const ambitionQuestionDataJson = await ambitionQuestionData.json();
        const businessDataJson = await businessData.json();

        setAmbitionAnswerData(ambitionAnswerDataJson);
        setAmbitionQuestionData(ambitionQuestionDataJson);
        setBusinessData(businessDataJson);

        setLoading(false);
      })
      .catch(e => {
        props.onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      });
  };

  useEffect(() => {
    Promise.all([fetchBussinessUnits(Cookies.get('project'), props.onMessage), fetchUsers(props.onMessage)])
      .then(data => {
        setBusinessUnitList(
          data[0]
            ? data[0].map(i => {
                return { businessunit: i.unit };
              })
            : []
        );
        setUserList(
          data[1]
            ? data[1].map(i => {
                if (i.name == null) return { user: '' };
                else return { user: i.name };
              })
            : []
        );
      })
      .catch(e => {
        props.onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      });
  }, []);
  useEffect(() => {
    const Data = { maturity_BU: businessUnits, maturity_user: users };
    filteredDataCopy.push(Data);

    setFilteredDatas(
      filteredDataCopy.map(i => {
        return {
          BU: i.maturity_BU.map(j => j.businessunit),
          User: i.maturity_user.map(l => l.user)
        };
      })
    );
  }, [businessUnits, users]);

  const filters = () => {
    return (
      <Grid container>
        <Grid item container justify="flex-end">
          <Grid item>
            <List>
              <ListItem button onClick={handleClick}>
                <ListItemText primary={filterText} />
              </ListItem>
            </List>
          </Grid>
          {open ? null : (
            <Grid item container spacing={2}>
              <Grid item>
                <Autocomplete
                  multiple
                  filterSelectedOptions
                  id="add-businessUnits"
                  options={businessUnitList}
                  value={businessUnits}
                  getOptionLabel={option => option.businessunit}
                  getOptionSelected={(option, value) => option.businessunit === value.businessunit}
                  onChange={(event, newValue) => {
                    setBusinessUnits(newValue);
                  }}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        color="primary"
                        label={option.businessunit}
                        style={{ marginTop: '5px', marginBottom: '5px' }}
                        variant="outlined"
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={params => <TextField variant="filled" className={classes.textfieldstyle} {...params} label="Business Unit" />}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  multiple
                  filterSelectedOptions
                  id="add-users"
                  options={userList}
                  value={users}
                  getOptionLabel={option => option.user}
                  getOptionSelected={(option, value) => option.user === value.user}
                  onChange={(event, newValue) => {
                    setUsers(newValue);
                  }}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        color="primary"
                        label={option.user}
                        style={{ marginTop: '5px', marginBottom: '5px' }}
                        variant="outlined"
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={params => (
                    <TextField
                      variant="filled"
                      style={{ marginBottom: '0.5cm' }}
                      className={classes.textfieldstyle}
                      {...params}
                      label="Select Users"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Button variant="contained" style={{ margin: '0px 15px 40px' }} color="primary" onClick={handleFilteredData}>
                  Search
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    );
  };

  return (
    <React.Fragment>
      <Grid container>
        {filters()}
        <Divider />
        <Grid item container style={{ width: '100%' }}>
          <Grid item>
            <AmbitionSettingResult
              questionList={questionList}
              step={step}
              answerSet={answerSet}
              setCurrentQuestion={setCurrentQuestion}
              setCurrentAnswer={setCurrentAnswer}
              onMessage={props.onMessage}
              setAmbitionAnswerData={setAmbitionAnswerData}
              ambitionAnswerData={ambitionAnswerData}
              setAmbitionQuestionData={setAmbitionQuestionData}
              ambitionQuestionData={ambitionQuestionData}
              businessData={businessData}
              setBusinessData={setBusinessData}
              filteredData={filteredValue}
              setStep={setStep}
            />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
export default AmbitionSettingOutput;
