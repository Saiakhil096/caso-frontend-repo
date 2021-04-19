import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink, useParams, withRouter } from 'react-router-dom';
import { Grid, Button, Stepper, Step, StepLabel, Box, Backdrop, CircularProgress } from '@material-ui/core';
import InitialInformation from './InitialInformation';
import GeneralInformation from './GeneralInformation';
import PainPoints from './PainPoints';
import { fetchProjectData, createPersona, fetchPersona, updatePersona, createUserTraining } from '../../common/API';

const useStyles = makeStyles(theme => ({
  stepper: {
    background: 'none'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}));

function Profile(props) {
  const classes = useStyles();
  const { onMessage } = props;
  const [activeStep, setActiveStep] = useState(0);
  const [backdropOpen, setBackDropOpen] = React.useState(false);

  const projectId = Cookies.get('project');
  const userId = Cookies.get('user');
  const profileData = {
    project: projectId,
    persona_job_role: null,
    profile_name: '',
    number_of_employees_in_role: '',
    grades: [],
    background: '',
    key_skills: [],
    system_accesses: [],
    key_locations: [],
    key_motivations: [],
    accountableTo: '',
    business_units: [],
    work_environment: '',
    access_to_corporate_wifi: '',
    licence_to_operate: '',
    licence_to_operate_confidence_level: 0,
    PainPoints: [
      {
        reason: '',
        rating: null,
        contract_stage: '',
        type: ''
      }
    ]
  };
  const [profile, setProfile] = useState(profileData);
  const [projectData, setProjectData] = useState({});
  const [personaJobRoles, setPersonaJobRoles] = useState([]);
  const [typicalGradeOptions, setTypicalGradeOptions] = useState([]);
  const [keySkillOptions, setKeySkillOptions] = useState([]);
  const [systemAccessOptions, setSystemAccessOptions] = useState([]);
  const [keyLocationOptions, setKeyLocationOptions] = useState([]);
  const [keyMotivationOptions, setKeyMotivationOptions] = useState([]);
  const [businessUnitOptions, setBusinessUnitOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const STEPS = ['Initial Information', 'General Information', 'Pain Points'];
  if (id !== undefined) {
    props.setTitle('Persona Updation');
  } else {
    props.setTitle('Persona Creation');
  }
  useEffect(() => {
    if (id !== undefined) {
      fetchPersona(id, onMessage)
        .then(data => {
          fetchProjectData(data.project.id, onMessage)
            .then(project => {
              setProjectData(project);
              let filteredPersonaJobRoles = [];
              filteredPersonaJobRoles.push(data.persona_job_role);
              if (project.user_profiles.length > 0) {
                for (let i = 0; i < project.persona_job_roles.length; i++) {
                  let counter = 0;
                  for (let j = 0; j < project.user_profiles.length; j++) {
                    if (project.persona_job_roles[i].id === project.user_profiles[j].persona_job_role) {
                      counter++;
                      break;
                    }
                  }
                  if (counter === 0) {
                    filteredPersonaJobRoles.push(project.persona_job_roles[i]);
                  }
                }
                setPersonaJobRoles(filteredPersonaJobRoles);
              } else {
                setPersonaJobRoles(project.persona_job_roles);
              }
              setTypicalGradeOptions(project.grades);
              setKeySkillOptions(project.key_skills);
              setSystemAccessOptions(project.system_accesses);
              setKeyLocationOptions(project.key_locations);
              setKeyMotivationOptions(project.key_motivations);
              setBusinessUnitOptions(project.business_units);
            })
            .catch(error => {
              onMessage(error, 'error');
            });
          setProfile(data);
        })
        .catch(error => {
          onMessage(error, 'error');
        });
    } else {
      fetchProjectData(projectId, onMessage)
        .then(data => {
          setProjectData(data);
          let filteredPersonaJobRoles = [];
          if (data.user_profiles.length > 0) {
            for (let i = 0; i < data.persona_job_roles.length; i++) {
              let counter = 0;
              for (let j = 0; j < data.user_profiles.length; j++) {
                if (data.persona_job_roles[i].id === data.user_profiles[j].persona_job_role) {
                  counter++;
                  break;
                }
              }
              if (counter === 0) {
                filteredPersonaJobRoles.push(data.persona_job_roles[i]);
              }
            }
            setPersonaJobRoles(filteredPersonaJobRoles);
          } else {
            setPersonaJobRoles(data.persona_job_roles);
          }
          setTypicalGradeOptions(data.grades);
          setKeySkillOptions(data.key_skills);
          setSystemAccessOptions(data.system_accesses);
          setKeyLocationOptions(data.key_locations);
          setKeyMotivationOptions(data.key_motivations);
          setBusinessUnitOptions(data.business_units);
        })
        .catch(error => {
          onMessage(error, 'error');
        });
    }
  }, []);

  const handleTextChange = ({ target }) => {
    let formString = target.id.concat('_bool');
    setErrors({ ...errors, [target.id]: '', [formString]: false });
    setProfile({
      ...profile,
      [target.id]: [target.value].toString()
    });
  };

  const handleDropDownChange = (event, newValue) => {
    const str = event.target.id;
    const index = str.indexOf('-');
    const res = str.slice(0, index);
    if (index > 0) {
      let formString = res.concat('_bool');
      setErrors({ ...errors, [res]: '', [formString]: false });
      setProfile({
        ...profile,
        [res]: newValue
      });
    } else {
      setProfile({
        ...profile,
        [event.target.closest('div').previousElementSibling.id]: null
      });
    }
  };

  const handleMultiSelect = (event, newValue) => {
    const str = event.target.id;
    const index = str.indexOf('-');
    const res = str.slice(0, index);
    if (index > 0) {
      let formString = res.concat('_bool');
      setErrors({ ...errors, [res]: [], [formString]: false });
      setProfile({ ...profile, [res]: newValue });
    } else {
      setProfile({
        ...profile,
        [event.target.closest('div').parentNode.lastChild.previousSibling.id]: newValue
      });
    }
  };

  const handleRadioChange = ({ target }) => {
    let formString = target.name.concat('_bool');
    setErrors({ ...errors, [target.name]: '', [formString]: false });
    setProfile({
      ...profile,
      [target.name]: [target.value].toString()
    });
  };
  const handleSliderChange = (event, newValue) => {
    setProfile({
      ...profile,
      licence_to_operate_confidence_level: newValue
    });
  };
  const handleNext = () => {
    const _errors = {};
    if (activeStep === 0) {
      if (profile.persona_job_role === null) {
        _errors.persona_job_role = 'User Role is mandatory';
        _errors.persona_job_role_bool = true;
        setErrors(_errors);
      }
      if (profile.grades.length === 0) {
        _errors.grades = 'At least one Typical Grade is mandatory';
        _errors.grades_bool = true;
        setErrors(_errors);
      }
      if (profile.grades.length > 0 && profile.persona_job_role !== null) {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
      }
    } else if (activeStep === 1) {
      if (profile.background === '') {
        _errors.background = 'Background is mandatory';
        _errors.background_bool = true;
        setErrors(_errors);
      }
      if (profile.key_skills.length === 0) {
        _errors.key_skills = 'At least one Key Skill is mandatory';
        _errors.key_skills_bool = true;
        setErrors(_errors);
      }
      if (profile.system_accesses.length === 0) {
        _errors.system_accesses = 'At least one System Access is mandatory';
        _errors.system_accesses_bool = true;
        setErrors(_errors);
      }
      if (profile.key_locations.length === 0) {
        _errors.key_locations = 'At least one Key Location is mandatory';
        _errors.key_locations_bool = true;
        setErrors(_errors);
      }
      if (profile.key_motivations.length === 0) {
        _errors.key_motivations = 'At least one Key Motivation is mandatory';
        _errors.key_motivations_bool = true;
        setErrors(_errors);
      }
      if (profile.business_units.length === 0) {
        _errors.business_units = 'At least one Business Unit is mandatory';
        _errors.business_units_bool = true;
        setErrors(_errors);
      }
      if (profile.work_environment === '') {
        _errors.work_environment = 'Work Environment is mandatory';
        _errors.work_environment_bool = true;
        setErrors(_errors);
      }
      if (profile.access_to_corporate_wifi === '') {
        _errors.access_to_corporate_wifi = 'Access to Corporate Wifi is mandatory';
        _errors.access_to_corporate_wifi_bool = true;
        setErrors(_errors);
      }
      if (profile.licence_to_operate === '') {
        _errors.licence_to_operate = 'Licence to Operate is mandatory';
        _errors.licence_to_operate_bool = true;
        setErrors(_errors);
      }
      if (
        profile.background !== '' &&
        profile.key_skills.length > 0 &&
        profile.system_accesses.length > 0 &&
        profile.key_locations.length > 0 &&
        profile.key_motivations.length > 0 &&
        profile.business_units.length > 0 &&
        profile.work_environment !== '' &&
        profile.access_to_corporate_wifi !== '' &&
        profile.licence_to_operate !== ''
      ) {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
      } else {
        onMessage('Please complete all the required fields', 'error');
      }
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const formDataStructure = () => {
    profile.persona_job_role = profile.persona_job_role.id.toString();
    if (profile.number_of_employees_in_role !== '') {
      profile.number_of_employees_in_role = parseInt(profile.number_of_employees_in_role);
    } else {
      profile.number_of_employees_in_role = 0;
    }
    for (let index = 0; index < profile.grades.length; index++) {
      profile.grades[index] = profile.grades[index].id.toString();
    }
    for (let index = 0; index < profile.key_skills.length; index++) {
      profile.key_skills[index] = profile.key_skills[index].id.toString();
    }
    for (let index = 0; index < profile.system_accesses.length; index++) {
      profile.system_accesses[index] = profile.system_accesses[index].id.toString();
    }
    for (let index = 0; index < profile.key_locations.length; index++) {
      profile.key_locations[index] = profile.key_locations[index].id.toString();
    }
    for (let index = 0; index < profile.key_motivations.length; index++) {
      profile.key_motivations[index] = profile.key_motivations[index].id.toString();
    }

    for (let index = 0; index < profile.business_units.length; index++) {
      profile.business_units[index] = profile.business_units[index].id.toString();
    }
  };

  const handleComplete = () => {
    setBackDropOpen(true);
    formDataStructure();
    createPersona(profile, onMessage).then(persona => {
      let data = {
        user_profile: persona,
        project: Cookies.get('project')
      };
      createUserTraining(data, onMessage);
      setBackDropOpen(false);
      onMessage('Record Created Successfully', 'success');
      props.history.push('/profile');
    });
  };

  const handleUpdate = () => {
    setBackDropOpen(true);
    formDataStructure();
    updatePersona(id, profile, onMessage).then(() => {
      setBackDropOpen(false);
      onMessage('Record Updated Successfully', 'success');
      props.history.push('/profile');
    });
  };

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <InitialInformation
            profile={profile}
            personaJobRoles={personaJobRoles}
            typicalGradeOptions={typicalGradeOptions}
            projectData={projectData}
            onTextChange={handleTextChange}
            onMessage={onMessage}
            onDropDownChange={handleDropDownChange}
            onMultiSelect={handleMultiSelect}
            errors={errors}
          />
        );

      case 1:
        return (
          <GeneralInformation
            profile={profile}
            projectData={projectData}
            keySkillOptions={keySkillOptions}
            systemAccessOptions={systemAccessOptions}
            keyLocationOptions={keyLocationOptions}
            keyMotivationOptions={keyMotivationOptions}
            businessUnitOptions={businessUnitOptions}
            onTextChange={handleTextChange}
            onRadioChange={handleRadioChange}
            onSliderChange={handleSliderChange}
            onDropDownChange={handleDropDownChange}
            onMultiSelect={handleMultiSelect}
            errors={errors}
            onMessage={onMessage}
          />
        );
      case 2:
        return <PainPoints personaId={id} onMessage={onMessage} projectId={projectId} userId={userId} profile={profile} setProfile={setProfile} />;
      default:
        throw new Error('Unknown step');
    }
  };

  const mainComponent = () => {
    return (
      <Grid container component="main">
        {getStepContent(activeStep)}
      </Grid>
    );
  };

  const renderStepper = () => {
    return (
      <Grid item>
        <Stepper activeStep={activeStep} className={classes.stepper}>
          {STEPS.map(label => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Grid>
    );
  };

  const renderButtons = () => {
    return (
      <Grid container item xs={12}>
        <Grid container item xs={3} justify="flex-end" style={{ padding: '15px' }}>
          <Box>
            {activeStep === 0 ? (
              id === undefined ? (
                <Button color="primary" variant="contained" component={RouterLink} to="/profile">
                  Back
                </Button>
              ) : (
                <Button color="primary" variant="contained" onClick={() => props.history.goBack()}>
                  Back
                </Button>
              )
            ) : (
              <Button onClick={handleBack} color="primary" variant="contained">
                Back
              </Button>
            )}
          </Box>
        </Grid>
        <Grid item xs={6}></Grid>
        {activeStep !== STEPS.length - 1 ? (
          <Grid item xs={3} style={{ padding: '15px' }}>
            <Box>
              <Button data-testid="next" variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            </Box>
          </Grid>
        ) : id === undefined ? (
          <Grid container item xs={3} style={{ padding: '12px' }}>
            <Box>
              <Button variant="contained" onClick={handleComplete} color="primary">
                Complete
              </Button>
            </Box>
          </Grid>
        ) : (
          <Grid container item xs={3} style={{ padding: '12px' }}>
            <Box>
              <Button variant="contained" onClick={handleUpdate} color="primary">
                Update
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    );
  };
  return (
    <React.Fragment>
      {renderStepper()}
      {mainComponent()}
      {renderButtons()}
      <Backdrop className={classes.backdrop} open={backdropOpen}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment>
  );
}

export default withRouter(Profile);
