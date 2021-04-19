import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Card, Backdrop, CircularProgress } from '@material-ui/core';
import LocationReadiness from '../Charts/LocationReadiness';
import TaskReadiness from '../Charts/TaskReadiness';
import BuReadiness from './BuReadiness';
import LocationFilter from './LocationFilter';
import { fetchLocationInfrastructureReadinessGraphs, getlocationinfrastructurereadinessfilters, fetchProjectData } from '../../common/API';
import Cookies from 'js-cookie';

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
  const [selectedTaskFilter, setSelectedTaskFilter] = useState('');

  const [buFilterData, setBuFilterData] = useState([]);
  const [locationFilterData, setLocationFilterData] = useState([]);
  const [taskFilterData, setTaskFilterData] = useState([]);

  const [LocationReadinessData, setLocationReadinessData] = useState([]);
  const [TaskReadinessData, setTaskReadinessData] = useState([]);
  const [BuReadinessData, setBuReadinessData] = useState([]);
  const [filterData, setfilterData] = useState({
    business_unit: null,
    location: null,
    Location_task: null
  });

  useEffect(() => {
    Promise.all([
      fetchLocationInfrastructureReadinessGraphs(Cookies.get('project'), onMessage),
      fetchProjectData(Cookies.get('project'), onMessage)
    ]).then(async ([graphDataJson, projectDataJson]) => {
      setLocationFilterData(projectDataJson.key_locations);
      setBuFilterData(projectDataJson.business_units);
      setTaskFilterData(projectDataJson.location_infrastructure_tasks);

      setLocationReadinessData([graphDataJson.loc_x_axis, graphDataJson.loc_y_axis]);
      setTaskReadinessData([graphDataJson.task_x_axis, graphDataJson.task_y_axis]);
      setBuReadinessData([graphDataJson.Bu_x_axis, graphDataJson.Bu_y_axis]);
      setLoading(false);
    });
  }, []);

  const generateFilteredGraphs = (filter, type) => {
    if (type === 'unit') {
      filterData.business_unit = filter != null ? filter.id : null;
      filter != null ? setSelectedBUFilter(' ' + filter.unit) : setSelectedBUFilter('');
    } else if (type === 'title') {
      filterData.Location_task = filter != null ? filter.id : null;
      filter != null ? setSelectedTaskFilter(' ' + filter.title) : setSelectedTaskFilter('');
    } else if (type === 'location') {
      filterData.location = filter != null ? filter.id : null;
      filter != null ? setSelectedLocationFilter(' ' + filter.location) : setSelectedLocationFilter('');
    }
    Promise.all([getlocationinfrastructurereadinessfilters(filterData, onMessage)]).then(async ([filterDataJson]) => {
      setLocationReadinessData([filterDataJson.loc_x_axis, filterDataJson.loc_y_axis]);
      setTaskReadinessData([filterDataJson.task_x_axis, filterDataJson.task_y_axis]);
      setBuReadinessData([filterDataJson.Bu_x_axis, filterDataJson.Bu_y_axis]);
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
        <Grid container direction="row" className={classes.center}>
          <Grid item className={classes.fixedPosition}>
            <LocationFilter
              buFilterData={buFilterData}
              locationFilterData={locationFilterData}
              TaskFilterData={taskFilterData}
              generateFilteredGraphs={generateFilteredGraphs}
            />
          </Grid>
        </Grid>
        <Grid container direction="row" className={classes.center}>
          <Grid item className={classes.fixedPosition}>
            <Card className={classes.padding}>
              <TaskReadiness
                TaskReadinessData={TaskReadinessData}
                selectedBUFilter={selectedBUFilter}
                selectedLocationFilter={selectedLocationFilter}
                selectedTaskFilter={selectedTaskFilter}
                onMessage={props.onMessage}
                setLocInfraFilter={props.setLocInfraFilter}
              />
            </Card>
          </Grid>
          <Grid item className={classes.fixedPosition}>
            <Card className={classes.padding}>
              <BuReadiness
                BuReadinessData={BuReadinessData}
                selectedBUFilter={selectedBUFilter}
                selectedLocationFilter={selectedLocationFilter}
                selectedTaskFilter={selectedTaskFilter}
                onMessage={props.onMessage}
                setLocInfraFilter={props.setLocInfraFilter}
              />
            </Card>
          </Grid>
        </Grid>
        <Grid container direction="row" className={classes.center}>
          <Grid item className={classes.fixedPosition}>
            <Card className={classes.padding}>
              <LocationReadiness
                LocationReadinessData={LocationReadinessData}
                selectedBUFilter={selectedBUFilter}
                selectedLocationFilter={selectedLocationFilter}
                selectedTaskFilter={selectedTaskFilter}
                onMessage={props.onMessage}
                setLocInfraFilter={props.setLocInfraFilter}
              />
            </Card>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
export default Charts;
