import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Cookies from 'js-cookie';
import AddIdeaDialogBox from './AddIdeaDialogBox';
import { url } from '../../../common/API';
import { VerySadIcon, SadIcon, OkIcon, HappyIcon, VeryHappyIcon } from '../../../common/CustomIcons';
import { red, amber, yellow, lightGreen, green } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  subheading: {
    color: '#B8B8CC'
  },
  displayIdeaContainer: {
    alignSelf: 'left',
    width: '70%',
    margin: '20px 15%'
  },
  paper: {
    minHeight: 60,
    margin: '10px 0px 10px 10px',
    padding: 10,
    overflowWrap: 'anywhere'
  },
  paperContainer: {
    width: '90%'
  },
  dustbinIcon: {
    alignSelf: 'center',
    cursor: 'pointer',
    width: '8%'
  },
  heading: {
    marginBottom: '10px',
    justifyContent: 'center'
  },
  painpointTextColor: {
    color: '#858585'
  },
  idea: {
    width: '95%'
  }
}));

function IdeationBoard(props) {
  const [isAddIdeaDialogBoxOpen, setIsAddIdeaDialogBoxOpen] = useState(false);
  const { currentProcess, currentProcessIndex, totalProcesses, onMessage, l2ProcessList, ideas, setIdeas, perception } = props;
  const [ideasOpen, setideasOpen] = useState(false);
  const classes = useStyles();

  const openAddIdeaDialogBox = () => {
    setideasOpen(true);
    setIsAddIdeaDialogBoxOpen(true);
  };
  const closeAddIdeaDialogBox = () => {
    setIsAddIdeaDialogBoxOpen(false);
  };

  let getIdeasForProcess = processIndex => {
    let x = ideas.filter(idea => idea.l_2_process.id == l2ProcessList[processIndex].id);
    return x;
  };

  let getIdeasForDisplay = processIndex => {
    return getIdeasForProcess(processIndex).map(idea => {
      return (
        <Grid container direction="row" justify="space-between">
          <Grid item className={classes.paperContainer}>
            <Paper key={idea.id} className={classes.paper}>
              {idea.idea_text}
            </Paper>
          </Grid>
          <Grid item className={classes.dustbinIcon}>
            <DeleteOutlinedIcon fontSize="large" key={idea.id} onClick={() => deleteIdea(idea.id)} color="primary" />
          </Grid>
        </Grid>
      );
    });
  };

  const deleteIdea = id => {
    return fetch(new URL(`ideas/${id}`, url), {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${Cookies.get('jwt')}`
      }
    })
      .then(response => {
        if (!response.ok) throw response;
        ideas.splice(
          ideas.findIndex(idea => idea.id === id),
          1
        );
        setIdeas(ideas);
        onMessage('Your idea has been deleted', 'success');
      })
      .catch(e => {
        onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      });
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item direction="column">
        <Typography variant="body2" className={classes.subheading}>{`${currentProcessIndex + 1} of ${totalProcesses}`}</Typography>
        <Typography variant="h5">{currentProcess.title}</Typography>
      </Grid>
      <Grid container direction="row" className={classes.heading}>
        <Typography variant="h5">Painpoints</Typography>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography variant="h6">View Ideas</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography varient="h6">ID</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="h6">Perception</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="h6">Reason</Typography>
              </TableCell>
              <TableCell align="left">
                <Typography variant="h6">Add Ideas</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {perception.pain_points.reduce((outputarray, currentValue) => {
              if (perception.pain_points.find(data => data.id === currentValue.id)) {
                return outputarray.concat(
                  <TableRow key={currentValue.id}>
                    <TableCell align="center">
                      <Typography variant="h6" className={classes.subheading}>
                        {ideasOpen ? (
                          <Button
                            onClick={() => {
                              setideasOpen(false);
                            }}>
                            -
                          </Button>
                        ) : (
                          <Button onClick={() => setideasOpen(true)}>+</Button>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1" className={classes.painpointTextColor}>
                        {currentValue.id}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {(() => {
                        switch (Math.round(perception.rating)) {
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
                    <TableCell align="left">
                      <Grid item container className={classes.painpointTextColor}>
                        <Grid container justify="space-between">
                          <Grid>
                            <Button color="primary" onClick={openAddIdeaDialogBox} size="large">
                              Add New
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                );
              } else {
                return outputarray;
              }
            }, [])}
          </TableBody>
        </Table>
        {ideasOpen ? getIdeasForDisplay(currentProcessIndex) : null}
      </TableContainer>
      <Grid item>
        <Grid>
          <AddIdeaDialogBox
            currentProcessIndex={currentProcessIndex}
            isAddIdeaDialogBoxOpen={isAddIdeaDialogBoxOpen}
            closeAddIdeaDialogBox={closeAddIdeaDialogBox}
            onMessage={onMessage}
            l2ProcessList={l2ProcessList}
            setIdeas={setIdeas}
            ideas={ideas}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default IdeationBoard;
