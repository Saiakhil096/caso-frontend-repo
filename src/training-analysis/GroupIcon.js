import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Airplane,
  People,
  Car,
  Direction,
  Healthcare,
  Globe,
  Graph,
  Zoom,
  Conversation,
  Search,
  Speed,
  Cloud,
  Team,
  Mouse,
  Speaker,
  Pen,
  Folder,
  Correct,
  Bulb,
  Growth,
  Chemical,
  Target,
  Finance,
  Computer,
  Gears,
  Date,
  Vision,
  Ranking,
  Award,
  Comments,
  Laptop,
  Cart,
  Tag,
  Phone,
  Chart
} from '../common/CustomIcons';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(4, 0)
  },
  gridItem: {
    marginBottom: theme.spacing(3),
    maxWidth: '25rem'
  },
  icon: {
    width: '4rem',
    height: 'auto',
    display: 'block',
    margin: '10px auto'
  }
}));

function GroupIcon(props) {
  const classes = useStyles(props);
  const { icon } = props;
  const renderGroupIcon = () => {
    switch (icon) {
      case 'airplane':
        return <Airplane className={classes.icon} />;
      case 'award':
        return <Award className={classes.icon} />;
      case 'bulb':
        return <Bulb className={classes.icon} />;
      case 'car':
        return <Car className={classes.icon} />;
      case 'cart':
        return <Cart className={classes.icon} />;
      case 'chart':
        return <Chart className={classes.icon} />;
      case 'chemical':
        return <Chemical className={classes.icon} />;
      case 'cloud':
        return <Cloud className={classes.icon} />;
      case 'comments':
        return <Comments className={classes.icon} />;
      case 'computer':
        return <Computer className={classes.icon} />;
      case 'conversation':
        return <Conversation className={classes.icon} />;
      case 'correct':
        return <Correct className={classes.icon} />;
      case 'date':
        return <Date className={classes.icon} />;
      case 'direction':
        return <Direction className={classes.icon} />;
      case 'finance':
        return <Finance className={classes.icon} />;
      case 'folder':
        return <Folder className={classes.icon} />;
      case 'gears':
        return <Gears className={classes.icon} />;
      case 'globe':
        return <Globe className={classes.icon} />;
      case 'graph':
        return <Graph className={classes.icon} />;
      case 'growth':
        return <Growth className={classes.icon} />;
      case 'healthcare':
        return <Healthcare className={classes.icon} />;
      case 'laptop':
        return <Laptop className={classes.icon} />;
      case 'mouse':
        return <Mouse className={classes.icon} />;
      case 'pen':
        return <Pen className={classes.icon} />;
      case 'people':
        return <People className={classes.icon} />;
      case 'phone':
        return <Phone className={classes.icon} />;
      case 'ranking':
        return <Ranking className={classes.icon} />;
      case 'search':
        return <Search className={classes.icon} />;
      case 'speaker':
        return <Speaker className={classes.icon} />;
      case 'speed':
        return <Speed className={classes.icon} />;
      case 'tag':
        return <Tag className={classes.icon} />;
      case 'target':
        return <Target className={classes.icon} />;
      case 'team':
        return <Team className={classes.icon} />;
      case 'vision':
        return <Vision className={classes.icon} />;
      case 'zoom':
        return <Zoom className={classes.icon} />;
      default:
        break;
    }
  };
  return <React.Fragment>{renderGroupIcon()}</React.Fragment>;
}

export default GroupIcon;
