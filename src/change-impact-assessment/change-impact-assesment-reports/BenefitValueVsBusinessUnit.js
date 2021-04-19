import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';

function BenefitValueVsBusinessUnit(props) {
  const { benefitValueVsBusinessUnit, selectedLocationFilter, selectedJobRoleFilter, selectedBUFilter } = props;
  const [title, setTitle] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (selectedLocationFilter != '') {
      setTitle('Benefit Value By BusinessUnit filtered by: ' + selectedLocationFilter);
    }
    if (selectedJobRoleFilter != '') {
      setTitle('Benefit Value By BusinessUnit filtered by: ' + selectedJobRoleFilter);
    }
    if (selectedBUFilter != '') {
      setTitle('Benefit Value By BusinessUnit filtered by: ' + selectedBUFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '') {
      setTitle('Benefit Value By BusinessUnit filtered by: ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Benefit Value By BusinessUnit filtered by: ' + selectedBUFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter != '' && selectedBUFilter != '') {
      setTitle('Benefit Value By BusinessUnit filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Benefit Value By BusinessUnit filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter == '' && selectedJobRoleFilter == '' && selectedBUFilter == '') {
      setTitle('Benefit Value By BusinessUnit');
    }
  }, [selectedBUFilter, selectedJobRoleFilter, selectedLocationFilter]);
  const colors = ['#0070AD', '#12ABDB', '#8BD5EC'];

  const data = {
    labels: benefitValueVsBusinessUnit[0],
    datasets: [
      {
        label: 'High (Above 250k $) ',
        data: benefitValueVsBusinessUnit[1][0],
        backgroundColor: colors[0]
      },
      {
        label: 'Medium (100-250 k $)',
        data: benefitValueVsBusinessUnit[1][1],
        backgroundColor: colors[1],
        stacked: true
      },
      {
        label: 'Low (Below 100 k $)',
        data: benefitValueVsBusinessUnit[1][2],
        backgroundColor: colors[2]
      }
    ]
  };

  var getElementAtEvent = elems => {
    if (elems.length > 0) {
      var changeImpactValues = {
        business_unit: `${elems[0]._model.label}`,
        benefit_value: `${elems[0]._model.datasetLabel}`
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
              if (benefitValueVsBusinessUnit[0].length <= 5 && /\s/.test(label)) {
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
            labelString: ' Change Impact By Benefit Value '
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
export default BenefitValueVsBusinessUnit;
