import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ValueLeftPane from './ValueLeftPane';
import ValueRightPane from './ValueRightPane';
import { fetchIdeasPerProcess, createValueVote, createIdeaComment } from '../../common/API';
import Cookies from 'js-cookie';

const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(4)
  }
}));

function Value(props) {
  const classes = useStyles();
  const { l2ProcessList, onMessage, handleNextStep, sendResponse, setSendResponse, setActiveStep, activeStep, setCompleted } = props;
  const user = Cookies.get('user');
  const project = Cookies.get('project');
  const [currentProcess, setCurrentProcess] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState(false);
  const [allIdea, setAllIdea] = useState(
    l2ProcessList.map(process => {
      return {
        l_2_process: process.id,
        votes: 4,
        ideas: [],
        valueVote: [],
        comments: [{ comment_text: '', user: user, project: project, idea: null, comment_type: 'benefit' }]
      };
    })
  );

  useEffect(() => {
    l2ProcessList.map((item, index) => {
      fetchIdeasPerProcess(item.id, onMessage).then(data => {
        if (data.length == 0) {
          allIdea[index].votes = 0;
        } else {
          allIdea[index].ideas = data;
          data.map(items => {
            var body = {
              vote_count: 0,
              idea: items,
              user: user,
              project: project
            };
            allIdea[index].valueVote.push(body);
          });
        }
        setAllData(true);
        setLoading(false);
      });
    });
  }, []);

  useEffect(() => {
    if (sendResponse) {
      submitIdeas();
    }
  }, [sendResponse]);

  const handleCommentAdd = () => {
    const allIdeaCopy = JSON.parse(JSON.stringify(allIdea));
    allIdeaCopy[currentProcess].comments.push({
      comment_text: '',
      user: user,
      project: project,
      idea: null,
      comment_type: 'benefit'
    });
    setAllIdea(allIdeaCopy);
  };

  const handleCommentsDelete = (event, index) => {
    const allIdeaCopy = JSON.parse(JSON.stringify(allIdea));
    allIdeaCopy[currentProcess].comments.splice(index, 1);
    setAllIdea(allIdeaCopy);
  };

  const handleCommentTextChange = (event, index) => {
    const allIdeaCopy = JSON.parse(JSON.stringify(allIdea));
    allIdeaCopy[currentProcess].comments[index].comment_text = event.target.value;
    setAllIdea(allIdeaCopy);
  };

  const handleIdeaChange = (event, newValue, index) => {
    const allIdeaCopy = JSON.parse(JSON.stringify(allIdea));
    allIdeaCopy[currentProcess].comments[index].idea = newValue;
    setAllIdea(allIdeaCopy);
  };

  const handleIncreaseVote = (event, index) => {
    var currentTotalVote = allIdea[currentProcess].votes;
    if (currentTotalVote <= 0) {
      onMessage('You have no votes left', 'warning');
    } else {
      const allIdeaCopy = JSON.parse(JSON.stringify(allIdea));
      var currentVote = allIdeaCopy[currentProcess].valueVote[index].vote_count;
      allIdeaCopy[currentProcess].valueVote[index].vote_count = currentVote + 1;
      allIdeaCopy[currentProcess].votes = currentTotalVote - 1;
      setAllIdea(allIdeaCopy);
    }
  };

  const handleDecreaseVote = (event, index) => {
    var currentTotalVote = allIdea[currentProcess].votes;
    const allIdeaCopy = JSON.parse(JSON.stringify(allIdea));
    var currentVote = allIdeaCopy[currentProcess].valueVote[index].vote_count;
    allIdeaCopy[currentProcess].valueVote[index].vote_count = currentVote - 1;
    allIdeaCopy[currentProcess].votes = currentTotalVote + 1;
    setAllIdea(allIdeaCopy);
  };

  const onPreviousProcess = () => {
    if (currentProcess != 0) {
      setCurrentProcess(currentProcess - 1);
    } else {
      setCurrentProcess(currentProcess);
    }
  };

  function checkAllProcessCompleted() {
    for (let index = 0; index < allIdea.length; index++) {
      const element = allIdea[index];
      if (element.votes != 0) {
        return false;
      }
    }
    return true;
  }

  const onNextProcess = () => {
    if (allIdea[currentProcess].votes === 0) {
      if (currentProcess + 1 < l2ProcessList.length) {
        setCurrentProcess(currentProcess + 1);
      } else {
        if (checkAllProcessCompleted()) {
          handleNextStep();
        } else {
          onMessage('You have not completed all process ', 'warning');
        }
      }
    } else {
      onMessage('please provide your complete votes to move to next process', 'warning');
    }
  };

  const submitIdeas = () => {
    Promise.all(
      allIdea.map((item, index) => {
        item.valueVote.map((item1, index) => {
          if (item1.vote_count != 0) {
            return createValueVote(item1, onMessage);
          }
        });
        item.comments.map((item2, index) => {
          if (item2.idea != null && item2.comment_text != '') {
            return createIdeaComment(item2, onMessage);
          }
        });
      })
    )
      .then(() => {
        onMessage('You have successfully completed your Value vote', 'success');
        setSendResponse(false);
        setCompleted();
      })
      .catch(e => onMessage(e));
  };

  if (allData && !loading) {
    return (
      <React.Fragment>
        <Grid container style={{ height: '100%' }}>
          <Grid item xs={false} sm={5} md={4} className={classes.content}>
            <ValueLeftPane
              onMessage={onMessage}
              l2ProcessList={l2ProcessList}
              votes={allIdea[currentProcess].votes}
              allIdea={allIdea}
              setCurrentProcess={setCurrentProcess}
              currentProcess={currentProcess}
            />
          </Grid>
          <ValueRightPane
            onMessage={onMessage}
            l2ProcessList={l2ProcessList}
            setCurrentProcess={setCurrentProcess}
            currentProcess={currentProcess}
            valueVote={allIdea[currentProcess].valueVote}
            idea={allIdea[currentProcess].ideas}
            allIdea={allIdea[currentProcess]}
            comments={allIdea[currentProcess].comments}
            handleCommentAdd={handleCommentAdd}
            handleCommentsDelete={handleCommentsDelete}
            handleCommentTextChange={handleCommentTextChange}
            handleIdeaChange={handleIdeaChange}
            handleIncreaseVote={handleIncreaseVote}
            onNextProcess={onNextProcess}
            onPreviousProcess={onPreviousProcess}
            handleDecreaseVote={handleDecreaseVote}
          />
        </Grid>
      </React.Fragment>
    );
  } else {
    return null;
  }
}

export default Value;
