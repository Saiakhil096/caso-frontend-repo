import React, { useEffect } from 'react';
import { Grid, Typography, makeStyles, Box } from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import Questions from '../Priorities/question';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  bottom: {
    marginBottom: theme.spacing(6),
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1)
  },
  toggleGroupStyle: {
    flexDirection: 'column'
  },
  options: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(5),
    padding: theme.spacing(4)
  }
}));

const toggleStyles = makeStyles(
  {
    root: {
      backgroundColor: 'inherit',
      textTransform: 'none',
      justifyContent: 'flex-start',
      fontSize: '15px',

      '&$selected': {
        backgroundColor: 'inherit',
        color: '#1381B9',
        disableFocusRipple: 'true',
        '&:hover': {
          backgroundColor: 'inherit',
          color: '#1381B9'
        }
      }
    },
    selected: {}
  },
  { name: 'MuiToggleButton' }
);

function PrioritiesSummaryScreen(props) {
  const classes = useStyles();
  const toggleClass = toggleStyles();

  const [currentProcess, setCurrentProcess] = React.useState(0);
  const [processes, setProcesses] = React.useState([]);
  const [newdata, setNewData] = React.useState([]);
  var filteredDataCopy = props.filteredData;
  const [ratingInfo, setRatingInfo] = React.useState([]);
  const [allRecords, setAllRecords] = React.useState([]);
  const [values, setValues] = React.useState('All');

  useEffect(() => {
    if (props.l2Process && props.l2Process.length > 0) {
      setProcesses(props.l2Process);
    }
    userBody();
  }, [props.l2Process]);

  const userBody = () => {
    var l2ProcessCopy = props.l2Process;
    const userData = [];

    l2ProcessCopy.map((process, index) => {
      props.prioritiesData.map((data, index) => {
        data.Priority.map((priority, index) => {
          props.businessData.map((business, index) => {
            if (priority.l_2_process.id === process.id && data.user.business_unit === business.id) {
              const user = {
                l2process_id: process.id,
                userName: data.user.username,
                priority_rating: priority.rating,
                justification: priority.justification,
                business_unit_id: data.user.business_unit,
                business_unit: business.unit
              };
              userData.push(user);
            }
          });
        });
      });
    });
    setNewData(userData);
  };

  useEffect(() => {
    if (filteredDataCopy && filteredDataCopy.length > 0) {
      if (filteredDataCopy[0].User.length > 0) {
        let usersFound = newdata.filter(j => {
          return filteredDataCopy[0].User.indexOf(j.userName) !== -1;
        });
        if (filteredDataCopy[0].BU.length > 0) {
          let buFound = usersFound.filter(j => {
            return filteredDataCopy[0].BU.indexOf(j.business_unit) !== -1;
          });
          setRatingInfo(buFound);
        } else {
          setRatingInfo(usersFound);
        }
      } else {
        let buFound = newdata.filter(j => {
          return filteredDataCopy[0].BU.indexOf(j.business_unit) !== -1;
        });
        setRatingInfo(buFound);
      }
    } else {
      setRatingInfo(newdata);
    }
  }, [filteredDataCopy, newdata]);

  useEffect(() => {
    if (values) {
      if (values === 'All') {
        setAllRecords(ratingInfo);
      } else {
        let filterRatings = ratingInfo.filter(k => {
          return values.indexOf(k.priority_rating) !== -1;
        });
        setAllRecords(filterRatings);
      }
    }
  }, [ratingInfo, values]);

  const handleNextProcess = () => {
    if (currentProcess === processes.length - 1) {
      props.onCompletion();
    } else {
      setCurrentProcess(currentProcess + 1);
      setValues('All');
    }
  };

  const handlePreviousProcess = () => {
    if (currentProcess === 0) {
      props.onPreviousStep();
    } else {
      setCurrentProcess(currentProcess - 1);
      setValues('All');
    }
  };

  const handleLinkClick = (event, index) => {
    setCurrentProcess(index);
    setValues('All');
  };

  return (
    <React.Fragment>
      <Grid item xs={12} sm={5} md={3} style={{ backgroundColor: 'white' }}>
        <Grid container className={classes.options}>
          <Grid item container alignitems="center">
            <Typography variant="h6">Select a process:</Typography>
          </Grid>
          {processes[currentProcess] && (
            <Grid container direction="column">
              <Grid className={classes.bottom}>
                <Grid item container>
                  <Grid item>
                    <ToggleButtonGroup className={classes.toggleGroupStyle} exclusive value={processes[currentProcess].title}>
                      {processes.map((item, index) => (
                        <ToggleButton
                          style={{ border: 0 }}
                          value={item.title}
                          key={item.title}
                          className={toggleClass.root}
                          aria-label={item.title}
                          onClick={event => handleLinkClick(event, index)}>
                          {index + 1}.{item.title}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item xs={12} sm={7} md={9}>
        {processes[currentProcess] && (
          <Questions
            title={processes[currentProcess].title}
            id={processes[currentProcess].id}
            step={currentProcess + 1}
            totalSteps={processes.length}
            onNextProcess={handleNextProcess}
            onPreviousProcess={handlePreviousProcess}
            newdata={newdata}
            currentProcess={currentProcess}
            ratingInfo={ratingInfo}
            allRecords={allRecords}
            values={values}
            setValues={setValues}
          />
        )}
      </Grid>
    </React.Fragment>
  );
}

export default PrioritiesSummaryScreen;
