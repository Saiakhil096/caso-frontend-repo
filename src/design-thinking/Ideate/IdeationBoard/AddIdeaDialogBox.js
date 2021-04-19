import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography, Button, Dialog, TextField } from '@material-ui/core';
import Cookies from 'js-cookie';
import { url } from '../../../common/API';
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
  textfieldMargin: {
    padding: '10px 10px 0px',
    marginBottom: '10px'
  }
}));

function AddIdeaDialogBox(props) {
  const maxWidth = 'sm';
  const [idea, setIdea] = React.useState('');
  const { isAddIdeaDialogBoxOpen, closeAddIdeaDialogBox, onMessage, currentProcessIndex, l2ProcessList, ideas, setIdeas } = props;
  const classes = useStyles();

  const onIdeaChange = event => {
    setIdea(event.target.value);
  };

  const onSave = () => {
    const regex = new RegExp(/(.*[a-z]){2}/i);

    if (!idea) {
      onMessage('You must provide an idea', 'warning');
      return;
    } else if (!regex.test(idea)) {
      onMessage('You must enter at least 2 characters in your idea', 'warning');
      return;
    } else {
      submitIdea();
    }
  };

  const submitIdea = () => {
    const requestHeaders = {
      Authorization: `Bearer ${Cookies.get('jwt')}`
    };

    fetch(new URL('ideas', url), {
      method: 'post',
      headers: requestHeaders,
      body: JSON.stringify({
        idea_text: idea,
        user: Cookies.get('user'),
        project: Cookies.get('project'),
        l_2_process: l2ProcessList[currentProcessIndex].id
      })
    })
      .then(response => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then(response => {
        onMessage('Your idea has been added', 'success');
        closeAddIdeaDialogBox();
        let updatedIdeas = ideas.concat(response);
        setIdeas(updatedIdeas);
      })
      .catch(e => {
        onMessage(`Error ${e.status}: ${e.statusText}`, 'error');
      });
  };

  return (
    <Dialog open={isAddIdeaDialogBoxOpen} onClose={closeAddIdeaDialogBox} fullWidth="true" maxWidth={maxWidth}>
      <Grid item className={classes.dialogContainer}>
        <Grid item className={classes.closeButton}>
          <CloseIcon fontSize="large" onClick={closeAddIdeaDialogBox} color="primary">
            Close
          </CloseIcon>
        </Grid>
        <Grid container direction="row" justify="space-around" className={classes.heading}>
          <Typography variant="h5">Add New Idea</Typography>
        </Grid>
        <Paper className={classes.textfieldMargin}>
          <TextField label="Idea" multiline fullWidth={true} rows={4} onChange={onIdeaChange}></TextField>
        </Paper>
        <Grid item container justify="space-between" alignItems="baseline">
          <Grid item></Grid>
          <Grid item>
            <Button variant="contained" color="primary" disableElevation onClick={onSave}>
              Save
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default AddIdeaDialogBox;
