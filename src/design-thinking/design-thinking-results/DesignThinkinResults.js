import React, { useEffect, useState } from 'react';
import { Grid, Typography, LinearProgress, CardContent, Chip, Card, Paper, makeStyles, withStyles } from '@material-ui/core';
import { Bubble } from 'react-chartjs-2';
import Cookies from 'js-cookie';
import { fetchProjectSpecificL2Process, fetchIdeasPerProcess, fetchFeasibilityVotesPerProcess, fetchValueVotesPerProcess } from '../../common/API';
import DesignThinkingBackground from '../../assets/DesignThinkingBackground.png';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '0.7cm',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(2.0)
    }
  },
  headerMargin: {
    marginTop: '1.5cm'
  },
  feasibilityColumn: {
    display: 'flex',
    flexDirection: 'column',
    width: 550,
    '& > *': {
      margin: theme.spacing(2.0)
    }
  },
  matrixmargin: {
    '& > *': {
      margin: theme.spacing(4.0)
    }
  },
  cardSlider: {
    justifyContent: 'center',
    '& > *': {
      padding: theme.spacing(1.5)
    }
  },
  lastDiv: {
    display: 'flex',
    justifyContent: 'center',
    '& > *': {
      padding: theme.spacing(4.0)
    }
  },
  headingVote: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  voteText: {
    marginTop: theme.spacing(1.5)
  },
  paperGraph: {
    display: 'flex',
    justifyContent: 'center',
    '& > *': {
      padding: theme.spacing(3.0),
      margin: theme.spacing(6.0)
    }
  }
}));

function DesignThinkingResults(props) {
  const classes = useStyles();
  const { onMessage } = props;
  const [activeStep, setActiveStep] = useState([]);
  const [activeIndex, setActiveIndex] = useState();
  const [l2ProcessList, setL2ProcessList] = useState([]);
  const [ideasData, setIdeasData] = useState([]);
  const [valueVotes, setValueVotes] = useState([]);
  const [feasibilityVotes, setFeasibilityVotes] = useState([]);
  const [feasibilityTotalVotes, setFeasibilityTotalVotes] = useState();
  const [valueTotalVotes, setValueTotalVotes] = useState();
  const [seeMoreFeasibility, setSeeMoreFeasibility] = useState(false);
  const [seeMoreValue, setSeeMoreValue] = useState(false);

  const BorderLinearProgress = withStyles({
    root: {
      height: 4
    },
    bar: {
      borderRadius: 10,
      backgroundColor: '#89C64F '
    }
  })(LinearProgress);

  const voteCount = (process, index) => {
    let list = l2ProcessList;
    list.map((process, id) => {
      if (index === id) {
        process.isSelected = true;
      } else {
        process.isSelected = false;
      }
    });
    setL2ProcessList(list);
    setActiveStep(process);
    setActiveIndex(index);
    fetchIdeasPerProcess(process.id, onMessage).then(ideaPerProcessJson => {
      setIdeasData(ideaPerProcessJson);
    });
    fetchValueVotesPerProcess(process.id, onMessage).then(valueVotesPerProcessJson => {
      let totalVotes = 0;
      valueVotesPerProcessJson.forEach(valueVotePerProcess => {
        totalVotes = totalVotes + valueVotePerProcess.vote_count;
      });
      setValueTotalVotes(totalVotes);
      var ideaIdArr = [];
      var valueArr = [];
      valueVotesPerProcessJson.map((item, index) => {
        if (ideaIdArr.indexOf(item.idea.id) === -1) {
          ideaIdArr.push(item.idea.id);
          valueArr.push(item);
        } else {
          valueArr[ideaIdArr.indexOf(item.idea.id)].vote_count += item.vote_count;
        }
      });
      setValueVotes(valueArr);
    });
    fetchFeasibilityVotesPerProcess(process.id, onMessage).then(feasibilityVotesPerProcessJson => {
      let totalVotes = 0;
      feasibilityVotesPerProcessJson.forEach(feasibilityVotePerProcess => {
        totalVotes = totalVotes + feasibilityVotePerProcess.vote_count;
      });
      setFeasibilityTotalVotes(totalVotes);
      var ideaIdArr1 = [];
      var feasibilityArr = [];
      feasibilityVotesPerProcessJson.map((item, index) => {
        if (ideaIdArr1.indexOf(item.idea.id) === -1) {
          ideaIdArr1.push(item.idea.id);
          feasibilityArr.push(item);
        } else {
          feasibilityArr[ideaIdArr1.indexOf(item.idea.id)].vote_count += item.vote_count;
        }
      });
      setFeasibilityVotes(feasibilityArr);
    });
  };

  const updateDataList = () => {
    let arr = [];
    let arr1 = [];
    feasibilityVotes.sort((a, b) => {
      return a.idea.id - b.idea.id;
    });
    valueVotes.sort((a, b) => {
      return a.idea.id - b.idea.id;
    });

    valueVotes.forEach(valVote => {
      arr.push({ label: 'Idea ' + valVote.idea.id });
    });

    valueVotes.forEach(valVote => {
      arr1.push({ x: valVote.vote_count, y: 0, r: 15 });
    });
    feasibilityVotes.map((fVote, index) => {
      arr1[index] = { ...arr1[index], y: fVote.vote_count };
    });
    arr1.map((temp, index) => {
      arr[index] = { ...arr[index], data: [temp], backgroundColor: '#5e3d75' };
    });
    return arr;
  };

  const data = {
    datasets: updateDataList()
  };
  var options = {
    legend: {
      display: false
    },
    tooltips: {
      enabled: true,
      callbacks: {
        label: function (tooltipItems, data) {
          return data.datasets[tooltipItems.datasetIndex].label;
        }
      }
    },
    pointLabelFontSize: 5,
    layout: {
      padding: {
        right: 40
      }
    },
    title: {
      display: true,
      text: 'Feasibility Vs Value Matrix'
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            drawOnChartArea: false
          },
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: 'Value'
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            drawOnChartArea: false
          },
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: 'Feasibility'
          }
        }
      ]
    },
    maintainAspectRatio: false
  };

  useEffect(() => {
    if (l2ProcessList.length === 0) fetchRequests();
  }, [l2ProcessList]);
  const fetchRequests = async () => {
    Promise.all([fetchProjectSpecificL2Process(Cookies.get('project'), onMessage)])
      .then(async ([l2ProcessDataJson]) => {
        voteCount(l2ProcessDataJson[0], 0);
        let updatedList = l2ProcessDataJson.map((list, index) => ({ ...list, isSelected: index === 0 ? true : false }));
        setL2ProcessList(updatedList, 'process');
      })
      .catch(e => {
        onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      });
  };

  return (
    <React.Fragment>
      <Typography className={classes.headerMargin} align="center" variant="h5">
        Select a Level 2 Process
      </Typography>
      <Grid className={classes.root}>
        {l2ProcessList.map((process, index) => (
          <Chip
            variant="outlined"
            size="medium"
            style={{ color: process.isSelected ? 'white' : '#1381B9', backgroundColor: process.isSelected ? '#1381B9' : 'white' }}
            label={process.title}
            clickable
            color="primary"
            onClick={() => voteCount(process, index)}
          />
        ))}
      </Grid>

      <Typography className={classes.headerMargin} align="center" variant="h6">
        {activeIndex + 1} of {l2ProcessList.length}
      </Typography>
      <Typography className={classes.matrixmargin} align="center" variant="h5">
        {activeStep.title} - Feasibility vs Value Matrix
      </Typography>

      <Grid className={classes.paperGraph}>
        <Paper
          elevation={3}
          style={{
            background: 'url(' + DesignThinkingBackground + ')',
            backgroundPosition: 'center ',
            backgroundSize: '812px 300px',
            backgroundRepeat: 'no-repeat'
          }}>
          <Bubble height={400} width={900} data={data} options={options} />
        </Paper>
      </Grid>

      <Grid className={classes.lastDiv}>
        <Grid className={classes.feasibilityColumn}>
          <Grid className={classes.headingVote}>
            <Typography variant="h5">Feasibility</Typography>
            <Typography variant="h5">
              {feasibilityTotalVotes}
              {'  '}votes
            </Typography>
          </Grid>
          {feasibilityVotes.map((idea, index) => {
            if (seeMoreFeasibility) {
              return (
                <Card className={classes.cardSlider}>
                  <Grid className={classes.headingVote}>
                    <Typography variant="h5">
                      {idea.idea.id}
                      {' .       '} {idea.idea.idea_text}
                    </Typography>
                    <Typography variant="h5">{Math.ceil((idea.vote_count / feasibilityTotalVotes) * 100)}%</Typography>
                  </Grid>
                  <CardContent>
                    <BorderLinearProgress variant="determinate" value={(idea.vote_count / feasibilityTotalVotes) * 100} />
                    <Typography className={classes.voteText} variant="body2" color="textSecondary" component="p">
                      Total Votes = {idea.vote_count}
                    </Typography>
                  </CardContent>
                </Card>
              );
            } else if (index < 5 && !seeMoreFeasibility) {
              return (
                <Card className={classes.cardSlider}>
                  <Grid className={classes.headingVote}>
                    <Typography variant="h5">
                      {idea.idea.id}
                      {' .       '} {idea.idea.idea_text}
                    </Typography>
                    <Typography variant="h5">{Math.ceil((idea.vote_count / feasibilityTotalVotes) * 100)}%</Typography>
                  </Grid>
                  <CardContent>
                    <BorderLinearProgress variant="determinate" value={(idea.vote_count / feasibilityTotalVotes) * 100} />
                    <Typography className={classes.voteText} variant="body2" color="textSecondary" component="p">
                      Total Votes = {idea.vote_count}
                    </Typography>
                  </CardContent>
                </Card>
              );
            }
          })}
          {feasibilityVotes.length > 5 ? (
            <span
              style={{
                display: 'flex',
                justifyContent: 'center',
                color: '#369FD1',
                cursor: 'pointer'
              }}
              onClick={() => setSeeMoreFeasibility(seeMoreFeasibility ? false : true)}>
              {!seeMoreFeasibility ? 'See all ideas' : 'Hide ideas'}
            </span>
          ) : null}
        </Grid>

        <Grid className={classes.feasibilityColumn}>
          <Grid className={classes.headingVote}>
            <Typography variant="h5">Value</Typography>
            <Typography variant="h5">
              {valueTotalVotes}
              {'  '}votes
            </Typography>
          </Grid>
          {valueVotes.map((idea, index) => {
            if (seeMoreValue) {
              return (
                <Card className={classes.cardSlider}>
                  <Grid className={classes.headingVote}>
                    <Typography variant="h5">
                      {idea.idea.id}
                      {' .       '} {idea.idea.idea_text}
                    </Typography>
                    <Typography variant="h5">{Math.ceil((idea.vote_count / valueTotalVotes) * 100)}%</Typography>
                  </Grid>
                  <CardContent>
                    <LinearProgress variant="determinate" value={(idea.vote_count / valueTotalVotes) * 100}></LinearProgress>
                    <Typography className={classes.voteText} variant="body2" color="textSecondary" component="p">
                      Total Votes = {idea.vote_count}
                    </Typography>
                  </CardContent>
                </Card>
              );
            } else if (index < 4 && !seeMoreValue) {
              return (
                <Card className={classes.cardSlider}>
                  <Grid className={classes.headingVote}>
                    <Typography variant="h5">
                      {idea.idea.id}
                      {' .       '} {idea.idea.idea_text}
                    </Typography>
                    <Typography variant="h5">{Math.ceil((idea.vote_count / valueTotalVotes) * 100)}%</Typography>
                  </Grid>
                  <CardContent>
                    <LinearProgress variant="determinate" value={(idea.vote_count / valueTotalVotes) * 100}></LinearProgress>
                    <Typography className={classes.voteText} variant="body2" color="textSecondary" component="p">
                      Total Votes = {idea.vote_count}
                    </Typography>
                  </CardContent>
                </Card>
              );
            }
          })}
          {valueVotes.length > 4 ? (
            <span
              style={{
                display: 'flex',
                justifyContent: 'center',
                color: '#369FD1',
                cursor: 'pointer'
              }}
              onClick={() => setSeeMoreValue(seeMoreValue ? false : true)}>
              {!seeMoreValue ? 'See all ideas' : 'Hide ideas'}
            </span>
          ) : null}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default DesignThinkingResults;
