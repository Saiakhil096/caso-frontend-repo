import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Stepper, Step, StepLabel, Grid } from '@material-ui/core';
import Information from './Information';
import AmbitionSetting from './AmbitionSetting';
import MaturityModel from './MaturityModel';

import {
  createClient,
  createProject,
  createKPI,
  createQuestionnaireQuestion,
  createL2Process,
  createMaturityQuestion,
  fetchProjectData,
  fetchProjectSpecificL2Process,
  updateClient,
  updateProject,
  updateKPI,
  updateQuestionnaireQuestion,
  updateL2Process,
  updateMaturityQuestion,
  deleteKPI,
  deleteQuestionnaireQuestion,
  deleteL2Process,
  deleteMaturityQuestion,
  createBusinessUnit,
  deleteBusinessUnit,
  updateBusinessUnit,
  createSiteLocation,
  createKeyLocation,
  deleteKeyLocation,
  updateKeyLocation,
  deleteSiteLocation,
  updateSiteLocation
} from '../common/API';

const useStyles = makeStyles(theme => ({
  stepper: {
    background: 'none'
  }
}));

function CreateProject(props) {
  const classes = useStyles();

  const history = useHistory();

  const steps = ['Information', 'Ambition Setting', 'Maturity Model'];

  const [activeStep, setActiveStep] = useState(0);

  const [client, setClient] = useState('');
  const [project, setProject] = useState('');
  const [kpis, setKpis] = useState([
    {
      name: ''
    }
  ]);
  const [businessUnits, setBusinessUnits] = useState([
    {
      unit: ''
    }
  ]);
  const [siteLocations, setSiteLocations] = useState([
    {
      site_location: ''
    }
  ]);
  const [keyLocations, setKeyLocations] = useState([
    {
      location: ''
    }
  ]);
  const [questionnaireQs, setQuestionnaireQs] = useState([
    {
      question_text: ''
    }
  ]);
  const [l2Processes, setL2Processes] = useState([
    {
      title: '',
      maturity_questions: [
        {
          question_text: ''
        }
      ]
    }
  ]);
  const [projectId, setProjectId] = useState('');
  const [projectData, setProjectData] = useState({});
  const [l2processesCopy, setL2ProcessesCopy] = useState([]);
  const [deleteKpiIds, setDeleteKpiIds] = useState([]);
  const [deleteBusinessUnits, setDeleteBusinessUnits] = useState([]);
  const [deleteKeyLocations, setDeleteKeyLocations] = useState([]);
  const [deleteSiteLocations, setDeleteSiteLocations] = useState([]);
  const [deleteQuestionnaireIds, setDeleteQuestionnaireIds] = useState([]);
  const [deleteL2ProcessIds, setDeleteL2ProcessIds] = useState([]);
  const [deleteMaturityQIds, setDeleteMaturityQIds] = useState([]);
  const [refresh, setRefresh] = useState(true);

  props.setTitle(Cookies.get('title'));

  useEffect(() => {
    if (projectId) {
      setRefresh(true);
    }
    setActiveStep(props.currentTaskStep);
  }, [props.currentTaskStep]);

  useEffect(() => {
    if (refresh) {
      var str = window.location.pathname;
      var res = str.split('/');
      const _id = res[res.length - 1];
      setProjectId(parseInt(_id));

      if (!isNaN(_id)) {
        fetchProjectData(_id, props.onMessage).then(data => {
          setProjectData(data);
          setClient(data.client.name);
          setProject(data.name);
          setKpis(data.kpis);
          setSiteLocations(data.site_locations);
          setBusinessUnits(data.business_units);
          setKeyLocations(data.key_locations);
          setQuestionnaireQs(data.questionnaire_questions);
          fetchProjectSpecificL2Process(_id, props.onMessage).then(l2data => {
            setL2Processes(l2data);
            setL2ProcessesCopy(l2data);
          });
        });
      }
      setRefresh(false);
    }
  }, [refresh]);

  const handleNextStep = () => {
    if (projectId) {
      handleEditProject();
      setRefresh(true);
    }
    props.setCurrentTaskStep(activeStep + 1);
  };

  const handlePreviousStep = () => {
    if (projectId) {
      setRefresh(true);
    }
    props.setCurrentTaskStep(activeStep - 1);
  };

  const handleSubmitData = () => {
    const userId = parseInt(Cookies.get('user'));
    createClient({ name: client }, props.onMessage)
      .then(data => createProject({ name: project, client: data.id, members: [userId] }, props.onMessage))
      .then(data =>
        Promise.all(
          kpis
            .map(kpi => createKPI({ name: kpi.name, project: data.id }, props.onMessage))
            .concat(questionnaireQs.map(q => createQuestionnaireQuestion({ question_text: q.question_text, project: data.id }, props.onMessage)))
            .concat(
              l2Processes.reduce((acc, item) => {
                acc.push(
                  createL2Process({ title: item.title, project: data.id }, props.onMessage).then(data =>
                    Promise.all(
                      item.maturity_questions.map(q =>
                        createMaturityQuestion({ question_text: q.question_text, l_2_process: data.id }, props.onMessage)
                      )
                    )
                  )
                );
                return acc;
              }, [])
            )
            .concat(businessUnits.map(businessUnit => createBusinessUnit({ unit: businessUnit.unit, projects: [data] }, props.onMessage)))
            .concat(keyLocations.map(keyLocation => createKeyLocation({ location: keyLocation.location, projects: [data] }, props.onMessage)))
            .concat(
              siteLocations.map(siteLocation => createSiteLocation({ site_location: siteLocation.site_location, projects: [data] }, props.onMessage))
            )
        )
      )
      .then(data => {
        props.setRefreshProjects(true);
        props.setCurrentTaskStep(0);
        history.push('/');
      });
  };

  const handleEditProject = () => {
    if (deleteKpiIds.length > 0) {
      deleteKpiIds.map(id => {
        deleteKPI(id, props.onMessage);
      });
      setDeleteKpiIds([]);
    }
    if (deleteBusinessUnits.length > 0) {
      deleteBusinessUnits.map(id => {
        deleteBusinessUnit(id, props.onMessage);
      });
      setDeleteBusinessUnits([]);
    }
    if (deleteKeyLocations.length > 0) {
      deleteKeyLocations.map(id => {
        deleteKeyLocation(id, props.onMessage);
      });
      setDeleteKeyLocations([]);
    }
    if (deleteSiteLocations.length > 0) {
      deleteSiteLocations.map(id => {
        deleteSiteLocation(id, props.onMessage);
      });
      setDeleteSiteLocations([]);
    }
    if (deleteQuestionnaireIds.length > 0) {
      deleteQuestionnaireIds.map(id => {
        deleteQuestionnaireQuestion(id, props.onMessage);
      });
      setDeleteQuestionnaireIds([]);
    }
    if (deleteMaturityQIds.length > 0) {
      deleteMaturityQIds.map(id => {
        deleteMaturityQuestion(id, props.onMessage);
      });
      setDeleteMaturityQIds([]);
    }
    if (deleteL2ProcessIds.length > 0) {
      deleteL2ProcessIds.map(id => {
        deleteL2Process(id, props.onMessage);
      });
      setDeleteL2ProcessIds([]);
    }
    if (projectData.name !== project) {
      updateProject(projectData.id, { name: project }, props.onMessage).then(() => props.setReProject(true));
    }

    if (projectData.client.name !== client) {
      updateClient(projectData.client.id, { name: client }, props.onMessage);
    }

    kpis.map((kpi, index) => {
      if (projectData.kpis[index] === undefined || projectData.kpis[index] === '' || projectData.kpis[index] === null || !kpi.id) {
        createKPI({ name: kpi.name, project: projectData.id }, props.onMessage);
      } else if (kpi.name !== projectData.kpis[index].name) {
        updateKPI(kpi.id, { name: kpi.name }, props.onMessage);
      }
    });
    businessUnits.map((businessUnit, index) => {
      if (
        projectData.business_units[index] === undefined ||
        projectData.business_units[index] === '' ||
        projectData.business_units[index] === null ||
        !businessUnit.id
      ) {
        createBusinessUnit({ unit: businessUnit.unit, projects: [projectData] }, props.onMessage);
      } else if (businessUnit.unit !== projectData.business_units[index].unit) {
        updateBusinessUnit(businessUnit.id, { unit: businessUnit.unit }, props.onMessage);
      }
    });
    keyLocations.map((keyLocation, index) => {
      if (
        projectData.key_locations[index] === undefined ||
        projectData.key_locations[index] === '' ||
        projectData.key_locations[index] === null ||
        !keyLocation.id
      ) {
        createKeyLocation({ location: keyLocation.location, projects: [projectData] }, props.onMessage);
      } else if (keyLocation.location !== projectData.key_locations[index].location) {
        updateKeyLocation(keyLocation.id, { location: keyLocation.location }, props.onMessage);
      }
    });
    siteLocations.map((siteLocation, index) => {
      if (
        projectData.site_locations[index] === undefined ||
        projectData.site_locations[index] === '' ||
        projectData.site_locations[index] === null ||
        !siteLocation.id
      ) {
        createSiteLocation({ site_location: siteLocation.site_location, projects: [projectData] }, props.onMessage);
      } else if (siteLocation.site_location !== projectData.site_locations[index].site_location) {
        updateSiteLocation(siteLocation.id, { site_location: siteLocation.site_location }, props.onMessage);
      }
    });
    questionnaireQs.map((questionnaireQ, index) => {
      if (
        projectData.questionnaire_questions[index] === undefined ||
        projectData.questionnaire_questions[index] === '' ||
        projectData.questionnaire_questions[index] === null ||
        !questionnaireQ.id
      ) {
        createQuestionnaireQuestion({ question_text: questionnaireQ.question_text, project: projectData.id }, props.onMessage);
      } else if (questionnaireQ.question_text !== projectData.questionnaire_questions[index].question_text) {
        updateQuestionnaireQuestion(questionnaireQ.id, { question_text: questionnaireQ.question_text }, props.onMessage);
      }
    });
    l2Processes.map((l2process, index) => {
      if (l2processesCopy[index] === undefined || l2processesCopy[index] === '' || l2processesCopy[index] === null || !l2process.id) {
        createL2Process({ title: l2process.title, project: projectData.id }, props.onMessage).then(data =>
          Promise.all(
            l2process.maturity_questions.map(q => createMaturityQuestion({ question_text: q.question_text, l_2_process: data.id }, props.onMessage))
          )
        );
      } else if (l2process.title !== l2processesCopy[index].title) {
        updateL2Process(l2process.id, { title: l2process.title }, props.onMessage);
      }
      if (l2processesCopy[index] !== undefined) {
        l2process.maturity_questions.map((maturityQuestion, qIndex) => {
          if (
            l2processesCopy[index].maturity_questions[qIndex] === undefined ||
            l2processesCopy[index].maturity_questions[qIndex] === null ||
            l2processesCopy[index].maturity_questions[qIndex] === '' ||
            !maturityQuestion.id
          ) {
            createMaturityQuestion({ question_text: maturityQuestion.question_text, l_2_process: l2process.id }, props.onMessage);
          } else if (maturityQuestion.question_text !== l2processesCopy[index].maturity_questions[qIndex].question_text) {
            updateMaturityQuestion(maturityQuestion.id, { question_text: maturityQuestion.question_text }, props.onMessage);
          }
        });
      }
    });
    props.setRefreshProjects(true);
    if (props.currentTaskStep === 2) {
      props.setCurrentTaskStep(0);
      history.push('/CapgeminiDashboard');
    }
  };

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <Information
            client={client}
            project={project}
            kpis={kpis}
            businessUnits={businessUnits}
            onBusinessUnitsChanged={setBusinessUnits}
            deleteBusinessUnits={deleteBusinessUnits}
            setDeleteBusinessUnits={setDeleteBusinessUnits}
            keyLocations={keyLocations}
            onKeyLocationsChanged={setKeyLocations}
            deleteKeyLocations={deleteKeyLocations}
            setDeleteKeyLocations={setDeleteKeyLocations}
            siteLocations={siteLocations}
            onSiteLocationsChanged={setSiteLocations}
            deleteSiteLocations={deleteSiteLocations}
            setDeleteSiteLocations={setDeleteSiteLocations}
            questionnaireQs={questionnaireQs}
            l2Processes={l2Processes}
            onClientChanged={setClient}
            onProjectChanged={setProject}
            onKpisChanged={setKpis}
            onCompletion={handleNextStep}
            onBack={handlePreviousStep}
            onMessage={props.onMessage}
            projectId={projectId}
            projectData={projectData}
            setDeleteKpiIds={setDeleteKpiIds}
            deleteKpiIds={deleteKpiIds}
          />
        );

      case 1:
        return (
          <AmbitionSetting
            client={client}
            project={project}
            kpis={kpis}
            questionnaireQs={questionnaireQs}
            l2Processes={l2Processes}
            onQuestionnaireQsChanged={setQuestionnaireQs}
            onCompletion={handleNextStep}
            onBack={handlePreviousStep}
            onMessage={props.onMessage}
            projectId={projectId}
            projectData={projectData}
            setDeleteQuestionnaireIds={setDeleteQuestionnaireIds}
            deleteQuestionnaireIds={deleteQuestionnaireIds}
          />
        );

      case 2:
        return (
          <MaturityModel
            client={client}
            project={project}
            kpis={kpis}
            questionnaireQs={questionnaireQs}
            l2Processes={l2Processes}
            onL2ProcessesChanged={setL2Processes}
            onCompletion={props.for === 'edit' ? handleEditProject : handleSubmitData}
            onBack={handlePreviousStep}
            onMessage={props.onMessage}
            projectId={projectId}
            deleteL2ProcessIds={deleteL2ProcessIds}
            setDeleteL2ProcessIds={setDeleteL2ProcessIds}
            deleteMaturityQIds={deleteMaturityQIds}
            setDeleteMaturityQIds={setDeleteMaturityQIds}
            l2processesCopy={l2processesCopy}
          />
        );

      default:
        throw new Error('Unknown step');
    }
  };

  const mainComponent = () => {
    return (
      <Grid container direction="column" alignItems="center" justify="center">
        {getStepContent(activeStep)}
      </Grid>
    );
  };

  const renderStepper = () => {
    if (activeStep < 4) {
      return (
        <Grid item>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>
      );
    }
  };

  return (
    <React.Fragment>
      {renderStepper()}
      {mainComponent()}
    </React.Fragment>
  );
}

export default CreateProject;
