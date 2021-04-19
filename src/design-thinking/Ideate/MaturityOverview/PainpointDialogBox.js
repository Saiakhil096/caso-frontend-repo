import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, Grid, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Dialog, Card } from '@material-ui/core';
import { red, amber, yellow, lightGreen, green } from '@material-ui/core/colors';
import { VerySadIcon, SadIcon, OkIcon, HappyIcon, VeryHappyIcon } from '../../../common/CustomIcons';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  dialogContainer: {
    backgroundColor: '#F2F2F2',
    padding: '1rem 5rem 5rem'
  },
  closeButton: {
    textAlign: 'end',
    cursor: 'pointer'
  },
  heading: {
    marginBottom: '10px',
    justifyContent: 'center'
  },
  painpointTextColor: {
    color: '#858585'
  }
}));

function PainpointDialogBox(props) {
  const maxWidth = 'md';
  const { isPainpointDialogBoxOpen, closePainpointDialogBox, perception } = props;
  const classes = useStyles();

  return (
    <Dialog open={isPainpointDialogBoxOpen} onClose={closePainpointDialogBox} fullWidth="true" maxWidth={maxWidth}>
      <Grid item className={classes.dialogContainer}>
        <Grid item className={classes.closeButton}>
          <CloseIcon fontSize="large" onClick={closePainpointDialogBox} color="primary" />
        </Grid>
        <Grid container direction="row" className={classes.heading}>
          <Typography variant="h5">Painpoints</Typography>
        </Grid>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <Typography varient="h6">PID</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6">Perception</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="h6">Reason</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {perception.pain_points.reduce((outputarray, currentValue) => {
                if (perception.pain_points.find(data => data.id === currentValue.id)) {
                  return outputarray.concat(
                    <TableRow key={currentValue.id}>
                      <TableCell align="center">
                        <Typography variant="body1" className={classes.painpointTextColor}>
                          {perception.id}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {(() => {
                          switch (perception.rating) {
                            default:
                              return;
                            case 0:
                              return <VerySadIcon selected={true} selectedColor={red[500]} fontSize="large" />;
                            case 1:
                              return <SadIcon selected={true} selectedColor={amber[500]} fontSize="large" />;
                            case 2:
                              return <OkIcon selected={true} selectedColor={yellow[500]} fontSize="large" />;
                            case 3:
                              return <HappyIcon selected={true} selectedColor={lightGreen[500]} fontSize="large" />;
                            case 4:
                              return <VeryHappyIcon selected={true} selectedColor={green[500]} fontSize="large" />;
                          }
                        })()}
                      </TableCell>
                      <TableCell align="left">
                        <Typography variant="body1" className={classes.painpointTextColor}>
                          {currentValue.pain_point_text}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                } else {
                  return outputarray;
                }
              }, [])}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Dialog>
  );
}

export default PainpointDialogBox;
