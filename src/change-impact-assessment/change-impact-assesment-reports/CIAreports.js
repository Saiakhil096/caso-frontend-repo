import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, Backdrop, CircularProgress } from '@material-ui/core';
import ImpactedEmployeesVsBU from './ImpactedEmployeesVsBU';
import BenefitValueVsL2process from './BenefitValueVsL2process';
import BenefitValueVsBusinessUnit from './BenefitValueVsBusinessUnit';
import ImpactedEmployeesVsL2Processes from './ImpactedEmployeesVsL2Processes';
import ChangeImpactsVsLocation from './ChangeImpactsVsLocation';
import ChangeImpactVsLocation from './NumberOfChangeImpactVsLocation';
import ChangeImpactsByBU from './ChangeImpactsByBU';
import ChangeImpactVsPersona from './NumberOfChangeImpactsVsPersona';
import ChangeImpactClassification from './ChangeImpactClassification';
import ChangeImpactByL2Process from './NumberOfChangeImpactByL2Processes';
import ChangeImpactByL3Process from './NumberOfChangeImpactsByL3Processes';
import ChangeThemes from './ChangeThemes';
import ChangeWeighting from './ChangeWeighting';
import TypesOfChangeImpact from './TypesOfChangeImpact';
import Filter from './Filter';
import Cookies from 'js-cookie';
import { fetchCIAGraphData, fetchProjectData, getFilteredCIAGraphData } from '../../common/API';

const useStyles = makeStyles(theme => ({
  fixedPosition: {
    top: theme.spacing(2),
    padding: '1%'
  },
  content: {
    padding: '2% 4%',
    justifyContent: 'center'
  },
  padding: {
    padding: '20px'
  },
  center: {
    justifyContent: 'center'
  }
}));

function CIAreports(props) {
  const classes = useStyles();

  const { onMessage } = props;

  const [loading, setLoading] = useState(true);
  const [benefitValueVsBusinessUnit, setBenefitValueVsBusinessUnit] = useState([]);
  const [benefitValueVsL2process, setBenefitValueVsL2process] = useState([]);
  const [changeImpactClassification, setChangeImpactClassification] = useState([]);
  const [changeImpactsByBU, setChangeImpactsByBU] = useState([]);
  const [changeImpactsVsLocation, setChangeImpactsVsLocation] = useState([]);
  const [changeThemes, setChangeThemes] = useState([]);
  const [changeWeighting, setChangeWeighting] = useState([]);
  const [impactedEmployeesVsBU, setImpactedEmployeesVsBU] = useState([]);
  const [impactedEmployeesVsL2Processes, setImpactedEmployeesVsL2Processes] = useState([]);
  const [numberOfChangeImpactByL2Processes, setNumberOfChangeImpactByL2Processes] = useState([]);
  const [numberOfChangeImpactsByL3Processes, setNumberOfChangeImpactsByL3Processes] = useState([]);
  const [numberOfChangeImpactsVsPersona, setNumberOfChangeImpactsVsPersona] = useState([]);
  const [numberOfChangeImpactVsLocation, setNumberOfChangeImpactVsLocation] = useState([]);
  const [typesOfChangeImpacts, setTypesOfChangeImpacts] = useState([]);
  const [profiles, setProfiles] = useState([]);

  const [buFilterData, setBuFilterData] = useState([]);
  const [locationFilterData, setLocationFilterData] = useState([]);
  const [personaFilterData, setPersonaFilterData] = useState([]);
  const [processReferenceOptions, setProcessReferenceOptions] = useState([]);

  const [selectedBUFilter, setSelectedBUFilter] = useState('');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('');
  const [selectedJobRoleFilter, setSelectedJobRoleFilter] = useState('');

  const [filterData, setfilterData] = useState({
    business_unit: null,
    location: null,
    profile_name: null
  });

  useEffect(() => {
    Promise.all([fetchProjectData(Cookies.get('project'), onMessage), fetchCIAGraphData(onMessage)]).then(([projectDataJson, GraphData]) => {
      setLocationFilterData(projectDataJson.key_locations);
      setBuFilterData(projectDataJson.business_units);
      setProcessReferenceOptions(projectDataJson.process_references);
      for (let i = 0; i < projectDataJson.user_profiles.length; i++) {
        for (let j = 0; j < projectDataJson.persona_job_roles.length; j++) {
          if (projectDataJson.persona_job_roles[j].id === projectDataJson.user_profiles[i].persona_job_role) {
            projectDataJson.user_profiles[i].profile_name = projectDataJson.user_profiles[i].profile_name.concat(
              '(' + projectDataJson.persona_job_roles[j].job_role + ')'
            );
            break;
          }
        }
      }
      projectDataJson.user_profiles.map(profile => {
        profiles.push(profile.profile_name);
      });
      setPersonaFilterData(projectDataJson.user_profiles);
      setChangeImpactClassification([GraphData.chart1_xaxis, GraphData.chart1_yaxis]);
      setNumberOfChangeImpactVsLocation([GraphData.chart2_xaxis, GraphData.chart2_yaxis]);
      setNumberOfChangeImpactsVsPersona([profiles, GraphData.chart3_yaxis]);
      setNumberOfChangeImpactByL2Processes([GraphData.chart4_xaxis, GraphData.chart4_yaxis]);
      setNumberOfChangeImpactsByL3Processes([GraphData.chart5_xaxis, GraphData.chart5_yaxis]);
      setChangeWeighting([GraphData.chart6_xaxis, GraphData.chart6_yaxis]);
      setChangeThemes([GraphData.chart7_xaxis, GraphData.chart7_yaxis]);
      setChangeImpactsByBU([GraphData.chart8_xaxis, GraphData.chart8_yaxis]);
      setBenefitValueVsL2process([GraphData.chart9_xaxis, GraphData.chart9_yaxis]);
      setBenefitValueVsBusinessUnit([GraphData.chart10_xaxis, GraphData.chart10_yaxis]);
      setImpactedEmployeesVsL2Processes([GraphData.chart11_xaxis, GraphData.chart11_yaxis]);
      setChangeImpactsVsLocation([GraphData.chart12_xaxis, GraphData.chart12_yaxis]);
      setImpactedEmployeesVsBU([GraphData.chart13_xaxis, GraphData.chart13_yaxis]);
      setTypesOfChangeImpacts(GraphData.table_data);
      setLoading(false);
    });
  }, []);

  const generateFilteredGraphs = (filter, type) => {
    if (type === 'unit') {
      filterData.business_unit = filter != null ? filter.id : null;
      filter != null ? setSelectedBUFilter(' ' + filter.unit) : setSelectedBUFilter('');
    } else if (type === 'profile_name') {
      filterData.profile_name = filter != null ? filter.id : null;
      filter != null ? setSelectedJobRoleFilter(' ' + filter.profile_name) : setSelectedJobRoleFilter('');
    } else if (type === 'location') {
      filterData.location = filter != null ? filter.id : null;
      filter != null ? setSelectedLocationFilter(' ' + filter.location) : setSelectedLocationFilter('');
    }
    Promise.all([getFilteredCIAGraphData(filterData, onMessage)]).then(async ([filterDataJson]) => {
      setChangeImpactClassification([filterDataJson.chart1_xaxis, filterDataJson.chart1_yaxis]);
      setNumberOfChangeImpactVsLocation([filterDataJson.chart2_xaxis, filterDataJson.chart2_yaxis]);
      setNumberOfChangeImpactsVsPersona([profiles, filterDataJson.chart3_yaxis]);
      setNumberOfChangeImpactByL2Processes([filterDataJson.chart4_xaxis, filterDataJson.chart4_yaxis]);
      setNumberOfChangeImpactsByL3Processes([filterDataJson.chart5_xaxis, filterDataJson.chart5_yaxis]);
      setChangeWeighting([filterDataJson.chart6_xaxis, filterDataJson.chart6_yaxis]);
      setChangeThemes([filterDataJson.chart7_xaxis, filterDataJson.chart7_yaxis]);
      setChangeImpactsByBU([filterDataJson.chart8_xaxis, filterDataJson.chart8_yaxis]);
      setBenefitValueVsL2process([filterDataJson.chart9_xaxis, filterDataJson.chart9_yaxis]);
      setBenefitValueVsBusinessUnit([filterDataJson.chart10_xaxis, filterDataJson.chart10_yaxis]);
      setImpactedEmployeesVsL2Processes([filterDataJson.chart11_xaxis, filterDataJson.chart11_yaxis]);
      setChangeImpactsVsLocation([filterDataJson.chart12_xaxis, filterDataJson.chart12_yaxis]);
      setImpactedEmployeesVsBU([filterDataJson.chart13_xaxis, filterDataJson.chart13_yaxis]);
      setTypesOfChangeImpacts(filterDataJson.table_data);
      setLoading(false);
    });
  };

  if (loading) {
    return (
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else {
    return (
      <React.Fragment>
        <Grid container className={classes.content}>
          <Filter
            buFilterData={buFilterData}
            locationFilterData={locationFilterData}
            personaFilterData={personaFilterData}
            generateFilteredGraphs={generateFilteredGraphs}
          />
        </Grid>
        <Grid container direction="row" className={classes.center}>
          <Grid item className={classes.fixedPosition}>
            <Card className={classes.padding}>
              <ChangeImpactClassification
                changeImpactClassificationData={changeImpactClassification}
                selectedBUFilter={selectedBUFilter}
                selectedJobRoleFilter={selectedJobRoleFilter}
                selectedLocationFilter={selectedLocationFilter}
                onMessage={props.onMessage}
                setCiaFilter={props.setCiaFilter}
              />
            </Card>
          </Grid>
          <Grid item className={classes.fixedPosition}>
            <Card className={classes.padding}>
              <TypesOfChangeImpact
                typesOfChangeImpacts={typesOfChangeImpacts}
                selectedBUFilter={selectedBUFilter}
                selectedLocationFilter={selectedLocationFilter}
                selectedJobRoleFilter={selectedJobRoleFilter}
              />
            </Card>
          </Grid>
        </Grid>
        <Grid container direction="row" className={classes.center}>
          <Grid item className={classes.fixedPosition}>
            <Card className={classes.padding}>
              <ChangeImpactVsLocation
                numberOfChangeImpactVsLocation={numberOfChangeImpactVsLocation}
                selectedBUFilter={selectedBUFilter}
                selectedJobRoleFilter={selectedJobRoleFilter}
                selectedLocationFilter={selectedLocationFilter}
                onMessage={props.onMessage}
                setCiaFilter={props.setCiaFilter}
              />
            </Card>
          </Grid>
          <Grid item className={classes.fixedPosition}>
            <Card className={classes.padding}>
              <ChangeImpactVsPersona
                numberOfChangeImpactsVsPersona={numberOfChangeImpactsVsPersona}
                selectedBUFilter={selectedBUFilter}
                selectedJobRoleFilter={selectedJobRoleFilter}
                selectedLocationFilter={selectedLocationFilter}
                onMessage={props.onMessage}
                setCiaFilter={props.setCiaFilter}
              />
            </Card>
          </Grid>
        </Grid>
        <Grid container direction="row" className={classes.center}>
          <Grid item className={classes.fixedPosition}>
            <Card className={classes.padding}>
              <ChangeImpactByL2Process
                numberOfChangeImpactByL2Processes={numberOfChangeImpactByL2Processes}
                selectedBUFilter={selectedBUFilter}
                selectedJobRoleFilter={selectedJobRoleFilter}
                selectedLocationFilter={selectedLocationFilter}
                onMessage={props.onMessage}
                setCiaFilter={props.setCiaFilter}
              />
            </Card>
          </Grid>
          <Grid item className={classes.fixedPosition}>
            <Card className={classes.padding}>
              <ChangeImpactByL3Process
                numberOfChangeImpactsByL3Processes={numberOfChangeImpactsByL3Processes}
                selectedBUFilter={selectedBUFilter}
                selectedJobRoleFilter={selectedJobRoleFilter}
                selectedLocationFilter={selectedLocationFilter}
                onMessage={props.onMessage}
                setCiaFilter={props.setCiaFilter}
              />
            </Card>
          </Grid>
        </Grid>
        <Grid container direction="row" className={classes.center}>
          <Grid item className={classes.fixedPosition}>
            <Card className={classes.padding}>
              <ChangeWeighting
                changeWeighting={changeWeighting}
                selectedBUFilter={selectedBUFilter}
                selectedJobRoleFilter={selectedJobRoleFilter}
                selectedLocationFilter={selectedLocationFilter}
                onMessage={props.onMessage}
                setCiaFilter={props.setCiaFilter}
              />
            </Card>
          </Grid>
          <Grid item className={classes.fixedPosition}>
            <Card className={classes.padding}>
              <ChangeThemes
                changeThemes={changeThemes}
                selectedBUFilter={selectedBUFilter}
                selectedJobRoleFilter={selectedJobRoleFilter}
                selectedLocationFilter={selectedLocationFilter}
                onMessage={props.onMessage}
                setCiaFilter={props.setCiaFilter}
              />
            </Card>
          </Grid>
        </Grid>

        <Grid container direction="row" className={classes.center}>
          <Grid item className={classes.fixedPosition}>
            <Card className={classes.padding}>
              <ChangeImpactsByBU
                changeImpactsByBU={changeImpactsByBU}
                selectedBUFilter={selectedBUFilter}
                selectedJobRoleFilter={selectedJobRoleFilter}
                selectedLocationFilter={selectedLocationFilter}
                onMessage={props.onMessage}
                setCiaFilter={props.setCiaFilter}
              />
            </Card>
          </Grid>
          <Grid item className={classes.fixedPosition}>
            <Card className={classes.padding}>
              <BenefitValueVsL2process
                benefitValueVsL2process={benefitValueVsL2process}
                selectedBUFilter={selectedBUFilter}
                selectedJobRoleFilter={selectedJobRoleFilter}
                selectedLocationFilter={selectedLocationFilter}
                onMessage={props.onMessage}
                setCiaFilter={props.setCiaFilter}
              />
            </Card>
          </Grid>
        </Grid>
        <Grid container direction="row" className={classes.center}>
          <Grid item className={classes.fixedPosition}>
            <Card className={classes.padding}>
              <BenefitValueVsBusinessUnit
                benefitValueVsBusinessUnit={benefitValueVsBusinessUnit}
                selectedBUFilter={selectedBUFilter}
                selectedJobRoleFilter={selectedJobRoleFilter}
                selectedLocationFilter={selectedLocationFilter}
                onMessage={props.onMessage}
                setCiaFilter={props.setCiaFilter}
              />
            </Card>
          </Grid>
          <Grid item className={classes.fixedPosition}>
            <Card className={classes.padding}>
              <ImpactedEmployeesVsL2Processes
                impactedEmployeesVsL2Processes={impactedEmployeesVsL2Processes}
                selectedBUFilter={selectedBUFilter}
                selectedJobRoleFilter={selectedJobRoleFilter}
                selectedLocationFilter={selectedLocationFilter}
                onMessage={props.onMessage}
                setCiaFilter={props.setCiaFilter}
              />
            </Card>
          </Grid>
        </Grid>
        <Grid container direction="row" className={classes.center}>
          <Grid item className={classes.fixedPosition}>
            <Card className={classes.padding}>
              <ChangeImpactsVsLocation
                changeImpactsVsLocation={changeImpactsVsLocation}
                selectedBUFilter={selectedBUFilter}
                selectedJobRoleFilter={selectedJobRoleFilter}
                selectedLocationFilter={selectedLocationFilter}
                onMessage={props.onMessage}
                setCiaFilter={props.setCiaFilter}
              />
            </Card>
          </Grid>
          <Grid item className={classes.fixedPosition}>
            <Card className={classes.padding}>
              <ImpactedEmployeesVsBU
                impactedEmployeesVsBU={impactedEmployeesVsBU}
                selectedBUFilter={selectedBUFilter}
                selectedJobRoleFilter={selectedJobRoleFilter}
                selectedLocationFilter={selectedLocationFilter}
                onMessage={props.onMessage}
                setCiaFilter={props.setCiaFilter}
              />
            </Card>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
export default CIAreports;
