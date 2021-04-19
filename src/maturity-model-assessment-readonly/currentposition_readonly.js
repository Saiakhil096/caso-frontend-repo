import React, { useEffect } from 'react';
import Sidebar from './sidebar';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { grey, red } from '@material-ui/core/colors';
import { TokenIcon } from '../common/CustomIcons';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { Grid, Typography, Button, Radio, TextField, Paper, ListItemText, Collapse, ListItem, List } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(8),
    flexGrow: 1,
    backgroundColor: '#F3F3F3'
  },
  subheading: {
    color: grey[500]
  },
  headerMargin: {
    marginTop: theme.spacing(2)
  },
  content: {
    padding: theme.spacing(4)
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
  paperTextfield: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(2),
      marginBottom: theme.spacing(1),
      width: theme.spacing(90),
      height: theme.spacing(10)
    },
    title: {
      marginTop: theme.spacing(3)
    }
  },
  icon: {
    padding: theme.spacing(1)
  },
  titleSpacing: {
    marginBottom: theme.spacing(1.5)
  },
  options: {
    padding: theme.spacing(1.5)
  },
  options2: {
    marginBottom: theme.spacing(1)
  }
}));

function CurrentPositionReadOnly(props) {
  const classes = useStyles();

  const CustomRadio = withStyles(({ palette, spacing }) => ({
    root: {
      color: grey[500]
    }
  }))(props => <Radio color="default" {...props} />);

  const { setActiveStep } = props;
  const [l2ProcessCopy, setL2ProcessCopy] = React.useState([]);
  const [tokenPool, setTokenPool] = React.useState([2, 2, 2, 2, 2]);

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

          if (crating.maturity_question.id === question.id) {
            question.currentratingreason = crating.reason;
          }
        });
      });
    });
    setL2ProcessCopy(l2ProcessCopy);
  };

  const ratingIcons = (index, currentrating) => {
    let items = [];

    for (let id = 0; id <= 4; id++) {
      items.push(
        <Grid item>
          <CustomRadio
            value={index}
            checked={currentrating === id}
            icon={<TokenIcon style={{ width: '55px', height: '55px' }} transparent disabled fontSize="large" />}
            checkedIcon={<TokenIcon style={{ width: '55px', height: '55px' }} selected={true} selectedColor={red[500]} fontSize="large" />}
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

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const getTokenSubHeading = index => {
    switch (index) {
      default:
        return '';
      case 0:
        return (
          <Typography align="center" variant="body2" className={classes.subheading}>
            Low
          </Typography>
        );
      case 1:
        return;
      case 2:
        return (
          <Typography align="center" variant="body2" className={classes.subheading}>
            Good
          </Typography>
        );
      case 3:
        return;
      case 4:
        return (
          <Typography align="center" variant="body2" className={classes.subheading}>
            Leading
          </Typography>
        );
    }
  };

  const getToken = (index, selected) => {
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

  return (
    <React.Fragment>
      {/* left side corner */}
      <Grid item xs={false} sm={7} md={4} style={{ flex: 1, backgroundColor: 'white' }} flexDirection="row" className={classes.content}>
        <Sidebar
          title="Setting the Current Position of Maturity"
          instructions="We want to understand the Ways of Working within the Contract Life Cycle Management Process. There are 4 questions per process for you to select the current level of maturity. This is based on your perception. Please highlight any reasons behind your selection.">
          <Grid item>
            <Typography className={classes.headerMargin} variant="h5">
              Tokens Available
            </Typography>
          </Grid>
          <Grid container item spacing={1}>
            {tokenPool.map((item, index) => (
              <Grid item key={`tokenpool-row1-${index}`}>
                {getToken(index, tokenPool[index] > 1)}
                {getTokenSubHeading(index)}
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
              <Grid container direction="column" className={classes.bottom}>
                <Grid>
                  <Grid item spacing={1}>
                    <Typography variant="h5">
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
                            {ratingIcons(index, maturityquestions.currentrating)}
                          </Grid>
                          <Grid item container>
                            <Grid item wrap="wrap">
                              <ListItem>
                                <Paper elevation={0.8} className={classes.paperTextfield}>
                                  <TextField disabled rows={4} multiline fullWidth value={maturityquestions.currentratingreason} />
                                </Paper>
                              </ListItem>
                            </Grid>
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
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default CurrentPositionReadOnly;
