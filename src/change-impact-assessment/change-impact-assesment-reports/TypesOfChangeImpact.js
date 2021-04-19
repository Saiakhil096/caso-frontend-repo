import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    width: 550,
    height: 380
  },
  grid: {
    width: 550,
    height: 400
  },
  ty: {
    fontSize: 12
  }
});
function TypesOfChangeImpact(props) {
  const { typesOfChangeImpacts, selectedLocationFilter, selectedJobRoleFilter, selectedBUFilter } = props;
  const [l2process, setL2process] = useState([]);
  const [title, setTitle] = useState('');
  useEffect(() => {
    if (selectedLocationFilter != '') {
      setTitle('Types Of Change Impact filtered by: ' + selectedLocationFilter);
    }
    if (selectedJobRoleFilter != '') {
      setTitle('Types Of Change Impact filtered by: ' + selectedJobRoleFilter);
    }
    if (selectedBUFilter != '') {
      setTitle('Types Of Change Impact filtered by: ' + selectedBUFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '') {
      setTitle('Types Of Change Impact filtered by: ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Types Of Change Impact filtered by: ' + selectedBUFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter != '' && selectedBUFilter != '') {
      setTitle('Types Of Change Impact filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Types Of Change Impact filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter == '' && selectedJobRoleFilter == '' && selectedBUFilter == '') {
      setTitle('Types Of Change Impact');
    }
  }, [selectedBUFilter, selectedJobRoleFilter, selectedLocationFilter]);
  useEffect(() => {
    setL2process(typesOfChangeImpacts[0]);
  });

  const classes = useStyles();

  return (
    <React.Fragment>
      <Grid container className={classes.grid} justify="center">
        <Typography color="textSecondary" className={classes.ty}>
          <b>{title}</b>
        </Typography>
        <TableContainer component={Paper} className={classes.table}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow bgcolor="">
                {l2process.map((head, index) => (
                  <TableCell key={index} style={{ backgroundColor: index == 0 ? '#0070AD' : '#6fe3f2' }} align="center">
                    <b>{head}</b>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {typesOfChangeImpacts[1].map((head, index) => (
                  <TableCell key={index} style={{ backgroundColor: index == 0 ? '#12ABDB' : 'white' }} align="center">
                    {head}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {typesOfChangeImpacts[2].map((head, index) => (
                  <TableCell key={index} style={{ backgroundColor: index == 0 ? '#12ABDB' : 'white' }} align="center">
                    {head}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {typesOfChangeImpacts[3].map((head, index) => (
                  <TableCell key={index} style={{ backgroundColor: index == 0 ? '#12ABDB' : 'white' }} align="center">
                    {head}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {typesOfChangeImpacts[4].map((head, index) => (
                  <TableCell key={index} style={{ backgroundColor: index == 0 ? '#12ABDB' : 'white' }} align="center">
                    {head}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {typesOfChangeImpacts[5].map((head, index) => (
                  <TableCell key={index} style={{ backgroundColor: index == 0 ? '#12ABDB' : 'white' }} align="center">
                    {head}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {typesOfChangeImpacts[6].map((head, index) => (
                  <TableCell key={index} style={{ backgroundColor: index == 0 ? '#12ABDB' : 'white' }} align="center">
                    {head}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {typesOfChangeImpacts[7].map((head, index) => (
                  <TableCell key={index} style={{ backgroundColor: index == 0 ? '#12ABDB' : 'white' }} align="center">
                    {head}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                {typesOfChangeImpacts[8].map((head, index) => (
                  <TableCell key={index} style={{ backgroundColor: index == 0 ? '#12ABDB' : 'white' }} align="center">
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </React.Fragment>
  );
}
export default TypesOfChangeImpact;
