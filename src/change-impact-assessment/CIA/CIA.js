import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  TextField,
  FormHelperText,
  Button,
  Tooltip,
  Paper,
  Typography,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox
} from '@material-ui/core';
import { VerySadIcon, SadIcon, OkIcon, HappyIcon, VeryHappyIcon } from '../../common/CustomIcons';
import { red, amber, yellow, lightGreen, green } from '@material-ui/core/colors';
import { Close as CloseIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { createPerception, fetchProjectSpecificPerceptions } from '../../common/API';
import Smiley from './Smiley';

const useStyles = makeStyles(theme => ({
  paper: {
    background: 'none',
    width: '100%',
    maxWidth: '40rem',
    margin: theme.spacing(1, 'auto'),
    padding: theme.spacing(2),
    boxShadow: 'none'
  }
}));

function CIA(props) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [filteredPainpoints, setFilteredPainpoints] = useState([]);
  const [newPerceptionReason, setNewPerceptionReason] = useState('');
  const [painpoints, setPainpoints] = useState([]);
  const [refresher, setRefresher] = useState(true);
  const [rating, setRating] = useState(null);
  const [createNew, setCreateNew] = useState(false);
  const [checkedOptions, setCheckedOptions] = useState([]);

  useEffect(() => {
    if (props.editFormId !== undefined && props.formCIA.Opportunities_The_Change_Enabled.length > 0) {
      setCheckedOptions(props.formCIA.Opportunities_The_Change_Enabled);
    }
    if (refresher) {
      fetchProjectSpecificPerceptions(props.projectId, props.onMessage).then(data => {
        let painpoints = [];

        data.map(item => {
          item.Perception.map(perception => {
            perception.pain_points.map(pain_point => {
              var obj = {
                rating: perception.rating,
                l_2_process: perception.l_2_process,
                painpoint: pain_point.pain_point_text,
                checked: false
              };
              painpoints.push(obj);
            });
          });
        });

        setPainpoints(painpoints);
        setRefresher(false);
      });
    }
  }, [refresher]);

  const handleAddNew = () => {
    let filteredPainpointsData = painpoints.filter(painpoint => {
      return painpoint.l_2_process.id === props.formCIA.l_2_process.id;
    });
    filteredPainpointsData.map(painpointRecord => {
      checkedOptions.map(checkedRecord => {
        if (painpointRecord.painpoint === checkedRecord.painpoint) {
          painpointRecord.checked = true;
        }
      });
    });
    setFilteredPainpoints(filteredPainpointsData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCreateNew(false);
  };

  const handleBack = () => {
    setCreateNew(false);
  };
  const handleCreateNew = () => {
    setCreateNew(true);
  };

  const handleRatingChange = event => {
    setRating(event.target.value);
  };

  const handleCheckBox = (event, painpoint, index) => {
    const values = [...checkedOptions];
    const filteredPainpointsCopy = filteredPainpoints;
    filteredPainpointsCopy[index].checked = event.target.checked;
    setFilteredPainpoints(filteredPainpointsCopy);
    if (event.target.checked) {
      values.push(painpoint);
      setCheckedOptions(values);
    } else {
      for (let i = 0; i < values.length; i++) {
        if (values[i].painpoint === painpoint.painpoint) {
          values.splice(i, 1);
          setCheckedOptions(values);
          break;
        }
      }
    }
  };

  const handleSave = () => {
    props.setFormCIA({ ...props.formCIA, Opportunities_The_Change_Enabled: checkedOptions });
    setOpen(false);
  };

  const handleOpportunityDelete = (opportunity, index) => {
    const opportunitiesCopy = [...props.formCIA.Opportunities_The_Change_Enabled];
    opportunitiesCopy.splice(index, 1);
    props.setFormCIA({ ...props.formCIA, Opportunities_The_Change_Enabled: opportunitiesCopy });
    for (let i = 0; i < filteredPainpoints.length; i++) {
      if (Object.entries(filteredPainpoints[i]).toString() === Object.entries(opportunity).toString()) {
        filteredPainpoints[i].checked = false;
        setFilteredPainpoints(filteredPainpoints);
        break;
      }
    }
    const values = [...checkedOptions];
    for (let i = 0; i < values.length; i++) {
      if (Object.entries(values[i]).toString() === Object.entries(opportunity).toString()) {
        values.splice(i, 1);
        setCheckedOptions(values);
        break;
      }
    }
  };

  const handleCreateNewPerception = () => {
    if (newPerceptionReason === '') {
      props.onMessage('Cannot create a blank Perception! Please enter data and save', 'error');
    } else {
      const newPerception = {
        Perception: [
          {
            rating: rating,
            pain_points: [
              {
                pain_point_text: newPerceptionReason
              }
            ],
            l_2_process: props.formCIA.l_2_process.id
          }
        ],
        user: props.userId,
        project: props.projectId
      };
      createPerception(newPerception, props.onMessage).then(() => {
        props.onMessage('Perception Created Successfully', 'success');

        const opportunitiesCopy = [...props.formCIA.Opportunities_The_Change_Enabled];
        const newValue = {
          rating: parseInt(rating),
          l_2_process: props.formCIA.l_2_process,
          painpoint: newPerceptionReason,
          checked: true
        };

        opportunitiesCopy.push(newValue);
        const checkedCopy = [...checkedOptions];

        checkedCopy.push(newValue);
        if (checkedCopy.length > opportunitiesCopy.length) {
          for (let j = 0; j < checkedCopy.length; j++) {
            let counter = 0;
            for (let i = 0; i < opportunitiesCopy.length; i++) {
              if (Object.entries(opportunitiesCopy[i]).toString() === Object.entries(checkedCopy[j]).toString()) {
                counter++;
                break;
              }
            }
            if (counter === 0) {
              opportunitiesCopy.push(checkedCopy[j]);
            }
          }
        }
        setCheckedOptions(checkedCopy);
        props.setFormCIA({ ...props.formCIA, Opportunities_The_Change_Enabled: opportunitiesCopy });
        setNewPerceptionReason('');
        handleClose(false);
        setRefresher(true);
      });
    }
  };

  const getToken = (index, selected) => {
    switch (index) {
      case 0:
        return <VerySadIcon key={index} selected={selected} selectedColor={red[500]} fontSize="large" />;
      case 1:
        return <SadIcon key={index} selected={selected} selectedColor={amber[500]} fontSize="large" />;
      case 2:
        return <OkIcon key={index} selected={selected} selectedColor={yellow[500]} fontSize="large" />;
      case 3:
        return <HappyIcon key={index} selected={selected} selectedColor={lightGreen[500]} fontSize="large" />;
      case 4:
        return <VeryHappyIcon key={index} selected={selected} selectedColor={green[500]} fontSize="large" />;
      default:
        return '';
    }
  };

  return (
    <React.Fragment>
      <Paper component="form" className={classes.paper}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <TextField
                required
                id="as_is"
                label="As-Is"
                color="primary"
                variant="filled"
                value={props.formCIA.as_is}
                onChange={props.onTextChange}
                inputProps={{ 'data-testid': 'as_is' }}
                error={props.errors.as_is_bool}
                helperText={props.errors.as_is}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <TextField
                required
                id="to_be"
                label="To-Be"
                color="primary"
                variant="filled"
                value={props.formCIA.to_be}
                onChange={props.onTextChange}
                inputProps={{ 'data-testid': 'to_be' }}
                error={props.errors.to_be_bool}
                helperText={props.errors.to_be}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" variant="filled">
              <TextField
                required
                id="business_change_impact"
                label="Business Change Impact"
                color="primary"
                variant="filled"
                value={props.formCIA.business_change_impact}
                onChange={props.onTextChange}
                inputProps={{ 'data-testid': 'business_change_impact' }}
                error={props.errors.business_change_impact_bool}
                helperText={props.errors.business_change_impact}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography>Change Impact Weighting *</Typography>
          </Grid>
          <Grid container align="center" item xs={12}>
            <Grid item xs={2}>
              <Button
                variant="contained"
                color={props.changeImpactWeightButtonColor.low}
                onClick={() => props.handleChangeImpactWeightButtonColor('Low')}>
                Low
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                color={props.changeImpactWeightButtonColor.medium}
                onClick={() => props.handleChangeImpactWeightButtonColor('Medium')}>
                Medium
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                variant="contained"
                color={props.changeImpactWeightButtonColor.high}
                onClick={() => props.handleChangeImpactWeightButtonColor('High')}>
                High
              </Button>
            </Grid>
            <Grid item xs={6}>
              <FormControl error={props.errors.change_impact_weight_bool} fullWidth margin="normal" variant="filled">
                <FormHelperText>{props.errors.change_impact_weight}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Typography>Benefit Value *</Typography>
          </Grid>
          <Grid container align="center" item xs={12}>
            <Grid item xs={2}>
              <Tooltip title="under $100K" arrow>
                <Button variant="contained" color={props.benefitValueButtonColor.low} onClick={() => props.handleBenefitValueButtonColor('Low')}>
                  Low
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={2}>
              <Tooltip title="$100K to $250K" arrow>
                <Button
                  variant="contained"
                  color={props.benefitValueButtonColor.medium}
                  onClick={() => props.handleBenefitValueButtonColor('Medium')}>
                  Medium
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={2}>
              <Tooltip title="$250K – million dollars" arrow>
                <Button variant="contained" color={props.benefitValueButtonColor.high} onClick={() => props.handleBenefitValueButtonColor('High')}>
                  High
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={6}>
              <FormControl error={props.errors.benefit_value_bool} fullWidth margin="normal" variant="filled">
                <FormHelperText>{props.errors.benefit_value}</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>

          <Grid item xs={12} container spacing={2}>
            <Grid item container xs={12} justify="space-between">
              <Grid item xs={10}>
                <Typography>Opportunities The Change Enables</Typography>
              </Grid>
              <Grid item xs={2} container justify="flex-end">
                <Button onClick={handleAddNew} color="primary">
                  Add New
                </Button>
              </Grid>
            </Grid>

            {props.formCIA.Opportunities_The_Change_Enabled.map((opportunity, index) => {
              return (
                <Grid key={index} item container xs={12}>
                  <Grid item container xs={2} justify="center" alignItems="center">
                    {getToken(opportunity.rating, true)}
                  </Grid>
                  <Grid style={{ backgroundColor: '#E4E4E4', padding: 10 }} item xs={8}>
                    <Typography>{opportunity.painpoint}</Typography>
                  </Grid>
                  <Grid item container xs={2} justify="center">
                    <Tooltip title="Delete" arrow>
                      <IconButton onClick={() => handleOpportunityDelete(opportunity, index)} aria-label="delete" color="primary">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Paper>

      <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose} aria-labelledby="dialog-title">
        <DialogTitle id="dialog-title">
          <Grid container item xs={12}>
            <Grid item container xs={11} justify="center">
              <Typography align="center" style={{ padding: 15 }}>
                {props.formCIA.l_2_process !== null ? props.formCIA.l_2_process.title : null}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton aria-label="search" onClick={handleClose} color="primary">
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          {createNew ? (
            <Paper component="form" className={classes.paper}>
              <Grid container spacing={3}>
                <Grid item container xs={12} spacing={2}>
                  <Grid item container xs={12}>
                    <Typography style={{ padding: 10 }}>Perception</Typography>
                  </Grid>
                  <Box>
                    <Smiley rating={rating} onRateChange={handleRatingChange} />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth margin="normal" variant="filled">
                    <TextField
                      required
                      id="reason"
                      label="Reason"
                      color="primary"
                      variant="filled"
                      onChange={e => setNewPerceptionReason(e.target.value)}
                      value={newPerceptionReason}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '10%' }}></TableCell>

                    <TableCell style={{ width: '15%' }} align="center">
                      Perception
                    </TableCell>

                    <TableCell>Reason</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPainpoints.map((pain_point, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        <Checkbox
                          name="temp"
                          checked={pain_point.checked}
                          onChange={event => handleCheckBox(event, pain_point, index)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="center">{getToken(pain_point.rating, true)}</TableCell>
                      <TableCell>{pain_point.painpoint}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        {createNew ? (
          <DialogActions>
            <Grid container xs={12}>
              <Grid item container xs={2} justify="flex-end">
                <Button onClick={handleBack} variant="contained" color="primary">
                  Back
                </Button>
              </Grid>
              <Grid item container xs={8}></Grid>
              <Grid item container xs={2}>
                <Button onClick={handleCreateNewPerception} variant="contained" color="primary">
                  Save
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        ) : (
          <DialogActions>
            <Button onClick={handleCreateNew} variant="contained" color="primary">
              Create New
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </React.Fragment>
  );
}

export default CIA;
