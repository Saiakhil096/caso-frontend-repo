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

function General(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Paper component="form" className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <Autocomplete
                id="workshop"
                value={props.formCIA.workshop}
                options={props.workshopOptions}
                getOptionLabel={option => option.name}
                getOptionSelected={(option, value) => value.id === option.id}
                onChange={props.onDropDownChange}
                renderInput={params => (
                  <TextField
                    required
                    {...params}
                    label="Workshop Name/Source"
                    variant="filled"
                    margin="normal"
                    error={props.errors.workshop_bool}
                    helperText={props.errors.workshop}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <Autocomplete
                id="process_reference"
                value={props.formCIA.process_reference}
                options={props.processReferenceOptions}
                getOptionLabel={option => option.title}
                getOptionSelected={(option, value) => value.id === option.id}
                onChange={props.onDropDownChange}
                renderInput={params => (
                  <TextField
                    required
                    {...params}
                    label="Process Reference"
                    variant="filled"
                    margin="normal"
                    error={props.errors.process_reference_bool}
                    helperText={props.errors.process_reference}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <Autocomplete
                id="l_2_process"
                value={props.formCIA.l_2_process}
                options={props.l2processes}
                getOptionLabel={option => option.title}
                getOptionSelected={(option, value) => value.id === option.id}
                onChange={props.onDropDownChange}
                renderInput={params => (
                  <TextField
                    required
                    {...params}
                    label="L2 Process"
                    variant="filled"
                    margin="normal"
                    error={props.errors.l_2_process_bool}
                    helperText={props.errors.l_2_process}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <Autocomplete
                id="l_3_process"
                value={props.formCIA.l_3_process}
                options={props.l3processes}
                getOptionLabel={option => option.title}
                getOptionSelected={(option, value) => value.id === option.id}
                onChange={props.onDropDownChange}
                renderInput={params => <TextField {...params} label="L3 Process" margin="normal" variant="filled" />}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
}

export default General;
