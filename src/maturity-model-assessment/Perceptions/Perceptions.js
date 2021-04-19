import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { red, amber, yellow, lightGreen, green } from '@material-ui/core/colors';
import { Grid, Typography, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import Questions from './Questions';
import Sidebar from '../Sidebar';
import { VerySadIcon, SadIcon, OkIcon, HappyIcon, VeryHappyIcon } from '../../common/CustomIcons';
import { url, fetchKPIs, createKPI } from '../../common/API';

const useStyles = makeStyles(theme => ({
  headerMargin: {
    marginTop: theme.spacing(2)
  },
  activeListItem: {
    color: 'black'
  },
  listItem: {
    color: '#858585'
  },
  listIcon: {
    marginLeft: theme.spacing(2)
  },
  content: {
    padding: theme.spacing(4)
  },
  background: {
    backgroundColor: '#1381B9'
  }
}));

function Perceptions(props) {
  const classes = useStyles();

  const [currentProcess, setCurrentProcess] = useState(0);
  const [tokenPool, setTokenPool] = useState([2, 2, 2, 2, 2]);
  const [processes, setProcesses] = useState([]);
  const [perceptions, setPerceptions] = useState([]);
  const [kpis, setKpis] = React.useState([]);

  const { sendResponse, onMessage, setActiveStep, activeStep, setSendResponse, l2Process, setPereptionData } = props;

  useEffect(() => {
    if (l2Process && l2Process.length > 0) {
      setProcesses(l2Process);
      setPerceptions(
        l2Process.map(process => {
          return {
            l_2_process: process.id,
            rating: null,
            pain_points: [{ pain_point_text: '', kpi: null }]
          };
        })
      );
      fetchKPIs(onMessage).then(data => setKpis(data));
    }
  }, [l2Process]);

  //componentDidUpdate
  useEffect(() => {
    if (sendResponse) {
      submitAnswers();
    }
  }, [sendResponse]);

  const submitAnswers = () => {
    const API_CALL = new URL('perceptions', url);
    const requestHeaders = {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    };
    fetch(API_CALL, {
      method: 'post',
      headers: requestHeaders,
      body: JSON.stringify({ Perception: perceptions, user: Cookies.get('user'), project: Cookies.get('project') })
    })
      .then(response => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then(() => {
        onMessage('Your answers have been submitted', 'success');
        setPereptionData([{ Perception: perceptions, user: Cookies.get('user'), project: Cookies.get('project') }]);
        setSendResponse(false);
        setActiveStep(activeStep + 1);
      })
      .catch(e => {
        props.onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      });
  };

  const handleNextProcess = () => {
    if (currentProcess === processes.length - 1) {
      if (perceptions.filter(o => o.rating === null).length > 0) {
        props.onMessage('You must provide a perception for each L2 process', 'warning');
      } else {
        props.onCompletion();
      }
    } else {
      setCurrentProcess(currentProcess + 1);
    }
  };

  const handlePreviousProcess = () => {
    setCurrentProcess(currentProcess - 1);
  };

  const handleLinkClick = (event, index) => {
    const regex = new RegExp(/(.*[a-z]){2}/i);
    const perceptionsCopy = JSON.parse(JSON.stringify(perceptions));

    if (perceptionsCopy[currentProcess].pain_points.filter(o => !regex.test(o.pain_point_text) && o.pain_point_text.length !== 0).length > 0) {
      props.onMessage('You must enter at least 2 characters per reason', 'warning');
      return;
    }
    setCurrentProcess(index);
  };

  const handleRatingChange = (selectedIndex, previousIndex) => {
    if (tokenPool[selectedIndex] === 0) {
      props.onMessage('You have used all available tokens for this perception rating', 'warning');
      return false;
    }
    const perceptionsCopy = JSON.parse(JSON.stringify(perceptions));
    perceptionsCopy[currentProcess].rating = selectedIndex;
    setPerceptions(perceptionsCopy);
    const originalData = [...tokenPool];
    const newData = originalData.map(function (total, index) {
      if (index === selectedIndex && total > 0) {
        return total - 1;
      } else if (index === previousIndex && total < 2) {
        return total + 1;
      } else {
        return total;
      }
    });
    setTokenPool(newData);
    return true;
  };

  const handlePainpointAdd = () => {
    const perceptionsCopy = JSON.parse(JSON.stringify(perceptions));
    perceptionsCopy[currentProcess].pain_points.push({
      pain_point_text: ''
    });
    setPerceptions(perceptionsCopy);
  };

  const handlePainpointChange = (event, index) => {
    const perceptionsCopy = JSON.parse(JSON.stringify(perceptions));
    perceptionsCopy[currentProcess].pain_points[index].pain_point_text = event.target.value;
    setPerceptions(perceptionsCopy);
  };

  const handlePainpointDelete = (event, index) => {
    const perceptionsCopy = JSON.parse(JSON.stringify(perceptions));
    perceptionsCopy[currentProcess].pain_points.splice(index, 1);
    setPerceptions(perceptionsCopy);
  };

  const handleKPIChange = (event, newValue, index) => {
    const perceptionsCopy = JSON.parse(JSON.stringify(perceptions));
    if (typeof newValue === 'string') {
      perceptionsCopy[currentProcess].pain_points[index].kpi = {
        name: newValue
      };
    } else if (newValue && newValue.inputValue) {
      // Create a new value from the user
      createKPI({
        name: newValue.inputValue,
        project: Cookies.get('project')
      }).then(() => {
        fetchKPIs(onMessage).then(data => setKpis(data));
        perceptionsCopy[currentProcess].pain_points[index].kpi = {
          name: newValue.inputValue
        };
      });
    } else {
      perceptionsCopy[currentProcess].pain_points[index].kpi = newValue;
    }
    setPerceptions(perceptionsCopy);
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
      <Grid item xs={false} sm={7} md={4} className={classes.content}>
        {processes[currentProcess] && perceptions[currentProcess] && (
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
            <Grid container item spacing={1}>
              {tokenPool.map((item, index) => (
                <Grid item key={`tokenpool-row2-${index}`}>
                  {getToken(index, tokenPool[index] > 0)}
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
                <List component="nav" aria-label="main Level 2 Processes" className={classes.list}>
                  {processes.map((item, index) => {
                    const bSelected = currentProcess === index;
                    const linkClass = bSelected ? classes.activeListItem : classes.listItem;
                    const icon = getToken(perceptions[index].rating, true);

                    return (
                      <ListItem key={index} button selected={bSelected} onClick={e => handleLinkClick(e, index)}>
                        <ListItemText classes={{ primary: linkClass }} primary={item.title} />

                        <ListItemIcon classes={{ root: classes.listIcon }}>{icon}</ListItemIcon>
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
            </Grid>
          </Sidebar>
        )}
      </Grid>
      <Grid item xs={12} sm={5} md={8} className={`${classes.background} ${classes.content}`}>
        {processes[currentProcess] && perceptions[currentProcess] && (
          <Questions
            title={processes[currentProcess].title}
            rating={perceptions[currentProcess].rating}
            pain_points={perceptions[currentProcess].pain_points}
            kpis={kpis}
            step={currentProcess + 1}
            totalSteps={processes.length}
            onNextProcess={handleNextProcess}
            onPreviousProcess={handlePreviousProcess}
            onRatingChange={handleRatingChange}
            onPainpointAdd={handlePainpointAdd}
            onPainpointChange={handlePainpointChange}
            onPainpointDelete={handlePainpointDelete}
            onKPIChange={handleKPIChange}
            onMessage={props.onMessage}
          />
        )}
      </Grid>
    </React.Fragment>
  );
}

export default Perceptions;
