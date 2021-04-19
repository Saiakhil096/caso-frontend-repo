import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';

function JobVsIntervention(props) {
  const { jobVsInterventionData } = props;
  const history = useHistory();

  const data = {
    labels: jobVsInterventionData[0],
    datasets: [
      {
        backgroundColor: '#2B0A3D',
        label: 'Adaptive',
        data: jobVsInterventionData[1]
      },
      {
        backgroundColor: '#12ABDB',
        label: 'Resistant',
        data: jobVsInterventionData[2]
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
        intent: { IntentValue: `${elems[0]._model.datasetLabel}` },
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
              if (jobVsInterventionData[0].length <= 5 && /\s/.test(label)) {
                return label.split(' ');
              } else {
                return label;
              }
            }
          },
          stacked: true,
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
          stacked: true,
          scaleLabel: {
            display: true,
            labelString: 'No. Of Interventions'
          }
        }
      ]
    },
    maintainAspectRatio: false
  };
  return <Bar data={data} height={400} width={550} options={options} getElementAtEvent={getElementAtEvent} />;
}

export default JobVsIntervention;
