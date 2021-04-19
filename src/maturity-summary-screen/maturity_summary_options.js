import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { fetchUsersByRole, fetchBussinessUnits, fetchKPIs } from '../common/API';
import { makeStyles, TextField, Grid, Paper, Button, Chip, List, ListItem, ListItemText } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
  paper: {
    width: '100%',
    backgroundColor: 'inherit'
  },
  textfieldstyle: {
    width: '20rem',
    marginLeft: theme.spacing(2),
    height: '5rem',
    overflow: 'auto'
  }
}));
const MaturitySummaryOptions = props => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [filterText, setFilterText] = useState('Hide Filter Tab');
  const [businessUnitList, setBusinessUnitList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [kpiList, setKPIList] = useState([]);
  const [users, setUsers] = useState([]);
  const [businessUnits, setBusinessUnits] = useState([]);
  const [KPIs, setKPIs] = useState([]);
  const [filteredDatas, setFilteredDatas] = useState([]);
  const { setFilteredValue } = props;
  let filteredDataCopy = [];

  const handleClick = () => {
    setOpen(!open);
    if (open) {
      setFilterText('Hide Filter Tab');
    } else {
      setFilterText('Show Filter Tab');
    }
  };
  useEffect(() => {
    Promise.all([
      fetchBussinessUnits(Cookies.get('project'), props.onMessage),
      fetchUsersByRole('Capgemini Users', props.onMessage),
      //here/
      fetchKPIs(Cookies.get('project'), props.onMessage)
    ])
      .then(data => {
        setBusinessUnitList(
          data[0]
            ? data[0].map(i => {
                return { businessunit: i.unit };
              })
            : []
        );
        setUserList(
          data[1]
            ? data[1].map(i => {
                if (i.name == null) return { user: '' };
                else return { user: i.name };
              })
            : []
        );
        setKPIList(
          data[2]
            ? data[2].map(i => {
                return { kpi: i.name };
              })
            : []
        );
      })
      .catch(e => {
        props.onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      });
  }, []);
  useEffect(() => {
    const Data = { maturity_BU: businessUnits, maturity_user: users, maturity_KPI: KPIs };
    filteredDataCopy.push(Data);

    setFilteredDatas(
      filteredDataCopy.map(i => {
        return {
          BU: i.maturity_BU.map(j => j.businessunit),
          KPI: i.maturity_KPI.map(k => k.kpi),
          User: i.maturity_user.map(l => l.user)
        };
      })
    );
  }, [businessUnits, users, KPIs]);

  const handleFilteredData = () => {
    if (filteredDatas.length > 0) {
      if (businessUnits.length < 1 && users.length < 1 && KPIs.length < 1) {
        setFilteredValue([]);
      } else {
        setFilteredValue(filteredDatas);
      }
    }
  };
  const userBUDropdowns = () => {
    return (
      <Grid item container direction="row" justify="space-around" spacing={5}>
        <Grid item>
          <Autocomplete
            multiple
            filterSelectedOptions
            id="add-businessUnits"
            options={businessUnitList}
            value={businessUnits}
            limitTags={4}
            getOptionLabel={option => option.businessunit}
            getOptionSelected={(option, value) => option.businessunit === value.businessunit}
            onChange={(event, newValue) => {
              setBusinessUnits(newValue);
            }}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  color="primary"
                  label={option.businessunit}
                  style={{ marginTop: '5px', marginBottom: '5px' }}
                  variant="outlined"
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={params => <TextField className={classes.textfieldstyle} {...params} variant="filled" label="Business Unit" />}
          />
        </Grid>
        <Grid item>
          <Autocomplete
            multiple
            filterSelectedOptions
            id="add-users"
            options={userList}
            value={users}
            limitTags={2}
            getOptionLabel={option => option.user}
            getOptionSelected={(option, value) => option.user === value.user}
            onChange={(event, newValue) => {
              setUsers(newValue);
            }}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  style={{ marginTop: '5px', marginBottom: '5px' }}
                  color="primary"
                  label={option.user}
                  variant="outlined"
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={params => <TextField className={classes.textfieldstyle} {...params} variant="filled" label="Select Users" />}
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <React.Fragment>
      <Paper className={classes.paper} elevation={0}>
        <Grid container>
          <Grid item container justify="flex-end">
            <List>
              <ListItem button onClick={handleClick}>
                <ListItemText primary={filterText} />
              </ListItem>
            </List>
          </Grid>
          {open ? null : (
            <Grid item container direction="row" spacing={6}>
              {props.activeStep > 0 ? (
                <Grid item container direction="row" spacing={6}>
                  <Grid item>{userBUDropdowns()}</Grid>
                  <Grid item>
                    <Button variant="contained" style={{ margin: '0px 15px 40px' }} color="primary" onClick={handleFilteredData}>
                      Search
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <Grid item container direction="row" spacing={5}>
                  <Grid item>{userBUDropdowns()}</Grid>
                  <Grid item>
                    <Autocomplete
                      multiple
                      filterSelectedOptions
                      id="add-kpi"
                      options={kpiList}
                      value={KPIs}
                      limitTags={4}
                      getOptionLabel={option => option.kpi}
                      getOptionSelected={(option, value) => option.kpi === value.kpi}
                      onChange={(event, newValue) => {
                        setKPIs(newValue);
                      }}
                      renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                          <Chip
                            color="primary"
                            style={{ marginTop: '5px', marginBottom: '5px' }}
                            label={option.kpi}
                            variant="outlined"
                            {...getTagProps({ index })}
                          />
                        ))
                      }
                      renderInput={params => <TextField className={classes.textfieldstyle} {...params} variant="filled" label="KPI" />}
                    />
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="primary" onClick={handleFilteredData}>
                      Search
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
      </Paper>
    </React.Fragment>
  );
};

export default MaturitySummaryOptions;
