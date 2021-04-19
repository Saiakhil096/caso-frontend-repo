import React, { useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Sidebar from './sidebar';
import { TokenIcon } from '../common/CustomIcons';
import { grey, green, red } from '@material-ui/core/colors';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { Grid, Typography, Button, Radio, ListItem, ListItemText, Collapse, List } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(8),
    flexGrow: 1,
    backgroundColor: '#F3F3F3'
  },
  headerMargin: {
    marginTop: theme.spacing(2)
  },
  content: {
    padding: theme.spacing(4)
  },
  subheading: {
    color: grey[500]
  },
  bottom: {
    marginBottom: theme.spacing(6)
  },
  button: {
    marginRight: theme.spacing(15),
    marginTop: theme.spacing(0)
  },
  button1: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(0)
  },
  fixedPosition: {
    position: 'sticky',
    top: theme.spacing(2)
  },
  icon: {
    padding: theme.spacing(0.5),
    marginBottom: theme.spacing(2.5)
  },
  titleSpacing: {
    marginBottom: theme.spacing(1)
  },
  options: {
    padding: theme.spacing(1.5)
  },
  options2: {
    marginBottom: theme.spacing(1)
  }
}));

function ImprovementReadOnly(props) {
  const classes = useStyles();
  const history = useHistory();

  const [tokenPool, setTokenPool] = React.useState([2, 2, 2, 2, 2]);

  const CustomRadio = withStyles(({ palette, spacing }) => ({
    root: {
      color: grey[500]
    }
  }))(props => <Radio color="default" {...props} />);

  const { setActiveStep } = props;

  const [l2ProcessCopy, setL2ProcessCopy] = React.useState([]);

  useEffect(() => {
    improvementsBody();
  }, []);

  const improvementsBody = () => {
    var l2ProcessCopy = props.l2Process;
    l2ProcessCopy.map((process, index) => {
      process.maturity_questions.map((question, index) => {
        props.currentRatingData[0].maturity_rating.map((crating, index) => {
          if (crating.maturity_question.id === question.id) {
            question.currentrating = crating.rating;
          }
        });
        props.improvementData[0].improvement_rating.map((irating, index) => {
          if (irating.maturity_question.id === question.id) {
            question.improvementrating = irating.rating;
          }
        });
      });
    });
    setL2ProcessCopy(l2ProcessCopy);
  };

  const ratingIcons = (index, currentrating, improvementrating) => {
    let items = [];

    const checkedIconColor = (id, currentrating, improvementrating) => {
      if (currentrating === id) {
        return <TokenIcon style={{ width: '55px', height: '55px' }} selected={true} selectedColor={red[500]} fontSize="large" />;
      } else if (currentrating < id && improvementrating > id) {
        return <TokenIcon style={{ width: '55px', height: '55px' }} selected={true} selectedColor={grey[500]} fontSize="large" />;
      } else if ((improvementrating = id)) {
        return <TokenIcon style={{ width: '55px', height: '55px' }} selected={true} selectedColor={green[500]} fontSize="large" />;
      }
    };

    for (let id = 0; id <= 4; id++) {
      items.push(
        <Grid item>
          <CustomRadio
            value={index}
            checked={(currentrating <= id && improvementrating >= id) || (currentrating === id && improvementrating == null)}
            icon={<TokenIcon style={{ width: '55px', height: '55px' }} transparent disabled fontSize="large" />}
            checkedIcon={checkedIconColor(id, currentrating, improvementrating)}
            disabled="true"
          />
          <Grid item>
            {(() => {
              switch (id) {
                case 0:
                  return (
                    <Typography align="center" variant="body2" className={classes.subheading}>
                      Low
                    </Typography>
                  );
                case 1:
                  return;
                case 2:
                  return;
                case 3:
                  return;
                case 4:
                  return (
                    <Typography align="center" variant="body2" className={classes.subheading}>
                      Leading
                    </Typography>
                  );
              }
            })()}
          </Grid>
        </Grid>
      );
    }
    return (
      <Grid item container>
        {items}
      </Grid>
    );
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const getTokenCurrent = (index, selected) => {
    switch (index) {
      default:
        return '';
      case 0:
        return <TokenIcon key={index} selected={selected} selectedColor={red[500]} fontSize="large" />;
      case 1:
        return <TokenIcon key={index} selected={selected} selectedColor={red[500]} fontSize="large" />;
      case 2:
        return <TokenIcon key={index} selected={selected} selectedColor={red[500]} fontSize="large" />;
      case 3:
        return <TokenIcon key={index} selected={selected} selectedColor={red[500]} fontSize="large" />;
      case 4:
        return <TokenIcon key={index} selected={selected} selectedColor={red[500]} fontSize="large" />;
    }
  };

  const getTokenImprovement = (index, selected) => {
    switch (index) {
      default:
        return '';
      case 0:
        return <TokenIcon key={index} selected={selected} selectedColor={green[500]} fontSize="large" />;
      case 1:
        return <TokenIcon key={index} selected={selected} selectedColor={green[500]} fontSize="large" />;
      case 2:
        return <TokenIcon key={index} selected={selected} selectedColor={green[500]} fontSize="large" />;
      case 3:
        return <TokenIcon key={index} selected={selected} selectedColor={green[500]} fontSize="large" />;
      case 4:
        return <TokenIcon key={index} selected={selected} selectedColor={green[500]} fontSize="large" />;
    }
  };

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
    <React.Fragment>
      {/* left side corner */}
      <Grid item xs={false} sm={7} md={4} style={{ flex: 1, backgroundColor: 'white' }} flexDirection="row" className={classes.content}>
        <Sidebar
          title="Identifying Your Target State Maturity"
          instructions="Through the inputs that you have provided in the previous steps, you have been given a set amount of Improvement Votes to use which are highlighted below. Please select where you want to use these improvement votes within the questions. In some situations you will receive 0 improvement points so in that instance please continue to the next step.">
          <Grid item>
            <Typography className={classes.headerMargin} variant="h5">
              Improvements Points
            </Typography>
          </Grid>
          <Grid container item spacing={1}>
            {tokenPool.map((item, index) => (
              <Grid item key={`tokenpool-row1-${index}`}>
                {getTokenImprovement(index, tokenPool[index] > 1)}
              </Grid>
            ))}
          </Grid>
          <Grid item>
            <Typography className={classes.headerMargin} variant="h5">
              Current Position points
            </Typography>
          </Grid>
          <Grid container item spacing={1}>
            {tokenPool.map((item, index) => (
              <Grid item key={`tokenpool-row2-${index}`}>
                {getTokenCurrent(index, tokenPool[index] > 0)}
              </Grid>
            ))}
          </Grid>
          <Grid container direction="column" item spacing={1}>
            <Grid item>
              <Typography className={classes.headerMargin} variant="h5">
                Process Checklist
              </Typography>
            </Grid>
            <Grid item container>
              <List component="nav" aria-label="main Level 2 Processes">
                {props.l2Process.map((process, index) => (
                  <Grid container>
                    <Grid item container>
                      <Typography>
                        {index + 1}. {process.title}
                      </Typography>
                    </Grid>
                    <br />
                    <Grid container className={classes.options}>
                      {process.maturity_questions.map((question, index) => (
                        <Grid item container className={classes.options1}>
                          <Typography>
                            {index + 1}. {question.question_text}
                          </Typography>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                ))}
              </List>
            </Grid>
          </Grid>
        </Sidebar>
      </Grid>
      {/* right side corner */}
      <Grid item xs={12} sm={5} md={8} className={classes.content} style={{ flex: 3, backgroundColor: '#F3F3F3' }}>
        <Grid container>
          <Grid item container>
            {l2ProcessCopy.map((l2processcopy, index) => (
              <Grid container direction="column">
                <Grid className={classes.bottom}>
                  <Grid item>
                    <Typography variant="h5" className={classes.titleSpacing}>
                      {index + 1}. {l2processcopy.title}
                    </Typography>
                  </Grid>
                  <Grid item container>
                    <Grid item>
                      {l2processcopy.maturity_questions.map((maturityquestions, index) => (
                        <Grid>
                          <ListItem>
                            <Typography>
                              {index + 1}. {maturityquestions.question_text}
                            </Typography>
                          </ListItem>
                          <Grid container className={classes.icon}>
                            {ratingIcons(index, maturityquestions.currentrating, maturityquestions.improvementrating)}
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid item container justify="space-between" alignItems="baseline">
            <Grid item className={classes.button1}>
              {props.step > 1 && (
                <Button variant="contained" color="primary" onClick={handleBack}>
                  Back
                </Button>
              )}
            </Grid>
            <Grid item className={classes.button}>
              <Button variant="contained" color="primary" onClick={e => handleClick()}>
                Dashboard
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default ImprovementReadOnly;
