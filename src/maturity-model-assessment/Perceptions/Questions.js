import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons';
import { red, amber, yellow, lightGreen, green, grey } from '@material-ui/core/colors';
import { Grid, Typography, Button, Radio, IconButton, List, ListItem, TextField } from '@material-ui/core';
import { VerySadIcon, SadIcon, OkIcon, HappyIcon, VeryHappyIcon } from '../../common/CustomIcons';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';

const filter = createFilterOptions();

const useStyles = makeStyles(theme => ({
  list: {
    maxHeight: 190,
    overflow: 'auto'
  },
  heading: {
    color: grey[50]
  },
  subheading: {
    color: grey[50]
  },
  input: {
    color: grey[200]
  },
  button: {
    backgroundColor: 'rgba(224, 224, 224, 0.65)'
  },
  fixedPosition: {
    position: 'sticky',
    top: theme.spacing(2)
  },
  kpi: {
    margin: theme.spacing(0, 1),
    color: grey[200]
  }
}));

function Questions(props) {
  const classes = useStyles();

  const CustomRadio = withStyles(({ palette, spacing }) => ({
    root: {
      color: grey[500]
    }
  }))(props => <Radio color="default" {...props} />);

  const handleNext = () => {
    const regex = new RegExp(/(.*[a-z]){2}/i);

    if (props.rating === null) {
      props.onMessage('You must provide a perception rating to proceed', 'warning');
      return;
    } else if (props.pain_points.filter(o => o.pain_point_text).length === 0) {
      props.onMessage('You must include at least one reason to support your rating', 'warning');
      return;
    } else if (props.pain_points.filter(o => !regex.test(o.pain_point_text)).length > 0) {
      props.onMessage('You must enter at least 2 characters per reason', 'warning');
      return;
    } else {
      props.onNextProcess();
    }
  };

  const handleRatingChange = event => {
    const selectedIndex = parseInt(event.target.value);
    const ratingChanged = props.onRatingChange(selectedIndex, props.rating);
    if (!ratingChanged) {
      event.preventDefault();
    }
  };

  const ratingIcons = () => {
    let items = [];
    const checkedIconColor = id => {
      if (id === 0) {
        return <VerySadIcon selected={true} selectedColor={red[500]} fontSize="large" />;
      } else if (id === 1) {
        return <SadIcon selected={true} selectedColor={amber[500]} fontSize="large" />;
      } else if (id === 2) {
        return <OkIcon selected={true} selectedColor={yellow[500]} fontSize="large" />;
      } else if (id === 3) {
        return <HappyIcon selected={true} selectedColor={lightGreen[500]} fontSize="large" />;
      } else if (id === 4) {
        return <VeryHappyIcon selected={true} selectedColor={green[500]} fontSize="large" />;
      }
    };
    const IconColor = id => {
      if (id === 0) {
        return <VerySadIcon fontSize="large" />;
      } else if (id === 1) {
        return <SadIcon fontSize="large" />;
      } else if (id === 2) {
        return <OkIcon fontSize="large" />;
      } else if (id === 3) {
        return <HappyIcon fontSize="large" />;
      } else if (id === 4) {
        return <VeryHappyIcon fontSize="large" />;
      }
    };

    for (let id = 0; id <= 4; id++) {
      items.push(
        <CustomRadio
          color="primary"
          name="rating"
          value={id}
          checked={props.rating === id}
          onChange={handleRatingChange}
          icon={IconColor(id)}
          checkedIcon={checkedIconColor(id)}
        />
      );
    }
    return <Grid item>{items}</Grid>;
  };

  return (
    <Grid container direction="column" spacing={2} className={classes.fixedPosition}>
      <Grid item>
        <Typography className={classes.subheading}>
          {props.step} of {props.totalSteps}
        </Typography>
        <Typography variant="h5" className={classes.heading}>
          {props.title}
        </Typography>
      </Grid>
      <Grid item container>
        {ratingIcons()}
      </Grid>
      <Grid item container justify="space-between">
        <Grid item>
          <Typography variant="h5" className={classes.subheading}>
            Why is that?
          </Typography>
        </Grid>
        <Grid item>
          <Button style={{ color: grey[200] }} endIcon={<AddIcon style={{ color: grey[200] }} />} onClick={props.onPainpointAdd}>
            Add New
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        <List disablePadding={true} dense={true} className={classes.list}>
          {props.pain_points.map((item, index) => (
            <ListItem key={index} disableGutters={true}>
              <TextField
                label={<span style={{ color: 'white' }}>Reason</span>}
                multiline
                autoFocus={true}
                fullWidth={true}
                variant="filled"
                value={item.pain_point_text}
                color="secondary"
                type="text"
                inputProps={{ 'aria-label': 'description', className: classes.input }}
                onChange={e => props.onPainpointChange(e, index)}
              />
              <Autocomplete
                className={classes.kpi}
                classes={{ inputRoot: classes.input }}
                value={item.kpi}
                onChange={(event, newValue) => props.onKPIChange(event, newValue, index)}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  // Suggest the creation of a new value
                  if (params.inputValue !== '') {
                    filtered.push({
                      inputValue: params.inputValue,
                      name: `Add new KPI "${params.inputValue}"`
                    });
                  }
                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                options={props.kpis}
                getOptionLabel={option => {
                  // Value selected with enter, right from the input
                  if (typeof option === 'string') {
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    return option.inputValue;
                  }
                  // Regular option
                  return option.name;
                }}
                renderOption={option => option.name}
                style={{ width: 300 }}
                freeSolo
                renderInput={params => (
                  <TextField {...params} label={<span style={{ color: 'white' }}>KPI</span>} color="secondary" variant="filled" />
                )}
              />
              <IconButton style={{ color: grey[200] }} aria-label="delete" onClick={e => props.onPainpointDelete(e, index)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item container justify="space-between" alignItems="baseline">
        <Grid item>
          {props.step > 1 && (
            <Button variant="contained" className={classes.button} style={{ color: grey[50] }} onClick={props.onPreviousProcess}>
              Back
            </Button>
          )}
        </Grid>
        <Grid item>
          <Button variant="contained" className={classes.button} style={{ color: grey[50] }} onClick={handleNext}>
            {props.step === props.totalSteps ? 'Complete' : 'Next'}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Questions;
