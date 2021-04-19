import React, { useState } from 'react';
import { Switch, Route, Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Container, Typography, Grid, Box, Link, TextField, Button, Avatar } from '@material-ui/core';
import ForgotPassword from './ForgotPassword';
import { url } from '../common/API';

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
    fontColor: 'black'
  },
  avatar: {
    margin: theme.spacing(1)
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  label: {
    color: 'black'
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

function SignIn(props) {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // todo: loading screen
  // const { setLoading } = props;

  const handleLogin = e => {
    e.preventDefault();

    if (username.length < 1) {
      props.onMessage('You must enter a username', 'error');
      return;
    } else if (password.length < 1) {
      props.onMessage('You must enter a password', 'error');
      return;
    }

    const API_CALL = new URL('auth/local', url);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const raw = JSON.stringify({
      identifier: username,
      password: password
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(API_CALL, requestOptions)
      .then(response => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then(response => {
        props.onMessage('You have been logged in', 'success');
        // setLoading(true);
        props.onSignedIn(response);
      })
      .catch(e => {
        const errMessage = e.status === 400 ? 'Incorrect username or password' : `Error ${e.status}: ${e.statusText}`;
        props.onMessage(errMessage, 'error');
      });
  };

  return (
    <Container maxWidth="xs">
      <div className={classes.paper}>
        <Switch>
          <Route exact path="/">
            <React.Fragment>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <form className={classes.form} noValidate>
                <TextField
                  variant="filled"
                  margin="normal"
                  required
                  fullWidth
                  InputLabelProps={{
                    className: classes.label
                  }}
                  id="username"
                  label="Username"
                  name="username"
                  onChange={e => setUsername(e.target.value)}
                  autoComplete="username"
                  autoFocus
                />
                <TextField
                  variant="filled"
                  margin="normal"
                  required
                  fullWidth
                  InputLabelProps={{
                    className: classes.label
                  }}
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={handleLogin}>
                  Sign In
                </Button>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Link component={RouterLink} to="/forgot-password" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </React.Fragment>
          </Route>
          <Route path="/forgot-password">
            <ForgotPassword onMessage={props.onMessage} />
          </Route>
        </Switch>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default SignIn;
