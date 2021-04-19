import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Modal,
  TextField,
  Button,
  Paper,
  Fade,
  Popper,
  InputAdornment,
  CircularProgress,
  makeStyles,
  ClickAwayListener
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { fetchProgressTrackers, createRollout, updateRolloutTrackers } from '../common/API';
import Cookies from 'js-cookie';
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 'auto',
    width: '100%',
    padding: theme.spacing(10, 0)
  },
  heading: {
    color: blue[900],
    padding: theme.spacing(5)
  },
  progressItem: {
    marginBottom: theme.spacing(8),
    spacing: 10
  },
  circularcolor: {
    color: 'maroon'
  },
  duecolor: {
    color: 'orange',
    fontSize: 12,
    marginLeft: '15px'
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardName: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: '35px'
  },
  save: {
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(0.5)
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  }
}));

function RolloutTracker(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openmodal, setOpenmodal] = React.useState(false);
  const [roll, setRoll] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const endDate = moment().format('YYYY-MM-DD');
  const [selectPrepareDate, setSelectPrepareDate] = React.useState(null);
  const [selectFoundationDate, setSelectFoundationDate] = React.useState(null);
  const [selectBuildDate, setSelectBuildDate] = React.useState(null);
  const [selectTestDate, setSelectTestDate] = React.useState(null);
  const [selectDeployDate, setSelectDeployDate] = React.useState(null);
  const [selectEditDate, setSelectEditDate] = React.useState(null);
  const user = Cookies.get('user');
  const { onMessage } = props;
  const [percent, setPercent] = React.useState();
  const [refresher, setRefresher] = useState(true);
  const [title, setTitle] = useState('');
  const [item, setItem] = useState(false);
  const trackerObject = {
    rollout_title: '',
    project: Cookies.get('project'),
    user: Cookies.get('user'),
    rollout_trackers: []
  };
  const [trackerRoll, setTrackerRoll] = useState(trackerObject);

  useEffect(() => {
    if (refresher) {
      Promise.all([fetchProgressTrackers(user, onMessage)]).then(([trackerData]) => {
        trackerData.map(tracker => {
          tracker.item = item;
        });
        setRoll(trackerData);
        setRefresher(false);
      });
    }
  }, [refresher]);

  const handleEditClick = (value, cardId, rolloutInddex, event) => {
    const rollCopy = JSON.parse(JSON.stringify(roll));
    setPercent(rollCopy[rolloutInddex].rollout_trackers[value].percentage);
    setSelectEditDate(rollCopy[rolloutInddex].rollout_trackers[value].due_date);
    rollCopy[rolloutInddex].rollout_trackers[value].open = true;
    setOpen(true);
    setRoll(rollCopy);
    setAnchorEl(event.currentTarget);
    clickHandler();
  };
  const userRole = Cookies.get('role');

  const handleSave = (id, index, rolloutIndex, event) => {
    if (Number(percent) <= 100 && Number(percent) >= 0) {
      const rollCopy = JSON.parse(JSON.stringify(roll));
      rollCopy[rolloutIndex].rollout_trackers[index].percentage = Number(percent);
      rollCopy[rolloutIndex].rollout_trackers[index].due_date = selectEditDate;
      rollCopy[rolloutIndex].rollout_trackers[index].open = false;
      updateRolloutTrackers(rollCopy[rolloutIndex].id, rollCopy[rolloutIndex], props.onMessage).then(() => {
        setRefresher(true);
        setSelectEditDate();
      });
    } else {
      props.onMessage('Please enter a value between and including  0 - 100 ', 'warning');
    }
  };

  const handleAddNewCards = () => {
    setOpenmodal(true);
  };
  const handleCards = () => {
    if (
      title === '' ||
      selectPrepareDate === null ||
      selectFoundationDate === null ||
      selectBuildDate === null ||
      selectTestDate === null ||
      selectDeployDate === null
    ) {
      props.onMessage('A valid field is required', 'warning');
    } else {
      createRollout(trackerRoll, onMessage).then(() => {
        handleCancel();
        setTitle('');
        setRefresher(true);
        setSelectPrepareDate(null);
        setSelectFoundationDate(null);
        setSelectBuildDate(null);
        setSelectTestDate(null);
        setSelectDeployDate(null);
      });
    }
  };
  const handleCancel = () => {
    setOpenmodal(false);
  };

  const handleCancel1 = () => {
    setOpen(false);
    setRefresher(true);
  };

  const handleEditDate = date => {
    setSelectEditDate(date);
  };

  const handleTitle = event => {
    setTrackerRoll({ ...trackerRoll, rollout_title: event.target.value.toString() });
    setTitle(event.target.value);
  };

  const handleDateChange = (date, trackerTitle) => {
    let tracker = [...trackerRoll.rollout_trackers];
    var copyIndex = null;
    tracker.map((item, index) => {
      if (item.title === trackerTitle) {
        copyIndex = index;
      }
    });
    if (copyIndex === null) {
      tracker.push({
        title: trackerTitle,
        percentage: 0,
        due_date: date
      });
    } else {
      tracker[copyIndex].due_date = date;
    }

    setTrackerRoll({ ...trackerRoll, rollout_trackers: tracker });
    if (trackerTitle === 'Prepare') {
      setSelectPrepareDate(date);
    }
    if (trackerTitle === 'Foundation') {
      setSelectFoundationDate(date);
    }
    if (trackerTitle === 'Build-Print') {
      setSelectBuildDate(date);
    }
    if (trackerTitle === 'Test') {
      setSelectTestDate(date);
    }
    if (trackerTitle === 'Deploy') {
      setSelectDeployDate(date);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const clickAwayHandler = (index, rollIndex) => {
    const rollCopy = JSON.parse(JSON.stringify(roll));
    rollCopy[rollIndex].rollout_trackers[index].open = false;
    setRoll(rollCopy);
    setIsOpen(false);
  };
  const clickHandler = () => setIsOpen(true);

  const MyPopper = ({ isOpen, clickAwayHandler, index, rollIndex, activity }) => (
    <ClickAwayListener onClickAway={e => clickAwayHandler(index, rollIndex)}>
      <Popper open={activity.open} anchorEl={anchorEl} transition>
        <Paper style={{ display: 'flex', flexFlow: 'column', placeItems: 'flex-start', padding: '15px' }}>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Percent"
            type="number"
            id="progress"
            name="Progress"
            placeholder={activity.percentage}
            value={percent}
            onChange={event => setPercent(event.target.value)}
            autoComplete="progress"
          />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="normal"
              required
              inputProps={{ readOnly: false }}
              label="Edit Date"
              id="date-picker-inline"
              format="dd/MM/yyyy"
              placeholder="dd/MM/yyyy "
              value={selectEditDate}
              onChange={event => {
                handleEditDate(event);
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date'
              }}
            />
          </MuiPickersUtilsProvider>
          <Grid container justify="flex-end">
            <Grid item justify="flex-end" className={classes.save}>
              <Button style={{ marginRight: '.2cm' }} variant="contained" color="primary" onClick={handleCancel1}>
                Cancel
              </Button>
            </Grid>
            <Grid item justify="flex-end" className={classes.save}>
              <Button variant="contained" color="primary" onClick={e => handleSave(activity.id, index, rollIndex, e)}>
                Save
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Popper>
    </ClickAwayListener>
  );

  const renderCards = (cards, id, rollIndex) => {
    return cards.map((activity, index) => {
      return (
        <Grid key={activity.id} item component={Card} className={classes.progressItem}>
          <CardContent>
            <Grid>
              <Typography style={{ marginLeft: '15px' }} gutterBottom variant="h5" align="left" component="h2">
                {`${activity.title}`}
              </Typography>
            </Grid>
            {moment(endDate).isAfter(activity.due_date) ? (
              <Grid>
                <Grid item className={classes.progressItem}>
                  <Box position="relative" m={2} display="inline-flex">
                    <CircularProgress className={classes.circularcolor} size={210} thickness={6} variant="static" value={activity.percentage} />
                    <Box top={0} left={0} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center">
                      <Typography variant="h3" component="div" color="textSecondary">{`${Math.round(activity.percentage)}%`}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Typography style={{ marginLeft: '15px' }} variant="h6" align="left">
                  Due Date
                </Typography>
                <Typography style={{ marginLeft: '15px' }} align="left">
                  {activity.due_date}
                </Typography>
                <Typography className={classes.duecolor} align="left" variant="subtitle1">
                  Overdue
                </Typography>
              </Grid>
            ) : (
              <Grid>
                <Grid item className={classes.progressItem}>
                  <Box position="relative" m={2} display="inline-flex">
                    <CircularProgress size={210} thickness={6} variant="static" value={activity.percentage} />
                    <Box top={0} left={0} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center">
                      <Typography variant="h3" component="div" color="textSecondary">{`${Math.round(activity.percentage)}%`}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Typography style={{ marginLeft: '15px' }} variant="h6" align="left">
                  Due Date
                </Typography>
                <Typography style={{ marginLeft: '15px' }} align="left">
                  {activity.due_date}
                </Typography>
              </Grid>
            )}
            {userRole === 'Programme Users' || userRole === 'Capgemini Users' ? (
              <Grid>
                <Button color="primary" onClick={e => handleEditClick(index, activity.id, rollIndex, e)}>
                  Edit
                </Button>

                {isOpen && <MyPopper {...{ clickAwayHandler, isOpen, index, rollIndex, activity }} />}
              </Grid>
            ) : (
              <Typography></Typography>
            )}
          </CardContent>
        </Grid>
      );
    });
  };

  return (
    <div className={classes.root}>
      <Grid className={classes.cardName} item container>
        <Grid item>
          <Button color="primary" onClick={handleAddNewCards}>
            Create Cards
          </Button>
          <Modal className={classes.modal} open={openmodal}>
            <Fade in={openmodal}>
              <div className={classes.paper}>
                <h2 id="rollout-title">Rollout Title</h2>
                <TextField
                  label="Title"
                  required
                  value={title}
                  onChange={event => {
                    handleTitle(event);
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"></InputAdornment>
                  }}></TextField>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify="space-around">
                    <KeyboardDatePicker
                      margin="normal"
                      required
                      inputProps={{ readOnly: false }}
                      label="Prepare Due Date"
                      id="date-picker-inline"
                      format="dd/MM/yyyy"
                      placeholder="dd/MM/yyyy "
                      value={selectPrepareDate}
                      onChange={event => {
                        handleDateChange(event, 'Prepare');
                      }}
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                    />
                    <KeyboardDatePicker
                      margin="normal"
                      required
                      inputProps={{ readOnly: false }}
                      label="Foundation Due Date"
                      placeholder="dd/MM/yyyy "
                      format="dd/MM/yyyy"
                      value={selectFoundationDate}
                      onChange={event => {
                        handleDateChange(event, 'Foundation');
                      }}
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                    />
                    <KeyboardDatePicker
                      margin="normal"
                      required
                      inputProps={{ readOnly: false }}
                      label="Build-Print Due Date"
                      placeholder="dd/MM/yyyy "
                      format="dd/MM/yyyy"
                      value={selectBuildDate}
                      onChange={event => {
                        handleDateChange(event, 'Build-Print');
                      }}
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                    />
                    <KeyboardDatePicker
                      margin="normal"
                      label="Test Due Date"
                      required
                      inputProps={{ readOnly: false }}
                      placeholder="dd/MM/yyyy "
                      format="dd/MM/yyyy"
                      value={selectTestDate}
                      onChange={event => {
                        handleDateChange(event, 'Test');
                      }}
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                    />
                    <KeyboardDatePicker
                      margin="normal"
                      required
                      inputProps={{ readOnly: false }}
                      label="Deploy Due Date"
                      placeholder="dd/MM/yyyy "
                      format="dd/MM/yyyy"
                      value={selectDeployDate}
                      onChange={event => {
                        handleDateChange(event, 'Deploy');
                      }}
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                    />
                  </Grid>
                  <Button justify="flex-end" color="primary" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button color="primary" onClick={handleCards}>
                    Ok
                  </Button>
                </MuiPickersUtilsProvider>
              </div>
            </Fade>
          </Modal>
        </Grid>
      </Grid>
      <Grid container direction="row">
        {roll.map((trackers, index) => (
          <React.Fragment>
            <Typography className={classes.heading} variant="h4" gutterBottom>
              {trackers.rollout_title}
            </Typography>
            <Grid container direction="row" justify="space-evenly" alignItems="center">
              {renderCards(trackers.rollout_trackers, trackers.id, index)}
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </div>
  );
}
export default RolloutTracker;
