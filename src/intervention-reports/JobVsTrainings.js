import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';

function JobVsTrainings(props) {
  const { jobVsTrainingData } = props;
  const history = useHistory();

  const TrainingData = {
    labels: jobVsTrainingData[0],
    datasets: [
      {
        backgroundColor: '#12ABDB',
        data: jobVsTrainingData[1]
      }
    ]
  };

  var getElementAtEvent = elems => {
    if (elems.length > 0) {
      console.log(elems);
      var job_role = elems[0]._model.label;
      var user_profileId = jobVsTrainingData[2][elems[0]._index];
      history.push(`/training-analysis/${user_profileId}/assign-training/report`);
    } else {
      props.onMessage('There is no data where you clicked', 'success');
    }
  };

  var options = {
    legend: {
      display: false
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
      text: 'Trainings by Persona Job Roles'
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            drawOnChartArea: false
          },
          ticks: {
            beginAtZero: true,
            callback: function (label, index, labels) {
              if (jobVsTrainingData[0].length <= 5 && /\s/.test(label)) {
                return label.split(' ');
              } else {
                return label;
              }
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Persona Job Roles'
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            drawOnChartArea: false
          },
          ticks: {
            beginAtZero: true
          },
          scaleLabel: {
            display: true,
            labelString: 'Trainings Assigned'
          }
        }
      ]
    },
    maintainAspectRatio: false
  };

  return <Bar data={TrainingData} height={400} width={550} options={options} getElementAtEvent={getElementAtEvent} />;
}

export default JobVsTrainings;
