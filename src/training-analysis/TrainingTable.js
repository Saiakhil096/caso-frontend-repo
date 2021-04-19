import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Toolbar,
  Grid,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  InputAdornment,
  TextField,
  Backdrop,
  CircularProgress
} from '@material-ui/core';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { Search } from '@material-ui/icons';
import { fetchUserTrainings, fetchUserProfilesPerProject } from '../common/API';

const useStyles = makeStyles(theme => ({
  filterStyle: {
    marginTop: theme.spacing(1)
  },
  tableRow: {
    width: '200px',
    cursor: 'pointer'
  },
  tableHeading: {
    fontWeight: 'bold'
  },
  tableWrapper: {
    padding: theme.spacing(2),
    minWidth: '750px'
  },
  paper: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3)
  },
  paperContainer: {
    alignSelf: 'center'
  }
}));

const tableHeadings = [
  { id: 'persona_job_role', numeric: false, disablePadding: false, label: 'Persona Job role' },
  { id: 'persona_name', numeric: false, disablePadding: false, label: 'Persona Name' },
  { id: 'assigned_courses', numeric: true, disablePadding: false, label: 'Assigned Courses' }
];

function TrainingTable(props) {
  const classes = useStyles();
  const { onMessage } = props;
  const [trainingTableData, setTrainingTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTableData, setFilteredTableData] = useState(trainingTableData);
  const [loading, setLoading] = useState(true);
  const { url } = useRouteMatch();

  useEffect(() => {
    Promise.all([fetchUserTrainings(onMessage), fetchUserProfilesPerProject(onMessage, true)]).then(([userTrainingDataJson, userProfileDataJson]) => {
      const table = [];
      userProfileDataJson.forEach(user => {
        const tableRow = [];
        tableRow.push(user.id);
        tableRow.push(user.persona_job_role.id);
        tableRow.push(user.persona_job_role.job_role);
        tableRow.push(user.profile_name);
        userTrainingDataJson.forEach(userTraining => {
          return userTraining.user_profile.id == user.id ? tableRow.push(userTraining.trainings.length) : null;
        });
        if (tableRow[4] == null) {
          tableRow[4] = 0;
        }
        table.push(tableRow);
        setTrainingTableData(table);
      });

      if (searchTerm.trim().length > 0) {
        const filteredTableData = table.filter(
          tableRow =>
            tableRow[2].toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 || tableRow[3].toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
        );
        setFilteredTableData(filteredTableData);
      } else {
        setFilteredTableData(table);
      }
      setLoading(false);
    });
  }, [searchTerm]);

  const SearchBar = () => {
    return (
      <Toolbar className={classes.filterStyle}>
        <Grid container justify="flex-end">
          <TextField
            autoFocus
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
            }}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              )
            }}
          />
        </Grid>
      </Toolbar>
    );
  };
  if (loading) {
    return (
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else {
    return (
      <React.Fragment>
        <Grid container direction="column">
          <Grid item className={classes.paperContainer}>
            <SearchBar />
            <Paper className={classes.paper}>
              <TableContainer className={classes.tableWrapper}>
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      {tableHeadings.map(columnHeading => (
                        <TableCell className={classes.tableHeading} key={columnHeading.id}>
                          {columnHeading.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTableData.length < 1 ? (
                      <TableRow style={{ height: '50px' }} className={classes.tableRow} hover>
                        <TableCell colSpan={6} align="center">
                          No result found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTableData.map((row, index) => {
                        return (
                          <TableRow
                            key={index}
                            className={classes.tableRow}
                            hover
                            component={RouterLink}
                            to={`${url}/${row[0]}/assign-training/${row[1]}`}>
                            <TableCell align="left">{row[2]}</TableCell>
                            <TableCell>{row[3]}</TableCell>
                            <TableCell align="center">{row[4]}</TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default TrainingTable;
