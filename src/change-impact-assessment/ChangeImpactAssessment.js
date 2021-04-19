import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink, useParams, withRouter } from 'react-router-dom';
import { Grid, Button, Stepper, Step, StepLabel, Box, Backdrop, CircularProgress } from '@material-ui/core';
import General from './General/General';
import CIA from './CIA/CIA';
import ChangeThemes from './ChangeThemes/ChangeThemes';
import ImpactedAudience from './ImpactedAudience/ImpactedAudience';
import ChangeLevers from './ChangeLevers/ChangeLevers';
import {
  createCIA,
  updateKeyActivity,
  fetchCIA,
  fetchCIAProjectData,
  deleteKeyActivity,
  updateCIA,
  createKeyActivity,
  fetchCategoryOnCIA,
  fetchKeyActivitiesonCia
} from '../common/API';

const useStyles = makeStyles(theme => ({
  stepper: {
    background: 'none'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  }
}));

function ChangeImpactAssessment(props) {
  const seen = new Set();
  const [keyActivities, setkeyActivities] = useState([]);
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [backdropOpen, setBackDropOpen] = React.useState(false);
  const [workshopOptions, setWorkShopOptions] = useState([]);
  const [l2processes, setL2Processes] = useState([]);
  const [category, setCategory] = useState([]);
  const [l3processes, setL3Processes] = useState([]);
  const [processReferenceOptions, setProcessReferenceOptions] = useState([]);
  const [personasOptions, setPersonasOptions] = useState([]);
  const [keyLocations, setKeyLocations] = useState([]);
  const [businessUnits, setBusinessUnits] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [ProjectId, setProjectId] = useState(null);
  const { onMessage } = props;
  const fetchKeyCategory = [];
  const ciaValues = {
    project: Cookies.get('project'),
    workshop: null,
    process_reference: null,
    l_2_process: null,
    l_3_process: null,
    as_is: '',
    to_be: '',
    business_change_impact: '',
    change_impact_weight: '',
    benefit_value: '',
    spending_our_money_wisely: false,
    insights_decision_making: false,
    a_new_way_to_buy: false,
    other: false,
    receipting_culture: false,
    user_profiles: [],
    number_of_impacted_employees: '',
    business_units: [],
    departments: [],
    key_locations: [],
    org_design: false,
    culture: false,
    roles_and_responsibility: false,
    communication_and_engagement: false,
    policy: false,
    training: false,
    process: false,
    performance_management: false,
    Opportunities_The_Change_Enabled: []
  };

  const [formCIA, setFormCIA] = useState(ciaValues);
  const impactWeight = {
    low: 'default',
    medium: 'default',
    high: 'default'
  };

  const [changeImpactWeightButtonColor, setChangeImpactWeightButtonColor] = useState(impactWeight);
  const [benefitValueButtonColor, setBenefitValueButtonColor] = useState(impactWeight);

  const [errors, setErrors] = useState({});
  const { id } = useParams();
  useEffect(() => {
    if (id !== undefined) {
      fetchCIA(id, onMessage)
        .then(data => {
          fetchCIAProjectData(data.project.id, onMessage).then(data => {
            setWorkShopOptions(data.workshops);
            setProjectId(data.id);
            setCategory(data.business_change_plan_categories);
            setL2Processes(data.l_2_processes);
            setL3Processes(data.l_3_processes);
            setProcessReferenceOptions(data.process_references);
            for (let i = 0; i < data.user_profiles.length; i++) {
              for (let j = 0; j < data.persona_job_roles.length; j++) {
                if (data.persona_job_roles[j].id === data.user_profiles[i].persona_job_role) {
                  data.user_profiles[i].profile_name = data.user_profiles[i].profile_name.concat('(' + data.persona_job_roles[j].job_role + ')');
                  break;
                }
              }
            }
            setPersonasOptions(data.user_profiles);
            setKeyLocations(data.key_locations);
            setBusinessUnits(data.business_units);
            setDepartments(data.departments);
          });
          Promise.all(
            data.key_activities.map(key => {
              fetchCategoryOnCIA(key.business_change_plan_category, key.change_impact_assessment, onMessage)
                .then(res => {
                  for (let i = 0; i < res.length; i++) {
                    fetchKeyCategory.push({
                      key_activity: res[i].key_activity,
                      category: res[i].business_change_plan_category,
                      key_id: res[i].id,
                      status: true
                    });
                  }
                })
                .catch(error => {
                  onMessage(error, 'error');
                });
            })
          );

          setkeyActivities(fetchKeyCategory);
          setFormCIA(data);

          if (data.change_impact_weight === 'Low') {
            setChangeImpactWeightButtonColor({ low: 'primary' });
          } else if (data.change_impact_weight === 'Medium') {
            setChangeImpactWeightButtonColor({ medium: 'primary' });
          } else {
            setChangeImpactWeightButtonColor({ high: 'primary' });
          }
          if (data.benefit_value === 'Low') {
            setBenefitValueButtonColor({ low: 'primary' });
          } else if (data.benefit_value === 'Medium') {
            setBenefitValueButtonColor({ medium: 'primary' });
          } else {
            setBenefitValueButtonColor({ high: 'primary' });
          }
        })
        .catch(error => {
          onMessage(error, 'error');
        });
    } else {
      fetchCIAProjectData(Cookies.get('project'), onMessage)
        .then(data => {
          setProjectId(data.id);
          setWorkShopOptions(data.workshops);
          setL2Processes(data.l_2_processes);
          setCategory(data.business_change_plan_categories);
          setL3Processes(data.l_3_processes);
          setProcessReferenceOptions(data.process_references);

          for (let i = 0; i < data.user_profiles.length; i++) {
            for (let j = 0; j < data.persona_job_roles.length; j++) {
              if (data.persona_job_roles[j].id === data.user_profiles[i].persona_job_role) {
                data.user_profiles[i].profile_name = data.user_profiles[i].profile_name.concat('(' + data.persona_job_roles[j].job_role + ')');
                break;
              }
            }
          }

          setPersonasOptions(data.user_profiles);
          setKeyLocations(data.key_locations);
          setBusinessUnits(data.business_units);
          setDepartments(data.departments);
        })
        .catch(error => {
          onMessage(error, 'error');
        });
    }
  }, [id]);

  const handleChangeImpactWeightButtonColor = value => {
    if (value === 'Low') {
      changeImpactWeightButtonColor.low === 'primary'
        ? setChangeImpactWeightButtonColor(impactWeight)
        : setChangeImpactWeightButtonColor({ low: 'primary' });
    } else if (value === 'Medium') {
      changeImpactWeightButtonColor.medium === 'primary'
        ? setChangeImpactWeightButtonColor(impactWeight)
        : setChangeImpactWeightButtonColor({ medium: 'primary' });
    } else {
      changeImpactWeightButtonColor.high === 'primary'
        ? setChangeImpactWeightButtonColor(impactWeight)
        : setChangeImpactWeightButtonColor({ high: 'primary' });
    }
    setErrors({ ...errors, change_impact_weight: '', change_impact_weight_bool: false });
    setFormCIA({ ...formCIA, change_impact_weight: value });
  };

  const handleBenefitValueButtonColor = value => {
    if (value === 'Low') {
      benefitValueButtonColor.low === 'primary' ? setBenefitValueButtonColor(impactWeight) : setBenefitValueButtonColor({ low: 'primary' });
    } else if (value === 'Medium') {
      benefitValueButtonColor.medium === 'primary' ? setBenefitValueButtonColor(impactWeight) : setBenefitValueButtonColor({ medium: 'primary' });
    } else {
      benefitValueButtonColor.high === 'primary' ? setBenefitValueButtonColor(impactWeight) : setBenefitValueButtonColor({ high: 'primary' });
    }
    setErrors({ ...errors, benefit_value: '', benefit_value_bool: false });
    setFormCIA({ ...formCIA, benefit_value: value });
  };

  const STEPS = ['General', 'Change Impact Assessment', 'Change Themes', 'Impacted Audience', 'Change Levers and Activities'];
  const handleTextChange = ({ target }) => {
    let formString = target.id.concat('_bool');
    setErrors({ ...errors, [target.id]: '', [formString]: false });
    setFormCIA({
      ...formCIA,
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
      if (res === 'l_2_process') {
        setFormCIA({
          ...formCIA,
          [res]: newValue,
          Opportunities_The_Change_Enabled: []
        });
      } else
        setFormCIA({
          ...formCIA,
          [res]: newValue
        });
    } else {
      setFormCIA({
        ...formCIA,
        [event.target.closest('div').previousElementSibling.id]: null
      });
    }
  };
  const handleSwitchChange = ({ target }) => {
    setFormCIA({
      ...formCIA,
      [target.name]: !formCIA[target.name]
    });
  };

  const handleMultiSelect = (event, newValue) => {
    const str = event.target.id;
    const index = str.indexOf('-');
    const res = str.slice(0, index);
    if (index > 0) {
      let formString = res.concat('_bool');
      setErrors({ ...errors, [res]: [], [formString]: false });
      if (res === 'user_profiles') {
        let summation = newValue.reduce((acc, cur) => {
          return acc + cur.number_of_employees_in_role;
        }, 0);
        setFormCIA({ ...formCIA, [res]: newValue, number_of_impacted_employees: summation });
      } else {
        setFormCIA({ ...formCIA, [res]: newValue });
      }
    } else {
      if (event.target.closest('div').parentNode.lastChild.previousSibling.id === 'user_profiles') {
        let summation = newValue.reduce((acc, cur) => {
          return acc + cur.number_of_employees_in_role;
        }, 0);
        setFormCIA({
          ...formCIA,
          number_of_impacted_employees: summation,
          [event.target.closest('div').parentNode.lastChild.previousSibling.id]: newValue
        });
      } else {
        setFormCIA({
          ...formCIA,
          [event.target.closest('div').parentNode.lastChild.previousSibling.id]: newValue
        });
      }
    }
  };

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <General
            formCIA={formCIA}
            workshopOptions={workshopOptions}
            l2processes={l2processes}
            l3processes={l3processes}
            processReferenceOptions={processReferenceOptions}
            errors={errors}
            onTextChange={handleTextChange}
            onDropDownChange={handleDropDownChange}
            onMessage={onMessage}
          />
        );
      case 1:
        return (
          <CIA
            formCIA={formCIA}
            errors={errors}
            onTextChange={handleTextChange}
            handleChangeImpactWeightButtonColor={handleChangeImpactWeightButtonColor}
            handleBenefitValueButtonColor={handleBenefitValueButtonColor}
            changeImpactWeightButtonColor={changeImpactWeightButtonColor}
            benefitValueButtonColor={benefitValueButtonColor}
            projectId={Cookies.get('project')}
            userId={Cookies.get('user')}
            setFormCIA={setFormCIA}
            editFormId={id}
            onMessage={onMessage}
          />
        );
      case 2:
        return <ChangeThemes formCIA={formCIA} onSwitchChange={handleSwitchChange} />;
      case 3:
        return (
          <ImpactedAudience
            formCIA={formCIA}
            personasOptions={personasOptions}
            keyLocations={keyLocations}
            businessUnits={businessUnits}
            departments={departments}
            errors={errors}
            onTextChange={handleTextChange}
            onMultiSelect={handleMultiSelect}
            onMessage={onMessage}
          />
        );
      case 4:
        return (
          <ChangeLevers
            formCIA={formCIA}
            category={category}
            onSwitchChange={handleSwitchChange}
            onkeyActivityChanged={setkeyActivities}
            keyActivities={keyActivities.filter(el => {
              const duplicate = seen.has(el.key_activity);
              seen.add(el.key_activity);
              return !duplicate;
            })}
          />
        );

      default:
        throw new Error('Unknown step');
    }
  };

  const handleNext = () => {
    const _errors = {};
    if (activeStep === 0) {
      if (formCIA.workshop === null) {
        _errors.workshop = 'Workshop Name is mandatory';
        _errors.workshop_bool = true;
        setErrors(_errors);
      }
      if (formCIA.process_reference === null) {
        _errors.process_reference = 'Process Reference is mandatory';
        _errors.process_reference_bool = true;
        setErrors(_errors);
      }
      if (formCIA.l_2_process === null) {
        _errors.l_2_process = 'L2 Process is mandatory';
        _errors.l_2_process_bool = true;
        setErrors(_errors);
      }
      if (formCIA.workshop !== null && formCIA.process_reference !== null && formCIA.l_2_process !== null) {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
      }
    } else if (activeStep === 1) {
      if (formCIA.as_is === '') {
        _errors.as_is = 'As Is is mandatory';
        _errors.as_is_bool = true;
        setErrors(_errors);
      }
      if (formCIA.to_be === '') {
        _errors.to_be = 'To Be is mandatory';
        _errors.to_be_bool = true;
        setErrors(_errors);
      }
      if (formCIA.business_change_impact === '') {
        _errors.business_change_impact = 'Business Change Impact is mandatory';
        _errors.business_change_impact_bool = true;
        setErrors(_errors);
      }
      if (formCIA.change_impact_weight === '') {
        _errors.change_impact_weight = 'Change Impact Weight is mandatory';
        _errors.change_impact_weight_bool = true;
        setErrors(_errors);
      }
      if (formCIA.benefit_value === '') {
        _errors.benefit_value = 'Benefit Value is mandatory';
        _errors.benefit_value_bool = true;
        setErrors(_errors);
      }
      if (
        formCIA.as_is !== '' &&
        formCIA.to_be !== '' &&
        formCIA.business_change_impact !== '' &&
        formCIA.change_impact_weight !== '' &&
        formCIA.benefit_value !== ''
      ) {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
      }
    } else if (activeStep === 2) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    } else if (activeStep === 3) {
      if (formCIA.business_units.length === 0) {
        _errors.business_units = 'Business Unit is mandatory';
        _errors.business_units_bool = true;
        setErrors(_errors);
      }
      if (formCIA.user_profiles.length === 0) {
        _errors.user_profiles = 'Personas is mandatory';
        _errors.user_profiles_bool = true;
        setErrors(_errors);
      }
      if (formCIA.business_units.length > 0 && formCIA.user_profiles.length > 0) {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
      }
    }
  };
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const formDataStructure = () => {
    formCIA.workshop = formCIA.workshop.id.toString();
    formCIA.l_2_process = formCIA.l_2_process.id.toString();
    if (formCIA.l_3_process !== null) {
      formCIA.l_3_process = formCIA.l_3_process.id.toString();
    }

    formCIA.process_reference = formCIA.process_reference.id.toString();
    if (formCIA.key_locations.length > 0) {
      for (let index = 0; index < formCIA.key_locations.length; index++) {
        formCIA.key_locations[index] = formCIA.key_locations[index].id.toString();
      }
    }

    for (let index = 0; index < formCIA.business_units.length; index++) {
      formCIA.business_units[index] = formCIA.business_units[index].id.toString();
    }

    if (formCIA.departments.length > 0) {
      for (let index = 0; index < formCIA.departments.length; index++) {
        formCIA.departments[index] = formCIA.departments[index].id.toString();
      }
    }
    for (let index = 0; index < formCIA.user_profiles.length; index++) {
      formCIA.user_profiles[index] = formCIA.user_profiles[index].id.toString();
    }
    if (formCIA.Opportunities_The_Change_Enabled.length > 0) {
      for (let index = 0; index < formCIA.Opportunities_The_Change_Enabled.length; index++) {
        formCIA.Opportunities_The_Change_Enabled[index].l_2_process = formCIA.Opportunities_The_Change_Enabled[index].l_2_process.id.toString();
        delete formCIA.Opportunities_The_Change_Enabled[index].checked;
      }
    }
    formCIA.number_of_impacted_employees = formCIA.number_of_impacted_employees.toString();
  };

  const handleComplete = () => {
    setBackDropOpen(true);
    formDataStructure();
    createCIA(formCIA, onMessage)
      .then(CiaData => {
        Promise.all(
          keyActivities.map(key => {
            createKeyActivity(
              {
                key_activity: key.key_activity,
                status: null,
                project: ProjectId,
                business_change_plan_category: key.category,
                change_impact_assessment: CiaData.id,
                key_locations: CiaData.key_locations,
                business_units: CiaData.business_units,
                l_2_process: CiaData.l_2_process.id
              },
              props.onMessage
            ).then(keyData => {});
          })
        );
      })
      .then(data => {
        setBackDropOpen(false);
        onMessage('Record Created Successfully', 'success');
        props.history.push('/change-impact-assessment');
      });
  };

  const handleUpdate = () => {
    setBackDropOpen(true);
    formDataStructure();
    updateCIA(id, formCIA, onMessage).then(ciares => {
      fetchKeyActivitiesonCia(id, onMessage).then(res => {
        Promise.all(
          keyActivities.map(key => {
            if (key.key_id !== null && key.status == true) {
              updateKeyActivity(
                key.key_id,
                { key_activity: key.key_activity, business_change_plan_category: key.category },
                onMessage
              ).then(() => {});
            } else if (key.key_id !== null && key.status == false) {
              deleteKeyActivity(key.key_id, onMessage).then(() => {});
            } else {
              createKeyActivity(
                {
                  key_activity: key.key_activity,
                  status: null,
                  business_change_plan_category: key.category,
                  project: ProjectId,
                  change_impact_assessment: ciares.id,
                  key_locations: ciares.key_locations,
                  business_units: ciares.business_units,
                  l_2_process: ciares.l_2_process.id
                },
                props.onMessage
              ).then(keyData => {});
            }
          })
        );
      });
      setBackDropOpen(false);
      onMessage('Record Updated Successfully', 'success');
      props.history.push('/change-impact-assessment');
    });
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
        <Grid container item xs={3} justify="flex-end">
          <Box>
            {activeStep === 0 ? (
              <Button color="primary" variant="contained" component={RouterLink} to="/change-impact-assessment">
                Back
              </Button>
            ) : (
              <Button onClick={handleBack} color="primary" variant="contained">
                Back
              </Button>
            )}
          </Box>
        </Grid>
        <Grid item xs={6}></Grid>
        {activeStep !== STEPS.length - 1 ? (
          <Grid item xs={3}>
            <Button data-testid="next" variant="contained" color="primary" onClick={handleNext} style={{ marginBottom: '16px' }}>
              Next
            </Button>
          </Grid>
        ) : id === undefined ? (
          <Grid item xs={3}>
            <Button variant="contained" color="primary" onClick={handleComplete}>
              Complete
            </Button>
          </Grid>
        ) : (
          <Grid item xs={3}>
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update
            </Button>
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

export default withRouter(ChangeImpactAssessment);
