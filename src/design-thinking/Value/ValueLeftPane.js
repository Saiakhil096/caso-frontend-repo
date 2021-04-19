import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { Grid, Typography, List, ListItem, ListItemText, IconButton, Collapse } from '@material-ui/core';
import { Star, StarBorder, Search, Check as CheckIcon } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(4, 5)
  },
  star: {
    color: 'rgb(76,53,105)',
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

function ValueLeftPane(props) {
  const classes = useStyles();
  const [icons, setICons] = useState([]);
  const { l2ProcessList, currentProcess, votes, allIdea, setCurrentProcess } = props;

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
        <Typography variant="h6">Value</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" color="textSecondary">
          You have 4 votes to choose your top 4 value votes and below please tell us the benefits these would bring to your business. You can use more
          than one per idea and move freely between processes.
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
          <List component="nav" aria-label="main Level 2 Processes" className={classes.list}>
            {l2ProcessList.map((item, index) => {
              const label = `${item.title}`;
              const bSelected = currentProcess === index;
              const linkClass = bSelected ? classes.activeListItem : classes.listItem;
              return (
                <ListItem
                  onClick={e => {
                    listItemClick(index);
                  }}
                  key={index}
                  button
                  selected={bSelected}>
                  <ListItemText classes={{ primary: linkClass }} primary={label} />
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

export default ValueLeftPane;
