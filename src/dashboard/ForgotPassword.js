import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, TextField, Typography, Avatar } from '@material-ui/core';
import { LockOutlined, LockOpenOutlined } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { url } from '../common/API';

const useStyles = makeStyles(theme => ({
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

function ForgotPassword(props) {
  const classes = useStyles();

  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = e => {
    e.preventDefault();

    if (email.length < 1) {
      props.onMessage('You must enter an email', 'error');
      return;
    }

    const API_CALL = new URL('auth/forgot-password', url);
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    const raw = JSON.stringify({
      email: email
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
        setEmailSent(true);
        const message = `Password reset for ${email}`;
        props.onMessage(message, 'success');
      })
      .catch(e => {
        const errMessage = e.status === 400 ? 'Email not registered' : `Error ${e.status}: ${e.statusText}`;
        props.onMessage(errMessage, 'error');
      });
  };

  const renderForgottenPasswordBody = () => {
    if (emailSent) {
      return (
        <React.Fragment>
          <Typography component="h1" variant="body1" className={classes.form}>
            Email sent to {email}
          </Typography>
          <Typography component="h1" variant="body2" className={classes.form}>
            To get back into your account, follow the instructions we've sent to your email address.
          </Typography>
          <Button component={RouterLink} to="/" fullWidth variant="contained" color="primary" className={classes.submit}>
            Back
          </Button>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <form className={classes.form} noValidate>
          <TextField
            variant="filled"
            margin="normal"
            required
            fullWidth
            InputLabelProps={{
              className: classes.label
            }}
            id="email"
            label="Email"
            name="email"
            type="email"
            onChange={e => setEmail(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={handleResetPassword}>
            Reset Password
          </Button>
        </form>
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <Avatar className={classes.avatar}>{emailSent ? <LockOpenOutlined /> : <LockOutlined />}</Avatar>
      <Typography component="h1" variant="h5">
        Reset your password
      </Typography>
      {renderForgottenPasswordBody()}
    </React.Fragment>
  );
}

export default ForgotPassword;
