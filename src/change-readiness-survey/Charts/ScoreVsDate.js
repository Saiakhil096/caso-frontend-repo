import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

function ScoreVsdate(props) {
  const { ScoreVsdateData, selectedBUFilter, selectedJobRoleFilter, selectedLocationFilter } = props;
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (selectedLocationFilter != '') {
      setTitle('Change Readiness Scores for different Months filtered by: ' + selectedLocationFilter);
    }
    if (selectedJobRoleFilter != '') {
      setTitle('Change Readiness Scores for different Months filtered by: ' + selectedJobRoleFilter);
    }
    if (selectedBUFilter != '') {
      setTitle('Change Readiness Scores for different Months filtered by: ' + selectedBUFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '') {
      setTitle('Change Readiness Scores for different Months filtered by: ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Change Readiness Scores for different Months filtered by: ' + selectedBUFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter != '' && selectedBUFilter != '') {
      setTitle('Change Readiness Scores for different Months filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle(
        'Change Readiness Scores for different Months filtered by: ' +
          selectedBUFilter +
          ' , ' +
          selectedLocationFilter +
          ' , ' +
          selectedJobRoleFilter
      );
    }
    if (selectedLocationFilter == '' && selectedJobRoleFilter == '' && selectedBUFilter == '') {
      setTitle('Change Readiness Scores for different Months');
    }
  }, [selectedBUFilter, selectedJobRoleFilter, selectedLocationFilter]);

  const data = {
    labels: ScoreVsdateData[0],
    datasets: [
      {
        label: 'Change Readiness Scores',
        data: ScoreVsdateData[1],
        backgroundColor: '#12ABDB'
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
              if (ScoreVsdateData[0].length <= 5 && /\s/.test(label)) {
                return label.split(' ');
              } else {
                return label;
              }
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Months'
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

  return <Line data={data} height={400} width={550} options={options} />;
}
export default ScoreVsdate;
