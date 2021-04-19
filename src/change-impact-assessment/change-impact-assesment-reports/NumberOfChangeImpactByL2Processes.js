import React, { useEffect, useState } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';

function ChangeImpactByL2Process(props) {
  const { numberOfChangeImpactByL2Processes, selectedLocationFilter, selectedJobRoleFilter, selectedBUFilter } = props;
  const [title, setTitle] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (selectedLocationFilter != '') {
      setTitle('Number Of Change Impact by L2 Processes filtered by: ' + selectedLocationFilter);
    }
    if (selectedJobRoleFilter != '') {
      setTitle('Number Of Change Impact by L2 Processes filtered by: ' + selectedJobRoleFilter);
    }
    if (selectedBUFilter != '') {
      setTitle('Number Of Change Impact by L2 Processes filtered by: ' + selectedBUFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '') {
      setTitle('Number Of Change Impact by L2 Processes filtered by: ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Number Of Change Impact by L2 Processes filtered by: ' + selectedBUFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter != '' && selectedBUFilter != '') {
      setTitle(' Number Of Change Impact by L2 Processes filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle(
        'Number Of Change Impact by L2 Processes filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter
      );
    }
    if (selectedLocationFilter == '' && selectedJobRoleFilter == '' && selectedBUFilter == '') {
      setTitle('Number Of Change Impact by L2 Processes');
    }
  }, [selectedBUFilter, selectedJobRoleFilter, selectedLocationFilter]);
  const data = {
    labels: numberOfChangeImpactByL2Processes[0],
    toolTipContent: '{label}: <strong>{data[]}%</strong>',
    dataPlacement: 'inside',
    datasets: [
      {
        data: numberOfChangeImpactByL2Processes[1],
        backgroundColor: [
          '#0070AD',
          '#12ABDB',
          '#23D1D0',
          '#6fe3f2',
          '#9dcaeb',
          '#57e0ff',
          '#2B0A3D',
          '#4714A3',
          '#6E66C9',
          '#7C3EB7',
          '#19596A',
          '#1E999B',
          '#1EC17C',
          '#95E616',
          '#1EC17C',
          '#C8FD3A',
          '#861162',
          '#CA2F80',
          '#FF304C',
          '#FD7E84',
          '#FC6433'
        ]
      }
    ]
  };

  var getElementAtEvent = elems => {
    if (elems.length > 0) {
      var changeImpactValues = {
        l_2_process: `${elems[0]._model.label}`
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
    maintainAspectRatio: true,
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          var allData = data.datasets[tooltipItem.datasetIndex].data;
          var tooltipLabel = data.labels[tooltipItem.index];
          var tooltipData = allData[tooltipItem.index];
          var total = 0;
          for (var i in allData) {
            total += allData[i];
          }
          var tooltipPercentage = ((tooltipData / total) * 100).toFixed(2);
          return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
        }
      }
    },

    title: {
      display: true,
      text: title
    }
  };

  return <Pie data={data} height={400} width={550} options={options} getElementAtEvent={getElementAtEvent} />;
}
export default ChangeImpactByL2Process;
