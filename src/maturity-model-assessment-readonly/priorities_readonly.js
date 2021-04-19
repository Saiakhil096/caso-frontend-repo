import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Sidebar from './sidebar';
import { Rating1Icon, Rating2Icon, Rating3Icon, Rating4Icon, Rating5Icon } from '../common/CustomIcons';
import { red, amber, yellow, lightGreen, green, grey } from '@material-ui/core/colors';
import { Grid, Typography, Button, Radio, ListItem, TextField, Paper } from '@material-ui/core';

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
    marginBottom: theme.spacing(4)
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
      width: theme.spacing(90),
      height: theme.spacing(12)
    },
    title: {
      marginBottom: theme.spacing(3)
    }
  },
  icon: {
    padding: theme.spacing(1)
  }
}));

function PrioritiesReadOnly(props) {
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

  const getTokenPriority = index => {
    switch (index) {
      default:
        return '';
      case 0:
        return (
          <Typography align="center" variant="body2" className={classes.subheading}>
            High
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
            Low
          </Typography>
        );
    }
  };

  const getToken = (index, selected) => {
    switch (index) {
      default:
        return '';
      case 0:
        return <Rating1Icon key={index} selected={selected} selectedColor={red[500]} fontSize="large" />;
      case 1:
        return <Rating2Icon key={index} selected={selected} selectedColor={amber[500]} fontSize="large" />;
      case 2:
        return <Rating3Icon key={index} selected={selected} selectedColor={yellow[500]} fontSize="large" />;
      case 3:
        return <Rating4Icon key={index} selected={selected} selectedColor={lightGreen[500]} fontSize="large" />;
      case 4:
        return <Rating5Icon key={index} selected={selected} selectedColor={green[500]} fontSize="large" />;
    }
  };

  return (
    <React.Fragment>
      {/* left side corner */}
      <Grid item xs={false} sm={7} md={4} style={{ flex: 1, backgroundColor: 'white' }} flexDirection="row" className={classes.content}>
        <Sidebar
          title="Understanding The Priorities To Improve"
          instructions="We want to understand the different priorities you have for the different parts of the Contract Life Cycle Management Solution. You have a set amount of stickers. Note the reasoning behind your chosen priorities. Include anything involving Technology, Process, People &amp; Data.">
          <Grid item>
            <Typography className={classes.headerMargin} variant="h5">
              Stickers Available
            </Typography>
          </Grid>
          <Grid container item spacing={1}>
            {tokenPool.map((item, index) => (
              <Grid item key={`tokenpool-row1-${index}`}>
                {getToken(index, tokenPool[index] > 1)}
                {getTokenPriority(index)}
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
        <Grid container>
          <Grid item container>
            {props.prioritiesData.map((data, index) => (
              <Grid container direction="column" className={classes.bottom}>
                {data.Priority.map((subdata, index) => (
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
                          icon={<Rating1Icon style={{ width: '55px', height: '55px' }} disabled fontSize="large" />}
                          checkedIcon={
                            <Rating1Icon style={{ width: '55px', height: '55px' }} selected={true} selectedColor={red[500]} fontSize="large" />
                          }
                          disabled
                        />
                        <CustomRadio
                          color="primary"
                          name="rating"
                          value="1"
                          checked={subdata.rating === 1}
                          icon={<Rating2Icon style={{ width: '55px', height: '55px' }} disabled fontSize="large" />}
                          checkedIcon={
                            <Rating2Icon style={{ width: '55px', height: '55px' }} selected={true} selectedColor={amber[500]} fontSize="large" />
                          }
                          disabled
                        />
                        <CustomRadio
                          color="primary"
                          name="rating"
                          value="2"
                          checked={subdata.rating === 2}
                          icon={<Rating3Icon style={{ width: '55px', height: '55px' }} disabled fontSize="large" />}
                          checkedIcon={
                            <Rating3Icon style={{ width: '55px', height: '55px' }} selected={true} selectedColor={yellow[500]} fontSize="large" />
                          }
                          disabled
                        />
                        <CustomRadio
                          color="primary"
                          name="rating"
                          value="3"
                          checked={subdata.rating === 3}
                          icon={<Rating4Icon style={{ width: '55px', height: '55px' }} disabled fontSize="large" />}
                          checkedIcon={
                            <Rating4Icon style={{ width: '55px', height: '55px' }} selected={true} selectedColor={lightGreen[500]} fontSize="large" />
                          }
                          disabled
                        />
                        <CustomRadio
                          color="primary"
                          name="rating"
                          value="4"
                          checked={subdata.rating === 4}
                          icon={<Rating5Icon style={{ width: '55px', height: '55px' }} disabled fontSize="large" />}
                          checkedIcon={
                            <Rating5Icon style={{ width: '55px', height: '55px' }} selected={true} selectedColor={green[500]} fontSize="large" />
                          }
                          disabled
                        />
                      </Grid>
                    </Grid>
                    <Grid>
                      <Grid item wrap="wrap">
                        <ListItem>
                          <Paper elevation={0.8} className={classes.paperTextfield}>
                            <TextField disabled multiline rows={5} fullWidth={true} value={subdata.justification} />
                          </Paper>
                        </ListItem>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
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

export default PrioritiesReadOnly;
