import React from 'react';
import { Bar } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';

function JobVsNInterventions(props) {
  const { jobVsNInterventionsData } = props;
  const history = useHistory();

  const data = {
    labels: jobVsNInterventionsData[0],
    datasets: [
      {
        backgroundColor: '#2B0A3D',
        data: jobVsNInterventionsData[1],
        label: 'Pending'
      },
      {
        backgroundColor: '#0070AD',
        label: 'Not Due',
        data: jobVsNInterventionsData[2]
      },
      {
        backgroundColor: '#12ABDB',
        label: 'Done',
        data: jobVsNInterventionsData[3]
      }
    ]
  };

  var getElementAtEvent = elems => {
    if (elems.length > 0) {
      const searchObjectCopy = {
        change_Agent: null,
        intervention_type: null,
        job_role: { job_role: `${elems[0]._model.label}` },
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
      text: 'Interventions by Persona Job Roles'
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
              if (jobVsNInterventionsData[0].length <= 5 && /\s/.test(label)) {
                return label.split(' ');
              } else {
                return label;
              }
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Persona Job Roles'
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
            labelString: 'No. Of Interventions'
          },
          stacked: true
        }
      ]
    }
  };

  return <Bar data={data} height={400} width={550} options={options} getElementAtEvent={getElementAtEvent} />;
}

export default JobVsNInterventions;
