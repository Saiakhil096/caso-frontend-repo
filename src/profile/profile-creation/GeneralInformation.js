import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  FormControl,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  FormHelperText,
  Slider,
  Paper,
  Typography,
  Grid
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  paper: {
    background: 'none',
    width: '100%',
    maxWidth: '40rem',
    margin: theme.spacing(1, 'auto'),
    padding: theme.spacing(2),
    boxShadow: 'none'
  },
  textField: {
    width: '60ch'
  }
}));

function GeneralInformation(props) {
  const classes = useStyles();

  const marks = [
    {
      value: 0,
      label: 'Not Confident'
    },
    {
      value: 100,
      label: 'Confident'
    }
  ];

  function sliderValueText(value) {
    return `${value}%`;
  }

  return (
    <React.Fragment>
      <Paper component="form" className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <TextField
                required
                id="background"
                label="Background"
                multiline
                variant="filled"
                rows={5}
                value={props.profile.background}
                onChange={props.onTextChange}
                error={props.errors.background_bool}
                helperText={props.errors.background}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <Autocomplete
                multiple
                id="key_skills"
                value={props.profile.key_skills}
                options={props.keySkillOptions}
                getOptionLabel={option => option.title}
                getOptionSelected={(option, value) => value.id === option.id}
                onChange={props.onMultiSelect}
                renderInput={params => (
                  <TextField
                    required
                    {...params}
                    label="Key Skills"
                    variant="filled"
                    margin="normal"
                    error={props.errors.key_skills_bool}
                    helperText={props.errors.key_skills}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <Autocomplete
                multiple
                id="system_accesses"
                value={props.profile.system_accesses}
                options={props.systemAccessOptions}
                getOptionLabel={option => option.title}
                getOptionSelected={(option, value) => value.id === option.id}
                onChange={props.onMultiSelect}
                renderInput={params => (
                  <TextField
                    required
                    {...params}
                    label="System Access"
                    variant="filled"
                    margin="normal"
                    error={props.errors.system_accesses_bool}
                    helperText={props.errors.system_accesses}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <Autocomplete
                multiple
                id="key_locations"
                value={props.profile.key_locations}
                options={props.keyLocationOptions}
                getOptionLabel={option => option.location}
                getOptionSelected={(option, value) => value.id === option.id}
                onChange={props.onMultiSelect}
                renderInput={params => (
                  <TextField
                    required
                    {...params}
                    label="Key Locations"
                    variant="filled"
                    margin="normal"
                    error={props.errors.key_locations_bool}
                    helperText={props.errors.key_locations}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <Autocomplete
                multiple
                id="key_motivations"
                value={props.profile.key_motivations}
                options={props.keyMotivationOptions}
                getOptionLabel={option => option.title}
                getOptionSelected={(option, value) => value.id === option.id}
                onChange={props.onMultiSelect}
                renderInput={params => (
                  <TextField
                    required
                    {...params}
                    label="Key Motivations"
                    variant="filled"
                    margin="normal"
                    error={props.errors.key_motivations_bool}
                    helperText={props.errors.key_motivations}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography gutterBottom>Reporting Lines</Typography>
            <FormControl fullWidth margin="normal" variant="filled">
              <TextField
                id="accountableTo"
                label="Accountable To"
                multiline
                variant="filled"
                value={props.profile.accountableTo}
                onChange={props.onTextChange}
              />
            </FormControl>

            <FormControl fullWidth margin="normal" variant="filled">
              <Autocomplete
                multiple
                id="business_units"
                value={props.profile.business_units}
                options={props.businessUnitOptions}
                getOptionLabel={option => option.unit}
                getOptionSelected={(option, value) => value.id === option.id}
                onChange={props.onMultiSelect}
                renderInput={params => (
                  <TextField
                    required
                    {...params}
                    label="Business Units"
                    variant="filled"
                    margin="normal"
                    error={props.errors.business_units_bool}
                    helperText={props.errors.business_units}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl error={props.errors.work_environment_bool} fullWidth margin="normal" variant="filled">
              <FormLabel component="legend">Work Environment *</FormLabel>
              <RadioGroup aria-label="workEnvironment" name="work_environment" value={props.profile.work_environment} onChange={props.onRadioChange}>
                <FormControlLabel value="Home_Based" control={<Radio color="default" />} label="Home Based" />
                <FormControlLabel value="Work_Based" control={<Radio color="default" />} label="Office Based" />
                <FormControlLabel value="Mobile_Working" control={<Radio color="default" />} label="Mobile Working" />
              </RadioGroup>
              <FormHelperText>{props.errors.work_environment}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl error={props.errors.access_to_corporate_wifi_bool} fullWidth margin="normal" variant="filled">
              <FormLabel component="legend">Access to Corporate Wifi *</FormLabel>
              <RadioGroup
                aria-label="access_to_system_wifi"
                name="access_to_corporate_wifi"
                onChange={props.onRadioChange}
                value={props.profile.access_to_corporate_wifi}>
                <FormControlLabel value="Yes" control={<Radio color="default" />} label="Yes" />
                <FormControlLabel value="No" control={<Radio color="default" />} label="No" />
              </RadioGroup>
              <FormHelperText>{props.errors.access_to_corporate_wifi}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl error={props.errors.licence_to_operate_bool} fullWidth margin="normal" variant="filled">
              <FormLabel component="legend">Licence To Operate *</FormLabel>
              <RadioGroup
                aria-label="access_to_system_wifi"
                name="licence_to_operate"
                onChange={props.onRadioChange}
                value={props.profile.licence_to_operate}>
                <FormControlLabel value="Yes" control={<Radio color="default" />} label="Yes" />
                <FormControlLabel value="No" control={<Radio color="default" />} label="No" />
              </RadioGroup>
              <FormHelperText>{props.errors.licence_to_operate}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <Typography gutterBottom>License To Operate - Confidence Level</Typography>
              <Slider
                getAriaValueText={sliderValueText}
                aria-label="pretto slider"
                step={10}
                marks={marks}
                valueLabelDisplay="auto"
                onChangeCommitted={props.onSliderChange}
                value={props.profile.licence_to_operate_confidence_level}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
}

export default GeneralInformation;
