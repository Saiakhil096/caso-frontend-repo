import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink, useParams, withRouter } from 'react-router-dom';
import { createKeyActivity } from '../common/API';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Grid, Button, TextField, Backdrop, CircularProgress } from '@material-ui/core';
import { fetchProjectData } from '../common/API';
const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}));

function CreateNewBcp(props) {
  const { onMessage } = props;
  const classes = useStyles();
  const [l2processes, setL2Processes] = useState(null);
  const [activity, setactivity] = useState(null);
  const [l2processesList, setL2ProcessesList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState(null);
  const [businessUnits, setBusinessUnits] = useState(null);
  const [businessUnitsList, setBusinessUnitsList] = useState([]);
  const [businessLoc, setBusinessLoc] = useState(null);
  const [businessLocList, setBusinessLocList] = useState([]);
  const [errors, setErrors] = useState({});
  const [backdropOpen, setBackDropOpen] = React.useState(false);

  useEffect(() => {
    fetchProjectData(Cookies.get('project'), onMessage)
      .then(data => {
        setCategoryList(data.business_change_plan_categories);
        setL2ProcessesList(data.l_2_processes);
        setBusinessUnitsList(data.business_units);
        setBusinessLocList(data.key_locations);
      })
      .catch(error => {
        onMessage(error, 'error');
      });
  }, []);
  const handleSave = () => {
    setBackDropOpen(true);
    const _errors = {};
    if (category === null) {
      _errors.category = 'Category Name is mandatory';
      _errors.category_bool = true;
      setErrors(_errors);
    }
    if (businessLoc === null) {
      _errors.businessLoc = 'Business Location Name is mandatory';
      _errors.businessLoc_bool = true;
      setErrors(_errors);
    }
    if (businessUnits === null) {
      _errors.businessUnits = 'Business Unit Name is mandatory';
      _errors.businessUnits_bool = true;
      setErrors(_errors);
    }
    if (l2processes === null) {
      _errors.l2processes = 'l2-Process Name is mandatory';
      _errors.l2processes_bool = true;
      setErrors(_errors);
    }
    if (activity === null) {
      _errors.activity = 'Activity Name is mandatory';
      _errors.activity_bool = true;
      setErrors(_errors);
    }
    if (category !== null && businessLoc !== null && businessUnits !== null && l2processes !== null && activity !== null) {
      const AddObjectCopy = {
        Activity: activity,
        Category: category.id.toString(),
        Business_Unit: businessUnits.id.toString(),
        Location: businessLoc.id.toString(),
        L2_Process: l2processes.id.toString()
      };
      createKeyActivity(
        {
          key_activity: AddObjectCopy.Activity,
          business_change_plan_category: AddObjectCopy.Category,
          key_locations: [AddObjectCopy.Location],
          business_units: [AddObjectCopy.Business_Unit],
          project: Cookies.get('project'),
          l_2_process: AddObjectCopy.L2_Process
        },
        props.onMessage
      ).then(keyData => {});
      setBackDropOpen(false);
      onMessage('Record Created Successfully', 'success');
      props.history.push('/Business-change-plan');
    }
  };

  const handleL2ProcessChange = e => {
    setactivity(e.target.value);
  };

  const handleCancel = () => {
    props.history.push('/Business-change-plan');
  };
  return (
    <React.Fragment>
      <Grid container direction="column" justify="center" spacing={3} style={{ width: '100%', marginTop: 50 }}>
        <Grid item container>
          <Grid xs={4} />
          <Grid item xs={4}>
            <TextField
              required
              style={{ width: '100%' }}
              id="key_activity"
              label="Activity"
              color="primary"
              variant="filled"
              onChange={e => handleL2ProcessChange(e)}
              error={errors.activity_bool}
              helperText={errors.activity}
            />
          </Grid>
          <Grid xs={4} />
        </Grid>
        <Grid item container>
          <Grid xs={4} />
          <Grid item xs={4}>
            <Autocomplete
              id="category"
              value={category}
              options={categoryList}
              getOptionLabel={option => option.category_name}
              onChange={(e, newValue) => setCategory(newValue)}
              renderInput={params => (
                <TextField required error={errors.category_bool} helperText={errors.category} {...params} label="Category" variant="filled" />
              )}
            />
          </Grid>
          <Grid xs={4} />
        </Grid>
        <Grid item container>
          <Grid xs={4} />
          <Grid item xs={4}>
            <Autocomplete
              id="Business_Unit"
              value={businessUnits}
              options={businessUnitsList}
              getOptionLabel={option => option.unit}
              onChange={(e, newValue) => setBusinessUnits(newValue)}
              renderInput={params => (
                <TextField
                  required
                  error={errors.businessUnits_bool}
                  helperText={errors.businessUnits}
                  {...params}
                  label="Business Unit"
                  variant="filled"
                />
              )}
            />
          </Grid>
          <Grid xs={4} />
        </Grid>
        <Grid item container>
          <Grid xs={4} />
          <Grid item xs={4}>
            <Autocomplete
              id="Location"
              value={businessLoc}
              options={businessLocList}
              getOptionLabel={option => option.location}
              onChange={(e, newValue) => setBusinessLoc(newValue)}
              renderInput={params => (
                <TextField error={errors.businessLoc_bool} helperText={errors.businessLoc} required {...params} label="Location" variant="filled" />
              )}
            />
          </Grid>
          <Grid xs={4} />
        </Grid>
        <Grid item container>
          <Grid xs={4} />
          <Grid item xs={4}>
            <Autocomplete
              id="l_2_process"
              value={l2processes}
              options={l2processesList}
              getOptionLabel={option => option.title}
              onChange={(e, newValue) => setL2Processes(newValue)}
              renderInput={params => (
                <TextField
                  error={errors.l2processes_bool}
                  helperText={errors.l2processes}
                  required
                  {...params}
                  label="Level 2 Process"
                  variant="filled"
                />
              )}
            />
          </Grid>
          <Grid xs={4} />
        </Grid>

        <Grid item container justify="space-between" style={{ marginTop: 50 }}>
          <Grid item xs={1} />
          <Grid item xs={3} style={{ marginLeft: '4%' }}>
            <Button variant="contained" color="primary" onClick={handleCancel}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={4} />
          <Grid item xs={3}>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default withRouter(CreateNewBcp);
