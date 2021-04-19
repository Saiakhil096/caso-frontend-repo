import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { grey, red, green } from '@material-ui/core/colors';
import { TokenIconColor, TextIcon } from '../../common/CustomIcons';
import { Grid, Typography, Radio, Tooltip } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  subheading: {
    color: grey[500]
  }
}));

function CurrentRating(props) {
  const { setValues } = props;
  const CustomRadio = withStyles(({ palette, spacing }) => ({
    root: {
      color: grey[800]
    }
  }))(props => <Radio color="default" {...props} />);

  const handlePainpoints = event => {
    setValues(event.target.value);
  };
  const radioTitle = id => {
    let votes = props.ratingAverage.filter(ratingVotes => id.toString().indexOf(ratingVotes.toString()) !== -1);

    let reasons = props.totalReasons.filter(reason => id.toString().indexOf(reason.rating.toString()) !== -1);

    return (
      <Grid>
        <Typography>Votes : {votes.length} </Typography>
        <hr />
        <Typography>Reasons :{reasons.length} </Typography>
      </Grid>
    );
  };

  const checkedIconColor = (averageValue, value) => {
    if (averageValue === value) {
      return (
        <TokenIconColor
          value={props.averageValue}
          style={{
            height: '60px',
            width: '60px'
          }}
          average={true}
          fill={red[500]}
          fontSize="large"
        />
      );
    } else {
      return (
        <TokenIconColor
          value={props.averageValue}
          style={{
            height: '60px',
            width: '60px'
          }}
          fill={green[50]}
          fontSize="large"
        />
      );
    }
  };
  const selectedIconColor = (averageValue, value) => {
    if (averageValue == value) {
      return (
        <TokenIconColor
          value={props.averageValue}
          style={{
            height: '60px',
            width: '60px'
          }}
          selected={true}
          average={true}
          selectedColor={red[500]}
          fontSize="large"
        />
      );
    } else {
      return (
        <TokenIconColor
          value={props.averageValue}
          style={{
            height: '60px',
            width: '60px'
          }}
          selected={true}
          selectedColor={grey[50]}
          fontSize="large"
        />
      );
    }
  };
  const classes = useStyles();
  return (
    <Grid container direction="row" spacing={2}>
      <Grid item container>
        <Grid item>
          <CustomRadio
            color="secondary"
            name="All Rating"
            value={'All'}
            checked={props.values === 'All'}
            onChange={handlePainpoints}
            icon={
              <TextIcon
                value={props.ratingInfo.map(i => i.ratingReason).length}
                style={{
                  height: '60px',
                  width: '60px',
                  fontSize: '7px'
                }}
                fontSize="large"
              />
            }
            checkedIcon={
              <TextIcon
                value={props.ratingInfo.map(i => i.ratingReason).length}
                style={{
                  height: '60px',
                  width: '60px',
                  fontSize: '7px'
                }}
                selected={true}
                fontSize="large"
              />
            }
          />
        </Grid>

        <Grid item>
          <Typography style={{ padding: '22px' }}>or</Typography>
        </Grid>
        <Grid item>
          <Tooltip title={radioTitle('0')} arrow>
            <CustomRadio
              color="primary"
              name="rating"
              value="0"
              checked={props.values === '0'}
              onChange={handlePainpoints}
              icon={checkedIconColor(props.averageValue, 0)}
              checkedIcon={selectedIconColor(props.averageValue, 0)}
            />
          </Tooltip>
          <Typography variant="body2" className={classes.subheading} align="center">
            Low
          </Typography>
        </Grid>
        <Grid item>
          <Tooltip title={radioTitle('1')} arrow>
            <CustomRadio
              color="primary"
              name="rating"
              value="1"
              checked={props.values === '1'}
              onChange={handlePainpoints}
              icon={checkedIconColor(props.averageValue, 1)}
              checkedIcon={selectedIconColor(props.averageValue, 1)}
            />
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title={radioTitle('2')} arrow>
            <CustomRadio
              color="primary"
              name="rating"
              value="2"
              checked={props.values === '2'}
              onChange={handlePainpoints}
              icon={checkedIconColor(props.averageValue, 2)}
              checkedIcon={selectedIconColor(props.averageValue, 2)}
            />
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title={radioTitle('3')} arrow>
            <CustomRadio
              name="rating"
              value="3"
              checked={props.values === '3'}
              onChange={handlePainpoints}
              icon={checkedIconColor(props.averageValue, 3)}
              checkedIcon={selectedIconColor(props.averageValue, 3)}
            />
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title={radioTitle('4')} arrow>
            <CustomRadio
              color="primary"
              name="rating"
              value="4"
              checked={props.values === '4'}
              onChange={handlePainpoints}
              icon={checkedIconColor(props.averageValue, 4)}
              checkedIcon={selectedIconColor(props.averageValue, 4)}
            />
          </Tooltip>
          <Typography variant="body2" className={classes.subheading} align="center">
            Leading
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
export default CurrentRating;
