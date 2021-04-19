import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';

function ChangeVsIntervention(props) {
  const { ChangeVsInterventionData } = props;
  const history = useHistory();

  const TrainingData = {
    labels: ChangeVsInterventionData[0], //array of data for x-axis

    datasets: [
      {
        backgroundColor: '#12ABDB',
        label: 'Interventions',
        data: ChangeVsInterventionData[1] //array of data for y-axis
      }
    ]
  };

  var getElementAtEvent = elems => {
    if (elems.length > 0) {
      const searchObjectCopy = {
        change_Agent: null,
        intervention_type: { InterventionType_Value: `${elems[0]._model.label}` },
        job_role: null,
        date: null,
        Engagement: null,
        intent: null,
        status: null,
        cate_gory: null
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
      text: 'Intervention By Change Cycle'
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
              if (ChangeVsInterventionData[0].length <= 5 && /\s/.test(label)) {
                return label.split(' ');
              } else {
                return label;
              }
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Change cycle'
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
            labelString: 'No.of interventions'
          }
        }
      ]
    },
    maintainAspectRatio: false
  };

  return <Bar data={TrainingData} height={400} width={550} options={options} getElementAtEvent={getElementAtEvent} />;
}

export default ChangeVsIntervention;
