import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { Link as RouterLink } from 'react-router-dom';
import { TextField, Grid, IconButton, Button, Divider, Card, Link, Box, Typography, Chip, Backdrop, CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import {
  fetchCategories,
  updateSubCategories,
  fetchCategoriesReports,
  createSubCategories,
  createBusinessCategory,
  updateBusinessCategory
} from '../common/API';
import { Pie } from 'react-chartjs-2';
import { Save as SaveIcon, Edit as EditIcon } from '@material-ui/icons';

const Completed = withStyles(theme => ({
  root: {
    height: 10,
    width: 10,
    borderRadius: 5
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700]
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#74C56D'
  }
}))(LinearProgress);

const Pending = withStyles(theme => ({
  root: {
    height: 10,
    width: 10,
    borderRadius: 5
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700]
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#E26320'
  }
}))(LinearProgress);

const NotDue = withStyles(theme => ({
  root: {
    height: 10,
    width: 10,
    borderRadius: 5
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700]
  },
  bar: {
    borderRadius: 5,
    backgroundColor: '#E3912B'
  }
}))(LinearProgress);

const useStyles = makeStyles(theme => ({
  co: {
    backgroundColor: '#F2F2F2'
  },
  root: {
    display: 'flex',
    maxWidth: '100%',
    marginLeft: '2cm',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(2.0)
    }
  },
  subheading: {
    margin: theme.spacing(5, 12)
  },
  headerMargin: {
    marginLeft: '2.5cm',
    marginTop: '1.5cm'
  },
  chip: {
    padding: '0.5cm',
    border: '2px solid',
    fontSize: '19px'
  },
  margin: {
    marginTop: '1.5cm'
  },
  card: {
    display: 'flex',
    marginLeft: '2.2cm',
    marginTop: '0.5cm',
    width: 'auto',
    marginRight: '2.2cm'
  },
  card1: {
    marginLeft: '2.2cm',
    marginTop: '0.5cm',
    width: '1000px',
    marginRight: '2.2cm'
  },

  button: {
    paddingRight: '2.2cm',
    marginTop: '1cm',
    paddingBottom: '1cm'
  },
  content: {
    display: 'flex',
    paddingLeft: '15px',
    width: 'auto',
    height: '70px',
    paddingTop: '10px',
    paddingBottom: '10px',
    maxHeight: '100%'
  },
  content1: {
    paddingLeft: '15px',
    width: '1000px',
    height: '70px',
    paddingTop: '23px',
    maxHeight: '100%'
  },
  padding: {
    width: '750px',
    height: '10cm',
    display: 'flex',
    justifyContent: 'center',
    marginLeft: '4.7cm',
    marginTop: '0.5cm',
    marginRight: '3.2cm',
    textAlign: 'center'
  },

  linp: {
    margin: theme.spacing(0.2)
  },
  underline: {
    '&&&:before': {
      borderBottom: 'none'
    },
    '&&:after': {
      borderBottom: 'none'
    }
  },
  floatingLabelFocusStyle: {
    color: '#4492B7'
  }
}));

function ProgrammeDashboard(props) {
  props.setTitle('Programme Dashboard');

  const classes = useStyles();
  const { onMessage } = props;
  const [category, setCategory] = useState(null);
  const [categoryList, setCategoryList] = useState([{ id: 'Overall View', category: 'Overall View', isSelected: true }]);
  const [subCategory, setSubCategory] = useState(null);
  const [activityCount, setActivityCount] = useState(0);
  const [activityStatus, setActivityStatus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Overall View');
  const [selectedCategoryName, setSelectedCategoryName] = useState('Overall View');
  const history = useHistory();
  const [totalData, setTotalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const divStyle = {
    display: 'flex',
    alignItems: 'center'
  };

  useEffect(() => {
    fetchCategories(props.onMessage, Cookies.get('project'))
      .then(allCategories => {
        categoryList.push({ id: 'Business Change', category: 'Business Change', isSelected: false });
        allCategories.map((item, index) => {
          item.isSelected = false;
          categoryList.push(item);
        });
      })
      .catch(e => props.onMessage(e, 'Error'));
  }, []);

  useEffect(() => {
    fetchCategoriesReports(props.onMessage, selectedCategory)
      .then(reports => {
        setActivityStatus(reports.cActivityStatus);
        setActivityCount(reports.activityCount);
        var arr = [];
        reports.total.map((item, index) => {
          item.editmode = false;
          item.savemode = false;
          var width = 280 / (item.completed + item.notDue + item.pending);
          if (item.completed + item.notDue + item.pending != 0) {
            item.width = width;
          } else {
            item.width = 100;
          }
          arr.push(item);
        });
        setTotalData(arr);
        setLoading(false);
      })
      .catch(e => props.onMessage(e, 'Error'));
  }, [selectedCategory]);

  const updateActivities = () => {
    if (selectedCategory === 'Business Change') {
      history.push(`/Business-change-plan`);
    } else if (totalData.length === 0) {
      props.onMessage('Add Atleast one Sub-Category', 'warning');
    } else {
      history.push(`/programme-dashboard-activities/${selectedCategory}`);
    }
  };

  const addSubCategory = () => {
    if (selectedCategory === 'Overall View') {
      props.onMessage('Please select a category to add Sub Category.', 'warning');
    } else {
      const data = {
        name: '',
        activityCount: 0,
        completed: 0,
        notDue: 0,
        pending: 0,
        editmode: true,
        savemode: true
      };
      const totalDataCopy = JSON.parse(JSON.stringify(totalData));
      totalDataCopy.push(data);
      setTotalData(totalDataCopy);
    }
  };

  const handleEdit = (id, index) => {
    const totalDataCopy = JSON.parse(JSON.stringify(totalData));
    totalDataCopy[index].editmode = true;
    totalDataCopy[index].savemode = true;
    setTotalData(totalDataCopy);
  };

  const handleChange = (e, index) => {
    const totalDataCopy = JSON.parse(JSON.stringify(totalData));
    totalDataCopy[index].name = e.target.value;
    setTotalData(totalDataCopy);
  };

  const handleSave = (id, index) => {
    const totalDataCopy = JSON.parse(JSON.stringify(totalData));
    totalDataCopy[index].editmode = false;
    totalDataCopy[index].savemode = false;
    if (id) {
      if (selectedCategory === 'Business Change') {
        var body4 = {
          category_name: totalDataCopy[index].name
        };
        updateBusinessCategory(totalDataCopy[index].id, body4, props.onMessage)
          .then(() => {
            setTotalData(totalDataCopy);
            props.onMessage('Data updated Successfully.', 'success');
          })
          .catch(e => props.onMessage(e, 'error'));
      } else {
        var body = JSON.stringify({
          name: totalDataCopy[index].name
        });
        updateSubCategories(id, body, onMessage)
          .then(() => {
            setTotalData(totalDataCopy);
            props.onMessage('Data updated Successfully.', 'success');
          })
          .catch(e => props.onMessage(e, 'error'));
      }
    } else {
      if (selectedCategory === 'Business Change') {
        var body2 = {
          category_name: totalDataCopy[index].name,
          project: {
            id: Cookies.get('project')
          },
          key_activities: []
        };
        createBusinessCategory(body2, props.onMessage)
          .then(() => {
            props.onMessage('Data created Successfully.', 'success');
            setTotalData(totalDataCopy);
          })
          .catch(e => props.onMessage(e, 'error'));
      } else {
        var body1 = {
          name: totalDataCopy[index].name,
          category: {
            id: selectedCategory
          },
          activities: []
        };
        createSubCategories(body1, onMessage)
          .then(() => {
            props.onMessage('Data created Successfully.', 'success');
            setTotalData(totalDataCopy);
          })
          .catch(e => props.onMessage(e, 'error'));
      }
    }
  };

  const handleSelectedCategory = item => {
    setSelectedCategoryName(item.category);
    setSelectedCategory(item.id);
  };

  const pieChart = activityStatus => {
    var pendingpercentage = 0;
    var notduepercentage = 0;
    var completepercentage = 0;
    if (activityStatus[0] + activityStatus[1] + activityStatus[2] > 0) {
      pendingpercentage = ((activityStatus[0] / (activityStatus[0] + activityStatus[1] + activityStatus[2])) * 100).toFixed(0);
      notduepercentage = ((activityStatus[1] / (activityStatus[0] + activityStatus[1] + activityStatus[2])) * 100).toFixed(0);
      completepercentage = ((activityStatus[2] / (activityStatus[0] + activityStatus[1] + activityStatus[2])) * 100).toFixed(0);
    }

    const data = {
      labels: [
        `Pending - ${activityStatus[0]} - ${pendingpercentage} %`,
        `Not Due - ${activityStatus[1]} - ${notduepercentage} %`,
        `Completed - ${activityStatus[2]} - ${completepercentage} %`
      ],

      datasets: [
        {
          data: activityStatus,
          backgroundColor: ['#E26320', '#E3912B', '#74C56D']
        }
      ]
    };
    var options = {
      responsive: true,
      maintainAspectRatio: false,

      legend: {
        position: 'right',
        align: 'center',

        labels: {
          boxWidth: 35
        }
      },

      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            var allData = data.datasets[tooltipItem.datasetIndex].data;
            var tooltipLabel = data.labels[tooltipItem.index];
            var tooltipData = allData[tooltipItem.index];
            var total = 0;
            for (var i in allData) {
              total += allData[i];
            }
            var tooltipPercentage = ((tooltipData / total) * 100).toFixed(2);

            return tooltipLabel;
          }
        }
      }
    };

    return <Pie data={data} height={70} options={options} />;
  };

  if (loading) {
    return (
      <Backdrop open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else {
    return (
      <React.Fragment>
        <Grid xs={12} className={classes.co}>
          <Typography className={classes.headerMargin} variant="h6">
            Select a category
          </Typography>
          <Grid container direction="column" justify="center">
            <Grid item className={classes.root}>
              {categoryList.map((item, index) => (
                <Chip
                  key={index}
                  style={{
                    color: item.id === selectedCategory ? 'white' : '#1381B9',
                    backgroundColor: item.id === selectedCategory ? '#1381B9' : 'white'
                  }}
                  className={classes.chip}
                  label={item.category}
                  clickable
                  onClick={e => handleSelectedCategory(item)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Grid>

            <Grid item container xs={12} direction="row" className={classes.margin}>
              <Grid item container xs={9} style={{ paddingLeft: '90px' }}>
                <Grid item>
                  <Typography variant="h6">{selectedCategoryName}</Typography>
                </Grid>
              </Grid>
              <Grid item container xs={3} style={{ paddingLeft: '145px' }}>
                <Grid item>
                  <Typography variant="h6">({activityCount}) Activities</Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
              <Card className={classes.padding} style={{ paddingLeft: '145px', paddingRight: '145px' }}>
                {pieChart(activityStatus)}
              </Card>
            </Grid>

            <Grid container xs={12} direction="row" className={classes.margin}>
              <Grid item container xs={9} style={{ paddingLeft: '90px' }}>
                <Grid item>
                  {selectedCategory != 'Overall View' ? (
                    <Typography variant="h6">Sub-Categories</Typography>
                  ) : (
                    <Typography variant="h6">Categories</Typography>
                  )}
                </Grid>
              </Grid>
              <Grid item container xs={3} style={{ paddingLeft: '100px' }}>
                <Grid item>
                  {selectedCategory != 'Overall View' ? (
                    <Link component={RouterLink} onClick={e => addSubCategory()}>
                      <h3>Add Sub-Category</h3>
                    </Link>
                  ) : null}
                </Grid>
              </Grid>
            </Grid>

            {totalData.map((item, index) => (
              <Grid>
                <table style={{ display: 'flex', justifyContent: 'center' }}>
                  <tbody>
                    <td style={{ width: '71rem' }}>
                      <Card className={classes.card}>
                        <Grid item container xs={12} className={classes.content}>
                          <Grid item xs={12} xs={5}>
                            <TextField
                              style={{ width: '95%' }}
                              autoFocus={true}
                              disabled={item.editmode === false}
                              onChange={e => handleChange(e, index)}
                              value={item.name}
                              InputProps={{
                                className: classes.floatingLabelFocusStyle,
                                classes: {
                                  root: classes.underline
                                }
                              }}
                            />
                          </Grid>

                          <Divider orientation="vertical" flexItem />

                          <Grid item xs={12} xs={1} style={{ textAlign: 'center', paddingTop: '8px' }}>
                            <Typography>{item.activityCount}</Typography>
                          </Grid>

                          <Divider orientation="vertical" flexItem />

                          <Grid item xs={12} xs={4} spacing={1} style={{ textAlign: 'center', paddingLeft: '8px', paddingTop: '8px' }}>
                            <Grid item xs={12} style={divStyle}>
                              <Grid>
                                <Completed
                                  className={classes.linp}
                                  style={{ width: item.width === 100 ? item.width : item.completed === 0 ? 10 : item.completed * item.width }}
                                  variant="determinate"
                                  value={100}
                                />
                                {item.completed}
                              </Grid>
                              <Grid>
                                <Pending
                                  className={classes.linp}
                                  style={{ width: item.width === 100 ? item.width : item.pending === 0 ? 10 : item.pending * item.width }}
                                  variant="determinate"
                                  value={100}
                                />
                                {item.pending}
                              </Grid>
                              <Grid>
                                <NotDue
                                  className={classes.linp}
                                  style={{ width: item.width === 100 ? item.width : item.notDue === 0 ? 10 : item.notDue * item.width }}
                                  variant="determinate"
                                  value={100}
                                />
                                {item.notDue}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Card>
                    </td>
                    <td>
                      {selectedCategory != 'Overall View' ? (
                        <Grid item container style={{ marginTop: '15px' }} justify="flex-end" alignItems="flex-start">
                          {item.editmode === false ? (
                            <IconButton aria-label={item.id} onClick={e => handleEdit(item.id, index)}>
                              <EditIcon color="primary" />
                            </IconButton>
                          ) : item.savemode ? (
                            <IconButton aria-label={item.id} onClick={e => handleSave(item.id, index)}>
                              <SaveIcon color="primary" />
                            </IconButton>
                          ) : null}
                        </Grid>
                      ) : null}
                    </td>
                  </tbody>
                </table>
              </Grid>
            ))}

            <Grid item container className={classes.button} justify="flex-end">
              <Button variant="contained" color="primary" onClick={e => updateActivities()}>
                Update Activities
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default ProgrammeDashboard;
