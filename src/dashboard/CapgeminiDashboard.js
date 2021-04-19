import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, CardContent, CardActions, Button, Paper, Typography } from '@material-ui/core';
import { ExportIcon, ManageUsersIcon, ManageActivitiesIcon } from '../common/CustomIcons';
import ClientDashboard from '../Client/Dashboard';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4, 0)
  },
  gridItem: {
    marginTop: theme.spacing(1),
    marginLeft: '1px',
    marginBottom: theme.spacing(1),
    maxWidth: '23rem'
  },
  icon: {
    width: '8rem',
    height: 'auto',
    display: 'block',
    margin: '1rem auto'
  }
}));

const toggleStyles = makeStyles(
  {
    root: {
      backgroundColor: '#ffffff',
      color: '#1381B9',
      '&$selected': {
        color: '#ffffff',
        backgroundColor: '#1381B9',
        '&:hover': {
          backgroundColor: '#1381B9',
          color: '#ffffff'
        }
      }
    },
    selected: {}
  },
  { name: 'MuiToggleButton' }
);

//Capgemini users dasboard
function CapgeminiDashboard(props) {
  const classes = useStyles();
  const toggleClass = toggleStyles();
  const id = Cookies.get('project');

  const handleScreenChange = (event, newScreen) => {
    if (newScreen !== null) {
      props.setScreen(newScreen);
    }
  };

  const renderCards = () => {
    const cards = [
      {
        title: 'Manage Activities',
        description: 'View and edit the questions and processes set for the project.',
        disabled: false,
        route: `/view-project/information/${id}`
      },
      {
        title: 'Manage Users',
        description: 'Add, remove and  manage the users for your project.',
        route: `/manage-users`
      },
      {
        title: 'Activity Output',
        description: ' Here you can start the analysis on the projects data and export it.',
        disabled: false,
        route: `/ActivityOutput`
      }
    ];

    return cards.map((activity, index) => {
      var icon;
      switch (index) {
        case 0:
          icon = <ManageActivitiesIcon className={classes.icon} />;
          break;
        case 1:
          icon = <ManageUsersIcon className={classes.icon} />;
          break;
        case 2:
        default:
          icon = <ExportIcon className={classes.icon} />;
          break;
      }

      const button = activity.disabled ? (
        <Button variant="contained" fullWidth color="primary" disabled>
          launch
        </Button>
      ) : (
        <Button variant="contained" fullWidth color="primary" onClick={e => handleClick(activity.title)} component={Link} to={activity.route}>
          launch
        </Button>
      );
      const handleClick = title => {
        if (title === 'Manage Activities') {
          Cookies.set('title', title);
        }
      };
      return (
        <Grid item component={Card} className={classes.gridItem} data-testid={`card-${index}`} key={`card-${index}`}>
          <CardContent>
            {icon}
            <Typography gutterBottom variant="h5" align="center" component="h2">
              {`${index + 1}. ${activity.title}`}
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center" component="p">
              {activity.description}
            </Typography>
          </CardContent>
          <CardActions>{button}</CardActions>
        </Grid>
      );
    });
  };

  return (
    <div className={classes.root}>
      <Grid container item xs={12} spacing={2}>
        <Grid container item justify="center">
          <ToggleButtonGroup value={props.screen} exclusive onChange={handleScreenChange}>
            <ToggleButton value="Admin" className={toggleClass.root}>
              Admin Activities
            </ToggleButton>
            <ToggleButton value="Client" className={toggleClass.root}>
              Client Activities
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        {props.screen === 'Admin' ? (
          <Grid item xs={12} style={{ padding: '2.5%' }}>
            <Paper component="div" elevation={5} style={{ padding: '0.5%' }} align="center">
              <Grid container direction="row" justify="space-evenly">
                {renderCards()}
              </Grid>
            </Paper>
          </Grid>
        ) : (
          <ClientDashboard onMessage={props.onMessage} />
        )}
      </Grid>
    </div>
  );
}
export default CapgeminiDashboard;
