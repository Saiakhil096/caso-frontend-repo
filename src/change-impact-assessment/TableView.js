import React, { useState } from 'react';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  TablePagination,
  Typography,
  IconButton,
  Tooltip
} from '@material-ui/core';

import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import { Delete as DeleteIcon, Edit as EditIcon, FileCopy as FileCopyIcon } from '@material-ui/icons';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

const useStyles = makeStyles(theme => ({
  tableWrapper: {
    maxHeight: 500
  },
  tableRow: {
    cursor: 'pointer'
  }
}));

const theme = createMuiTheme({
  typography: {
    body1: {
      fontWeight: 500,
      fontSize: 16
    }
  }
});

function TableView(props) {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0);
  const { url } = useRouteMatch();
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const rows = props.CIAs;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <React.Fragment>
      <TableContainer className={classes.tableWrapper}>
        <Table stickyHeader size="small" aria-label="CIAs table">
          <TableHead>
            <TableRow>
              {props.headCells.map(headCell =>
                headCell.selected ? (
                  <TableCell
                    key={headCell.id}
                    style={{ minWidth: headCell.minWidth }}
                    align={headCell.float}
                    sortDirection={orderBy === headCell.id ? order : false}>
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={event => handleRequestSort(event, headCell.id)}>
                      <ThemeProvider theme={theme}>
                        <Typography>{headCell.label}</Typography>
                      </ThemeProvider>
                    </TableSortLabel>
                  </TableCell>
                ) : null
              )}
              <TableCell align="center" style={{ minWidth: 190 }}>
                <ThemeProvider theme={theme}>
                  <Typography>Actions</Typography>
                </ThemeProvider>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length < 1 ? (
              <TableRow style={{ height: '50px' }} className={classes.tableRow} hover>
                <TableCell colSpan={8} align="center">
                  No result found
                </TableCell>
              </TableRow>
            ) : (
              stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(row => {
                  return (
                    <TableRow key={row.id} className={classes.tableRow} hover>
                      {props.headCells[0].selected ? <TableCell>{row.id}</TableCell> : null}
                      {props.headCells[1].selected ? <TableCell>{row.workshop.name}</TableCell> : null}
                      {props.headCells[2].selected ? <TableCell>{row.process_reference.title}</TableCell> : null}
                      {props.headCells[3].selected ? <TableCell>{row.l_2_process.title}</TableCell> : null}
                      {props.headCells[4].selected ? <TableCell>{row.l_3_process === null ? '' : row.l_3_process.title}</TableCell> : null}
                      {props.headCells[5].selected ? <TableCell>{row.as_is}</TableCell> : null}
                      {props.headCells[6].selected ? <TableCell>{row.to_be}</TableCell> : null}
                      {props.headCells[7].selected ? <TableCell>{row.business_change_impact}</TableCell> : null}
                      {props.headCells[8].selected ? <TableCell>{row.change_impact_weight}</TableCell> : null}

                      {props.headCells[9].selected ? <TableCell>{row.benefit_value}</TableCell> : null}

                      {props.headCells[10].selected ? (
                        <TableCell>{row.user_profiles.map(userProfile => userProfile.profile_name + ';')}</TableCell>
                      ) : null}
                      {props.headCells[11].selected ? <TableCell>{row.number_of_impacted_employees}</TableCell> : null}
                      {props.headCells[12].selected ? <TableCell>{row.business_units.map(businessUnit => businessUnit.unit + ';')}</TableCell> : null}
                      {props.headCells[13].selected ? (
                        <TableCell>{row.departments.length === 0 ? '' : row.departments.map(department => department.title + ';')}</TableCell>
                      ) : null}
                      {props.headCells[14].selected ? (
                        <TableCell>{row.key_locations.length === 0 ? '' : row.key_locations.map(location => location.location + ';')}</TableCell>
                      ) : null}
                      <TableCell align="center">
                        <Tooltip title="Edit" arrow>
                          <IconButton aria-label="edit" color="primary" component={RouterLink} to={`${url}/view/${row.id}`}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Duplicate" arrow>
                          <IconButton
                            aria-label="copy"
                            color="primary"
                            onClick={() => {
                              props.handleRowCopy(row);
                            }}>
                            <FileCopyIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete" arrow>
                          <IconButton aria-label="delete" color="primary" onClick={() => props.handleDialogConfirmation(row.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </React.Fragment>
  );
}

export default TableView;
