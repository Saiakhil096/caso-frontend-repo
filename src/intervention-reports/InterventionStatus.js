import React from 'react';
import { Pie } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';

function InterventionStatus(props) {
  const { interventionStatusData } = props;
  const history = useHistory();

  const data = {
    labels: ['Pending', 'Not Due', 'Done'],
    animationEnabled: true,
    datasets: [
      {
        data: interventionStatusData[1],
        backgroundColor: ['#2B0A3D', '#0070AD', '#12ABDB']
      }
    ]
  };

  var getElementAtEvent = elems => {
    if (elems.length > 0) {
      const searchObjectCopy = {
        change_Agent: null,
        intervention_type: null,
        job_role: null,
        date: null,
        Engagement: null,
        intent: null,
        status: `${elems[0]._model.label}`,
        cate_gory: null
      };
      props.setInterventionTracker(searchObjectCopy);
      history.push('/intervention-tracker');
    } else {
      props.onMessage('There is no data where you clicked', 'success');
    }
  };

  var options = {
    maintainAspectRatio: true,
    legend: {
      display: true
    },
    hover: {
      onHover: (e, el) => {
        const section = el[0];
        const currentStyle = e.target.style;
        currentStyle.cursor = section ? 'pointer' : 'default';
      }
    },
    title: {
      display: true,
      text: 'Intervention Status'
    }
  };
  return <Pie data={data} height={400} width={550} options={options} getElementAtEvent={getElementAtEvent} />;
}

export default InterventionStatus;
