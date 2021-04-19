import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { Grid, TextField, Button, FormControl, Switch, FormLabel } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useRouteMatch, withRouter } from 'react-router-dom';
import { createEngagementData, fetchProjectData } from '../common/API';

const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(7, 10)
  },
  background: {
    backgroundColor: '#f4f4f3'
  },
  subheading: {
    color: grey[200]
  },
  button: {
    backgroundColor: 'pri',
    color: grey[50]
  },
  text: {
    borderRadius: '5px 5px 0 0',
    maxHeight: 190,
    backgroundColor: 'white'
  },
  input: {
    color: grey[50]
  },
  textfield: {
    style: { backgroundColor: 'white' },
    width: '100%'
  }
}));

function EngagementsReportsTile(props) {
  const classes = useStyles();
  const [locationlist, setLocationlist] = useState([]);
  const [businessUnitlist, setBusinessUnitlist] = useState([]);
  const [interventionType, setInterventionType] = useState('');
  const [comment, setComment] = useState('');
  const [isAnonymousUser, setIsAnonymousUser] = useState(false);
  const project = Cookies.get('project');
  const [location, setLocation] = useState(null);
  const [businessUnit, setBusinessUnit] = useState(null);
  const [user, setUser] = useState();
  const { url } = useRouteMatch();
  const { onMessage } = props;

  useEffect(() => {
    const userId = isAnonymousUser === false ? Cookies.get('user') : null;
    setUser(userId);
  }, [isAnonymousUser]);

  useEffect(() => {
    Promise.all([fetchProjectData(project, onMessage)])
      .then(([data]) => {
        setLocationlist(data.key_locations);
        setBusinessUnitlist(data.business_units);
      })
      .catch(e => {
        props.onMessage(`Error: ${e}`, 'error');
      });
  }, []);

  const generateData = () => {
    var body = {
      comment: comment,
      intervention_type: interventionType,
      record_anonymously: isAnonymousUser,
      business_unit: businessUnit,
      key_location: location,
      date_time: new Date(),
      user: user,
      project: Cookies.get('project')
    };

    if (location === '' || businessUnit === '' || interventionType === '' || comment === '') {
      props.onMessage(`Fill the mandatory details`, 'warning');
    } else {
      createEngagementData(body, props.onMessage)
        .then(data => {
          if (data.error) {
            props.onMessage(data.message[0].messages[0].message, 'error');
          } else {
            props.onMessage(`Data has been created successfully`, 'success');
            props.history.push(`/other-engagements-comments`);
          }
        })
        .catch(e => {
          props.onMessage(e, 'error');
        });
    }
  };

  const handleSwitchToggle = () => {
    setIsAnonymousUser(!isAnonymousUser);
  };

  return (
    <Grid item sm className={`${classes.background} ${classes.content}`}>
      <Grid item container direction="column" spacing={2} xs={10}>
        <Grid item>
          <FormControl fullWidth>
            <FormLabel>Record Anonymously</FormLabel>
            <Switch checked={isAnonymousUser} onChange={handleSwitchToggle} color="primary" />
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl fullWidth variant="filled" className={classes.textfield}>
            <Autocomplete
              id="Location"
              value={location}
              options={locationlist}
              getOptionLabel={option => option.location}
              onChange={(e, newValue) => setLocation(newValue)}
              renderInput={params => <TextField required {...params} label="Location" margin="normal" variant="filled" />}
            />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl fullWidth variant="filled" className={classes.textfield}>
            <Autocomplete
              id="business_unit"
              value={businessUnit}
              onChange={(e, newValue) => {
                setBusinessUnit(newValue);
              }}
              renderInput={params => <TextField className={classes.text} {...params} label="Business Unit" margin="normal" required={true} />}
              options={businessUnitlist}
              getOptionLabel={option => option.unit}
              onChange={(e, newValue) => setBusinessUnit(newValue)}
              renderInput={params => <TextField required {...params} label="Business Unit" margin="normal" variant="filled" />}
            />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl fullWidth variant="filled" className={classes.textfield}>
            <TextField
              label="Type of Intervention "
              value={interventionType}
              onChange={e => {
                setInterventionType(e.target.value);
              }}
              required={true}
              variant="filled"
              required
            />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl fullWidth variant="filled" className={classes.textfield}>
            <TextField
              label="Comment"
              multiline
              rows={4}
              value={comment}
              onChange={e => {
                setComment(e.target.value);
              }}
              required={true}
              variant="filled"
              required
            />
          </FormControl>
        </Grid>

        <Grid item container alignItems="baseline" justify="flex-end">
          <Grid item>
            <Button variant="contained" color="primary" className={classes.button} onClick={e => generateData()}>
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default withRouter(EngagementsReportsTile);
