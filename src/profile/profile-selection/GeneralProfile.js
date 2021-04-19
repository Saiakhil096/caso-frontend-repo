import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, FormControl, Slider, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { RecentActors as RecentActorsIcon, LocationOn as LocationOnIcon, Commute as CommuteIcon, Wifi as WifiIcon } from '@material-ui/icons';
import { VerySadIcon, SadIcon, OkIcon, HappyIcon, VeryHappyIcon } from '../../common/CustomIcons';
import { red, amber, yellow, lightGreen, green, grey } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  disabled: {
    color: theme.palette.text.disabled
  },
  IconStyles: {
    marginTop: 'auto',
    marginBottom: 'auto',
    width: 70,
    height: 70,
    color: grey[500]
  },
  radioStyles: {
    display: 'inline'
  },
  sliderStyles: {
    marginLeft: 44,
    width: 310,
    color: grey[500]
  }
}));

function GeneralProfile(props) {
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

  const getToken = (index, selected) => {
    switch (index) {
      case 0:
        return (
          <Grid item container>
            <Grid style={{ padding: 5 }}>
              <VerySadIcon selected={selected} selectedColor={red[500]} fontSize="large" />
            </Grid>
            <Grid style={{ padding: 5 }}>
              <SadIcon fontSize="large" />
            </Grid>
            <Grid style={{ padding: 5 }}>
              <OkIcon fontSize="large" />
            </Grid>
            <Grid style={{ padding: 5 }}>
              <HappyIcon fontSize="large" />
            </Grid>
            <Grid style={{ padding: 5 }}>
              <VeryHappyIcon fontSize="large" />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid item container>
            <Grid style={{ padding: 5 }}>
              <VerySadIcon fontSize="large" />
            </Grid>
            <Grid style={{ padding: 5 }}>
              <SadIcon selected={selected} selectedColor={amber[500]} fontSize="large" />
            </Grid>
            <Grid style={{ padding: 5 }}>
              <OkIcon fontSize="large" />
            </Grid>
            <Grid style={{ padding: 5 }}>
              <HappyIcon fontSize="large" />
            </Grid>
            <Grid style={{ padding: 5 }}>
              <VeryHappyIcon fontSize="large" />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid item container>
            <Grid style={{ padding: 5 }}>
              <VerySadIcon fontSize="large" />
            </Grid>
            <Grid style={{ padding: 5 }}>
              <SadIcon fontSize="large" />
            </Grid>
            <Grid style={{ padding: 5 }}>
              <OkIcon selected={selected} selectedColor={yellow[500]} fontSize="large" />
            </Grid>
            <Grid style={{ padding: 5 }}>
              <HappyIcon fontSize="large" />
            </Grid>
            <Grid style={{ padding: 5 }}>
              <VeryHappyIcon fontSize="large" />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid item container>
            <Grid style={{ padding: 5 }}>
              <VerySadIcon fontSize="large" />
            </Grid>
            <Grid style={{ padding: 5 }}>
              <SadIcon fontSize="large" />
            </Grid>
            <Grid style={{ padding: 5 }}>
              <OkIcon fontSize="large" />
            </Grid>
            <Grid style={{ padding: 5 }}>
              <HappyIcon selected={selected} selectedColor={lightGreen[500]} fontSize="large" />
            </Grid>
            <Grid style={{ padding: 5 }}>
              <VeryHappyIcon fontSize="large" />
            </Grid>
          </Grid>
        );
      case 4:
        return (
          <React.Fragment>
            <Grid item container>
              <Grid style={{ padding: 5 }}>
                <VerySadIcon fontSize="large" />
              </Grid>
              <Grid style={{ padding: 5 }}>
                <SadIcon fontSize="large" />
              </Grid>
              <Grid style={{ padding: 5 }}>
                <OkIcon fontSize="large" />
              </Grid>
              <Grid style={{ padding: 5 }}>
                <HappyIcon fontSize="large" />
              </Grid>
              <Grid style={{ padding: 5 }}>
                <VeryHappyIcon selected={selected} selectedColor={green[500]} fontSize="large" />
              </Grid>
            </Grid>
          </React.Fragment>
        );
      default:
        return (
          <React.Fragment>
            <Grid item container>
              <Grid style={{ padding: 5 }}>
                <VerySadIcon fontSize="large" />
              </Grid>
              <Grid style={{ padding: 5 }}>
                <SadIcon fontSize="large" />
              </Grid>
              <Grid style={{ padding: 5 }}>
                <OkIcon fontSize="large" />
              </Grid>
              <Grid style={{ padding: 5 }}>
                <HappyIcon fontSize="large" />
              </Grid>
              <Grid style={{ padding: 5 }}>
                <VeryHappyIcon fontSize="large" />
              </Grid>
            </Grid>
          </React.Fragment>
        );
    }
  };

  return (
    <React.Fragment>
      <Grid container item xs={12} spacing={2}>
        <Grid container item xs={12}>
          <Grid item xs={6}>
            <Typography className={classes.disabled}>Background</Typography>
            <Typography>{props.profileData.background}</Typography>
          </Grid>
          <Grid item xs={6} style={{ paddingLeft: 50 }}>
            <Typography className={classes.disabled}>Primary Skills</Typography>
            <ul style={{ listStyleType: 'square' }}>
              {props.profileData.key_skills.map((keySkill, index) => {
                return <li key={index}>{keySkill.title}</li>;
              })}
            </ul>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={6}>
            <Typography className={classes.disabled}>System Access</Typography>
            <ul style={{ listStyleType: 'square' }}>
              {props.profileData.system_accesses.map((systemAccess, index) => {
                return <li key={index}>{systemAccess.title}</li>;
              })}
            </ul>
          </Grid>
          <Grid item xs={6} style={{ paddingLeft: 50 }}>
            <Typography className={classes.disabled}>Key Locations</Typography>
            <ul style={{ listStyleType: 'square' }}>
              {props.profileData.key_locations.map((keyLocation, index) => {
                return <li key={index}>{keyLocation.location}</li>;
              })}
            </ul>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={6}>
            <Typography className={classes.disabled}>Work Environment - Key Characteristics</Typography>
            <Grid item container xs={12}>
              <Grid item container xs={5}>
                <FormControl fullWidth margin="normal" variant="filled">
                  <RadioGroup aria-label="workEnvironment" id="radio" name="work_environment" value={props.profileData.work_environment}>
                    <FormControlLabel value="Home_Based" disabled control={<Radio color="default" />} label="Home Based" />
                    <FormControlLabel value="Work_Based" disabled control={<Radio color="default" />} label="Office Based" />
                    <FormControlLabel value="Mobile_Working" disabled control={<Radio color="default" />} label="Mobile Working" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item container xs={7}>
                <CommuteIcon className={classes.IconStyles} />
                <LocationOnIcon className={classes.IconStyles} />
              </Grid>
            </Grid>
          </Grid>
          <Grid container item xs={6} spacing={2} className={classes.root} style={{ paddingLeft: 50 }}>
            <Grid item container xs={12} spacing={2}>
              <Grid item container xs={12}>
                <Typography className={classes.disabled}>Overall Perception Rating</Typography>
              </Grid>
              <Grid item container xs={12}>
                {getToken(props.overallPerceptionRating, true)}
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Grid item container xs={12}>
                <Typography className={classes.disabled}>Access to Corporate Wifi</Typography>
              </Grid>
              <Grid item container xs={12}>
                <Grid item container xs={3}>
                  <WifiIcon className={classes.IconStyles} />
                </Grid>
                <Grid item container xs={9}>
                  <FormControl fullWidth margin="normal" variant="filled">
                    <RadioGroup
                      className={classes.radioStyles}
                      aria-label="access_to_system_wifi"
                      name="access_to_corporate_wifi"
                      value={props.profileData.access_to_corporate_wifi}>
                      <FormControlLabel value="Yes" disabled control={<Radio color="default" />} label="Yes" />
                      <FormControlLabel value="No" disabled control={<Radio color="default" />} label="No" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <Grid item container xs={6}>
            <Typography className={classes.disabled}>Digital Confidence</Typography>

            <FormControl fullWidth margin="normal" variant="filled">
              <Slider
                className={classes.sliderStyles}
                getAriaValueText={sliderValueText}
                aria-label="pretto slider"
                step={10}
                marks={marks}
                valueLabelDisplay="auto"
                value={props.profileData.licence_to_operate_confidence_level}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6} style={{ paddingLeft: 50 }}>
            <Typography className={classes.disabled}>License to Operate</Typography>
            <Grid item container xs={12}>
              <Grid item container xs={3}>
                <RecentActorsIcon className={classes.IconStyles} />
              </Grid>
              <Grid item container xs={9}>
                <FormControl fullWidth margin="normal" variant="filled">
                  <RadioGroup
                    className={classes.radioStyles}
                    aria-label="access_to_system_wifi"
                    name="licence_to_operate"
                    value={props.profileData.licence_to_operate}>
                    <FormControlLabel value="Yes" disabled control={<Radio color="default" />} label="Yes" />
                    <FormControlLabel value="No" disabled control={<Radio color="default" />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={6}>
            <Grid item container spacing={2} xs={12}>
              <Grid item xs={12}>
                <Typography className={classes.disabled}>Reporting Lines</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>Reports To: {props.profileData.accountableTo}</Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6} style={{ paddingLeft: 50 }}>
            <Typography className={classes.disabled}>Key Motivations</Typography>
            <ul style={{ listStyleType: 'square' }}>
              {props.profileData.key_motivations.map((key_motivation, index) => {
                return <li key={index}>{key_motivation.title}</li>;
              })}
            </ul>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default GeneralProfile;
