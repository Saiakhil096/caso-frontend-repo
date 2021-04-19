import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { FormControl, TextField, Paper, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  paper: {
    background: 'none',
    width: '100%',
    maxWidth: '40rem',
    margin: theme.spacing(1, 'auto'),
    padding: theme.spacing(2),
    boxShadow: 'none'
  }
}));

function ImpactedAudience(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Paper component="form" className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <Autocomplete
                multiple
                id="user_profiles"
                value={props.formCIA.user_profiles}
                options={props.personasOptions}
                onChange={props.onMultiSelect}
                getOptionLabel={option => option.profile_name}
                getOptionSelected={(option, value) => value.id === option.id}
                renderInput={params => (
                  <TextField
                    {...params}
                    required
                    variant="filled"
                    label="Affected Personas"
                    error={props.errors.user_profiles_bool}
                    helperText={props.errors.user_profiles}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <TextField
                id="number_of_impacted_employees"
                label="Number of Impacted Employees"
                type="number"
                color="primary"
                variant="filled"
                value={props.formCIA.number_of_impacted_employees}
                onChange={props.onTextChange}
                inputProps={{ 'data-testid': 'number_of_impacted_employees' }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <Autocomplete
                multiple
                id="business_units"
                value={props.formCIA.business_units}
                options={props.businessUnits}
                getOptionLabel={option => option.unit}
                getOptionSelected={(option, value) => value.id === option.id}
                onChange={props.onMultiSelect}
                renderInput={params => (
                  <TextField
                    {...params}
                    required
                    label="Business Units"
                    margin="normal"
                    variant="filled"
                    error={props.errors.business_units_bool}
                    helperText={props.errors.business_units}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <Autocomplete
                multiple
                id="departments"
                value={props.formCIA.departments}
                options={props.departments}
                getOptionLabel={option => option.title}
                getOptionSelected={(option, value) => value.id === option.id}
                onChange={props.onMultiSelect}
                renderInput={params => <TextField {...params} label="Departments" margin="normal" variant="filled" />}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <Autocomplete
                multiple
                id="key_locations"
                value={props.formCIA.key_locations}
                options={props.keyLocations}
                getOptionLabel={option => option.location}
                getOptionSelected={(option, value) => value.id === option.id}
                onChange={props.onMultiSelect}
                renderInput={params => <TextField {...params} label="Key Locations" margin="normal" variant="filled" />}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
}

export default ImpactedAudience;
