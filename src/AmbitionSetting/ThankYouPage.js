import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Box, Typography, Link, Button, Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="primary" href="https://capgemini.com/">
        Capgemini.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8)
  },
  button: {
    marginTop: theme.spacing(8)
  }
}));

function ThankYouPage(props) {
  const classes = useStyles();
  const history = useHistory();

  const handleClick = () => {
    const userRole = Cookies.get('role');
    if (userRole === 'Capgemini Users') {
      //here
      history.push('/CapgeminiDashboard');
    } else {
      history.push('/');
    }
  };

  return (
    <Container maxWidth="sm">
      <Grid container justify="center" spacing={8} className={classes.paper}>
        <Grid item>
          <Typography variant="h3" color="primary">
            Thank you!
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1" color="primary">
            Thank you very much for completing the exercise, your work has been forwarded to the Capgemini Team.
          </Typography>
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
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default ThankYouPage;
