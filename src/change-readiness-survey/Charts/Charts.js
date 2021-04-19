import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, Backdrop, CircularProgress } from '@material-ui/core';
import ScoreVsLocation from './ScoreVsLocation';
import ScoreVsBU from './ScoreVsBU';
import ScoreVsJobRole from './ScoreVsJobRole';
import ScoreVsQuestions from './ScoreVsQuestions';
import ScoreVsDate from './ScoreVsDate';
import Filters from './Filters';
import Cookies from 'js-cookie';
import { fetchProjectData, getFilteredChangeReadinessGraphData, fetchChangeReadinessGraphData } from '../../common/API';

const useStyles = makeStyles(theme => ({
  fixedPosition: {
    top: theme.spacing(2),
    padding: '1%'
  },
  content: {
    padding: '2% 4%'
  },
  padding: {
    padding: '20px'
  },
  center: {
    justifyContent: 'center'
  }
}));

function Charts(props) {
  const { onMessage } = props;
  const classes = useStyles();
  const [loading, setLoading] = useState(true);

  const [selectedBUFilter, setSelectedBUFilter] = useState('');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('');
  const [selectedJobRoleFilter, setSelectedJobRoleFilter] = useState('');

  const [buFilterData, setBuFilterData] = useState([]);
  const [locationFilterData, setLocationFilterData] = useState([]);
  const [jobRoleFilterData, setJobRoleFilterData] = useState([]);

  const [scoreVsBuData, setScoreVsBuData] = useState([]);
  const [scoreVsLocationData, setScoreVsLocationData] = useState([]);
  const [scoreVsJobRoleData, setScoreVsJobRoleData] = useState([]);
  const [scoreVsQuestionData, setScoreVsQuestionData] = useState([]);
  const [ScoreVsdateData, setScoreVsdateData] = useState([]);

  const [filterData, setfilterData] = useState({
    business_unit: null,
    location: null,
    job_role: null
  });

  useEffect(() => {
    Promise.all([fetchChangeReadinessGraphData(onMessage), fetchProjectData(Cookies.get('project'), onMessage)]).then(
      async ([graphDataJson, projectDataJson]) => {
        setLocationFilterData(projectDataJson.key_locations);
        setBuFilterData(projectDataJson.business_units);
        setJobRoleFilterData(projectDataJson.persona_job_roles);

        setScoreVsBuData([graphDataJson.score_vs_bu_xaxis_array, graphDataJson.score_vs_bu_yaxis_array]);
        setScoreVsLocationData([graphDataJson.score_vs_location_xaxis_array, graphDataJson.score_vs_location_yaxis_array]);
        setScoreVsJobRoleData([graphDataJson.score_vs_job_xaxis_array, graphDataJson.score_vs_job_yaxis_array]);
        setScoreVsQuestionData([
          graphDataJson.score_vs_questions_xaxis_array,
          graphDataJson.score_vs_questionsyaxis_array,
          graphDataJson.score_vs_questions_ratings
        ]);
        setScoreVsdateData([graphDataJson.month_vs_crr_xaxis, graphDataJson.month_vs_crr_yaxis]);

        setLoading(false);
      }
    );
  }, []);

  const generateFilteredGraphs = (filter, type) => {
    if (type === 'location') {
      filterData.location = filter != null ? filter.id : null;
      filter != null ? setSelectedBUFilter(' ' + filter.location) : setSelectedBUFilter('');
    } else if (type === 'job_role') {
      filterData.job_role = filter != null ? filter.id : null;
      filter != null ? setSelectedJobRoleFilter(' ' + filter.job_role) : setSelectedJobRoleFilter('');
    } else if (type === 'unit') {
      filterData.business_unit = filter != null ? filter.id : null;
      filter != null ? setSelectedLocationFilter(' ' + filter.unit) : setSelectedLocationFilter('');
    }
    Promise.all([getFilteredChangeReadinessGraphData(filterData, onMessage)]).then(async ([filterDataJson]) => {
      setScoreVsBuData([filterDataJson.score_vs_bu_xaxis_array, filterDataJson.score_vs_bu_yaxis_array]);
      setScoreVsLocationData([filterDataJson.score_vs_location_xaxis_array, filterDataJson.score_vs_location_yaxis_array]);
      setScoreVsJobRoleData([filterDataJson.score_vs_job_xaxis_array, filterDataJson.score_vs_job_yaxis_array]);
      setScoreVsQuestionData([
        filterDataJson.score_vs_questions_xaxis_array,
        filterDataJson.score_vs_questionsyaxis_array,
        filterDataJson.score_vs_questions_ratings
      ]);
      setScoreVsdateData([filterDataJson.month_vs_crr_xaxis, filterDataJson.month_vs_crr_yaxis]);
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
          <Filters
            buFilterData={buFilterData}
            locationFilterData={locationFilterData}
            jobRoleFilterData={jobRoleFilterData}
            generateFilteredGraphs={generateFilteredGraphs}
          />
          <Grid container direction="row" className={classes.center}>
            <Grid item spacing={2} className={classes.fixedPosition}>
              <Card className={classes.padding}>
                <ScoreVsBU
                  scoreVsBuData={scoreVsBuData}
                  selectedBUFilter={selectedBUFilter}
                  selectedJobRoleFilter={selectedJobRoleFilter}
                  selectedLocationFilter={selectedLocationFilter}
                />
              </Card>
            </Grid>
            <Grid item spacing={2} className={classes.fixedPosition}>
              <Card className={classes.padding}>
                <ScoreVsLocation
                  scoreVsLocationData={scoreVsLocationData}
                  selectedBUFilter={selectedBUFilter}
                  selectedJobRoleFilter={selectedJobRoleFilter}
                  selectedLocationFilter={selectedLocationFilter}
                />
              </Card>
            </Grid>
          </Grid>
          <Grid container direction="row" className={classes.center}>
            <Grid item spacing={2} className={classes.fixedPosition}>
              <Card className={classes.padding}>
                <ScoreVsJobRole
                  scoreVsJobRoleData={scoreVsJobRoleData}
                  selectedBUFilter={selectedBUFilter}
                  selectedJobRoleFilter={selectedJobRoleFilter}
                  selectedLocationFilter={selectedLocationFilter}
                />
              </Card>
            </Grid>
            <Grid item spacing={2} className={classes.fixedPosition}>
              <Card className={classes.padding}>
                <ScoreVsQuestions
                  scoreVsQuestionData={scoreVsQuestionData}
                  selectedBUFilter={selectedBUFilter}
                  selectedJobRoleFilter={selectedJobRoleFilter}
                  selectedLocationFilter={selectedLocationFilter}
                />
              </Card>
            </Grid>
            <Grid item spacing={2} className={classes.fixedPosition}>
              <Card className={classes.padding}>
                <ScoreVsDate
                  ScoreVsdateData={ScoreVsdateData}
                  selectedBUFilter={selectedBUFilter}
                  selectedJobRoleFilter={selectedJobRoleFilter}
                  selectedLocationFilter={selectedLocationFilter}
                />
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default Charts;
