import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';

function ChangeVsInterventionUser(props) {
  const { ChangeVsInterventionUserData } = props;
  const history = useHistory();

  const data = {
    labels: ChangeVsInterventionUserData[0], //array of data for x-axis

    datasets: [
      {
        backgroundColor: '#2B0A3D',
        data: ChangeVsInterventionUserData[1], //array of data for y-axis
        label: 'Pending'
      },
      {
        backgroundColor: '#0070AD',
        label: 'Not Due',
        data: ChangeVsInterventionUserData[2] //array of data for y-axis
      },
      {
        backgroundColor: '#12ABDB',
        label: 'Done',
        data: ChangeVsInterventionUserData[3] //array of data for y-axis
      }
    ]
  };

  var getElementAtEvent = elems => {
    if (elems.length > 0) {
      const searchObjectCopy = {
        change_Agent: { name: `${elems[0]._model.label}` },
        intervention_type: null,
        job_role: null,
        date: null,
        Engagement: null,
        intent: null,
        status: `${elems[0]._model.datasetLabel}`,
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
      text: 'Interventions Assigned to Change Agents'
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
              if (ChangeVsInterventionUserData[0].length <= 5 && /\s/.test(label)) {
                return label.split(' ');
              } else {
                return label;
              }
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Change Agents and Leaders'
          },
          stacked: true
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
            labelString: 'N0. Of Interventions'
          },
          stacked: true
        }
      ]
    },
    maintainAspectRatio: false
  };

  return <Bar data={data} height={400} width={550} options={options} getElementAtEvent={getElementAtEvent} />;
}

export default ChangeVsInterventionUser;
