import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Switch, FormControlLabel, FormControl } from '@material-ui/core';
import { Paper, Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  paper: {
    background: 'none',
    width: '100%',
    maxWidth: '40rem',
    margin: theme.spacing(3, 'auto'),
    padding: theme.spacing(2),
    boxShadow: 'none',
    '& .MuiSwitch-root': {
      marginRight: 'auto'
    }
  }
}));

function ChangeThemes(props) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Paper component="form" className={classes.paper}>
        <FormControl component="fieldset">
          <Grid container spacing={10}>
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  name="spending_our_money_wisely"
                  control={
                    <Switch
                      data-testid="spending_our_money_wisely"
                      checked={props.formCIA.spending_our_money_wisely}
                      onChange={props.onSwitchChange}
                      color="primary"
                    />
                  }
                  label="Spending our money wisely"
                  labelPlacement="top"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  name="insights_decision_making"
                  control={
                    <Switch
                      data-testid="insights_decision_making"
                      checked={props.formCIA.insights_decision_making}
                      onChange={props.onSwitchChange}
                      color="primary"
                    />
                  }
                  label="Insights & Decision Making"
                  labelPlacement="top"
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  name="a_new_way_to_buy"
                  control={
                    <Switch data-testid="a_new_way_to_buy" checked={props.formCIA.a_new_way_to_buy} onChange={props.onSwitchChange} color="primary" />
                  }
                  label="A new way to buy"
                  labelPlacement="top"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  name="other"
                  control={<Switch data-testid="other" checked={props.formCIA.other} onChange={props.onSwitchChange} color="primary" />}
                  label="Other"
                  labelPlacement="top"
                />
              </Grid>
            </Grid>
            <Grid container item xs={12} spacing={2}>
              <Grid item xs={6}>
                <FormControlLabel
                  name="receipting_culture"
                  control={
                    <Switch
                      data-testid="receipting_culture"
                      checked={props.formCIA.receipting_culture}
                      onChange={props.onSwitchChange}
                      color="primary"
                    />
                  }
                  label="Receipting Culture"
                  labelPlacement="top"
                />
              </Grid>
            </Grid>
          </Grid>
        </FormControl>
      </Paper>
    </React.Fragment>
  );
}

export default ChangeThemes;
