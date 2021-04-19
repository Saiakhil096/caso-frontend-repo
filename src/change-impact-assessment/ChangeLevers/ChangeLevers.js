import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  List,
  ListItem,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
  FormControl,
  Paper,
  Grid,
  TextField,
  Button,
  Tooltip,
  IconButton,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  paper: {
    background: 'none',
    width: '100%',
    maxWidth: '45rem',
    margin: theme.spacing(3, 'auto'),
    padding: theme.spacing(2),
    boxShadow: 'none',
    '& .MuiSwitch-root': {
      marginRight: 'auto'
    }
  },
  textField: {
    width: '62%',
    marginRight: '4px'
  }
}));

function ChangeLevers(props) {
  const classes = useStyles();
  const handleL2ProcessChange = (e, index) => {
    const keyActivitiesCopy = JSON.parse(JSON.stringify(props.keyActivities));
    keyActivitiesCopy[index].key_activity = e.target.value;
    props.onkeyActivityChanged(keyActivitiesCopy);
  };
  const handleDeleteL2Process = (e, index) => {
    const keyActivitiesCopy = JSON.parse(JSON.stringify(props.keyActivities));
    keyActivitiesCopy[index].status = false;
    props.onkeyActivityChanged(keyActivitiesCopy);
  };
  const handleDropDownChange = (event, id, newValue) => {
    const keyActivitiesCopy = JSON.parse(JSON.stringify(props.keyActivities));
    const str = event.target.id;
    const index = str.indexOf('-');

    if (index > 0) {
      keyActivitiesCopy[id].category = newValue;

      props.onkeyActivityChanged(keyActivitiesCopy);
    }
  };

  const handleAddNewL2Process = () => {
    const keyActivitiesCopy = JSON.parse(JSON.stringify(props.keyActivities));
    keyActivitiesCopy.push({
      key_activity: null,
      category: null,
      key_id: null,
      status: true
    });
    props.onkeyActivityChanged(keyActivitiesCopy);
  };
  const renderTextFields = () => {
    return props.keyActivities.map((keyActivity, id) => {
      {
        return keyActivity.status == true ? (
          <ListItem style={{ paddingLeft: 15 }} disableGutters key={`${keyActivity}-${id}`}>
            <TextField
              id="key_activity"
              color="primary"
              variant="filled"
              className={classes.textField}
              value={keyActivity.key_activity || ''}
              onChange={e => handleL2ProcessChange(e, id)}
              inputProps={{ 'data-testid': 'key_activity' }}
            />
            <Autocomplete
              id="category"
              style={{ width: '32%', marginTop: '-6px' }}
              value={keyActivity.category}
              options={props.category}
              getOptionLabel={option => option.category_name}
              getOptionSelected={(option, value) => value.id === option.id}
              onChange={(e, value) => handleDropDownChange(e, id, value)}
              renderInput={params => <TextField {...params} variant="filled" margin="normal" />}
            />
            <ListItemSecondaryAction style={{ paddingRight: 40 }}>
              <Tooltip title="Delete" arrow>
                <IconButton edge="end" onClick={e => handleDeleteL2Process(e, id, keyActivity)}>
                  <DeleteIcon color="primary" />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        ) : null;
      }
    });
  };

  return (
    <React.Fragment>
      <Paper component="form" className={classes.paper}>
        <FormControl component="fieldset">
          <Grid container spacing={8}>
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  name="org_design"
                  control={<Switch data-testid="org_design" checked={props.formCIA.org_design} onChange={props.onSwitchChange} color="primary" />}
                  label="Org Design"
                  labelPlacement="top"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  name="culture"
                  control={<Switch data-testid="culture" checked={props.formCIA.culture} onChange={props.onSwitchChange} color="primary" />}
                  label="Culture"
                  labelPlacement="top"
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  name="roles_and_responsibility"
                  control={
                    <Switch
                      data-testid="roles_and_responsibility"
                      checked={props.formCIA.roles_and_responsibility}
                      onChange={props.onSwitchChange}
                      color="primary"
                    />
                  }
                  label="Roles and Responsibilities"
                  labelPlacement="top"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  name="communication_and_engagement"
                  control={
                    <Switch
                      data-testid="communication_and_engagement"
                      checked={props.formCIA.communication_and_engagement}
                      onChange={props.onSwitchChange}
                      color="primary"
                    />
                  }
                  label="Communication and Engagement"
                  labelPlacement="top"
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  name="policy"
                  control={<Switch data-testid="policy" checked={props.formCIA.policy} onChange={props.onSwitchChange} color="primary" />}
                  label="Policy"
                  labelPlacement="top"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  name="training"
                  control={<Switch data-testid="training" checked={props.formCIA.training} onChange={props.onSwitchChange} color="primary" />}
                  label="Training"
                  labelPlacement="top"
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  name="process"
                  control={<Switch data-testid="process" checked={props.formCIA.process} onChange={props.onSwitchChange} color="primary" />}
                  label="Process"
                  labelPlacement="top"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  name="performance_management"
                  control={
                    <Switch
                      data-testid="performance_management"
                      checked={props.formCIA.performance_management}
                      onChange={props.onSwitchChange}
                      color="primary"
                    />
                  }
                  label="Performance Management"
                  labelPlacement="top"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid item container justify="space-between" style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 40 }}>
              <Grid item xs={8}>
                <Typography>List Key Activities</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography>Category</Typography>
              </Grid>
              <Grid item xs={2} container justify="center">
                <Button onClick={handleAddNewL2Process} color="primary">
                  Add New
                </Button>
              </Grid>
            </Grid>
            <List>{renderTextFields()}</List>
          </Grid>
        </FormControl>
      </Paper>
    </React.Fragment>
  );
}

export default ChangeLevers;
