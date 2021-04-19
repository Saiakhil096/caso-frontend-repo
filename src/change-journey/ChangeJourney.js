import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, Select, MenuItem, InputLabel, FormControl, Grid, Button } from '@material-ui/core';
import { useParams, withRouter } from 'react-router-dom';
import { generateChangeJourneyPDF } from './DocumentsData';
import { fetchChangeJourneyPDF, fetchReleaseCategory, fetchProjectData } from '../common/API';

const useStyles = makeStyles(theme => ({
  paper: {
    width: '100%',
    maxWidth: '40rem',
    margin: theme.spacing(10, 'auto'),
    padding: theme.spacing(2)
  }
}));

function ChangeJourney(props) {
  const classes = useStyles();
  const [jobRole, setJobRole] = useState('');
  const [personaJobList, setPersonaJobList] = useState([]);
  const [releaseCategoryList, setReleaseCategoryList] = useState([]);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [releaseCategory, setReleaseCategory] = useState('');

  const { id } = useParams();

  useEffect(() => {
    Promise.all([fetchProjectData(Cookies.get('project'), props.onMessage), fetchReleaseCategory(props.onMessage)])
      .then(([data, releaseCategories]) => {
        if (id !== undefined) {
          let filteredPersonaJobRole = data.persona_job_roles.find(jobRole => {
            return jobRole.id === parseInt(id);
          });
          setJobRole(filteredPersonaJobRole.job_role);
        }
        setPersonaJobList(data.persona_job_roles);
        setReleaseCategoryList(releaseCategories);
      })
      .catch(e => {
        props.onMessage(`Error: ${e}`, 'error');
      });
  }, []);

  const generatePDF = () => {
    setGeneratingPDF(true);

    if (jobRole === '') {
      props.onMessage('You must select a Persona Job Role', 'error');
    } else if (releaseCategory === '') {
      props.onMessage('You must select an release category', 'error');
    } else {
      fetchChangeJourneyPDF(jobRole, releaseCategory, props.onMessage).then(data => {
        if (data.length === 0) {
          props.onMessage('Oops there is no Data to Display', 'error');
        } else {
          generateChangeJourneyPDF(jobRole, releaseCategory, data);
        }
      });
    }

    setGeneratingPDF(false);
  };

  return (
    <React.Fragment>
      <Paper component="form" className={classes.paper}>
        <Typography variant="h6" id="tableTitle" component="h2">
          Change Journey
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <InputLabel htmlFor="select-type">Persona Job Role</InputLabel>
              {id !== undefined ? (
                <Select
                  data-testid="jobRole"
                  value={jobRole}
                  label="Persona Job Role"
                  disabled
                  inputProps={{
                    name: 'Persona Job Role',
                    id: 'select-type'
                  }}>
                  {personaJobList.map(jobRole => (
                    <MenuItem data-testid="option" key={jobRole.id} value={jobRole.job_role}>
                      {jobRole.job_role}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <Select
                  data-testid="jobRole"
                  value={jobRole}
                  onChange={e => setJobRole(e.target.value)}
                  label="Persona Job Role"
                  inputProps={{
                    name: 'Persona Job Role',
                    id: 'select-type'
                  }}>
                  {personaJobList.map(jobRole => (
                    <MenuItem data-testid="option" key={jobRole.id} value={jobRole.job_role}>
                      {jobRole.job_role}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <InputLabel htmlFor="release-category">Release Category</InputLabel>
              <Select
                data-testid="releaseCategory"
                value={releaseCategory}
                onChange={e => setReleaseCategory(e.target.value)}
                label="release-category"
                inputProps={{
                  name: 'release-category',
                  id: 'release-category'
                }}>
                {releaseCategoryList.map(relcategory => (
                  <MenuItem key={relcategory.id} value={relcategory.category}>
                    {relcategory.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid container justify="flex-end">
            <Grid item>
              <Button data-testid="download" disabled={generatingPDF} onClick={e => generatePDF()} variant="contained" color="primary">
                Download
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
}

export default withRouter(ChangeJourney);
