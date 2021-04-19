import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Grid, Divider, Typography, Button, Radio } from '@material-ui/core';
import { red, amber, yellow, lightGreen, green, grey, lightBlue } from '@material-ui/core/colors';
import {
  Rating1Icon,
  Rating2Icon,
  Rating3Icon,
  Rating4Icon,
  Rating5Icon,
  VerySadIcon,
  SadIcon,
  OkIcon,
  HappyIcon,
  VeryHappyIcon,
  TokenIcon
} from '../../common/CustomIcons';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '0.5rem 1rem'
  },
  button: {
    backgroundColor: 'rgba(224, 224, 224, 0.65)'
  },
  content1: {
    color: 'white'
  },
  fixedPosition: {
    position: 'sticky',
    top: theme.spacing(2)
  }
}));

function Questions(props) {
  const classes = useStyles();

  const CustomRadio = withStyles(({ palette, spacing }) => ({
    root: {
      color: grey[500]
    }
  }))(props => <Radio color="default" {...props} />);

  const handleNext = () => {
    if (props.remainingTokens > 0) {
      props.onMessage('You must use all of your improvement points to proceed', 'warning');
      return;
    } else {
      props.onNextProcess();
    }
  };

  const handleRatingClick = (event, questionIndex) => {
    const selectedIndex = parseInt(event.target.value);
    const ratingChanged = props.onRatingClick(selectedIndex, questionIndex);
    if (!ratingChanged) {
      event.preventDefault();
      props.onMessage("You don't have enough remaining tokens", 'warning');
    }
  };

  return (
    <Grid container direction="column" spacing={2} className={classes.fixedPosition}>
      <Grid item>
        <Typography className={classes.content1}>{`${props.step} of ${props.totalSteps}`}</Typography>
        <Grid item container alignItems="center" className={classes.container}>
          <Typography variant="h5">{props.process.title}</Typography>
          <Divider variant="middle" orientation="vertical" flexItem />
          <Grid item>
            {(() => {
              switch (props.perception.rating) {
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
          <Divider variant="middle" orientation="vertical" flexItem />
          <Grid item>
            <Typography align="center" variant="h5">
              {props.perception.pain_points.length}
            </Typography>
            <Typography variant="body2">Reasons</Typography>
          </Grid>
          <Divider variant="middle" orientation="vertical" flexItem />
          <Grid item>
            {(() => {
              switch (props.priority.rating) {
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
          <Divider variant="middle" orientation="vertical" flexItem />
          <Grid item>
            {(() => {
              switch (props.priority.rating) {
                default:
                  return;
                case 0:
                  return <Typography variant="body2">This is the lowest priority because...</Typography>;
                case 1:
                  return <Typography variant="body2">This is low priority because...</Typography>;
                case 2:
                  return <Typography variant="body2">This is medium priority because...</Typography>;
                case 3:
                  return <Typography variant="body2">This is high priority because...</Typography>;
                case 4:
                  return <Typography variant="body2">This is the highest priority because...</Typography>;
              }
            })()}
          </Grid>
        </Grid>
      </Grid>
      {props.maturityRatings.reduce((a, item, index) => {
        if (props.maturityQuestions.find(q => q.id === item.maturity_question.id)) {
          return a.concat(
            <Grid item container>
              <Grid item>
                <Typography className={classes.content1}>
                  {index + 1}. {item.maturity_question.question_text}
                </Typography>
              </Grid>
              <Grid item container>
                <Grid item>
                  <CustomRadio
                    value="0"
                    checked={
                      (props.improvementRatings[index].rating &&
                        props.improvementRatings[index].rating >= 0 &&
                        props.maturityRatings[index].rating < 0) ||
                      props.maturityRatings[index].rating === 0
                    }
                    onClick={e => handleRatingClick(e, index)}
                    icon={<TokenIcon transparent disabled={props.maturityRatings[index].rating >= 0} fontSize="large" />}
                    checkedIcon={
                      <TokenIcon
                        selected={true}
                        selectedColor={lightBlue['A100']}
                        disabled={props.maturityRatings[index].rating >= 0}
                        fontSize="large"
                      />
                    }
                    disabled={props.maturityRatings[index].rating >= 0}
                  />
                </Grid>
                <Grid item>
                  <CustomRadio
                    value="1"
                    checked={
                      (props.improvementRatings[index].rating &&
                        props.improvementRatings[index].rating >= 1 &&
                        props.maturityRatings[index].rating < 1) ||
                      props.maturityRatings[index].rating === 1
                    }
                    onClick={e => handleRatingClick(e, index)}
                    icon={<TokenIcon transparent disabled={props.maturityRatings[index].rating >= 1} fontSize="large" />}
                    checkedIcon={
                      <TokenIcon
                        selected={true}
                        selectedColor={lightBlue['A100']}
                        disabled={props.maturityRatings[index].rating >= 1}
                        fontSize="large"
                      />
                    }
                    disabled={props.maturityRatings[index].rating >= 1}
                  />
                </Grid>
                <Grid item>
                  <CustomRadio
                    value="2"
                    checked={
                      (props.improvementRatings[index].rating &&
                        props.improvementRatings[index].rating >= 2 &&
                        props.maturityRatings[index].rating < 2) ||
                      props.maturityRatings[index].rating === 2
                    }
                    onClick={e => handleRatingClick(e, index)}
                    icon={<TokenIcon transparent disabled={props.maturityRatings[index].rating >= 2} fontSize="large" />}
                    checkedIcon={
                      <TokenIcon
                        selected={true}
                        selectedColor={lightBlue['A100']}
                        disabled={props.maturityRatings[index].rating >= 2}
                        fontSize="large"
                      />
                    }
                    disabled={props.maturityRatings[index].rating >= 2}
                  />
                </Grid>
                <Grid item>
                  <CustomRadio
                    value="3"
                    checked={
                      (props.improvementRatings[index].rating &&
                        props.improvementRatings[index].rating >= 3 &&
                        props.maturityRatings[index].rating < 3) ||
                      props.maturityRatings[index].rating === 3
                    }
                    onClick={e => handleRatingClick(e, index)}
                    icon={<TokenIcon transparent disabled={props.maturityRatings[index].rating >= 3} fontSize="large" />}
                    checkedIcon={
                      <TokenIcon
                        selected={true}
                        selectedColor={lightBlue['A100']}
                        disabled={props.maturityRatings[index].rating >= 3}
                        fontSize="large"
                      />
                    }
                    disabled={props.maturityRatings[index].rating >= 3}
                  />
                </Grid>
                <Grid item>
                  <CustomRadio
                    value="4"
                    checked={
                      (props.improvementRatings[index].rating &&
                        props.improvementRatings[index].rating >= 4 &&
                        props.maturityRatings[index].rating < 4) ||
                      props.maturityRatings[index].rating === 4
                    }
                    onClick={e => handleRatingClick(e, index)}
                    icon={<TokenIcon transparent disabled={props.maturityRatings[index].rating >= 4} fontSize="large" />}
                    checkedIcon={
                      <TokenIcon
                        selected={true}
                        selectedColor={lightBlue['A100']}
                        disabled={props.maturityRatings[index].rating >= 4}
                        fontSize="large"
                      />
                    }
                    disabled={props.maturityRatings[index].rating >= 4}
                  />
                </Grid>
              </Grid>
            </Grid>
          );
        } else {
          return a;
        }
      }, [])}
      <Grid item container justify="flex-end" alignItems="baseline">
        <Grid item>
          <Button variant="contained" className={classes.button} style={{ color: grey[50] }} onClick={handleNext}>
            {props.step === props.totalSteps ? 'Complete' : 'Next'}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Questions;
