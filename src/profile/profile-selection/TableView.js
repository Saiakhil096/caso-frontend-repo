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
    maxHeight: 500,
    padding: theme.spacing(2)
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

  const rows = props.data;

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
        <Table size="small" aria-label="Table">
          <TableHead>
            <TableRow>
              {props.headCells.map(headCell => (
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
              ))}
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
                  return props.viewType === 'CIAs' ? (
                    <TableRow key={row.id} className={classes.tableRow} hover>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.workshop.name}</TableCell>
                      <TableCell>{row.l_2_process.title}</TableCell>
                      <TableCell>{row.l_3_process === null ? '' : row.l_3_process.title}</TableCell>
                      <TableCell>{row.as_is}</TableCell>
                      <TableCell>{row.to_be}</TableCell>
                      <TableCell>{row.business_change_impact}</TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={row.id} className={classes.tableRow} hover>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.SectionHeader}</TableCell>
                      <TableCell>{row.release_category.category}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.Intent}</TableCell>
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
