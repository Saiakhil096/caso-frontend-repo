import React, { useEffect, useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { TextIcon } from '../../common/CustomIcons';
import { Grid, Typography, Button, Radio, TextField, ListItem, Tooltip, Paper, CircularProgress, Backdrop } from '@material-ui/core';
import { red, amber, yellow, lightGreen, green, grey } from '@material-ui/core/colors';
import { Rating1IconColor, Rating2IconColor, Rating3IconColor, Rating4IconColor, Rating5IconColor } from '../../common/CustomIcons';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(5),
    flexGrow: 1,
    backgroundColor: grey[50]
  },
  button: {
    marginTop: theme.spacing(8)
  },
  titleSpacing: {
    marginBottom: theme.spacing(1.5)
  },
  gridStyle: {
    marginLeft: theme.spacing(1.2)
  },
  backButton: {
    marginLeft: theme.spacing(1.5)
  },
  paperTextfield: {
    display: 'flex',
    width: '80%',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(2)
    },
    title: {
      marginTop: theme.spacing(1)
    }
  }
}));

function Questions(props) {
  const classes = useStyles();
  const { setValues, newdata } = props;
  const [loading, setLoading] = useState(true);
  const [avgPriorityRating, setAvgPriorityRating] = useState(-1);

  const CustomRadio = withStyles(({ palette, spacing }) => ({
    root: {
      color: grey[500]
    }
  }))(props => <Radio color="default" {...props} />);

  useEffect(() => {
    setAvgPriorityRating(avgPriorityRatingFunction());
    setLoading(false);
  }, [props.id]);

  const avgPriorityRatingFunction = () => {
    let process_id = props.id;

    let ratingSum = 0;
    let ratingCount = 0;
    const len = props.newdata.length;
    let item = null;
    for (let i = 0; i < len; i++) {
      item = props.newdata[i];
      if (item.l2process_id === process_id) {
        ratingSum += parseInt(item.priority_rating);
        ratingCount = parseInt(ratingCount + 1);
      }
    }
    return Math.round(ratingSum / ratingCount);
  };

  const totalJustification = () => {
    let process_id = props.id;
    let justificationCount = 0;
    let len = props.ratingInfo.length;
    let item = null;

    for (let i = 0; i < len; i++) {
      item = props.ratingInfo[i];
      if (item.l2process_id === process_id) {
        justificationCount = parseInt(justificationCount + 1);
      }
    }
    return justificationCount;
  };

  const radioTitle = id => {
    const ratingDataArray = [];
    const justificationDataArray = [];

    props.ratingInfo.map((newdata, index) => {
      if (props.id === newdata.l2process_id) {
        const priorityRating = {
          prating: newdata.priority_rating
        };
        ratingDataArray.push(priorityRating);
      }
    });

    props.ratingInfo.map((newdata, index) => {
      if (props.id === newdata.l2process_id && newdata.justification !== null) {
        const pJustification = {
          pjustification: newdata.justification,
          prating: newdata.priority_rating
        };
        justificationDataArray.push(pJustification);
      }
    });

    const average = ratingDataArray.map(k => k.prating);
    let ratingAverage = [].concat(...average);

    let vote = ratingAverage.filter(ratingVotes => id.toString().indexOf(ratingVotes.toString()) !== -1);
    let justifications = justificationDataArray.filter(ratingVotes => id.toString().indexOf(ratingVotes.prating.toString()) !== -1);
    return (
      <Grid>
        <Typography>Votes : {vote.length} </Typography>
        <hr />
        <Typography>Justifications : {justifications.length} </Typography>
      </Grid>
    );
  };

  const colorList = average => {
    if (average === 0) return red[500];
    else if (average === 1) return amber[500];
    else if (average === 2) return yellow[500];
    else if (average === 3) return lightGreen[500];
    else if (average === 4) return green[500];
    else return grey[50];
  };

  const handlePainpoints = event => {
    setValues(event.target.value);
  };
  if (loading) {
    return (
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else {
    return (
      <Grid container className={classes.root}>
        <Grid item container direction="column" alignContent="center">
          <Grid item container direction="column" className={classes.titleSpacing}>
            <Typography variant="h6">
              {props.step}. {props.title}
            </Typography>
          </Grid>
          <Grid item container className={classes.gridStyle}>
            <Typography>Filter Justifications</Typography>
          </Grid>
          <Grid item container direction="row">
            <Grid item>
              <CustomRadio
                color="secondary"
                name="All Rating"
                value={'All'}
                checked={props.values === 'All'}
                onChange={handlePainpoints}
                icon={
                  <TextIcon
                    value={totalJustification()}
                    style={{
                      height: '60px',
                      width: '60px',
                      fontSize: '7px'
                    }}
                    fontSize="large"
                  />
                }
                checkedIcon={
                  <TextIcon
                    value={totalJustification()}
                    style={{
                      height: '60px',
                      width: '60px',
                      fontSize: '7px'
                    }}
                    selected={true}
                    fontSize="large"
                  />
                }
              />
            </Grid>
            <Grid>
              <Typography style={{ padding: '22px' }}>or</Typography>
            </Grid>
            <Grid item>
              <Tooltip title={radioTitle('0')} arrow>
                <div>
                  <CustomRadio
                    color="primary"
                    name="rating"
                    value="0"
                    checked={props.values === '0'}
                    onChange={handlePainpoints}
                    icon={
                      <Rating1IconColor
                        style={{ width: '60px', height: '60px' }}
                        average={avgPriorityRating === 0 ? true : false}
                        fill={avgPriorityRating === 0 ? colorList(0) : colorList(5)}
                        fontSize="large"
                      />
                    }
                    checkedIcon={
                      <Rating1IconColor
                        style={{ width: '60px', height: '60px' }}
                        selected={true}
                        average={avgPriorityRating === 0 ? true : false}
                        selectedColor={avgPriorityRating === 0 ? colorList(0) : colorList(5)}
                        fontSize="large"
                      />
                    }
                  />
                </div>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title={radioTitle('1')} arrow>
                <div>
                  <CustomRadio
                    color="primary"
                    name="rating"
                    value="1"
                    checked={props.values === '1'}
                    onChange={handlePainpoints}
                    icon={
                      <Rating2IconColor
                        style={{ width: '60px', height: '60px' }}
                        average={avgPriorityRating === 1 ? true : false}
                        fill={avgPriorityRating === 1 ? colorList(1) : colorList(5)}
                        fontSize="large"
                      />
                    }
                    checkedIcon={
                      <Rating2IconColor
                        style={{ width: '60px', height: '60px' }}
                        selected={true}
                        average={avgPriorityRating === 1 ? true : false}
                        selectedColor={avgPriorityRating === 1 ? colorList(1) : colorList(5)}
                        fontSize="large"
                      />
                    }
                  />
                </div>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title={radioTitle('2')} arrow>
                <div>
                  <CustomRadio
                    color="primary"
                    name="rating"
                    value="2"
                    checked={props.values === '2'}
                    onChange={handlePainpoints}
                    icon={
                      <Rating3IconColor
                        style={{ width: '60px', height: '60px' }}
                        average={avgPriorityRating === 2 ? true : false}
                        fill={avgPriorityRating === 2 ? colorList(2) : colorList(5)}
                        fontSize="large"
                      />
                    }
                    checkedIcon={
                      <Rating3IconColor
                        style={{ width: '60px', height: '60px' }}
                        selected={true}
                        average={avgPriorityRating === 2 ? true : false}
                        selectedColor={avgPriorityRating === 2 ? colorList(2) : colorList(5)}
                        fontSize="large"
                      />
                    }
                  />
                </div>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title={radioTitle('3')} arrow>
                <div>
                  <CustomRadio
                    color="primary"
                    name="rating"
                    value="3"
                    checked={props.values === '3'}
                    onChange={handlePainpoints}
                    icon={
                      <Rating4IconColor
                        style={{ width: '60px', height: '60px' }}
                        average={avgPriorityRating === 3 ? true : false}
                        fill={avgPriorityRating === 3 ? colorList(3) : colorList(5)}
                        fontSize="large"
                      />
                    }
                    checkedIcon={
                      <Rating4IconColor
                        style={{ width: '60px', height: '60px' }}
                        selected={true}
                        average={avgPriorityRating === 3 ? true : false}
                        selectedColor={avgPriorityRating === 3 ? colorList(3) : colorList(5)}
                        fontSize="large"
                      />
                    }
                  />
                </div>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title={radioTitle('4')} arrow>
                <div>
                  <CustomRadio
                    color="primary"
                    name="rating"
                    value="4"
                    checked={props.values === '4'}
                    onChange={handlePainpoints}
                    icon={
                      <Rating5IconColor
                        style={{ width: '60px', height: '60px' }}
                        average={avgPriorityRating === 4 ? true : false}
                        fill={avgPriorityRating === 4 ? colorList(4) : colorList(5)}
                        fontSize="large"
                      />
                    }
                    checkedIcon={
                      <Rating5IconColor
                        style={{ width: '60px', height: '60px' }}
                        selected={true}
                        average={avgPriorityRating === 4 ? true : false}
                        selectedColor={avgPriorityRating === 4 ? colorList(4) : colorList(5)}
                        fontSize="large"
                      />
                    }
                  />
                </div>
              </Tooltip>
            </Grid>
          </Grid>
          {props.allRecords.map((userData, index) => (
            <Grid>
              {props.id === userData.l2process_id ? (
                <Grid container>
                  <Grid item container>
                    <ListItem>
                      <Typography variant="body2">
                        {userData.userName}-{userData.business_unit}
                      </Typography>
                    </ListItem>
                  </Grid>
                  <Grid item wrap="wrap" container>
                    <ListItem>
                      <Paper elevation={0.8} className={classes.paperTextfield}>
                        <TextField disabled fullWidth value={userData.justification} />
                      </Paper>
                    </ListItem>
                  </Grid>
                </Grid>
              ) : null}
            </Grid>
          ))}
          <Grid item container justify="space-between" alignItems="baseline">
            <Grid item className={classes.backButton}>
              {props.step > 0 && (
                <Button variant="contained" color="primary" onClick={props.onPreviousProcess}>
                  {props.currentProcess === 0 ? 'Perceptions' : 'Back'}
                </Button>
              )}
            </Grid>
            <Grid item className={classes.button}>
              <Button variant="contained" color="primary" onClick={props.onNextProcess}>
                {props.step === props.totalSteps ? 'Current Position' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default Questions;
