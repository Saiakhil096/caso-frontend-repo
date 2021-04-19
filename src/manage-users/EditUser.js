import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Link, withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, FormControl, TextField, Button, Container, Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { fetchUser, updateUser, fetchUserRoles, fetchSiteLocation, fetchProjectData } from '../common/API';
import IcapUserFields from './IcapUserFields';

const useStyles = makeStyles(theme => ({
  form: {
    margin: theme.spacing(8, 2)
  },
  text: {
    width: '28rem'
  }
}));

function EditUser(props) {
  const classes = useStyles();

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userTypeList, setUserTypeList] = useState([]);
  const [baseLocationList, setBaseLocationList] = useState([]);
  const [BusinessUnitList, setBusinessUnitList] = useState([]);
  const [siteList, setSiteList] = useState([]);
  const [userType, setUserType] = useState(null);
  const [baseLocation, setBaseLocation] = useState(null);
  const [businessUnit, setBusinessUnit] = useState(null);
  const [jobProfile, setJobProfile] = useState('');
  const [site, setSite] = useState(null);
  const [supervisor, setSupervisor] = useState('');
  const [supervisorEmail, setSupervisorEmail] = useState('');
  const [formName, setFormName] = useState('');
  const project = Cookies.get('project');
  const [user, setUser] = useState();

  function validate(email) {
    var isValid = false;
    if (email !== 'undefined') {
      var pattern = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);

      if (!pattern.test(email)) {
        isValid = false;
      } else {
        isValid = true;
      }
    }
    return isValid;
  }

  useEffect(() => {
    var editUser = Cookies.get('editUser');
    Promise.all([
      fetchUserRoles(props.onMessage),
      fetchSiteLocation(props.onMessage, project),
      fetchUser(props.onMessage, editUser),
      fetchProjectData(project, props.onMessage)
    ])
      .then(([userTypes, sites, userData, projectdata]) => {
        setBaseLocationList(projectdata.key_locations);
        setBusinessUnitList(projectdata.business_units);
        setUserTypeList(userTypes.roles);
        setSiteList(sites);
        setUserType(userData.role);
        setFormName(userData.role.name);
        setName(userData.name);
        setUsername(userData.userName);
        setEmail(userData.email);
        setBaseLocation(userData.base_location);
        setBusinessUnit(userData.business_unit);
        setSite(userData.site_location);
        setJobProfile(userData.job_profile);
        setSupervisor(userData.supervisor);
        setSupervisorEmail(userData.supervisor_email);
        setUser(userData);
      })
      .catch(e => {
        props.onMessage(`Error: ${e}`, 'error');
      });
  }, []);

  const handleEditUser = e => {
    e.preventDefault();
    if (userType.name === '') {
      props.onMessage(`You should select user type to proceed `, 'warning');
    } else {
      var editUser = getBody(userType);
      if (editUser) {
        updateUser(editUser.id, editUser, props.onMessage)
          .then(() => {
            props.onMessage(`User "${editUser.username}" has been edited successfully`, 'success');
            props.history.push(`/manage-users`);
          })
          .catch(e => {
            props.onMessage(e, 'error');
          });
      }
    }
  };

  const getBody = userType => {
    user.role = `${userType.id}`;
    if (password != '') {
      user.password = password;
    }
    if (userType.name === 'Change Agent') {
      if (
        name == '' ||
        email == '' ||
        baseLocation == null ||
        businessUnit == null ||
        site == null ||
        jobProfile == '' ||
        supervisor == '' ||
        supervisorEmail == ''
      ) {
        props.onMessage(`Fill the mandatory details`, 'warning');
      } else if (validate(email) == false) {
        props.onMessage('Please Enter Valid Email', 'error');
      } else if (validate(supervisorEmail) == false) {
        props.onMessage('Please Enter Valid Supervisor Email ', 'error');
      } else {
        user.name = name;
        user.email = email;
        user.base_location = baseLocation.id;
        user.business_unit = businessUnit.id;
        user.site_location = site.id;
        user.job_profile = jobProfile;
        user.supervisor = supervisor;
        user.supervisor_email = supervisorEmail;
        return user;
      }
    } else if (
      userType.name === 'Basic User' ||
      userType.name === 'Leadership Team' ||
      userType.name === 'Capgemini Users' ||
      userType.name === 'Programme Users'
    ) {
      if (name === '' || email === '' || businessUnit === null) {
        props.onMessage(`Fill the mandatory details`, 'warning');
      } else if (validate(email) == false) {
        props.onMessage('Please Enter Valid Email ', 'error');
      } else {
        user.name = name;
        user.email = email;
        user.business_unit = businessUnit.id;
        return user;
      }
    }
  };

  const handleChangeUserType = newValue => {
    setUserType(newValue);
    if (newValue) {
      if (newValue.name === 'Capgemini Users') {
        setFormName('Capgemini Users');
      } else if (newValue.name === 'Programme Users') {
        setFormName('Programme Users');
      } else if (newValue.name === 'Change Agent') {
        setFormName('Change Agent');
      } else if (newValue.name === 'Leadership Team') {
        setFormName('Leadership Team');
      } else {
        setFormName('Basic User');
      }
    } else {
      setFormName('');
    }
  };

  return (
    <React.Fragment>
      <Container maxWidth="sm">
        <form className={classes.form} noValidate>
          <Grid container direction="column" spacing={4} className={classes.form}>
            <Grid item>
              <Typography variant="h5" color="textSecondary">
                {Cookies.get('client')}
              </Typography>
              <Typography variant="h6" color="textSecondary">
                {Cookies.get('projectname')}
              </Typography>
            </Grid>

            <Grid item>
              <FormControl fullWidth margin="normal">
                <Autocomplete
                  id="user_type"
                  value={userType}
                  options={userTypeList.map((item, index) => item)}
                  getOptionLabel={option => option.name}
                  getOptionSelected={(option, value) => value.id === option.id}
                  onChange={(e, newValue) => handleChangeUserType(newValue)}
                  className={classes.text}
                  renderInput={params => <TextField required {...params} label="User Type" margin="normal" />}
                />
              </FormControl>
            </Grid>

            <Grid item>
              <TextField
                autoComplete="off"
                id="Name"
                name="name"
                label="Name"
                value={name}
                varient="filled"
                className={classes.text}
                onChange={e => {
                  setName(e.target.value);
                }}
                inputProps={{ 'data-testid': 'username' }}
                required
                autoFocus
              />
            </Grid>
            <Grid item>
              <FormControl margin="normal" variant="filled">
                <TextField
                  autoComplete="off"
                  id="email"
                  name="email"
                  label="Email"
                  value={email}
                  varient="filled"
                  onChange={e => {
                    setEmail(e.target.value);
                  }}
                  inputProps={{ 'data-testid': 'email' }}
                  required
                  className={classes.text}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl margin="normal" variant="filled">
                <TextField
                  autoComplete="off"
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  value={password}
                  varient="filled"
                  className={classes.text}
                  onChange={e => {
                    setPassword(e.target.value);
                  }}
                  inputProps={{ 'data-testid': 'password' }}
                  required
                />
              </FormControl>
            </Grid>

            {formName === 'Change Agent' ? (
              <IcapUserFields
                classes={classes}
                fieldsList={[baseLocationList, BusinessUnitList, siteList]}
                fields={[baseLocation, businessUnit, site, jobProfile, supervisor, supervisorEmail]}
                setFields={[setBaseLocation, setBusinessUnit, setSite, setJobProfile, setSupervisor, setSupervisorEmail]}
              />
            ) : null}
            {formName === 'Leadership Team' || formName === 'Capgemini Users' || formName === 'Basic User' || formName === 'Programme Users' ? (
              <React.Fragment>
                <Grid item>
                  <FormControl margin="normal" variant="filled">
                    <Autocomplete
                      id="Business_unit"
                      value={businessUnit}
                      options={BusinessUnitList}
                      getOptionLabel={option => option.unit}
                      getOptionSelected={(option, value) => value.id === option.id}
                      onChange={(e, newValue) => setBusinessUnit(newValue)}
                      className={classes.text}
                      renderInput={params => <TextField required {...params} label="Business Unit" margin="normal" />}
                    />
                  </FormControl>
                </Grid>
              </React.Fragment>
            ) : null}
          </Grid>
          <Grid container>
            <Grid item sm={10}>
              <Button variant="contained" color="primary" className={classes.button} component={Link} to="/manage-users">
                Back
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleEditUser} className={classes.button}>
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </React.Fragment>
  );
}
export default withRouter(EditUser);
