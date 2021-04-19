import React, { useEffect, useState } from 'react';
import { Bar, ResponsiveContainer } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';

function ChangeImpactVsLocation(props) {
  const { numberOfChangeImpactVsLocation, selectedLocationFilter, selectedJobRoleFilter, selectedBUFilter } = props;
  const [title, setTitle] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (selectedLocationFilter != '') {
      setTitle('Change Impacts By Location filtered by: ' + selectedLocationFilter);
    }
    if (selectedJobRoleFilter != '') {
      setTitle('Change Impacts By Location filtered by: ' + selectedJobRoleFilter);
    }
    if (selectedBUFilter != '') {
      setTitle('Change Impacts By Location filtered by: ' + selectedBUFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '') {
      setTitle('Change Impacts By Location filtered by: ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Change Impacts By Location filtered by: ' + selectedBUFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter != '' && selectedBUFilter != '') {
      setTitle('Change Impacts By Location filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Change Impacts By Location filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter == '' && selectedJobRoleFilter == '' && selectedBUFilter == '') {
      setTitle('Change Impacts By Location');
    }
  }, [selectedBUFilter, selectedJobRoleFilter, selectedLocationFilter]);
  const colors = ['#0070AD', '#12ABDB', '#8BD5EC'];

  const data = {
    labels: numberOfChangeImpactVsLocation[0],

    datasets: [
      {
        label: 'High',
        data: numberOfChangeImpactVsLocation[1][0],
        backgroundColor: colors[0]
      },
      {
        label: 'Medium',
        data: numberOfChangeImpactVsLocation[1][1],
        backgroundColor: colors[1]
      },
      {
        label: 'Low',
        data: numberOfChangeImpactVsLocation[1][2],
        backgroundColor: colors[2]
      }
    ]
  };

  var getElementAtEvent = elems => {
    if (elems.length > 0) {
      var changeImpactValues = {
        key_location: `${elems[0]._model.label}`,
        change_impact_weight: `${elems[0]._model.datasetLabel}`
      };
      props.setCiaFilter(changeImpactValues);
      history.push('/change-impact-assessment');
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
    scales: {
      xAxes: [
        {
          gridLines: {
            drawOnChartArea: false
          },
          ticks: {
            beginAtZero: true,
            callback: function (label, index, labels) {
              if (numberOfChangeImpactVsLocation[0].length <= 3 && /\s/.test(label)) {
                return label.split(' ');
              } else {
                return label;
              }
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Locations'
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

  return <Bar data={data} options={options} height={400} width={550} getElementAtEvent={getElementAtEvent} />;
}
export default ChangeImpactVsLocation;
