import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import {
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  Toolbar,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
  IconButton,
  DialogContent,
  DialogContentText
} from '@material-ui/core';
import { Search as SearchIcon, ViewColumn as ViewColumnIcon, Close as CloseIcon } from '@material-ui/icons';
import { fetchCIAs, deleteCIA, createCIA, deleteKeyActivity } from '../common/API';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import TableView from './TableView';

const useStyles = makeStyles(theme => ({
  textField: {
    width: '40ch'
  },
  title: {
    flex: '1 1 100%'
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3)
  }
}));

function ViewCIAs(props) {
  const classes = useStyles();
  const { url } = useRouteMatch();
  const [CIAs, setCIAs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const { onMessage } = props;
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState();

  const [headCells, setHeadCells] = React.useState([
    { id: 'id', float: 'left', checkBoxName: '_id', selected: true, label: 'Id', minWidth: 50 },
    { id: 'workshop_name', float: 'left', checkBoxName: 'workshopName', selected: true, label: 'Workshop Name', minWidth: 150 },
    { id: 'process_reference.title', float: 'left', checkBoxName: 'processReference', selected: false, label: 'Process Reference', minWidth: 210 },
    { id: 'l_2_process.title', float: 'left', checkBoxName: 'l2Process', selected: true, label: 'L2 Process', minWidth: 150 },
    { id: 'l_3_process.title', float: 'left', checkBoxName: 'l3Process', selected: false, label: 'L3 Process', minWidth: 150 },
    { id: 'as_is', float: 'left', checkBoxName: 'asIS', selected: true, label: 'As Is', minWidth: 230 },
    { id: 'to_be', float: 'left', checkBoxName: 'toBe', selected: true, label: 'To Be', minWidth: 230 },
    {
      id: 'business_change_impact',
      float: 'left',
      checkBoxName: 'businessChangeImpact',
      selected: true,
      label: 'Business Change Impact',
      minWidth: 250
    },
    { id: 'change_impact_weight', float: 'left', checkBoxName: 'changeImpactWeight', selected: false, label: 'Change Impact Weight', minWidth: 150 },

    { id: 'benefit_value', float: 'left', checkBoxName: 'benefitValue', selected: false, label: 'Benefit Value', minWidth: 150 },
    { id: 'user_profiles', float: 'left', checkBoxName: 'userProfiles', selected: false, label: 'Affected Personas', minWidth: 150 },
    {
      id: 'number_of_impacted_employees',
      float: 'left',
      checkBoxName: 'impactedEmployees',
      selected: false,
      label: 'Impacted Employees',
      minWidth: 150
    },
    { id: 'business_units', float: 'left', checkBoxName: 'businessUnits', selected: false, label: 'Business Units', minWidth: 150 },
    { id: 'departments', float: 'left', checkBoxName: 'departments', selected: false, label: 'Departments', minWidth: 150 },
    { id: 'key_locations', float: 'left', checkBoxName: 'keyLocations', selected: false, label: 'Key Locations', minWidth: 150 }
  ]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectAllOption, setSelectAllOption] = useState(false);

  const [users, setUsers] = useState([]);
  const [data, setData] = useState({});
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchCIAs(props.onMessage).then(data => {
      data.map(user => {
        user.checked = false;
      });
      setUsers(data);
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const {
        Parser,
        transforms: { unwind }
      } = require('json2csv');
      let fields, fileName;

      fields = [
        {
          label: 'ID',
          value: 'id'
        },
        {
          label: 'workshop',
          value: 'workshop.name'
        },
        {
          label: 'L2 process',
          value: 'l_2_process.title'
        },
        {
          label: 'L3 process',
          value: 'l_3_process.title'
        },
        {
          label: 'As is',
          value: 'as_is'
        },
        {
          label: 'To Be',
          value: 'to_be'
        },
        {
          label: 'Business Change Impact',
          value: 'business_change_impact'
        },
        { label: 'Change Impact Weight', value: 'change_impact_weight' },
        {
          label: 'Benefit Value',
          value: 'benefit_value'
        },
        { label: 'Affected Personas', value: 'user_profiles' },

        {
          label: 'Number of Impacted Employees',
          value: 'number_of_impacted_employees'
        },
        {
          label: 'Change impact weight',
          value: 'change_impact_weight'
        },
        {
          label: 'Business Units',
          value: 'business_units'
        },
        {
          label: 'Department',
          value: 'departments'
        },
        {
          label: 'Key Location',
          value: 'key_locations'
        }
      ];
      fileName = 'caso-ambition-data';

      const transforms = [unwind({ paths: ['pain_points'] })];
      const opts = { fields, transforms };
      try {
        const parser = new Parser(opts);
        const csv = parser.parse(data);
        const pom = document.createElement('a');
        const csvContent = csv;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        pom.href = url;
        pom.setAttribute('download', 'CIAReport.csv');
        pom.click();
      } catch (err) {
        console.error(err);
      }
    }
  }, [data]);

  useEffect(() => {
    fetchCIAs(onMessage, true).then(data => {
      setCIAs(data);
    });
  }, []);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const CIAsCopy = JSON.parse(JSON.stringify(CIAs));

      const filteredCIAs = CIAsCopy.filter(
        CIA =>
          CIA.workshop_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          CIA.l_2_process.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          CIA.as_is.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          CIA.to_be.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          CIA.business_change_impact.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
      );
      setFilteredItems(filteredCIAs);
    } else {
      setFilteredItems(CIAs);
    }
  }, [searchTerm, CIAs]);

  useEffect(() => {
    if (filteredItems.length > 0) {
      if (props.ciaFilter != null) {
        const CIAsCopy = JSON.parse(JSON.stringify(CIAs));
        const filteredCIAs = ciaFilterReport(props.ciaFilter, CIAsCopy);
        setFilteredItems(filteredCIAs);
        props.setCiaFilter(null);
      }
    }
  }, [filteredItems]);

  const ciaFilterReport = (filterbject, data) => {
    console.log(filterbject);
    var dataCopy = JSON.parse(JSON.stringify(data));
    if (filterbject.org_design) {
      if (filterbject.org_design === true) {
        dataCopy = dataCopy.filter(item => {
          if (item.org_design === true) {
            return item;
          }
        });
      }
    }
    if (filterbject.culture) {
      if (filterbject.culture === true) {
        dataCopy = dataCopy.filter(item => {
          if (item.culture === true) {
            return item;
          }
        });
      }
    }
    if (filterbject.roles_and_responsibility) {
      if (filterbject.roles_and_responsibility === true) {
        dataCopy = dataCopy.filter(item => {
          if (item.roles_and_responsibility === true) {
            return item;
          }
        });
      }
    }
    if (filterbject.communication_and_engagement) {
      if (filterbject.communication_and_engagement === true) {
        dataCopy = dataCopy.filter(item => {
          if (item.communication_and_engagement === true) {
            return item;
          }
        });
      }
    }
    if (filterbject.policy) {
      if (filterbject.policy === true) {
        dataCopy = dataCopy.filter(item => {
          if (item.policy === true) {
            return item;
          }
        });
      }
    }
    if (filterbject.training) {
      if (filterbject.training === true) {
        dataCopy = dataCopy.filter(item => {
          if (item.training === true) {
            return item;
          }
        });
      }
    }
    if (filterbject.process) {
      if (filterbject.process === true) {
        dataCopy = dataCopy.filter(item => {
          if (item.process === true) {
            return item;
          }
        });
      }
    }
    if (filterbject.performance_management) {
      if (filterbject.performance_management === true) {
        dataCopy = dataCopy.filter(item => {
          if (item.performance_management === true) {
            return item;
          }
        });
      }
    }
    if (filterbject.change_impact_weight) {
      dataCopy = dataCopy.filter(item => {
        if (item.change_impact_weight === filterbject.change_impact_weight) {
          return item;
        }
      });
    }
    if (filterbject.key_location) {
      var arr = [];
      dataCopy.map(item => {
        item.key_locations.map((loc, index) => {
          if (filterbject.key_location === loc.location) {
            arr.push(item);
          }
        });
      });
      dataCopy = arr;
    }
    if (filterbject.user_profile) {
      var arr = [];
      var profileName = filterbject.user_profile.split('(');
      dataCopy.map(item => {
        item.user_profiles.map((profile, index) => {
          if (profileName[0] === profile.profile_name) {
            arr.push(item);
          }
        });
      });
      dataCopy = arr;
    }
    if (filterbject.l_2_process) {
      dataCopy = dataCopy.filter(item => {
        if (item.l_2_process.title === filterbject.l_2_process) {
          return item;
        }
      });
    }
    if (filterbject.l_3_process) {
      dataCopy = dataCopy.filter(item => {
        if (item.l_3_process.title === filterbject.l_3_process) {
          return item;
        }
      });
    }
    if (filterbject.benefit_value) {
      var arr = [];
      var benefitValue = filterbject.benefit_value.split(' (');
      dataCopy = dataCopy.filter(item => {
        if (item.benefit_value === benefitValue[0]) {
          return item;
        }
      });
    }
    if (filterbject.business_unit) {
      var arr = [];
      dataCopy.map(item => {
        item.business_units.map((bu, index) => {
          if (filterbject.business_unit === bu.unit) {
            arr.push(item);
          }
        });
      });
      dataCopy = arr;
    }
    if (filterbject.spending_our_money_wisely) {
      if (filterbject.spending_our_money_wisely === true) {
        dataCopy = dataCopy.filter(item => {
          if (item.spending_our_money_wisely === true) {
            return item;
          }
        });
      }
    }
    if (filterbject.insights_decision_making) {
      if (filterbject.insights_decision_making === true) {
        dataCopy = dataCopy.filter(item => {
          if (item.insights_decision_making === true) {
            return item;
          }
        });
      }
    }
    if (filterbject.a_new_way_to_buy) {
      if (filterbject.a_new_way_to_buy === true) {
        dataCopy = dataCopy.filter(item => {
          if (item.a_new_way_to_buy === true) {
            return item;
          }
        });
      }
    }
    if (filterbject.receipting_culture) {
      if (filterbject.receipting_culture === true) {
        dataCopy = dataCopy.filter(item => {
          if (item.receipting_culture === true) {
            return item;
          }
        });
      }
    }
    if (filterbject.other) {
      if (filterbject.other === true) {
        dataCopy = dataCopy.filter(item => {
          if (item.other === true) {
            return item;
          }
        });
      }
    }

    return dataCopy;
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleDialogConfirmation = id => {
    setDeleteId(id);
    handleDialogOpen();
  };
  const handleRowDelete = () => {
    deleteCIA(deleteId, onMessage).then(data => {
      Promise.all(
        data.key_activities.map(key => {
          deleteKeyActivity(key.id, onMessage).then(() => {});
        })
      );

      const filteredCIAs = CIAs.filter(CIA => {
        return CIA.id !== deleteId;
      });
      setCIAs(filteredCIAs);
      onMessage('Row Deleted', 'success');
    });
    handleDialogClose();
  };
  const handleRowCopy = data => {
    createCIA(data, onMessage).then(() => {
      fetchCIAs(onMessage, true).then(responseData => setCIAs(responseData));
      onMessage('Duplicate Row Created', 'success');
    });
  };

  const handleFilterMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterMenuClose = () => {
    setAnchorEl(null);
  };

  const selectAllHandler = e => {
    setSelectAllOption(e.target.checked);
    if (e.target.checked) {
      for (let index = 0; index < headCells.length; index++) {
        headCells[index].selected = e.target.checked;
        setHeadCells([...headCells]);
      }
    } else {
      for (let index = 0; index < headCells.length; index++) {
        if (
          headCells[index].id !== 'id' &&
          headCells[index].id !== 'workshop_name' &&
          headCells[index].id !== 'l_2_process.title' &&
          headCells[index].id !== 'as_is' &&
          headCells[index].id !== 'to_be' &&
          headCells[index].id !== 'business_change_impact'
        ) {
          headCells[index].selected = e.target.checked;
          setHeadCells([...headCells]);
        }
      }
    }
  };

  const handleCheckBoxChange = event => {
    for (let index = 0; index < headCells.length; index++) {
      if (headCells[index].checkBoxName === event.target.name) {
        headCells[index].selected = event.target.checked;
        setHeadCells([...headCells]);
        break;
      }
    }
  };
  const handleExport = () => {
    // seperate activities & user ids
    let oActivities = [];
    let oUserIds = [];
    let counter = 0;
    users.map(user => {
      if (user.checked == false) {
        counter++;
      }
    });

    fetchCIAs(oUserIds, props.onMessage).then(data => {
      data.map(CIA => {
        let bus = '';
        let depts = '';
        let keyLocs = '';
        let users = '';
        CIA.business_units.map(bu => {
          bus += bu.unit + ';';
        });
        CIA.departments.map(dept => {
          depts += dept.title + ';';
        });
        CIA.key_locations.map(keyLoc => {
          keyLocs += keyLoc.location + ';';
        });
        CIA.user_profiles.map(user => {
          users += user.profile_name + ';';
        });

        CIA.business_units = bus;
        CIA.departments = depts;
        CIA.key_locations = keyLocs;
        CIA.user_profiles = users;
      });

      setData(data);
    });
  };

  return (
    <React.Fragment>
      <Grid container>
        <Grid item container justify="space-between" alignItems="baseline" style={{ marginTop: '1cm', paddingLeft: '20px', paddingRight: '20px' }}>
          <Grid item>
            <Button variant="contained" color="primary" justify="flex-start" onClick={handleExport}>
              Export Data
            </Button>
          </Grid>
          <Grid item>
            <Button data-testid="create-new" variant="contained" color="primary" component={RouterLink} to={`${url}/create`}>
              Create New
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Toolbar>
              <Typography className={classes.title} variant="h6" id="tableTitle" component="h2">
                Change Impact Assessments
              </Typography>
              <TextField
                autoFocus
                value={searchTerm}
                className={classes.textField}
                onChange={e => {
                  setSearchTerm(e.target.value);
                }}
                placeholder="Search..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="primary" />
                    </InputAdornment>
                  )
                }}
              />

              <Tooltip title="View Columns" arrow>
                <IconButton aria-controls="filter-column-menu" aria-haspopup="true" color="primary" onClick={handleFilterMenuOpen}>
                  <ViewColumnIcon />
                </IconButton>
              </Tooltip>
              <Menu id="filter-column-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleFilterMenuClose}>
                <MenuItem>
                  <Grid>
                    <Typography>Show Columns</Typography>
                  </Grid>

                  <Grid container justify="flex-end">
                    <IconButton aria-label="search" onClick={handleFilterMenuClose} color="primary">
                      <CloseIcon />
                    </IconButton>
                  </Grid>
                </MenuItem>
                <MenuItem>
                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox name="selectAll" checked={selectAllOption} onChange={selectAllHandler} color="primary" />}
                      label="Select All"
                    />
                  </FormGroup>
                </MenuItem>
                {headCells.map(headCell => {
                  return (
                    <MenuItem key={headCell.id}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox name={headCell.checkBoxName} checked={headCell.selected} onChange={handleCheckBoxChange} color="primary" />
                          }
                          label={headCell.label}
                        />
                      </FormGroup>
                    </MenuItem>
                  );
                })}
              </Menu>
            </Toolbar>
            <Paper className={classes.paper}>
              <TableView
                CIAs={filteredItems}
                headCells={headCells}
                handleRowCopy={handleRowCopy}
                handleDialogConfirmation={handleDialogConfirmation}
              />
            </Paper>
          </Paper>
        </Grid>
        <Dialog open={open} onClose={handleDialogClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this change impact assessment? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              No
            </Button>
            <Button onClick={() => handleRowDelete()} color="primary" autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </React.Fragment>
  );
}

export default ViewCIAs;
