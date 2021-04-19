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

function InitialInformation(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Paper component="form" className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <Autocomplete
                id="persona_job_role"
                value={props.profile.persona_job_role}
                options={props.personaJobRoles}
                getOptionLabel={option => option.job_role}
                getOptionSelected={(option, value) => value.id === option.id}
                onChange={props.onDropDownChange}
                renderInput={params => (
                  <TextField
                    required
                    {...params}
                    label="Persona Job Role"
                    variant="filled"
                    margin="normal"
                    error={props.errors.persona_job_role_bool}
                    helperText={props.errors.persona_job_role}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <TextField
                id="profile_name"
                label="Name"
                color="primary"
                variant="filled"
                value={props.profile.profile_name}
                onChange={props.onTextChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <TextField
                id="number_of_employees_in_role"
                label="No. of Employees in Role"
                color="primary"
                variant="filled"
                type="number"
                value={props.profile.number_of_employees_in_role}
                onChange={props.onTextChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <Autocomplete
                multiple
                id="grades"
                value={props.profile.grades}
                options={props.typicalGradeOptions}
                getOptionLabel={option => option.grade_title}
                getOptionSelected={(option, value) => value.id === option.id}
                onChange={props.onMultiSelect}
                renderInput={params => (
                  <TextField
                    required
                    {...params}
                    label="Typical Grade"
                    variant="filled"
                    margin="normal"
                    error={props.errors.grades_bool}
                    helperText={props.errors.grades}
                  />
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
}

export default InitialInformation;
