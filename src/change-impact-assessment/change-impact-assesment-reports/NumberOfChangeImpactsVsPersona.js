import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';

function ChangeImpactVsPersona(props) {
  const { numberOfChangeImpactsVsPersona, selectedLocationFilter, selectedJobRoleFilter, selectedBUFilter } = props;
  const [title, setTitle] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (selectedLocationFilter != '') {
      setTitle('Change Impacts By Personas filtered by: ' + selectedLocationFilter);
    }
    if (selectedJobRoleFilter != '') {
      setTitle('Change Impacts By Personas filtered by: ' + selectedJobRoleFilter);
    }
    if (selectedBUFilter != '') {
      setTitle('Change Impacts By Personas filtered by: ' + selectedBUFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '') {
      setTitle('Change Impacts By Personas filtered by: ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Change Impacts By Personas filtered by: ' + selectedBUFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter != '' && selectedBUFilter != '') {
      setTitle('Change Impacts By Personas filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Change Impacts By Personas filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter == '' && selectedJobRoleFilter == '' && selectedBUFilter == '') {
      setTitle('Change Impacts By Personas');
    }
  }, [selectedBUFilter, selectedJobRoleFilter, selectedLocationFilter]);
  const colors = ['#0070AD', '#12ABDB', '#8BD5EC'];

  var getElementAtEvent = elems => {
    if (elems.length > 0) {
      var changeImpactValues = {
        user_profile: `${elems[0]._model.label}`,
        change_impact_weight: `${elems[0]._model.datasetLabel}`
      };
      props.setCiaFilter(changeImpactValues);
      history.push('/change-impact-assessment');
    } else {
      props.onMessage('There is no data where you clicked', 'success');
    }
  };

  const data = {
    labels: numberOfChangeImpactsVsPersona[0],

    datasets: [
      {
        label: 'High',
        data: numberOfChangeImpactsVsPersona[1][0],
        backgroundColor: colors[0]
      },
      {
        label: 'Medium',
        data: numberOfChangeImpactsVsPersona[1][1],
        backgroundColor: colors[1]
      },
      {
        label: 'Low',
        data: numberOfChangeImpactsVsPersona[1][2],
        backgroundColor: colors[2]
      }
    ]
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
    scales: {
      xAxes: [
        {
          gridLines: {
            drawOnChartArea: false
          },
          ticks: {
            beginAtZero: true,
            callback: function (label, index, labels) {
              if (numberOfChangeImpactsVsPersona[0].length <= 5 && /\s/.test(label)) {
                return label.split(' ');
              } else {
                return label;
              }
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Personas'
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
            labelString: 'Number Of Change Imapcts'
          },
          stacked: true
        }
      ]
    },
    maintainAspectRatio: false,
    title: {
      display: true,
      text: title
    }
  };

  return <Bar data={data} height={400} width={550} options={options} getElementAtEvent={getElementAtEvent} />;
}
export default ChangeImpactVsPersona;
