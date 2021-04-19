import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';

function ImpactedEmployeesVsBU(props) {
  const { impactedEmployeesVsBU, selectedLocationFilter, selectedJobRoleFilter, selectedBUFilter } = props;
  const [title, setTitle] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (selectedLocationFilter != '') {
      setTitle('Number Of Impacted Employees By BusinessUnit filtered by: ' + selectedLocationFilter);
    }
    if (selectedJobRoleFilter != '') {
      setTitle('Number Of Impacted Employees By BusinessUnit filtered by: ' + selectedJobRoleFilter);
    }
    if (selectedBUFilter != '') {
      setTitle('Number Of Impacted Employees By BusinessUnit filtered by: ' + selectedBUFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '') {
      setTitle('Number Of Impacted Employees By BusinessUnit filtered by: ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Number Of Impacted Employees By BusinessUnit filtered by: ' + selectedBUFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter != '' && selectedBUFilter != '') {
      setTitle('Number Of Impacted Employees By BusinessUnit filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle(
        'Number Of Impacted Employees By BusinessUnit filtered by: ' +
          selectedBUFilter +
          ' , ' +
          selectedLocationFilter +
          ' , ' +
          selectedJobRoleFilter
      );
    }
    if (selectedLocationFilter == '' && selectedJobRoleFilter == '' && selectedBUFilter == '') {
      setTitle('Number Of Impacted Employees By BusinessUnit');
    }
  }, [selectedBUFilter, selectedJobRoleFilter, selectedLocationFilter]);
  const data = {
    labels: impactedEmployeesVsBU[0],
    datasets: [
      {
        label: 'Impacted Employees',
        backgroundColor: '#8BD5EC',
        data: impactedEmployeesVsBU[1]
      }
    ]
  };

  var getElementAtEvent = elems => {
    if (elems.length > 0) {
      var changeImpactValues = {
        business_unit: `${elems[0]._model.label}`
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
              if (labels.length <= 5 && /\s/.test(label)) {
                return label.split(' ');
              } else {
                return label;
              }
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Business Units'
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
            labelString: 'Number Of Impacted Employees'
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

export default ImpactedEmployeesVsBU;
