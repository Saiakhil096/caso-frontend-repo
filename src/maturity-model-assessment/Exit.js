import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Box, Typography, Link, Button, Grid } from '@material-ui/core';

//import { Container, Box, Typography, Link, Button, Grid } from '@material-ui/core';
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
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  }
}));

function Exit() {
  const classes = useStyles();

  const history = useHistory();

  const handleClick = () => {
    const userRole = Cookies.get('role');
    if (userRole === 'Capgemini Users') {
      ///here
      history.push('/CapgeminiDashboard');
    } else {
      history.push('/');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography className={classes.paper} component="body1" color="textSecondary">
        Thank you very much for completing the exercise, your work has been forwarded to the Capgemini Team.
      </Typography>
      <Typography className={classes.paper} component="body1" color="textSecondary">
        The core project team will be in touch with the final output.
      </Typography>
      <Grid item>
        <Button variant="contained" style={{ marginTop: '5%', marginLeft: '205px' }} color="primary" onClick={e => handleClick()} alignItems="center">
          Dashboard
        </Button>
      </Grid>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default Exit;
