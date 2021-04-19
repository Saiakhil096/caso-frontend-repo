import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { blue, grey } from '@material-ui/core/colors';
import {
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  List,
  ListItem,
  Table,
  TableHead,
  TableBody,
  TableContainer,
  TableRow,
  TableCell
} from '@material-ui/core';
import { Star, StarBorder, Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(5, 5)
  },
  background: {
    backgroundColor: 'rgb(137, 198, 79)'
  },
  text: {
    color: grey[200]
  },
  tableRow: {
    cursor: 'pointer',
    height: '40pt'
  },
  list: {
    maxHeight: 190,
    overflow: 'auto'
  },
  paper: {
    borderRadius: '5px'
  },
  input: {
    color: grey[50]
  },
  idea: {
    margin: theme.spacing(0, 1),
    '& .MuiSvgIcon-root': {
      color: grey[50]
    }
  },
  button: {
    backgroundColor: 'rgba(224, 224, 224, 0.65)',
    color: grey[50]
  },
  star: {
    color: 'rgb(137, 198, 79)',
    width: 40,
    height: 40
  },
  ideaWidth: {
    width: '65%'
  }
}));

function FeasibilityRightPane(props) {
  const {
    onMessage,
    l2ProcessList,
    currentProcess,
    feasibilityVote,
    idea,
    comments,
    handleCommentAdd,
    handleCommentsDelete,
    handleCommentTextChange,
    handleIdeaChange,
    handleIncreaseVote,
    onNextProcess,
    onPreviousProcess,
    handleDecreaseVote,
    allIdea
  } = props;

  const classes = useStyles();

  useEffect(() => {
    idea.map((idea, index) => {
      idea.idea_label = `0${index + 1}.`;
    });
  }, [currentProcess]);

  const getIcons = count => {
    var icons = [];
    for (let index = 0; index < count; index++) {
      icons.push(<Star fontSize="large" />);
    }
    return icons;
  };

  return (
    <Grid container direction="column" xs={12} sm={7} md={8} className={`${classes.background} ${classes.content}`} spacing={4}>
      <Grid item>
        <Typography className={classes.text}>
          {currentProcess + 1} of {l2ProcessList.length}
        </Typography>
        <Typography className={classes.text}>{l2ProcessList[currentProcess].title}</Typography>
      </Grid>
      <Grid item>
        <Typography className={classes.text}>Feasibility Votes</Typography>
        <Paper className={classes.paper}>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="idea table">
              <TableHead>
                <TableRow className={classes.tableRow}>
                  <TableCell align="left">Ideas</TableCell>
                  <TableCell align="left">Feasibility Votes</TableCell>
                </TableRow>
              </TableHead>
              {feasibilityVote.map((item, index) => {
                const icon = getIcons(item.vote_count);
                return (
                  <TableBody>
                    <TableRow key={index} className={classes.tableRow}>
                      <TableCell
                        align="left"
                        className={classes.ideaWidth}
                        style={{
                          whiteSpace: 'normal',
                          wordBreak: 'break-word'
                        }}>
                        0{index + 1}. {item.idea.idea_text}
                      </TableCell>
                      <TableCell align="left">
                        {icon.map(item => {
                          return (
                            <IconButton aria-label="star" className={classes.star} onClick={e => handleDecreaseVote(e, index)}>
                              {item}
                            </IconButton>
                          );
                        })}
                        {allIdea.votes > 0 ? (
                          <IconButton aria-label="star" className={classes.star} onClick={e => handleIncreaseVote(e, index)}>
                            <StarBorder fontSize="large" />
                          </IconButton>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                );
              })}
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <Grid item container justify="space-between">
        <Grid item>
          <Typography className={classes.text}>Please list your barriers to entry here</Typography>
        </Grid>
        <Grid item>
          <Button style={{ color: grey[200] }} endIcon={<AddIcon style={{ color: grey[200] }} />} onClick={e => handleCommentAdd()}>
            Add New
          </Button>
        </Grid>
      </Grid>
      <Grid item>
        <List disablePadding={true} dense={true} className={classes.list}>
          {comments.map((item, index) => (
            <ListItem key={index} disableGutters={true}>
              <Autocomplete
                className={classes.idea}
                classes={{ inputRoot: classes.input }}
                value={item.idea}
                onChange={(event, newValue) => handleIdeaChange(event, newValue, index)}
                options={idea.map((idea, index) => {
                  return idea;
                })}
                getOptionLabel={option => {
                  if (typeof option === 'string') {
                    return option;
                  }
                  if (option.inputValue) {
                    return option.inputValue;
                  }
                  return option.idea_label;
                }}
                getOptionSelected={(option, value) => option.id === value.id}
                style={{ width: 150 }}
                renderInput={params => (
                  <TextField
                    {...params}
                    InputLabelProps={{
                      className: classes.input
                    }}
                    label="Idea"
                    color="secondary"
                    variant="filled"
                  />
                )}
              />
              <TextField
                label="Barrier"
                InputLabelProps={{
                  className: classes.input
                }}
                fullWidth={true}
                variant="filled"
                color="secondary"
                type="text"
                value={item.comment_text}
                inputProps={{ 'aria-label': 'description', className: classes.input }}
                onChange={e => handleCommentTextChange(e, index)}
              />
              <IconButton
                style={{ color: grey[200] }}
                aria-label="delete"
                onClick={e => {
                  handleCommentsDelete(e, index);
                }}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Grid>
      <Grid item container alignItems="baseline" justify="space-between">
        <Grid item>
          {currentProcess > 0 && (
            <Button variant="contained" className={classes.button} onClick={e => onPreviousProcess()}>
              Back
            </Button>
          )}
        </Grid>
        <Grid item>
          <Button variant="contained" className={classes.button} onClick={e => onNextProcess()}>
            {currentProcess === l2ProcessList.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default FeasibilityRightPane;
