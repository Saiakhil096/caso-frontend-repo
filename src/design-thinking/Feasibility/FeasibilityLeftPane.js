import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { Grid, Typography, List, ListItem, ListItemText, IconButton, Collapse } from '@material-ui/core';
import { Star, StarBorder, Check as CheckIcon } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(4, 5)
  },
  star: {
    color: 'rgb(137, 198, 79)',
    width: 55,
    height: 50
  },
  list: {
    width: '100%',
    maxWidth: 400
  },
  activeListItem: {
    color: 'black'
  },
  listItem: {
    color: '#858585'
  }
}));

function FeasibilityLeftPane(props) {
  const classes = useStyles();
  const { votes, setCurrentProcess, currentProcess, l2ProcessList, allIdea } = props;
  const [icons, setICons] = useState([]);

  useEffect(() => {
    setICons(getIcons());
  }, [votes]);

  const getIcons = () => {
    var icons = [];
    for (let index = 0; index < 4; index++) {
      if (index < votes) {
        icons.push(<Star fontSize="large" />);
      } else {
        icons.push(<StarBorder fontSize="large" />);
      }
    }
    return icons;
  };

  const listItemClick = index => {
    setCurrentProcess(index);
  };

  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <Typography variant="h6">Feasibility</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" color="textSecondary">
          We want to understand how feasible your solutions would be to implement in your organisations today. We want to understand your business
          barriers to entry. You have 4 votes, please allocate them to your ideas, you can use more than one per idea and move freely between
          processes
        </Typography>
      </Grid>
      <Grid container item sm={10} spacing={1}>
        {icons.map((item, index) => {
          return (
            <IconButton aria-label="star" className={classes.star}>
              {item}
            </IconButton>
          );
        })}
      </Grid>
      <Grid item>
        <Grid item>
          <Typography className={classes.headerMargin} variant="h5">
            Process Checklist
          </Typography>
        </Grid>
        <Grid item>
          <List component="nav" aria-label="main Level 2 Processes" className={classes.list}>
            {l2ProcessList.map((item, index) => {
              const label = `${item.title}`;
              const bSelected = currentProcess === index;
              const linkClass = bSelected ? classes.activeListItem : classes.listItem;
              return (
                <ListItem
                  selected={bSelected}
                  onClick={e => {
                    listItemClick(index);
                  }}
                  key={index}
                  button>
                  <ListItemText primary={label} classes={{ primary: linkClass }} />
                  {allIdea[index].votes === 0 ? <CheckIcon style={{ color: green[500] }} /> : null}
                </ListItem>
              );
            })}
          </List>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default FeasibilityLeftPane;
