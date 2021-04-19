import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { red, amber, yellow, lightGreen, green } from '@material-ui/core/colors';
import { Grid, Typography, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import Questions from './Questions';
import Sidebar from '../Sidebar';
import { Rating1Icon, Rating2Icon, Rating3Icon, Rating4Icon, Rating5Icon } from '../../common/CustomIcons';
import { url } from '../../common/API';

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
    backgroundColor: '#2BC4E9'
  }
}));

function Priorities(props) {
  const classes = useStyles();

  const [currentProcess, setCurrentProcess] = useState(0);
  const [tokenPool, setTokenPool] = useState([2, 2, 2, 2, 2]);
  const [processes, setProcesses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const { sendResponse, onMessage, setActiveStep, activeStep, l2Process, setSendResponse, setPrioritiesData } = props;

  useEffect(() => {
    if (l2Process && l2Process.length > 0) {
      setProcesses(l2Process);
      setPriorities(
        l2Process.map(process => {
          return {
            l_2_process: process.id,
            rating: null,
            justification: ''
          };
        })
      );
    }
  }, [l2Process]);

  //componentDidUpdate
  useEffect(() => {
    if (sendResponse) {
      submitAnswers();
    }
  }, [sendResponse]);

  const submitAnswers = () => {
    const API_CALL = new URL('priorities', url);
    const requestHeaders = {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    };
    fetch(API_CALL, {
      method: 'post',
      headers: requestHeaders,
      body: JSON.stringify({ Priority: priorities, user: Cookies.get('user'), project: Cookies.get('project') })
    })
      .then(response => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then(data => {
        onMessage('Your answers have been submitted', 'success');
        setPrioritiesData([{ Priority: data.Priority, user: Cookies.get('user'), project: Cookies.get('project') }]);
        setSendResponse(false);
        setActiveStep(activeStep + 1);
      })
      .catch(e => {
        props.onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      });
  };

  const handleNextProcess = () => {
    if (currentProcess === processes.length - 1) {
      if (priorities.filter(o => o.rating === null).length > 0) {
        props.onMessage('You must provide a priority for each L2 process', 'warning');
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
    const prioritiesCopy = JSON.parse(JSON.stringify(priorities));
    const justification = prioritiesCopy[currentProcess].justification;

    if (!regex.test(justification) && justification.length !== 0) {
      props.onMessage('You must enter at least 2 characters in your justification', 'warning');
      return;
    }
    setCurrentProcess(index);
  };

  const handleRatingChange = (selectedIndex, previousIndex) => {
    if (tokenPool[selectedIndex] === 0) {
      props.onMessage('You have used all available tokens for this priority rating', 'warning');
      return false;
    }
    const prioritiesCopy = JSON.parse(JSON.stringify(priorities));
    prioritiesCopy[currentProcess].rating = selectedIndex;
    setPriorities(prioritiesCopy);
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

  const handleJustificationChange = event => {
    const input = event.target.value;
    const prioritiesCopy = JSON.parse(JSON.stringify(priorities));
    prioritiesCopy[currentProcess].justification = input;
    setPriorities(prioritiesCopy);
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
      <Grid item xs={false} sm={7} md={4} className={classes.content}>
        {processes[currentProcess] && priorities[currentProcess] && (
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
                    const icon = getToken(priorities[index].rating, true);

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
        {processes[currentProcess] && priorities[currentProcess] && (
          <Questions
            title={processes[currentProcess].title}
            rating={priorities[currentProcess].rating}
            justification={priorities[currentProcess].justification}
            step={currentProcess + 1}
            totalSteps={processes.length}
            onNextProcess={handleNextProcess}
            onPreviousProcess={handlePreviousProcess}
            onRatingChange={handleRatingChange}
            onJustificationChange={handleJustificationChange}
            onMessage={props.onMessage}
          />
        )}
      </Grid>
    </React.Fragment>
  );
}

export default Priorities;
