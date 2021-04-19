import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

function ScoreVsJobRole(props) {
  const { scoreVsJobRoleData, selectedBUFilter, selectedJobRoleFilter, selectedLocationFilter } = props;

  const [title, setTitle] = useState('');

  useEffect(() => {
    if (selectedLocationFilter != '') {
      setTitle('Change Readiness Scores for different Job Roles filtered by: ' + selectedLocationFilter);
    }
    if (selectedJobRoleFilter != '') {
      setTitle('Change Readiness Scores for different Job Roles filtered by: ' + selectedJobRoleFilter);
    }
    if (selectedBUFilter != '') {
      setTitle('Change Readiness Scores for different Job Roles filtered by: ' + selectedBUFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '') {
      setTitle('Change Readiness Scores for different Job Roles filtered by: ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Change Readiness Scores for different Job Roles filtered by: ' + selectedBUFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter != '' && selectedBUFilter != '') {
      setTitle('Change Readiness Scores for different Job Roles filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle(
        'Change Readiness Scores for different Job Roles filtered by: ' +
          selectedBUFilter +
          ' , ' +
          selectedLocationFilter +
          ' , ' +
          selectedJobRoleFilter
      );
    }
    if (selectedLocationFilter == '' && selectedJobRoleFilter == '' && selectedBUFilter == '') {
      setTitle('Change Readiness Scores for different Job Roles');
    }
  }, [selectedBUFilter, selectedJobRoleFilter, selectedLocationFilter]);

  const data = {
    labels: scoreVsJobRoleData[0],
    datasets: [
      {
        backgroundColor: '#76ba1b',
        label: 'Change Readiness Scores',
        data: scoreVsJobRoleData[1]
      }
    ]
  };
  var options = {
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          var allData = data.datasets[tooltipItem.datasetIndex].data;
          var tooltipLabel = data.labels[tooltipItem.index];
          var tooltipData = allData[tooltipItem.index].toFixed(2);
          var total = 0;
          for (var i in allData) {
            total += allData[i];
          }

          return tooltipLabel + ': ' + tooltipData;
        }
      }
    },
    legend: {
      display: false
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
              if (scoreVsJobRoleData[0].length <= 5 && /\s/.test(label)) {
                return label.split(' ');
              } else {
                return label;
              }
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Job Roles'
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
            labelString: 'Change Readiness Scores'
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

  return <Bar data={data} height={400} width={550} options={options} />;
}

export default ScoreVsJobRole;
