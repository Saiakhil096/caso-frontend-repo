import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(theme => ({
  select: {
    margin: '40px'
  },
  autocomp: {
    width: '270px'
  },
  center: {
    justifyContent: 'center'
  }
}));

function Filters(props) {
  const classes = useStyles();
  const [selectedBUFilter, setSelectedBUFilter] = useState({});
  const [selectedLocationFilter, setSelectedLocationFilter] = useState({});
  const [selectedJobRoleFilter, setSelectedJobRoleFilter] = useState({});
  const { buFilterData, locationFilterData, jobRoleFilterData, generateFilteredGraphs } = props;

  const onBUFilterChange = (event, filter) => {
    setSelectedBUFilter(filter);
    generateFilteredGraphs(filter, 'unit');
  };
  const onLocationFilterChange = (event, filter) => {
    setSelectedLocationFilter(filter);
    generateFilteredGraphs(filter, 'location');
  };
  const onJobRoleFilterChange = (event, filter) => {
    setSelectedJobRoleFilter(filter);
    generateFilteredGraphs(filter, 'job_role');
  };
  return (
    <React.Fragment>
      <Grid container direction="row" className={classes.center}>
        <Grid item spacing={2} className={classes.select}>
          <Autocomplete
            className={classes.autocomp}
            id="filter_data"
            options={buFilterData}
            value={selectedBUFilter}
            autoHighlight
            getOptionLabel={option => option.unit}
            getOptionSelected={(option, value) => option.unit == value.unit}
            onChange={onBUFilterChange}
            renderInput={params => (
              <TextField
                {...params}
                label="Select Business Unit Filter"
                inputProps={{
                  ...params.inputProps
                }}
              />
            )}
          />
        </Grid>
        <Grid item spacing={2} className={classes.select}>
          <Autocomplete
            className={classes.autocomp}
            id="filter_data"
            options={locationFilterData}
            value={selectedLocationFilter}
            autoHighlight
            getOptionLabel={option => option.location}
            getOptionSelected={(option, value) => option.location == value.location}
            onChange={onLocationFilterChange}
            renderInput={params => (
              <TextField
                {...params}
                label="Select Location Filter"
                inputProps={{
                  ...params.inputProps
                }}
              />
            )}
          />
        </Grid>
        <Grid item spacing={2} className={classes.select}>
          <Autocomplete
            className={classes.autocomp}
            id="filter_data"
            options={jobRoleFilterData}
            value={selectedJobRoleFilter}
            autoHighlight
            getOptionLabel={option => option.job_role}
            getOptionSelected={(option, value) => option.job_role == value.job_role}
            onChange={onJobRoleFilterChange}
            renderInput={params => (
              <TextField
                {...params}
                label="Select Job Role Filter"
                inputProps={{
                  ...params.inputProps
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Filters;
