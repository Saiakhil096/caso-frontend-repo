import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Sidebar from './sidebar';
import { VerySadIcon, SadIcon, OkIcon, HappyIcon, VeryHappyIcon } from '../common/CustomIcons';
import { red, amber, yellow, lightGreen, green, grey } from '@material-ui/core/colors';
import { Grid, Typography, Button, Radio, ListItem, TextField, Paper } from '@material-ui/core';

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
  bottom: {
    marginBottom: theme.spacing(4)
  },
  button: {
    marginRight: theme.spacing(20),
    marginTop: theme.spacing(0)
  },
  paperTextfield1: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(2),
      width: theme.spacing(60),
      height: theme.spacing(3)
    },
    title: {
      marginTop: theme.spacing(3)
    }
  },
  paperTextfield2: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(2),
      width: theme.spacing(20),
      height: theme.spacing(3)
    },
    title: {
      marginTop: theme.spacing(3)
    }
  },
  textfieldPadding: {
    paddingRight: theme.spacing(1)
  },
  icon: {
    padding: theme.spacing(1)
  }
}));

function PerceptionReadOnly(props) {
  const classes = useStyles();

  const [tokenPool, setTokenPool] = React.useState([2, 2, 2, 2, 2]);

  const CustomRadio = withStyles(({ palette, spacing }) => ({
    root: {
      color: grey[500]
    }
  }))(props => <Radio color="default" {...props} />);

  const { setActiveStep } = props;

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const getToken = (index, selected) => {
    switch (index) {
      case 0:
        return <VerySadIcon key={index} selected={selected} selectedColor={red[500]} fontSize="large" />;
      case 1:
        return <SadIcon key={index} selected={selected} selectedColor={amber[500]} fontSize="large" />;
      case 2:
        return <OkIcon key={index} selected={selected} selectedColor={yellow[500]} fontSize="large" />;
      case 3:
        return <HappyIcon key={index} selected={selected} selectedColor={lightGreen[500]} fontSize="large" />;
      case 4:
        return <VeryHappyIcon key={index} selected={selected} selectedColor={green[500]} fontSize="large" />;
      default:
        return '';
    }
  };

  return (
    <React.Fragment>
      {/* left side corner */}
      <Grid item xs={false} sm={7} md={4} style={{ flex: 1, backgroundColor: 'white' }} flexDirection="row" className={classes.content}>
        <Sidebar
          title="Understanding Your Perceptions"
          instructions="We want to understand the different perceptions you have for the different parts of the Contract Life Cycle Management Solution. You have a set amount of stickers. Please explain the reasoning behind your chosen perceptions. Include anything involving Technology, Process, People &amp; Data. ">
          <Grid item>
            <Typography className={classes.headerMargin} variant="h5">
              Stickers Available
            </Typography>
          </Grid>
          <Grid container item spacing={1}>
            {tokenPool.map((item, index) => (
              <Grid item key={`tokenpool-row1-${index}`}>
                {getToken(index, tokenPool[index] > 1)}
              </Grid>
            ))}
          </Grid>
          <Grid container direction="column" item spacing={1}>
            <Grid item>
              <Typography className={classes.headerMargin} variant="h5">
                Process Checklist
              </Typography>
            </Grid>
            <Grid item>
              {props.l2Process.map((process, index) => (
                <Grid item>
                  <Typography>
                    {index + 1}. {process.title}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Sidebar>
      </Grid>
      {/* right side corner */}
      <Grid item xs={12} sm={5} md={8} className={classes.content} style={{ flex: 3, backgroundColor: '#F3F3F3' }}>
        {/* <Grid container className={classes.root}> */}
        <Grid container>
          <Grid item container>
            {props.perceptionData.map((data, index) => (
              <Grid container maxWidth="lg" direction="column" className={classes.bottom}>
                {data.Perception.map((subdata, index) => (
                  <Grid className={classes.bottom}>
                    <Grid item>
                      <Typography variant="h5">
                        {index + 1}. {subdata.l_2_process.title}
                      </Typography>
                    </Grid>
                    <Grid item container className={classes.icon}>
                      <Grid item>
                        <CustomRadio
                          color="primary"
                          name="rating"
                          value="0"
                          checked={subdata.rating === 0}
                          icon={<VerySadIcon style={{ width: '55px', height: '55px' }} transparent fontSize="large" />}
                          checkedIcon={
                            <VerySadIcon style={{ width: '55px', height: '55px' }} selected={true} selectedColor={red[500]} fontSize="large" />
                          }
                          disabled
                        />
                        <CustomRadio
                          color="primary"
                          name="rating"
                          value="1"
                          checked={subdata.rating === 1}
                          icon={<SadIcon style={{ width: '55px', height: '55px' }} transparent disabled fontSize="large" />}
                          checkedIcon={
                            <SadIcon style={{ width: '55px', height: '55px' }} selected={true} selectedColor={amber[500]} fontSize="large" />
                          }
                          disabled
                        />
                        <CustomRadio
                          color="primary"
                          name="rating"
                          value="2"
                          checked={subdata.rating === 2}
                          icon={<OkIcon style={{ width: '55px', height: '55px' }} transparent disabled fontSize="large" />}
                          checkedIcon={
                            <OkIcon style={{ width: '55px', height: '55px' }} selected={true} selectedColor={yellow[500]} fontSize="large" />
                          }
                          disabled
                        />
                        <CustomRadio
                          color="primary"
                          name="rating"
                          value="3"
                          checked={subdata.rating === 3}
                          icon={<HappyIcon style={{ width: '55px', height: '55px' }} transparent disabled fontSize="large" />}
                          checkedIcon={
                            <HappyIcon style={{ width: '55px', height: '55px' }} selected={true} selectedColor={lightGreen[500]} fontSize="large" />
                          }
                          disabled
                        />
                        <CustomRadio
                          color="primary"
                          name="rating"
                          value="4"
                          checked={subdata.rating === 4}
                          icon={<VeryHappyIcon style={{ width: '55px', height: '55px' }} disabled fontSize="large" />}
                          checkedIcon={
                            <VeryHappyIcon style={{ width: '55px', height: '55px' }} selected={true} selectedColor={green[500]} fontSize="large" />
                          }
                          disabled
                        />
                      </Grid>
                    </Grid>
                    <Grid>
                      {subdata.pain_points.map((subdata1, l) => (
                        <Grid>
                          {!subdata1.pain_point_text || !subdata1.pain_point_text.trim() ? null : (
                            <Grid>
                              {subdata1.kpi === null ? (
                                <Grid item wrap="wrap">
                                  <ListItem>
                                    <Grid container className={classes.textfieldPadding}>
                                      <Paper elevation={0.8} className={classes.paperTextfield1}>
                                        <TextField disabled fullWidth={true} value={subdata1.pain_point_text} />
                                      </Paper>{' '}
                                    </Grid>
                                    <Grid container>
                                      {' '}
                                      <Paper elevation={0.8} className={classes.paperTextfield2}>
                                        <TextField disabled fullWidth={true} />
                                      </Paper>
                                    </Grid>
                                  </ListItem>
                                </Grid>
                              ) : (
                                <Grid item wrap="wrap">
                                  <ListItem>
                                    <Grid container className={classes.textfieldPadding}>
                                      <Paper elevation={0.8} className={classes.paperTextfield1}>
                                        <TextField disabled fullWidth={true} value={subdata1.pain_point_text} />
                                      </Paper>{' '}
                                    </Grid>
                                    <Grid container>
                                      {' '}
                                      <Paper elevation={0.8} className={classes.paperTextfield2}>
                                        <TextField disabled fullWidth={true} value={subdata1.kpi.name} />
                                      </Paper>
                                    </Grid>
                                  </ListItem>
                                </Grid>
                              )}
                            </Grid>
                          )}
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            ))}
          </Grid>
          <Grid item container justify="space-between" alignItems="baseline">
            <Grid item>
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

export default PerceptionReadOnly;
