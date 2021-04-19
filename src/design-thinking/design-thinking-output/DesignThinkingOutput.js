import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  LinearProgress,
  CardContent,
  Chip,
  Card,
  Paper,
  makeStyles,
  withStyles,
  FormControl,
  ListItem,
  ListItemText,
  List
} from '@material-ui/core';
import { Bubble } from 'react-chartjs-2';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Cookies from 'js-cookie';
import {
  fetchProjectSpecificL2Process,
  fetchIdeasPerProcess,
  fetchUsers,
  fetchBussinessUnits,
  fetchFeasibilityVotesPerProcess,
  fetchValueVotesPerProcess
} from '../../common/API';
import chartbackground from '../../assets/chartbackground.jpeg';
import DesignThinkingBackground from '../../assets/DesignThinkingBackground.png';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import { TrendingUpRounded } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    marginTop: '0.7cm',
    marginLeft: '4cm',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(2.0)
    }
  },
  headerMargin: {
    marginLeft: '4cm',
    marginTop: '1.5cm',
    color: '#D3D3D3'
  },
  header: {
    marginLeft: '4cm',
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
    marginLeft: '4cm',
    '& > *': {
      margin: theme.spacing(4.0)
    }
  },
  cardSlider: {
    '& > *': {
      padding: theme.spacing(1.5)
    }
  },
  lastDiv: {
    display: 'flex',
    justifyContent: 'left',
    marginLeft: '2.7cm',
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
    justifyContent: 'left',
    marginLeft: '2.7cm',
    '& > *': {
      padding: theme.spacing(3.0),
      margin: theme.spacing(6.0)
    }
  },
  textfieldstyle: {
    width: '20rem',
    marginLeft: theme.spacing(2),
    height: '6rem',
    overflow: 'auto'
  }
}));

function DesignThinkingOutput(props) {
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
  const [filterText, setFilterText] = useState('Hide Filter Tab');
  const [open, setOpen] = useState(false);
  const [businessUnitList, setBusinessUnitList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [users, setUsers] = useState([]);
  const [businessUnits, setBusinessUnits] = useState([]);
  const [fesVotes, setFesVotes] = useState([]);
  const [valVotes, setValVotes] = useState([]);

  const BorderLinearProgress = withStyles({
    root: {
      height: 4
    },
    bar: {
      borderRadius: 10,
      backgroundColor: '#89C64F '
    }
  })(LinearProgress);
  const ValueLinearProgress = withStyles({
    root: {
      height: 4
    },
    bar: {
      borderRadius: 10,
      backgroundColor: '#FA1428'
    }
  })(LinearProgress);

  const PaperBg = withStyles({
    root: {
      backgroundImage: 'url(' + chartbackground + ')',
      backgroundSize: '850px 373px',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'top'
    }
  })(Paper);

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
      setValVotes(valueArr);
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
      setFesVotes(feasibilityArr);
      setFeasibilityVotes(feasibilityArr);
    });
    setBusinessUnits([]);
    setUsers([]);
  };

  const handleFilteredData = () => {
    if (businessUnits.length >= 1 && users < 1) {
      let fData = [];
      let vData = [];
      feasibilityVotes.map(vote => {
        for (let j = 0; j < businessUnits.length; j++) {
          if (vote.user.business_unit === businessUnits[j].id) {
            fData.push(vote);
          }
        }
      });
      valueVotes.map(vote => {
        businessUnits.map(bu => {
          if (vote.user.business_unit === bu.id) {
            vData.push(vote);
          }
        });
      });
      setFeasibilityVotes(fData);
      setValueVotes(vData);
    }
    if (businessUnits < 1 && users.length >= 1) {
      let fData = [];
      let vData = [];
      feasibilityVotes.map(vote => {
        for (let i = 0; i < users.length; i++) {
          if (vote.user.name === users[i].user) {
            fData.push(vote);
          }
        }
      });
      valueVotes.map(vote => {
        for (let i = 0; i < users.length; i++) {
          if (vote.user.name === users[i].user) {
            vData.push(vote);
          }
        }
      });
      setFeasibilityVotes(fData);
      setValueVotes(vData);
    }
    if (businessUnits.length >= 1 && users.length >= 1) {
      let fData = [];
      let vData = [];
      feasibilityVotes.map(vote => {
        for (let i = 0; i < users.length; i++) {
          for (let j = 0; j < businessUnits.length; j++) {
            if (vote.user.name === users[i].user || vote.user.business_unit === businessUnits[j].id) {
              fData.push(vote);
            }
          }
        }
      });
      valueVotes.map(vote => {
        for (let i = 0; i < users.length; i++) {
          for (let j = 0; j < businessUnits.length; j++) {
            if (vote.user.name === users[i].user || vote.user.business_unit === businessUnits[j].id) {
              vData.push(vote);
            }
          }
        }
      });
      setFeasibilityVotes(fData);
      setValueVotes(vData);
    }
  };
  const handleClick = () => {
    setOpen(!open);
    if (open) {
      setFilterText('Hide Filter Tab');
    } else {
      setFilterText('Show Filter Tab');
    }
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
  useEffect(() => {
    Promise.all([fetchBussinessUnits(Cookies.get('project'), props.onMessage), fetchUsers(props.onMessage)])
      .then(data => {
        setBusinessUnitList(
          data[0]
            ? data[0].map(i => {
                return { businessunit: i.unit, id: i.id };
              })
            : []
        );
        setUserList(
          data[1]
            ? data[1].map(i => {
                if (i.name == null) return { user: '', id: i.id };
                else return { user: i.name, id: i.id };
              })
            : []
        );
      })
      .catch(e => {
        props.onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      });
  }, []);
  useEffect(() => {
    if (businessUnits.length === 0 && users.length === 0) {
      setFeasibilityVotes(fesVotes);
      setValueVotes(valVotes);
    }
  }, [businessUnits, users]);

  return (
    <React.Fragment>
      <Grid container>
        <Grid item container justify="flex-end">
          <Grid item>
            <List>
              <ListItem button onClick={handleClick}>
                <ListItemText primary={filterText} />
              </ListItem>
            </List>
          </Grid>
          {open ? null : (
            <Grid item container spacing={2}>
              <Grid item>
                <Autocomplete
                  multiple
                  filterSelectedOptions
                  id="add-businessUnits"
                  options={businessUnitList}
                  value={businessUnits}
                  getOptionLabel={option => option.businessunit}
                  getOptionSelected={(option, value) => option.businessunit === value.businessunit}
                  onChange={(event, newValue) => {
                    setBusinessUnits(newValue);
                  }}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        color="primary"
                        label={option.businessunit}
                        style={{ marginTop: '5px', marginBottom: '5px' }}
                        variant="outlined"
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={params => <TextField variant="filled" className={classes.textfieldstyle} {...params} label="Business Unit" />}
                />
              </Grid>
              <Grid item>
                <Autocomplete
                  multiple
                  filterSelectedOptions
                  id="add-users"
                  options={userList}
                  value={users}
                  getOptionLabel={option => option.user}
                  getOptionSelected={(option, value) => option.user === value.user}
                  onChange={(event, newValue) => {
                    setUsers(newValue);
                  }}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip
                        color="primary"
                        label={option.user}
                        style={{ marginTop: '5px', marginBottom: '5px' }}
                        variant="outlined"
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={params => (
                    <TextField
                      variant="filled"
                      className={classes.textfieldstyle}
                      style={{ marginBottom: '0.5cm' }}
                      {...params}
                      label="Select Users"
                    />
                  )}
                />
              </Grid>
              <Grid item>
                <Button variant="contained" style={{ margin: '0px 15px 40px' }} color="primary" onClick={handleFilteredData}>
                  Search
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Divider />
      <Typography className={classes.header} variant="h5">
        Select a Level 2 Process
      </Typography>
      <Grid className={classes.root}>
        {l2ProcessList.map((process, index) => (
          <Chip
            variant="outlined"
            size="large"
            style={{ color: process.isSelected ? 'white' : '#1381B9', backgroundColor: process.isSelected ? '#1381B9' : 'white' }}
            label={process.title}
            clickable
            color="primary"
            onClick={() => voteCount(process, index)}
          />
        ))}
      </Grid>
      <Typography className={classes.headerMargin} variant="subtitle1">
        {activeIndex + 1} of {l2ProcessList.length}
      </Typography>
      <Typography className={classes.matrixmargin} variant="h5">
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
                      {'   '} {idea.idea.idea_text}
                    </Typography>
                    <Typography variant="h5">{Math.ceil((idea.vote_count / feasibilityTotalVotes) * 100)}%</Typography>
                  </Grid>
                  <CardContent>
                    <BorderLinearProgress variant="determinate" value={(idea.vote_count / feasibilityTotalVotes) * 100} />
                    <Typography className={classes.voteText} variant="body2" color="textSecondary" component="p">
                      {idea.vote_count} votes
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
                      {'   '} {idea.idea.idea_text}
                    </Typography>
                    <Typography variant="h5">{Math.ceil((idea.vote_count / feasibilityTotalVotes) * 100)}%</Typography>
                  </Grid>
                  <CardContent>
                    <BorderLinearProgress variant="determinate" value={(idea.vote_count / feasibilityTotalVotes) * 100} />
                    <Typography className={classes.voteText} variant="body2" color="textSecondary" component="p">
                      {idea.vote_count} votes
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
                      {'   '} {idea.idea.idea_text}
                    </Typography>
                    <Typography variant="h5">{Math.ceil((idea.vote_count / valueTotalVotes) * 100)}%</Typography>
                  </Grid>
                  <CardContent>
                    <ValueLinearProgress variant="determinate" value={(idea.vote_count / valueTotalVotes) * 100} />
                    <Typography className={classes.voteText} variant="body2" color="textSecondary" component="p">
                      {idea.vote_count} votes
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
                      {'   '} {idea.idea.idea_text}
                    </Typography>
                    <Typography variant="h5">{Math.ceil((idea.vote_count / valueTotalVotes) * 100)}%</Typography>
                  </Grid>
                  <CardContent>
                    <ValueLinearProgress variant="determinate" value={(idea.vote_count / valueTotalVotes) * 100} />
                    <Typography className={classes.voteText} variant="body2" color="textSecondary" component="p">
                      {idea.vote_count} votes
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

export default DesignThinkingOutput;
