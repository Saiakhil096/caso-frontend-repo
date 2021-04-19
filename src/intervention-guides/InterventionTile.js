import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Typography, Button } from '@material-ui/core';
import { fetchMedia } from '../common/API';
import { Graph } from '../common/CustomIcons';

const useStyles = makeStyles(theme => ({
  paper: {
    margin: theme.spacing(1),
    textAlign: 'center',
    padding: theme.spacing(0.5),
    width: '280px'
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%'
  },
  imgContainer: {
    overflow: 'hidden',
    width: '100%',
    height: '150px'
  },
  infoPadding: {
    padding: theme.spacing(1)
  },
  icon: {
    width: '8rem',
    height: 'auto',
    display: 'block',
    margin: '1rem auto'
  }
}));

function InterventionTile(props) {
  const classes = useStyles();
  const { onMessage, title, description, guide } = props;

  const downloadMedia = () => {
    let extension = '';
    if (guide[0].ext == '.false') {
      extension = '.zip';
    }
    fetchMedia(onMessage, guide[0].url)
      .then(response => response.blob())
      .then(blob => {
        let link = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = link;
        a.download = `${title}${extension}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  };

  return (
    <Grid item>
      <Paper className={classes.paper}>
        <Grid container xs={12} className={classes.imgContainer}>
          <Graph className={classes.icon} />
        </Grid>
        <Grid item xs={12} sm container spacing={1} className={classes.infoPadding}>
          <Grid item xs={7} container direction="column" spacing={1} wrap="nowrap">
            <Grid item>
              <Typography variant="subtitle1" color="primary" align="left" noWrap>
                {title}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" color="textSecondary" align="left" noWrap>
                {description}
              </Typography>
            </Grid>
          </Grid>
          <Grid container xs={5} alignItems="center" justify="center">
            <Button onClick={downloadMedia} variant="contained" color="primary">
              <Typography variant="caption" align="center">
                Download Available
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default InterventionTile;
