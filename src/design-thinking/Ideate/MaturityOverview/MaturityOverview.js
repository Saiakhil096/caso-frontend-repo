import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { red, amber, yellow, green, lightGreen, grey } from '@material-ui/core/colors';
import { Grid, Divider, Typography, Button, Radio } from '@material-ui/core';
import MaturityRatingDialogBox from './MaturityRatingDialogBox';
import PainpointDialogBox from './PainpointDialogBox';
import {
  TokenIcon,
  Rating1Icon,
  Rating2Icon,
  Rating3Icon,
  Rating4Icon,
  Rating5Icon,
  VerySadIcon,
  SadIcon,
  OkIcon,
  HappyIcon,
  VeryHappyIcon
} from '../../../common/CustomIcons';

const useStyles = makeStyles(theme => ({
  subheading: {
    color: '#B8B8CC'
  },
  maturityRatingText: {
    color: '#B8B8CC',
    textAlign: 'center'
  },
  tileContainer: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '0.5rem 1.5rem',
    minHeight: 105,
    margin: '10px 0px'
  },
  painpointPerceptionHeading: {
    color: '#B8B8CC',
    marginBottom: 10
  },
  entityName: {
    color: '#858585',
    alignSelf: 'center',
    marginBottom: '5px'
  },
  targetBaseline: {
    color: '#B8B8CC',
    alignSelf: 'center'
  },
  selfAlignCenter: {
    alignSelf: 'center'
  },
  painpointsContainer: {
    textAlignLast: 'center'
  },
  container: {
    padding: '20px'
  },
  radioStyles: {
    padding: '2px 5px 0px 0px'
  },
  avatar: {
    margin: 'auto',
    width: theme.spacing(7),
    height: theme.spacing(7)
  },
  cursor: {
    cursor: 'pointer'
  }
}));

function MaturityOverview(props) {
  const [isMaturityRatingDialogBoxOpen, setIsMaturityRatingDialogBoxOpen] = useState(false);
  const [isPainpointDialogBoxOpen, setIsPainpointDialogBoxOpen] = useState(false);

  const CustomRadio = withStyles(({ palette, spacing }) => ({
    root: {
      color: grey[500]
    }
  }))(props => <Radio color="default" {...props} />);

  const {
    currentProcess,
    perception,
    getNormalizedMaturityRating,
    getNormalizedImprovementRating,
    priority,
    currentProcessIndex,
    totalProcesses,
    onMessage,
    maturityQuestions,
    maturityRatings,
    improvementRatings
  } = props;

  const classes = useStyles();

  const openMaturityRatingDialogBox = () => {
    setIsMaturityRatingDialogBoxOpen(true);
  };
  const closeMaturityRatingDialogBox = () => {
    setIsMaturityRatingDialogBoxOpen(false);
  };
  const openPainpointDialogBox = () => {
    setIsPainpointDialogBoxOpen(true);
  };
  const closePainpointDialogBox = () => {
    setIsPainpointDialogBoxOpen(false);
  };

  const ratingIcons = (val, num, currentrating, improvementrating, label) => {
    let items = [];
    const checkedIconColor = (id, currentrating, improvementrating) => {
      if (currentrating === id) {
        return <TokenIcon selected={true} selectedColor={red[500]} fontSize="large" />;
      } else if (currentrating < id && improvementrating > id) {
        return <TokenIcon selected={true} selectedColor={grey[500]} fontSize="large" />;
      } else if (improvementrating === id) {
        return <TokenIcon selected={true} selectedColor={green[500]} fontSize="large" />;
      }
    };

    for (let id = val; id <= num; id++) {
      items.push(
        <CustomRadio
          value={id}
          checked={(currentrating <= id && improvementrating >= id) || (currentrating === id && improvementrating == null)}
          icon={<TokenIcon transparent disabled fontSize="large" />}
          checkedIcon={checkedIconColor(id, currentrating, improvementrating)}
          disabled="true"
        />
      );
    }
    return (
      <Grid item className={classes.selfAlignCenter}>
        {items}
        <Typography variant="body2" className={classes.maturityRatingText}>
          {label}
        </Typography>
      </Grid>
    );
  };

  return (
    <Grid container direction="column" spacing={2} className={classes.container}>
      <Grid container className={classes.tileContainer} justify="space-around">
        <Grid item direction="column" className={classes.selfAlignCenter}>
          <Typography variant="body2" className={classes.subheading}>{`${currentProcessIndex + 1} of ${totalProcesses}`}</Typography>
          <Typography variant="h5">{currentProcess.title}</Typography>
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item>
          <Typography variant="body2" className={classes.painpointPerceptionHeading} marginBottom="10">
            Perception
          </Typography>
          <Grid item align="center">
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
          </Grid>
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item className={classes.painpointsContainer}>
          <Typography variant="body2" className={classes.subheading}>
            Painpoints
          </Typography>
          <Typography align="center" variant="h3">
            {perception.pain_points.length}
          </Typography>
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item>
          <Typography variant="body2" className={classes.painpointPerceptionHeading} marginBottom="10">
            Priority
          </Typography>
          <Grid item align="center">
            {(() => {
              switch (priority.rating) {
                default:
                  return;
                case 0:
                  return <Rating1Icon selected={true} selectedColor={red[500]} fontSize="large" />;
                case 1:
                  return <Rating2Icon selected={true} selectedColor={amber[500]} fontSize="large" />;
                case 2:
                  return <Rating3Icon selected={true} selectedColor={yellow[500]} fontSize="large" />;
                case 3:
                  return <Rating4Icon selected={true} selectedColor={lightGreen[500]} fontSize="large" />;
                case 4:
                  return <Rating5Icon selected={true} selectedColor={green[500]} fontSize="large" />;
              }
            })()}
          </Grid>
        </Grid>
      </Grid>
      <Grid container justify="space-between" className={`${classes.tileContainer} ${classes.cursor}`} onClick={openMaturityRatingDialogBox}>
        <Grid item className={classes.selfAlignCenter}>
          <Typography variant="body1" className={classes.entityName}>
            Maturity Assessment
          </Typography>
          <Grid container>
            <Grid container>
              <CustomRadio
                className={classes.radioStyles}
                disabled="true"
                icon={<TokenIcon selected={true} selectedColor={red[500]} fontSize="small" />}
              />
              <Typography variant="caption" className={classes.targetBaseline}>
                Baseline
              </Typography>
            </Grid>
            <Grid container>
              <CustomRadio
                className={classes.radioStyles}
                disabled="true"
                icon={<TokenIcon selected={true} selectedColor={green[500]} fontSize="small" />}
              />
              <Typography variant="caption" className={classes.targetBaseline}>
                Target
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {ratingIcons(1, 3, getNormalizedMaturityRating, getNormalizedImprovementRating, 'Low')}
        <Divider orientation="vertical" flexItem />
        {ratingIcons(4, 6, getNormalizedMaturityRating, getNormalizedImprovementRating, 'Average')}
        <Divider orientation="vertical" flexItem />
        {ratingIcons(7, 9, getNormalizedMaturityRating, getNormalizedImprovementRating, 'Leading')}
      </Grid>
      <Grid>
        <MaturityRatingDialogBox
          isMaturityRatingDialogBoxOpen={isMaturityRatingDialogBoxOpen}
          closeMaturityRatingDialogBox={closeMaturityRatingDialogBox}
          maturityRatings={maturityRatings}
          improvementRatings={improvementRatings}
          maturityQuestions={maturityQuestions}
        />
      </Grid>
      <Grid>
        <PainpointDialogBox
          perception={perception}
          isPainpointDialogBoxOpen={isPainpointDialogBoxOpen}
          closePainpointDialogBox={closePainpointDialogBox}
        />
      </Grid>
    </Grid>
  );
}

export default MaturityOverview;
