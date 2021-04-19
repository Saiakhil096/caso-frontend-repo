import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';

function Monthvsintervention(props) {
  const { monthvsInterventionData } = props;
  const history = useHistory();

  const TrainingData = {
    labels: monthvsInterventionData[0],

    datasets: [
      {
        backgroundColor: '#12ABDB',
        data: monthvsInterventionData[1]
      }
    ]
  };

  var getElementAtEvent = elems => {
    if (elems.length > 0) {
      var month = `${elems[0]._model.label}`;
      const searchObjectCopy = {
        change_Agent: null,
        intervention_type: null,
        job_role: null,
        date: null,
        Engagement: null,
        intent: null,
        status: null,
        cate_gory: null,
        month: month
      };
      props.setInterventionTracker(searchObjectCopy);
      history.push('/intervention-tracker');
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
      text: 'Month wise Intervention'
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
              if (monthvsInterventionData[0].length <= 5 && /\s/.test(label)) {
                return label.split(' ');
              } else {
                return label;
              }
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Months'
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
            labelString: 'No. of Interventions'
          }
        }
      ]
    },
    maintainAspectRatio: false
  };

  return <Bar data={TrainingData} height={400} width={550} options={options} getElementAtEvent={getElementAtEvent} />;
}

export default Monthvsintervention;
