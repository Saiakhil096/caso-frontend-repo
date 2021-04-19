import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Typography } from '@material-ui/core';
import { VerySadIcon, SadIcon, OkIcon, HappyIcon, VeryHappyIcon } from '../../common/CustomIcons';
import { red, amber, yellow, lightGreen, green } from '@material-ui/core/colors';

const theme = createMuiTheme({
  typography: {
    body1: {
      fontWeight: 500,
      fontSize: 16
    }
  }
});

function PerceptionProfile(props) {
  const getToken = (index, selected) => {
    switch (index) {
      case 0:
        return <VerySadIcon key={index} selected={selected} selectedColor={red[500]} fontSize="large" />;
      case 1:
        return <SadIcon key={index} selected={selected} selectedColor={amber[500]} fontSize="large" />;
      case 2:
        return <OkIcon key={index} selected={selected} selectedColor={yellow[500]} fontSize="large" />;
      case 3:
        return <HappyIcon key={index} selected={selected} selectedColor={lightGreen[500]} fontSize="large" />;
      case 4:
        return <VeryHappyIcon key={index} selected={selected} selectedColor={green[500]} fontSize="large" />;
      default:
        return '';
    }
  };
  return (
    <React.Fragment>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: '20%' }}>
                <ThemeProvider theme={theme}>
                  <Typography> Process</Typography>
                </ThemeProvider>
              </TableCell>
              <TableCell style={{ width: '40%' }}>
                <ThemeProvider theme={theme}>
                  <Typography> Things That Don’t Work For Me</Typography>
                </ThemeProvider>
              </TableCell>
              <TableCell style={{ width: '40%' }}>
                <ThemeProvider theme={theme}>
                  <Typography> I Need / Want / Expect</Typography>
                </ThemeProvider>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.painpointsData.map((painpoint, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {painpoint.contract_stage}
                </TableCell>
                <TableCell>
                  <Grid container spacing={1}>
                    {painpoint.painpointsThatDontWorkForMe.map((painpointThatDontWorkForMe, i) => (
                      <Grid key={i} container item xs={12}>
                        <Grid item container xs={2}>
                          {getToken(painpointThatDontWorkForMe.rating, true)}
                        </Grid>
                        <Grid item container xs={10}>
                          {painpointThatDontWorkForMe.reason}
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                </TableCell>
                <TableCell>
                  <Grid container spacing={2}>
                    {painpoint.painpointsINeed.map((painpointINeed, i) => (
                      <Grid key={i} container item xs={12}>
                        {painpointINeed.reason}
                      </Grid>
                    ))}
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}

export default PerceptionProfile;
