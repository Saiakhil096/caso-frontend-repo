import React, { useState } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardActions, Button, Grid, Typography, Box, IconButton, Paper } from '@material-ui/core';
import { Close as CloseIcon, Info as InfoIcon } from '@material-ui/icons';
import { QuestionnaireIcon, MaturityModelAssessmentIcon, DesignThinkingIcon, ICAPBannerIcon } from '../common/CustomIcons';
import { renderToStaticMarkup } from 'react-dom/server';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4, 0)
  },
  box: {
    width: '100%',
    padding: theme.spacing(1, 0),
    backgroundColor: 'white'
  },
  gridItem: {
    marginBottom: theme.spacing(3),
    maxWidth: '25rem'
  },
  icon: {
    width: '8rem',
    height: 'auto',
    display: 'block',
    margin: '1rem auto'
  },
  paperStyles: {
    width: '95%',
    margin: 'auto'
  },
  grid: {
    marginTop: theme.spacing(3)
  }
}));

function Dashboard(props) {
  const classes = useStyles();
  const [messageBar, setMessageBar] = useState('');
  const [ambitionSettingStatus, setAmbitionSettingStatus] = useState();
  const [maturityModelStatus, setMaturityModelStatus] = useState();
  const Banner = encodeURIComponent(renderToStaticMarkup(<ICAPBannerIcon className={classes.icon} />));

  const renderMessageBar = () => {
    return messageBar.length > 0 ? (
      <Box className={classes.box} color="textSecondary">
        <IconButton>
          <InfoIcon color="primary" />
        </IconButton>
        {messageBar}
        <IconButton>
          <CloseIcon color="primary" />
        </IconButton>
      </Box>
    ) : null;
  };

  const renderCards = () => {
    const cards = [
      {
        id: 'ambition-setting-output',
        title: 'Ambition Setting Output',
        description: "First things first, Let's get to know more about you and your business.",
        route: '/ambition-setting-output',
        status: ambitionSettingStatus,
        disabled: false
      },
      {
        id: 'maturity-model-assessment',
        title: 'Maturity Model Assessment',
        description: 'Help us identify your current position and the maturity of your business.',
        disabled: false,
        status: maturityModelStatus,
        route: '/maturity-model-assessment-output'
      },
      {
        id: 'design-thinking-output',
        title: 'Design Thinking Output',
        description: 'Lets get creative and collect some ideas on how to get to your target maturity.',
        disabled: false,
        route: '/design-thinking-output'
      }
    ];

    return cards.map((activity, index) => {
      var icon;
      switch (index) {
        case 0:
          icon = <QuestionnaireIcon className={classes.icon} />;
          break;
        case 1:
          icon = <MaturityModelAssessmentIcon className={classes.icon} />;
          break;
        case 2:
        default:
          icon = <DesignThinkingIcon className={classes.icon} />;
          break;
      }

      const button = (
        <Button variant="contained" fullWidth color="primary" onClick={e => handleClick(activity.title)} component={Link} to={activity.route}>
          View Output
        </Button>
      );
      const handleClick = title => {
        if (title === 'Ambition Setting Output') {
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

  const renderTiles = () => {
    return (
      <React.Fragment>
        {renderMessageBar()}
        <Grid container direction="row" justify="space-evenly" className={classes.grid} alignItems="center">
          {renderCards()}
        </Grid>
        <React.Fragment>
          <Paper
            component="div"
            elevation={5}
            className={classes.paperStyles}
            style={{
              backgroundImage: `url('data:image/svg+xml;utf8, ${Banner}')`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
            }}>
            <Grid item container xs={12}>
              <Grid item container xs={8} style={{ paddingLeft: '12%', paddingTop: '8%', paddingBottom: '5%' }}>
                <Typography gutterBottom variant="h5" align="center" component="h2">
                  Mass Export to Excel
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" component="p">
                  You can use the CASO tool to view the activity output, you can however export the output to Excel as a spreadsheet.
                </Typography>
              </Grid>
              <Grid item container xs={4} justify="center" alignItems="center" style={{ paddingTop: '7%', paddingRight: '11%', paddingBottom: '7%' }}>
                <Button variant="contained" color="primary" size="large" component={Link} to="/data-export">
                  Mass Export
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </React.Fragment>
      </React.Fragment>
    );
  };

  return (
    <Switch>
      <Route exact path="/ActivityOutput">
        {renderTiles()}
      </Route>
      <Route exact path="/">
        <Grid className={classes.root}>{renderTiles()}</Grid>
      </Route>
    </Switch>
  );
}
export default Dashboard;
