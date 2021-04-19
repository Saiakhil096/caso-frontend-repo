import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { grey, red, green } from '@material-ui/core/colors';
import { TokenIconColor } from '../../common/CustomIcons';
import { Grid, Typography, Radio, Tooltip, Divider } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  subheading: {
    color: grey[500]
  },
  maturityRatingText: {
    color: '#B8B8CC',
    textAlign: 'center'
  }
}));
function ImprovementRating(props) {
  const classes = useStyles();

  const CustomRadio = withStyles(({ palette, spacing }) => ({
    root: {
      color: grey[800]
    }
  }))(props => <Radio color="default" {...props} />);

  const radioTitle = idValue => {
    let votes = props.ratingAverage.filter(ratingVotes => idValue.toString().indexOf(ratingVotes.toString()) !== -1);

    return (
      <Grid>
        <Typography>Current Votes : {votes.length} </Typography>
      </Grid>
    );
  };
  const normalizedCurrentRating = Math.round(props.averageValue * (9 / 5));

  const normalizedImprovementRating = Math.round(props.averageImprovements * (9 / 5));
  const checkedIconColor = (averageValue, improvementValue, value) => {
    if (averageValue === value) {
      return (
        <TokenIconColor
          disable
          style={{
            height: '60px',
            width: '60px'
          }}
          average={true}
          fill={red[500]}
          fontSize="large"
        />
      );
    } else if (averageValue < value && improvementValue > value) {
      return (
        <TokenIconColor
          disable
          style={{
            height: '60px',
            width: '60px'
          }}
          average={true}
          fill={grey[500]}
          fontSize="large"
        />
      );
    } else if (improvementValue === value) {
      return (
        <TokenIconColor
          disable
          style={{
            height: '60px',
            width: '60px'
          }}
          average={true}
          fill={green[500]}
          fontSize="large"
        />
      );
    } else {
      return (
        <TokenIconColor
          disable
          style={{
            height: '60px',
            width: '60px'
          }}
          average={true}
          fill={grey[50]}
          fontSize="large"
        />
      );
    }
  };
  const ratingIcons = (id, num) => {
    let icons = [];

    for (let index = id, i = 0; i < num; index++, i++) {
      icons.push(
        <Tooltip title={radioTitle(Math.round(index * (5 / 9)))} arrow>
          <Grid item>
            <CustomRadio
              color="primary"
              name="rating"
              disabled="true"
              value={index}
              icon={checkedIconColor(normalizedCurrentRating, normalizedImprovementRating, index)}
            />
          </Grid>
        </Tooltip>
      );
    }
    return (
      <Grid container direction="row">
        <Grid item container>
          {icons}
        </Grid>
      </Grid>
    );
  };

  return (
    <Grid container direction="row" spacing={2}>
      <Grid item container>
        <Grid item>
          {ratingIcons(1, 3)}
          <Typography variant="body2" className={classes.maturityRatingText}>
            Low
          </Typography>
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item>
          {ratingIcons(4, 3)}
          <Typography variant="body2" className={classes.maturityRatingText}>
            Average
          </Typography>
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item>
          {ratingIcons(7, 3)}
          <Typography variant="body2" className={classes.maturityRatingText}>
            Leading
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
export default ImprovementRating;
