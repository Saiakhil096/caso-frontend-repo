import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

function ScoreVsQuestions(props) {
  const { scoreVsQuestionData, selectedLocationFilter, selectedJobRoleFilter, selectedBUFilter } = props;
  const [title, setTitle] = useState('');
  useEffect(() => {
    if (selectedLocationFilter != '') {
      setTitle('Change Readiness Scores for different Questions filtered by: ' + selectedLocationFilter);
    }
    if (selectedJobRoleFilter != '') {
      setTitle('Change Readiness Scores for different Questions filtered by: ' + selectedJobRoleFilter);
    }
    if (selectedBUFilter != '') {
      setTitle('Change Readiness Scores for different Questions filtered by: ' + selectedBUFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '') {
      setTitle('Change Readiness Scores for different Questions filtered by: ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Change Readiness Scores for different Questions filtered by: ' + selectedBUFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter != '' && selectedBUFilter != '') {
      setTitle('Change Readiness Scores for different Questions filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle(
        'Change Readiness Scores for different Questions filtered by: ' +
          selectedBUFilter +
          ' , ' +
          selectedLocationFilter +
          ' , ' +
          selectedJobRoleFilter
      );
    }
    if (selectedLocationFilter == '' && selectedJobRoleFilter == '' && selectedBUFilter == '') {
      setTitle('Change Readiness Scores for different Questions');
    }
  }, [selectedBUFilter, selectedJobRoleFilter, selectedLocationFilter]);

  const colors = ['#004876', '#0063a0', '#0093ee', '#c8e6f4'];
  const chartData = {
    labels: scoreVsQuestionData[0],
    datasets: [
      {
        label: 'Strongly Disagree',
        data: scoreVsQuestionData[2][0],
        backgroundColor: colors[4]
      },
      {
        label: 'Disagree',
        data: scoreVsQuestionData[2][1],
        backgroundColor: colors[3]
      },
      {
        label: 'Neutral',
        data: scoreVsQuestionData[2][2],
        backgroundColor: colors[2]
      },
      {
        label: 'Agree',
        data: scoreVsQuestionData[2][3],
        backgroundColor: colors[1]
      },
      {
        label: 'Strongly Agree',
        data: scoreVsQuestionData[2][4],
        backgroundColor: colors[0]
      }
    ]
  };
  var options = {
    legend: {
      display: true
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
              if (scoreVsQuestionData[0].length <= 5 && /\s/.test(label)) {
                return label.split(' ');
              } else {
                return label;
              }
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Change Readiness Questions'
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
            labelString: 'Number of Employees'
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

  return <Bar data={chartData} height={400} width={550} options={options} />;
}

export default ScoreVsQuestions;
