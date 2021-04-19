import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, Radio, DialogContent, Dialog } from '@material-ui/core';
import { lightBlue } from '@material-ui/core/colors';
import { TokenIcon } from '../../../common/CustomIcons';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  tileContainer: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '0.5rem 1rem'
  },
  dialogContainer: {
    backgroundColor: '#F2F2F2',
    padding: '1rem 5rem 5rem'
  },
  closeButton: {
    textAlign: 'end',
    cursor: 'pointer'
  },
  heading: {
    marginBottom: '10px',
    justifyContent: 'center'
  },
  questionTextColor: {
    color: '#858585'
  }
}));

function MaturityRatingDialogBox(props) {
  const maxWidth = 'md';
  const CustomRadio = props => <Radio color="default" {...props} />;
  const { isMaturityRatingDialogBoxOpen, closeMaturityRatingDialogBox, maturityRatings, improvementRatings, maturityQuestions } = props;

  const classes = useStyles();

  const maturityRatingIcons = index => {
    let items = [];

    for (let id = 0; id <= 4; id++) {
      items.push(
        <Grid item>
          <CustomRadio
            value={index}
            checked={
              (maturityRatings[index].rating <= id && improvementRatings[index].rating >= id) ||
              (maturityRatings[index].rating === id && improvementRatings[index].rating == null)
            }
            icon={<TokenIcon transparent disabled="true" fontSize="large" />}
            checkedIcon={
              <TokenIcon
                selected={true}
                selectedColor={lightBlue['A100']}
                disabled={maturityRatings[index].rating === id || improvementRatings[index].rating < id || improvementRatings[index].rating == null}
                fontSize="large"
              />
            }
            disabled="true"
          />
        </Grid>
      );
    }
    return (
      <Grid item container>
        {items}
      </Grid>
    );
  };

  return (
    <Dialog open={isMaturityRatingDialogBoxOpen} onClose={closeMaturityRatingDialogBox} fullWidth="true" maxWidth={maxWidth}>
      <Grid item className={classes.dialogContainer}>
        <Grid item className={classes.closeButton}>
          <CloseIcon fontSize="large" onClick={closeMaturityRatingDialogBox} color="primary">
            Close
          </CloseIcon>
        </Grid>
        <Grid container direction="row" className={classes.heading}>
          <Typography variant="h5">Maturity Assessment</Typography>
        </Grid>
        <DialogContent className={classes.tileContainer}>
          {maturityRatings.reduce((outputArray, currentValue, index) => {
            if (maturityQuestions.find(data => data.id === currentValue.maturity_question.id)) {
              return outputArray.concat(
                <Grid item container>
                  <Grid item>
                    <Typography variant="body1" className={classes.questionTextColor}>
                      {index + 1}. {currentValue.maturity_question.question_text}
                    </Typography>
                  </Grid>
                  {maturityRatingIcons(index)}
                </Grid>
              );
            } else {
              return outputArray;
            }
          }, [])}
        </DialogContent>
      </Grid>
    </Dialog>
  );
}

export default MaturityRatingDialogBox;
