import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Link, withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Grid, FormControl, TextField, Button, Container, Typography } from '@material-ui/core';
import { createUser, fetchUserRoles, fetchSiteLocation, fetchProjectData } from '../common/API';
import IcapUserFields from './IcapUserFields';

const useStyles = makeStyles(theme => ({
  form: {
    margin: theme.spacing(4, 2)
  },
  text: {
    width: '28rem'
  }
}));

function CreateUser(props) {
  const classes = useStyles();

  const [username, setUsername] = useState('');
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
    Promise.all([fetchUserRoles(props.onMessage), fetchSiteLocation(props.onMessage, project), fetchProjectData(project, props.onMessage)])
      .then(([userTypes, sites, projectdata]) => {
        setBaseLocationList(projectdata.key_locations);
        setBusinessUnitList(projectdata.business_units);
        setUserTypeList(userTypes.roles);
        setSiteList(sites);
      })
      .catch(e => {
        props.onMessage(`Error: ${e}`, 'error');
      });
  }, []);

  const handleCreateUser = e => {
    e.preventDefault();
    if (userType === null) {
      props.onMessage(`You should select user type to proceed `, 'warning');
    } else {
      var user = getBody(userType);
      if (user) {
        createUser(user, props.onMessage)
          .then(data => {
            if (data.error) {
              props.onMessage(data.message[0].messages[0].message, 'error');
            } else {
              props.onMessage(`User "${user.username}" has been created successfully`, 'success');
              props.history.push(`/manage-users`);
            }
          })
          .catch(e => {
            props.onMessage(e, 'error');
          });
      }
    }
  };

  const getUserName = (userType, name) => {
    var userName = '';
    var str1 = userType.split(' ');
    var str2 = name.split(' ');
    var date = new Date();
    str1.forEach(element => {
      userName = userName + element.substring(0, 1);
    });
    str2.forEach(element => {
      userName = userName + element.substring(0, 1);
    });
    userName = userName + `${date.getHours()}` + `${date.getMinutes()}`;
    return userName;
  };

  const getBody = userType => {
    var user = {
      name: username,
      email: email,
      password: password,
      confirmed: true,
      projects: project,
      role: `${userType.id}`
    };
    if (
      userType.name === 'Capgemini Users' ||
      userType.name === 'Programme Users' ||
      userType.name === 'Basic User' ||
      userType.name === 'Leadership Team'
    ) {
      if (username === '' || email === '' || password === '' || businessUnit === null) {
        props.onMessage(`Fill the mandatory details`, 'warning');
      } else if (validate(email) == false) {
        props.onMessage('Please Enter Valid Email', 'error');
      } else {
        user.username = getUserName(userType.name, user.name);
        user.business_unit = businessUnit.id;
        return user;
      }
    } else if (userType.name === 'Change Agent') {
      if (
        username === '' ||
        email === '' ||
        password === '' ||
        baseLocation === null ||
        businessUnit === null ||
        site === null ||
        jobProfile === '' ||
        supervisor === '' ||
        supervisorEmail === ''
      ) {
        props.onMessage(`Fill the mandatory details`, 'warning');
      } else if (validate(email) == false) {
        props.onMessage('Please Enter Valid Email', 'error');
      } else if (validate(supervisorEmail) == false) {
        props.onMessage('Please Enter Valid Supervisor Email ', 'error');
      } else {
        user.username = getUserName(userType.name, user.name);
        user.base_location = baseLocation.id;
        user.business_unit = businessUnit.id;
        user.site_location = site.id;
        user.job_profile = jobProfile;
        user.supervisor = supervisor;
        user.supervisor_email = supervisorEmail;
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
                  options={userTypeList}
                  getOptionLabel={option => option.name}
                  onChange={(e, newValue) => handleChangeUserType(newValue)}
                  className={classes.text}
                  renderInput={params => <TextField required {...params} label="User Type" margin="normal" />}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <TextField
                autoComplete="off"
                id="username"
                name="username"
                label="Name"
                value={username}
                varient="filled"
                className={classes.text}
                onChange={e => {
                  setUsername(e.target.value);
                }}
                inputProps={{ 'data-testid': 'username' }}
                required
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
                onMessage={props.onMessage}
                fieldsList={[baseLocationList, BusinessUnitList, siteList]}
                fields={[baseLocation, businessUnit, site, jobProfile, supervisor, supervisorEmail]}
                setFields={[setBaseLocation, setBusinessUnit, setSite, setJobProfile, setSupervisor, setSupervisorEmail]}
              />
            ) : null}
            {formName === 'Leadership Team' || formName === 'Basic User' || formName === 'Capgemini Users' || formName === 'Programme Users' ? (
              <React.Fragment>
                <Grid item>
                  <FormControl margin="normal" variant="filled">
                    <Autocomplete
                      id="Business_unit"
                      value={businessUnit}
                      options={BusinessUnitList}
                      getOptionLabel={option => option.unit}
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
              <Button variant="contained" color="primary" onClick={handleCreateUser} className={classes.button}>
                Create
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </React.Fragment>
  );
}
export default withRouter(CreateUser);
