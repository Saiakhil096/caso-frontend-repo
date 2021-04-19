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
  }
}));

function Filters(props) {
  const classes = useStyles();
  const [selectedBUFilter, setSelectedBUFilter] = useState(null);
  const [selectedLocationFilter, setSelectedLocationFilter] = useState(null);
  const [selectedJobRoleFilter, setSelectedJobRoleFilter] = useState(null);
  const { buFilterData, locationFilterData, personaFilterData, generateFilteredGraphs } = props;

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
    generateFilteredGraphs(filter, 'profile_name');
  };
  return (
    <React.Fragment>
      <Grid item className={classes.select}>
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
              label="Select Business Unit "
              inputProps={{
                ...params.inputProps
              }}
            />
          )}
        />
      </Grid>
      <Grid item className={classes.select}>
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
              type="option"
              {...params}
              label="Select Location "
              inputProps={{
                ...params.inputProps
              }}
            />
          )}
        />
      </Grid>
      <Grid item className={classes.select}>
        <Autocomplete
          className={classes.autocomp}
          id="filter_data"
          options={personaFilterData}
          value={selectedJobRoleFilter}
          autoHighlight
          getOptionLabel={option => option.profile_name}
          getOptionSelected={(option, value) => option.profile_name == value.profile_name}
          onChange={onJobRoleFilterChange}
          renderInput={params => (
            <TextField
              type="option"
              {...params}
              label="Select Persona "
              inputProps={{
                ...params.inputProps
              }}
            />
          )}
        />
      </Grid>
    </React.Fragment>
  );
}

export default Filters;
