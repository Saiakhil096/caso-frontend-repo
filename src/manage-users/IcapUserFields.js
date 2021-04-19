import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Grid, FormControl, TextField } from '@material-ui/core';

function IcapUserFields(props) {
  const classes = props.classes;

  return (
    <React.Fragment>
      <Grid item>
        <Autocomplete
          id="base_location"
          value={props.fields[0]}
          options={props.fieldsList[0].map((item, index) => item)}
          getOptionLabel={option => option.location}
          getOptionSelected={(option, value) => value.id === option.id}
          onChange={(e, newValue) => props.setFields[0](newValue)}
          className={classes.text}
          renderInput={params => <TextField required {...params} label="Base Location" margin="normal" />}
        />
      </Grid>
      <Grid item>
        <Autocomplete
          id="business_unit"
          value={props.fields[1]}
          options={props.fieldsList[1].map((item, index) => item)}
          getOptionLabel={option => option.unit}
          getOptionSelected={(option, value) => value.id === option.id}
          onChange={(e, newValue) => props.setFields[1](newValue)}
          className={classes.text}
          renderInput={params => <TextField required {...params} label="Business Unit" margin="normal" />}
        />
      </Grid>
      <Grid item>
        <Autocomplete
          id="site"
          value={props.fields[2]}
          options={props.fieldsList[2].map((item, index) => item)}
          getOptionLabel={option => option.site_location}
          getOptionSelected={(option, value) => value.id === option.id}
          onChange={(e, newValue) => props.setFields[2](newValue)}
          className={classes.text}
          renderInput={params => <TextField required {...params} label="Site" margin="normal" />}
        />
      </Grid>
      <Grid item>
        <FormControl margin="normal" variant="filled">
          <TextField
            autoComplete="off"
            id="jobprofile "
            name="jobprofile"
            label="Job Profile (Role/Job Title) "
            value={props.fields[3]}
            varient="filled"
            className={classes.text}
            onChange={e => {
              props.setFields[3](e.target.value);
            }}
            inputProps={{ 'data-testid': 'jobprofile' }}
            required
          />
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl margin="normal" variant="filled">
          <TextField
            autoComplete="off"
            id="supervisor"
            name="supervisor"
            label="Supervisor(change agent-reporting field)->Manager"
            value={props.fields[4]}
            varient="filled"
            className={classes.text}
            onChange={e => {
              props.setFields[4](e.target.value);
            }}
            inputProps={{ 'data-testid': 'supervisor' }}
            required
          />
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl margin="normal" variant="filled">
          <TextField
            autoComplete="off"
            id="supervisorEmail"
            name="supervisorEmail"
            label="Supervisor Email"
            type="email"
            value={props.fields[5]}
            varient="filled"
            className={classes.text}
            onChange={e => props.setFields[5](e.target.value)}
            inputProps={{ 'data-testid': 'supervisorEmail' }}
            required
            onMessage={props.onMessage}
          />
        </FormControl>
      </Grid>
    </React.Fragment>
  );
}

export default IcapUserFields;
