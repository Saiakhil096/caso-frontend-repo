import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Typography, Grid, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  }
}));

function DesignThinking(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Container maxWidth="sm">
        <Typography className={classes.paper} component="body1" color="textSecondary">
          Coming Soon
        </Typography>
        <Grid item container justify="space-between" alignItems="baseline">
          <Grid item>
            <Button variant="contained" color="primary" onClick={props.onBack}>
              Back
            </Button>
          </Grid>
          <Grid item>
            {!isNaN(props.projectId) ? (
              <Button variant="contained" color="primary" onClick={props.onEditProject} component={Link} to="/CapgeminiDashboard">
                Edit Project
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={props.onCompletion}>
                Create
              </Button>
            )}
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
}

export default DesignThinking;
