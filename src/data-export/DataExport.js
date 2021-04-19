import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { positions } from '@material-ui/system';
import {
  Grid,
  FormControlLabel,
  Checkbox,
  Paper,
  Button,
  Link,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import { fetchUsers, fetchQuestionnaireAnswers, fetchMaturityModel, fetchDesignThinking } from '../common/API';

const useStyles = makeStyles(theme => ({
  paper: {
    width: '100%',
    maxWidth: '950px',
    margin: theme.spacing(6, 'auto'),
    padding: theme.spacing(3)
  },
  button: {
    float: 'right',
    marginTop: '10px'
  },
  link: {
    cursor: 'pointer'
  }
}));

export default function DataExport(props) {
  const classes = useStyles();
  const [activities, setActivities] = useState({});
  const [users, setUsers] = useState([]);
  const [data, setData] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchUsers(props.onMessage).then(data => {
      data.map(user => {
        user.checked = false;
      });
      setUsers(data);
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const {
        Parser,
        transforms: { unwind }
      } = require('json2csv');
      let fields, fileName;
      if (activities.download === 'maturity') {
        fields = [
          {
            label: 'Rating Type',
            value: 'rating_type'
          },
          {
            label: 'Project',
            value: 'project'
          },
          {
            label: 'User',
            value: 'user'
          },
          {
            label: 'L2 Process',
            value: 'l_2_process'
          },
          {
            label: 'Rating Value',
            value: 'rating_value'
          },
          {
            label: 'Perception Painpoints',
            value: 'pain_points.pain_point_text'
          },
          {
            label: 'Priority Justification',
            value: 'justification'
          },
          {
            label: 'Maturity Reason',
            value: 'reason'
          }
        ];
        fileName = 'caso-maturity-data';
      } else if (activities.download === 'design') {
        fields = [
          {
            label: 'Idea',
            value: 'idea'
          },
          {
            label: 'Project',
            value: 'project'
          },
          {
            label: 'User',
            value: 'user'
          },
          {
            label: 'Vote Type',
            value: 'vote_type'
          },
          {
            label: 'Vote Count',
            value: 'vote_count'
          }
        ];
        fileName = 'caso-design-thinking-data';
      } else {
        fields = [
          {
            label: 'Username',
            value: 'user.username'
          },
          {
            label: 'Project',
            value: 'project.name'
          },
          {
            label: 'Question',
            value: 'questionnaire_question.question_text'
          },
          {
            label: 'Answer',
            value: 'answer_text'
          }
        ];
        fileName = 'caso-ambition-data';
      }
      const transforms = [unwind({ paths: ['pain_points'] })];
      const opts = { fields, transforms };
      try {
        const parser = new Parser(opts);
        const csv = parser.parse(data);
        const pom = document.createElement('a');
        const csvContent = csv;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        pom.href = url;
        pom.setAttribute('download', 'CASOReport.csv');
        pom.click();
      } catch (err) {
        console.error(err);
      }
    }
  }, [data]);

  const handleActivityChange = event => {
    setActivities({ ...activities, [event.target.name]: event.target.checked });
  };
  const handleChange = (event, index) => {
    const userCopy = [...users];
    userCopy[index].checked = !userCopy[index].checked;
    setUsers(userCopy);
  };
  const handleSelectAllClick = () => {
    if (selectAll) {
      setSelectAll(false);
    } else {
      setSelectAll(true);
    }
    const userCopy = [...users];
    userCopy.forEach(user => {
      if (selectAll) {
        user.checked = true;
      } else {
        user.checked = false;
      }
    });
    setUsers(userCopy);
  };
  const handleExport = () => {
    // seperate activities & user ids
    let oActivities = [];
    let oUserIds = [];
    let counter = 0;
    users.map(user => {
      if (user.checked == false) {
        counter++;
      }
    });
    // check users which is selected
    if (users.length === counter) {
      props.onMessage('At least one user must be selected', 'error');
    } else {
      users.forEach(user => {
        if (user.checked) {
          oUserIds.push(user.id);
        }
      });
      // check activities
      for (var key in activities) {
        if (activities[key]) {
          oActivities.push(key);
        }
      }
      if (oActivities.length === 0) {
        props.onMessage('At least one activity must be selected', 'error');
      }
    }

    // handle api calls
    for (var i = 0; i < oActivities.length; i++) {
      if (oActivities[i] === 'checkedQuestionaire') {
        fetchQuestionnaireAnswers(oUserIds, props.onMessage).then(data => {
          if (data.length === 0) {
            props.onMessage('Selected User data not found', 'error');
          } else {
            setActivities({ ...activities, download: 'question' });
            setData(data);
          }
        });
      } else if (oActivities[i] === 'checkedMaturity') {
        fetchMaturityModel(oUserIds, props.onMessage).then(data => {
          if (data.length === 0) {
            props.onMessage('Selected User data not found', 'error');
          }
          setActivities({ ...activities, download: 'maturity' });
          setData(data);
        });
      } else if (oActivities[i] === 'checkedDesign') {
        fetchDesignThinking(oUserIds, props.onMessage).then(data => {
          if (data.length === 0) {
            props.onMessage('Selected User data not found', 'error');
          }
          setActivities({ ...activities, download: 'design' });
          setData(data);
        });
      }
    }
  };

  function FormRow() {
    return (
      <React.Fragment>
        <Grid container item xs={4} justify="center">
          <FormControlLabel
            control={<Checkbox color="default" checked={activities.checkedQuestionaire} onChange={handleActivityChange} name="checkedQuestionaire" />}
            label="Ambition Setting"
          />
        </Grid>
        <Grid container item xs={4} justify="center">
          <FormControlLabel
            control={<Checkbox color="default" checked={activities.checkedMaturity} onChange={handleActivityChange} name="checkedMaturity" />}
            label="Maturity Model Assessment"
          />
        </Grid>
        <Grid container item xs={4} justify="center">
          <FormControlLabel
            control={<Checkbox color="default" checked={activities.checkedDesign} onChange={handleActivityChange} name="checkedDesign" />}
            label="Design Thinking"
          />
        </Grid>
      </React.Fragment>
    );
  }

  return (
    <div>
      <Grid container justify="center">
        <Grid item>
          <Grid container justify="flex-end" style={{ marginTop: '0.8cm' }}>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleExport} className={classes.button}>
                export
              </Button>
            </Grid>
          </Grid>
          <Paper className={classes.paper}>
            <Grid container spacing={1}>
              <Typography variant="h5" component="h2">
                Activities
              </Typography>
              <Grid container item xs={12} spacing={3}>
                <FormRow />
              </Grid>
              <Typography variant="h5" component="h2">
                Users
              </Typography>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table aria-label="users table">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <Link onClick={handleSelectAllClick} className={classes.link}>
                            Select All
                          </Link>
                        </TableCell>
                        <TableCell>User ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Progress</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody id="users-table">
                      {/* TODO operator for no data */}
                      {users.map((row, index) => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                            <Checkbox color="default" checked={row.checked} onChange={e => handleChange(e, index)} name={row.username} />
                          </TableCell>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.username}</TableCell>
                          <TableCell>{row.email}</TableCell>
                          <TableCell>{row.progress}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
