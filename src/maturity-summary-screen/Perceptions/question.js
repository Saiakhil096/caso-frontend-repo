import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { TextIcon } from '../../common/CustomIcons';
import { Grid, Typography, Radio, Paper, TextField, ListItem, Button, Tooltip, CircularProgress, Backdrop } from '@material-ui/core';
import { grey, red, amber, lightGreen, yellow, green } from '@material-ui/core/colors';
import { VerySadIconColor, SadIconColor, OkIconColor, HappyIconColor, VeryHappyIconColor } from '../../common/CustomIcons';

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
  paperTextfield1: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    '& > *': {
      margin: theme.spacing(2)
    },
    title: {
      marginTop: theme.spacing(3)
    }
  },
  paperTextfield2: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    '& > *': {
      margin: theme.spacing(2)
    },
    title: {
      marginTop: theme.spacing(3)
    }
  },
  textfieldPadding: {
    paddingRight: theme.spacing(1)
  }
}));

function Questions(props) {
  const classes = useStyles();
  const { setValues, newdata } = props;
  const [avgPerceptionRating, setAvgPerceptionRating] = useState(-1);
  const [loading, setLoading] = useState(true);

  const CustomRadio = withStyles(({ palette, spacing }) => ({
    root: {
      color: grey[500]
    }
  }))(props => <Radio color="default" {...props} />);

  useEffect(() => {
    setAvgPerceptionRating(avgPerceptionRatingFun());
    setLoading(false);
  }, [props.id]);

  const avgPerceptionRatingFun = () => {
    let process_id = props.id;

    let ratingSum = 0;
    let ratingCount = 0;
    const len = newdata.length;
    let item = null;
    for (let i = 0; i < len; i++) {
      item = newdata[i];
      if (item && item.l2process_id === process_id) {
        ratingSum += parseInt(item.perception_rating);
        ratingCount = parseInt(ratingCount + 1);
      }
    }
    return Math.round(ratingSum / ratingCount);
  };

  const totalPainpoint = () => {
    let process_id = props.id;
    let painpointCount = 0;
    let len = props.ratingInfo.length;
    let item = null;
    for (let i = 0; i < len; i++) {
      item = props.ratingInfo[i];
      if (item && item.l2process_id === process_id) {
        let len1 = item.painpoints.length;
        let item1 = null;
        for (let j = 0; j < len1; j++) {
          item1 = item.painpoints[j];
          painpointCount = parseInt(painpointCount + 1);
        }
      }
    }

    return painpointCount;
  };

  const radioTitle = id => {
    let ratingDataArray = [];
    let painpointDataArray = [];
    props.ratingInfo.map((newdata, index) => {
      if (newdata && props.id === newdata.l2process_id) {
        const perceprating = {
          rating: newdata.perception_rating
        };
        ratingDataArray.push(perceprating);
      }
    });
    props.ratingInfo.map((newdata, index) => {
      if (newdata && props.id === newdata.l2process_id) {
        newdata.painpoints.map((painpoint, index) => {
          const percepPainpoints = {
            painpoints: painpoint.pain_point_text,
            prating: newdata.perception_rating
          };
          painpointDataArray.push(percepPainpoints);
        });
      }
    });

    const average = ratingDataArray.map(k => k.rating);
    let ratingAverage = [].concat(...average);
    let vote = ratingAverage.filter(ratingVotes => id.toString().indexOf(ratingVotes.toString()) !== -1);
    let painpointsVotes = painpointDataArray.filter(ratingVotes => id.toString().indexOf(ratingVotes.prating.toString()) !== -1);
    return (
      <Grid>
        <Typography>Votes : {vote.length} </Typography>
        <hr />
        <Typography>Painpoints : {painpointsVotes.length} </Typography>
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
          <Grid container className={classes.gridStyle}>
            <Typography>Filter Painpoints</Typography>
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
                    value={totalPainpoint()}
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
                    value={totalPainpoint()}
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
                    onChange={handlePainpoints}
                    checked={props.values === '0'}
                    icon={
                      <VerySadIconColor
                        style={{ width: '60px', height: '60px' }}
                        average={avgPerceptionRating === 0 ? true : false}
                        fill={avgPerceptionRating === 0 ? colorList(0) : colorList(5)}
                        fontSize="large"
                      />
                    }
                    checkedIcon={
                      <VerySadIconColor
                        style={{ width: '60px', height: '60px' }}
                        selected={true}
                        average={avgPerceptionRating === 0 ? true : false}
                        selectedColor={avgPerceptionRating === 0 ? colorList(0) : colorList(5)}
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
                    onChange={handlePainpoints}
                    checked={props.values === '1'}
                    icon={
                      <SadIconColor
                        style={{ width: '60px', height: '60px' }}
                        average={avgPerceptionRating === 1 ? true : false}
                        fill={avgPerceptionRating === 1 ? colorList(1) : colorList(5)}
                        fontSize="large"
                      />
                    }
                    checkedIcon={
                      <SadIconColor
                        style={{ width: '60px', height: '60px' }}
                        selected={true}
                        average={avgPerceptionRating === 1 ? true : false}
                        selectedColor={avgPerceptionRating === 1 ? colorList(1) : colorList(5)}
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
                    onChange={handlePainpoints}
                    checked={props.values === '2'}
                    icon={
                      <OkIconColor
                        style={{ width: '60px', height: '60px' }}
                        average={avgPerceptionRating === 2 ? true : false}
                        fill={avgPerceptionRating === 2 ? colorList(2) : colorList(5)}
                        fontSize="large"
                      />
                    }
                    checkedIcon={
                      <OkIconColor
                        style={{ width: '60px', height: '60px' }}
                        selected={true}
                        average={avgPerceptionRating === 2 ? true : false}
                        selectedColor={avgPerceptionRating === 2 ? colorList(2) : colorList(5)}
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
                    onChange={handlePainpoints}
                    checked={props.values === '3'}
                    icon={
                      <HappyIconColor
                        style={{ width: '60px', height: '60px' }}
                        average={avgPerceptionRating === 3 ? true : false}
                        fill={avgPerceptionRating === 3 ? colorList(3) : colorList(5)}
                        fontSize="large"
                      />
                    }
                    checkedIcon={
                      <HappyIconColor
                        style={{ width: '60px', height: '60px' }}
                        selected={true}
                        average={avgPerceptionRating === 3 ? true : false}
                        selectedColor={avgPerceptionRating === 3 ? colorList(3) : colorList(5)}
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
                    onChange={handlePainpoints}
                    checked={props.values === '4'}
                    icon={
                      <VeryHappyIconColor
                        style={{ width: '60px', height: '60px' }}
                        average={avgPerceptionRating === 4 ? true : false}
                        fill={avgPerceptionRating === 4 ? colorList(4) : colorList(5)}
                        fontSize="large"
                      />
                    }
                    checkedIcon={
                      <VeryHappyIconColor
                        style={{ width: '60px', height: '60px' }}
                        selected={true}
                        average={avgPerceptionRating === 4 ? true : false}
                        selectedColor={avgPerceptionRating === 4 ? colorList(4) : colorList(5)}
                        fontSize="large"
                      />
                    }
                  />
                </div>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid>
            {props.allRecords.map((userData, index) => (
              <Grid item>
                {userData &&
                  userData.painpoints.map((userPainpoints, index) => (
                    <Grid item>
                      {props.id === userData.l2process_id ? (
                        <Grid container>
                          <Grid item>
                            <ListItem>
                              <Typography variant="body2">
                                {userData.userName}-{userData.business_unit}
                              </Typography>
                            </ListItem>
                          </Grid>
                          <Grid item container>
                            {userPainpoints.kpi === null ? (
                              <Grid item wrap="wrap" style={{ width: '80%' }}>
                                <ListItem>
                                  <Grid container className={classes.textfieldPadding}>
                                    <Paper elevation={0.8} className={classes.paperTextfield1}>
                                      <TextField disabled fullWidth={true} value={userPainpoints.pain_point_text} />
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
                              <Grid item wrap="wrap" style={{ width: '80%' }}>
                                <ListItem>
                                  <Grid container className={classes.textfieldPadding}>
                                    <Paper elevation={0.8} className={classes.paperTextfield1}>
                                      <TextField disabled fullWidth={true} value={userPainpoints.pain_point_text} />
                                    </Paper>{' '}
                                  </Grid>
                                  <Grid container>
                                    {' '}
                                    <Paper elevation={0.8} className={classes.paperTextfield2}>
                                      <TextField disabled fullWidth={true} value={userPainpoints.kpi.name} />
                                    </Paper>
                                  </Grid>
                                </ListItem>
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                      ) : null}
                    </Grid>
                  ))}
              </Grid>
            ))}
          </Grid>
          <Grid item container justify="space-between" alignItems="baseline">
            <Grid item className={classes.backButton}>
              {props.step > 1 && (
                <Button variant="contained" color="primary" onClick={props.onPreviousProcess}>
                  Back
                </Button>
              )}
            </Grid>
            <Grid item className={classes.button}>
              <Button variant="contained" color="primary" onClick={props.onNextProcess}>
                {props.step === props.totalSteps ? 'Priorities' : 'Next'}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default Questions;
