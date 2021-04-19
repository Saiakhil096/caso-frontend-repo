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

function LocationFilter(props) {
  const classes = useStyles();
  const [selectedBUFilter, setSelectedBUFilter] = useState(null);
  const [selectedLocationFilter, setSelectedLocationFilter] = useState(null);
  const [selectedTaskFilter, setSelectedTaskFilter] = useState(null);
  const { buFilterData, locationFilterData, TaskFilterData, generateFilteredGraphs } = props;

  const onBUFilterChange = (event, filter) => {
    setSelectedBUFilter(filter);
    generateFilteredGraphs(filter, 'unit');
  };
  const onLocationFilterChange = (event, filter) => {
    setSelectedLocationFilter(filter);
    generateFilteredGraphs(filter, 'location');
  };
  const onTaskFilterChange = (event, filter) => {
    setSelectedTaskFilter(filter);
    generateFilteredGraphs(filter, 'title');
  };
  return (
    <React.Fragment>
      <Grid container direction="row" className={classes.center}>
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
            options={TaskFilterData}
            value={selectedTaskFilter}
            autoHighlight
            getOptionLabel={option => option.title}
            getOptionSelected={(option, value) => option.title === value.title}
            onChange={onTaskFilterChange}
            renderInput={params => (
              <TextField
                {...params}
                label="Select Task "
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

export default LocationFilter;
