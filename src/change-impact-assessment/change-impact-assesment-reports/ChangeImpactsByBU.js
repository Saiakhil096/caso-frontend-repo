import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';

function ChangeImpactsByBU(props) {
  const { changeImpactsByBU, selectedLocationFilter, selectedJobRoleFilter, selectedBUFilter } = props;
  const [title, setTitle] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (selectedLocationFilter != '') {
      setTitle('Change Impacts By Business Unit filtered by: ' + selectedLocationFilter);
    }
    if (selectedJobRoleFilter != '') {
      setTitle('Change Impacts By Business Unit filtered by: ' + selectedJobRoleFilter);
    }
    if (selectedBUFilter != '') {
      setTitle('Change Impacts By Business Unit filtered by: ' + selectedBUFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '') {
      setTitle('Change Impacts By Business Unit filtered by: ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Change Impacts By Business Unit filtered by: ' + selectedBUFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter != '' && selectedBUFilter != '') {
      setTitle('Change Impacts By Business Unit filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Change Impacts By Business Unit filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter == '' && selectedJobRoleFilter == '' && selectedBUFilter == '') {
      setTitle('Change Impacts By Business Unit');
    }
  }, [selectedBUFilter, selectedJobRoleFilter, selectedLocationFilter]);
  const colors = ['#0070AD', '#12ABDB', '#8BD5EC'];

  const data = {
    labels: changeImpactsByBU[0],
    datasets: [
      {
        label: 'High',
        data: changeImpactsByBU[1][0],
        backgroundColor: colors[0]
      },
      {
        label: 'Medium',
        data: changeImpactsByBU[1][1],
        backgroundColor: colors[1]
      },
      {
        label: 'Low',
        data: changeImpactsByBU[1][2],
        backgroundColor: colors[2]
      }
    ]
  };

  var getElementAtEvent = elems => {
    if (elems.length > 0) {
      var changeImpactValues = {
        business_unit: `${elems[0]._model.label}`,
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
              if (changeImpactsByBU[0].length <= 5 && /\s/.test(label)) {
                return label.split(' ');
              } else {
                return label;
              }
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Business Units'
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
            labelString: 'Change Impacts'
          }
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
export default ChangeImpactsByBU;
