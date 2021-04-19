import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Radio, Grid } from '@material-ui/core';
import { VerySadIcon, SadIcon, OkIcon, HappyIcon, VeryHappyIcon } from '../../common/CustomIcons';
import { grey, red, amber, yellow, lightGreen, green } from '@material-ui/core/colors';

function Smiley(props) {
  const { rating, onRateChange } = props;

  const CustomRadio = withStyles(({ palette, spacing }) => ({
    root: {
      color: grey[500]
    }
  }))(props => <Radio color="default" {...props} />);

  return (
    <Grid item container>
      <Grid item>
        <CustomRadio
          color="primary"
          name="rating"
          value="0"
          onChange={onRateChange}
          icon={<VerySadIcon fontSize="large" />}
          checkedIcon={<VerySadIcon selected={true} selectedColor={red[500]} fontSize="large" />}
        />
      </Grid>
      <Grid item>
        <CustomRadio
          color="primary"
          name="rating"
          value="1"
          onChange={onRateChange}
          icon={<SadIcon fontSize="large" />}
          checkedIcon={<SadIcon selected={true} selectedColor={amber[500]} fontSize="large" />}
        />
      </Grid>
      <Grid item>
        <CustomRadio
          color="primary"
          name="rating"
          value="2"
          onChange={onRateChange}
          icon={<OkIcon fontSize="large" />}
          checkedIcon={<OkIcon selected={true} selectedColor={yellow[500]} fontSize="large" />}
        />
      </Grid>
      <Grid item>
        <CustomRadio
          color="primary"
          name="rating"
          value="3"
          onChange={onRateChange}
          icon={<HappyIcon fontSize="large" />}
          checkedIcon={<HappyIcon selected={true} selectedColor={lightGreen[500]} fontSize="large" />}
        />
      </Grid>
      <Grid item>
        <CustomRadio
          color="primary"
          name="rating"
          value="4"
          onChange={onRateChange}
          icon={<VeryHappyIcon fontSize="large" />}
          checkedIcon={<VeryHappyIcon selected={true} selectedColor={green[500]} fontSize="large" />}
        />
      </Grid>
    </Grid>
  );
}
export default Smiley;
