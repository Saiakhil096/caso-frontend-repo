import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Button, Grid, Paper, Table, TableHead, TableBody, TableContainer, TableRow, TableCell } from '@material-ui/core';
import { fetchAmbitionSettingAnswers } from '../common/API';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(5)
  },
  tableWrapper: {
    padding: theme.spacing(2),
    width: '100%',
    minWidth: '750px'
  }
}));

function AmbitionSettingResultPage(props) {
  const classes = useStyles();
  const [answers, setAnswers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    fetchAmbitionSettingAnswers(props.onMessage, props.user)
      .then(data => {
        setAnswers(data);
      })
      .catch(e => {
        props.onMessage(e, 'error');
      });
  }, []);

  const handleClick = () => {
    const userRole = Cookies.get('role');
    if (userRole === 'Capgemini Users') {
      //here
      history.push('/CapgeminiDashboard');
    } else {
      history.push('/');
    }
  };

  if (answers.length > 0) {
    return (
      <Container maxWidth="sm">
        <Grid container justify="center" spacing={5} className={classes.paper}>
          <Grid item>
            <Typography variant="h5" color="primary">
              You have Completed this task Successfully
            </Typography>
          </Grid>
          <Grid item>
            <Paper>
              <TableContainer component={Paper} className={classes.tableWrapper}>
                <Table size="small" aria-label="projects table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Questions</TableCell>
                      <TableCell align="center">Answers</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {answers.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {index + 1}. {item.questionnaire_question.question_text}
                        </TableCell>
                        <TableCell>{item.answer_text}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          <Grid item>
            <Typography variant="body1" color="primary">
              The core project team will be in touch with the final output.
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={e => handleClick()}>
              Dashboard
            </Button>
          </Grid>
        </Grid>
      </Container>
    );
  } else {
    return null;
  }
}

export default AmbitionSettingResultPage;
