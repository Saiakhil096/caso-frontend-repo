import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Cookies from 'js-cookie';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import { Grid, Paper, TextField, Popper, Typography, Toolbar, IconButton, Button, Menu, MenuItem, Divider, Switch, Box } from '@material-ui/core';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Link as RouterLink } from 'react-router-dom';
import { fetchEngagements, fetchProjectData, createReply, createLike, deleteLike, fetchReplies } from '../common/API';
import { Pagination } from '@material-ui/lab';
import Autocomplete from '@material-ui/lab/Autocomplete';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1)
  },
  toolbarTop: {
    marginTop: '13px'
  },

  rightToolbar: {
    marginLeft: 'auto',
    marginRight: 120
  },
  title: {
    flex: '1 1 100%',
    marginLeft: 140
  },
  menu: {
    width: '16ch'
  },
  paper: {
    width: '100%',
    maxWidth: '950px',
    margin: theme.spacing(2, 'auto'),
    padding: theme.spacing(2)
  },

  subpaper: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(3),
    height: '7rem',
    backgroundColor: 'whitesmoke'
  },
  replyPaper: {
    marginTop: theme.spacing(3),
    height: '7rem',
    backgroundColor: 'whitesmoke'
  },
  reply: {
    backgroundColor: 'whitesmoke',
    width: '35rem'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '60ch'
  },
  paginator: {
    justifyContent: 'center',
    padding: '10px'
  },
  replyUser: {
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(2)
  },
  button: {
    marginLeft: 'auto',
    marginRight: 150,
    padding: theme.spacing(1)
  },
  button1: {
    color: 'primary',
    marginRight: '24px',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  createButton: {
    marginRight: 155
  }
}));

function OutputScreen(props) {
  const classes = useStyles();
  const [isAnonymousUser, setIsAnonymousUser] = useState(false);
  const [searchLocation, setSearchLocation] = useState(null);
  const [locationlist, setLocationlist] = useState([]);
  const [businessUnitlist, setBusinessUnitlist] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [engagements, setEngagements] = useState([]);
  const [searchBusinessUnit, setSearchBusinessUnit] = useState(null);
  const { onMessage } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState([]);
  const project = Cookies.get('project');
  const [id, setId] = useState();
  const itemsPerPage = 3;
  const [page, setPage] = useState(1);
  const [user, setUser] = useState();
  const [refresh, setRefresh] = useState(true);
  const handleChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    const userId = isAnonymousUser === false ? Cookies.get('user') : null;
    setUser(userId);
  }, [isAnonymousUser]);

  useEffect(() => {
    if (refresh) {
      Promise.all([fetchProjectData(project, onMessage), fetchEngagements(onMessage), fetchReplies(onMessage)])
        .then(([projectData, engagements, repliesData]) => {
          setLocationlist(projectData.key_locations);
          setBusinessUnitlist(projectData.business_units);
          setReplies(repliesData);
          const userId = parseInt(Cookies.get('user'));
          for (let i = 0; i < engagements.length; i++) {
            for (let j = 0; j < engagements[i].likes.length; j++) {
              if (engagements[i].likes[j].user === userId) {
                engagements[i].color1 = true;
                break;
              } else {
                engagements[i].color1 = false;
              }
            }
          }
          engagements.map(form => {
            const formReplies = repliesData.filter(reply => reply.other_engagement_form === form.id);
            form.replies = formReplies;
          });
          setFilteredItems(engagements);
          setEngagements(engagements);
          setRefresh(false);
        })
        .catch(e => {
          props.onMessage(`Error: ${e}`, 'error');
        });
    }
  }, [refresh]);

  useEffect(() => {
    const commentsCopy = JSON.parse(JSON.stringify(engagements));
    var filterComments = commentsCopy;
    if (searchLocation !== null) {
      filterComments = filterComments.filter(comment => comment.key_location.id == searchLocation.id);
    }
    if (searchBusinessUnit !== null) {
      filterComments = filterComments.filter(comment => comment.business_unit.id == searchBusinessUnit.id);
    }
    setFilteredItems(filterComments);
  }, [searchBusinessUnit, searchLocation]);

  const handleMenuOpen = event => {
    setMenuAnchorEl(event.currentTarget);
  };

  const updateLike = id => {
    const item = filteredItems.filter(item => item.id === id);
    item.color1 = true;
    setFilteredItems(filteredItems);
    const likeObject = {
      user: Cookies.get('user'),
      other_engagement_form: id,
      Likes: 1
    };
    createLike(likeObject, onMessage).then(() => {
      setRefresh(true);
    });
  };

  const updateUnLike = id => {
    const item = filteredItems.filter(item => item.id === id);
    item.color1 = false;
    setFilteredItems(filteredItems);
    for (let i = 0; i < item[0].likes.length; i++) {
      if (item[0].likes[i].user === parseInt(Cookies.get('user'))) {
        var id = item[0].likes[i].id;
        deleteLike(id, onMessage).then(() => {
          setRefresh(true);
        });
      }
    }
  };

  const handleSave = () => {
    setOpen(false);
    const replyObject = {
      reply_text: reply,
      record_anonymously: isAnonymousUser,
      user: user,
      other_engagement_form: id
    };
    createReply(replyObject, onMessage).then(() => {
      setRefresh(true);
    });
  };

  const handleSwitchToggle = () => {
    setIsAnonymousUser(!isAnonymousUser);
  };

  const handleCancle = () => {
    setOpen(false);
    setReply('');
  };

  const handleClick = (newPlacement, id) => event => {
    setAnchorEl(event.currentTarget);
    setId(id);
    setOpen(prev => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
    setReply('');
  };

  return (
    <React.Fragment>
      <Toolbar className={classes.toolbarTop}>
        <Typography className={classes.title} variant="h5">
          Results({filteredItems.length})
        </Typography>

        <IconButton className={classes.rightToolbar} onClick={handleMenuOpen}>
          <FilterListIcon fontSize="large" />
        </IconButton>

        <Menu
          id="menu-appbar"
          anchorEl={menuAnchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={menuOpen}
          onClose={() => setMenuAnchorEl(null)}>
          <MenuItem>
            <Autocomplete
              className={classes.menu}
              id="location"
              options={locationlist.map((item, index) => item)}
              value={searchLocation}
              autoHighlight
              getOptionLabel={option => option.location}
              getOptionSelected={(option, value) => option.location === value.location}
              onChange={(e, newValue) => setSearchLocation(newValue)}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Location"
                  inputProps={{
                    ...params.inputProps
                  }}
                />
              )}
            />
          </MenuItem>
          <MenuItem>
            <Autocomplete
              className={classes.menu}
              id="bussiness_unit"
              options={businessUnitlist.map((item, index) => item)}
              value={searchBusinessUnit}
              getOptionLabel={option => option.unit}
              getOptionSelected={(option, value) => option.unit === value.unit}
              onChange={(e, newValue) => setSearchBusinessUnit(newValue)}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Business Unit"
                  inputProps={{
                    ...params.inputProps
                  }}
                />
              )}
            />
          </MenuItem>
        </Menu>
      </Toolbar>

      <Grid container justify="center">
        <Grid item xs={6} sm={3}>
          {searchLocation !== null ? <Typography variant="h5">{searchLocation.location}</Typography> : null}
        </Grid>
        <Grid item xs={6} sm={3}>
          {searchBusinessUnit !== null ? <Typography variant="h5">{searchBusinessUnit.unit}</Typography> : null}
        </Grid>
      </Grid>
      <Grid container justify="center" className={classes.root}>
        {filteredItems.length < 1 ? (
          <Box display="flex" width={300} height={300} alignItems="center" justifyContent="center">
            <Typography variant="h4" align="center">
              No Results Found
            </Typography>
          </Box>
        ) : (
          filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((item, index) => (
            <Grid item xs={12}>
              <Paper key={index} justify="center" className={classes.paper}>
                <Grid container spacing={1}>
                  <Grid item xs={6} sm={1}></Grid>
                  <Grid item xs={6} sm={2}>
                    <Typography variant="caption" color="textSecondary" align="center">
                      Recorded By
                    </Typography>
                    <Typography variant="subtitle2">{item.record_anonymously ? 'Anonymous' : item.user.username}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Typography variant="caption" color="textSecondary" align="center">
                      Date/Time
                    </Typography>
                    <Typography variant="subtitle2">{moment(item.created_at).format('L')}</Typography>
                    <Typography variant="subtitle2">{moment(item.created_at).format('LT')}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Typography variant="caption" color="textSecondary" align="center">
                      Location
                    </Typography>
                    <Typography variant="subtitle2">{item.key_location.location}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Typography variant="caption" color="textSecondary" align="center">
                      Business Unit
                    </Typography>
                    <Typography variant="subtitle2">{item.business_unit.unit}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Typography variant="caption" color="textSecondary" align="center">
                      Type
                    </Typography>
                    <Typography variant="subtitle2">{item.intervention_type}</Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item xs={12} sm={11}>
                    <Paper justify="center" className={classes.subpaper}>
                      <Typography variant="caption" color="textSecondary" align="center" className={classes.root}>
                        Comment
                      </Typography>
                      <Grid className={classes.root}>{item.comment}</Grid>
                    </Paper>
                    <Grid container justify="flex-end">
                      <Button onClick={handleClick('bottom', item.id)} color="primary" className={classes.button1}>
                        Reply
                      </Button>
                      <Grid>
                        <Popper open={open} anchorEl={anchorEl} placement={placement} transition position="fixed">
                          <Paper justify="center" className={classes.reply}>
                            Want to Record as Anonymous..
                            <Switch checked={isAnonymousUser} onChange={handleSwitchToggle} color="primary" />
                            <TextField
                              label="Reply"
                              style={{ margin: 8 }}
                              placeholder="Your Reply"
                              value={reply}
                              onChange={e => {
                                setReply(e.target.value);
                              }}
                              className={classes.textField}
                              margin="normal"
                              InputLabelProps={{
                                shrink: true
                              }}
                              variant="outlined"
                            />
                            <Button color="primary" disabled={reply.length < 1} onClick={handleSave}>
                              Save
                            </Button>
                            <Button color="primary" onClick={handleCancle}>
                              Cancel
                            </Button>
                          </Paper>
                        </Popper>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={2} sm={1}>
                    {item.color1 ? (
                      <IconButton onClick={e => updateUnLike(item.id)}>
                        <ThumbUpIcon color="primary" fontSize="large" />
                        <Typography variant="h6">{item.likes.length}</Typography>
                      </IconButton>
                    ) : (
                      <IconButton onClick={e => updateLike(item.id)}>
                        <ThumbUpAltOutlinedIcon color="primary" fontSize="large" />
                        <Typography variant="h6">{item.likes.length}</Typography>
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
                {item.replies.length < 1 ? <Grid></Grid> : <Divider />}
                <Grid>
                  {item.replies.map((reply, index) => (
                    <Grid key={index} container justify="center" spacing={2}>
                      <Grid item xs={12} sm={1} className={classes.replyUser}>
                        <Typography variant="subtitle2">{reply.user === null ? 'Anonymous' : reply.user.username}</Typography>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="textSecondary" align="center">
                            {moment(reply.created_at).format('L')}
                          </Typography>
                        </Grid>
                        <Typography variant="caption" color="textSecondary" align="center">
                          {moment(reply.created_at).format('LT')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <Paper justify="center" className={classes.root} className={classes.replyPaper}>
                          <Typography variant="caption" color="textSecondary" align="center" className={classes.root}>
                            Reply
                          </Typography>
                          <Grid className={classes.root}>{reply.reply_text}</Grid>
                        </Paper>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          ))
        )}
      </Grid>
      <Grid container justify="flex-end">
        <Button variant="contained" color="primary" className={classes.createButton} component={RouterLink} to={`/other-engagements-form`}>
          Create New
        </Button>
      </Grid>

      <Grid>
        <Box component="span">
          <Pagination
            count={Math.ceil(filteredItems.length / itemsPerPage)}
            page={page}
            onChange={handleChange}
            defaultPage={1}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            classes={{ ul: classes.paginator }}
          />
        </Box>
      </Grid>
    </React.Fragment>
  );
}

export default OutputScreen;
