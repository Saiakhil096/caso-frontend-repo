import React, { useEffect, useState } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';

function ChangeWeighting(props) {
  const { changeWeighting, selectedLocationFilter, selectedJobRoleFilter, selectedBUFilter } = props;
  const [title, setTitle] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (selectedLocationFilter != '') {
      setTitle('Change Weightings filtered by: ' + selectedLocationFilter);
    }
    if (selectedJobRoleFilter != '') {
      setTitle('Change Weightings filtered by: ' + selectedJobRoleFilter);
    }
    if (selectedBUFilter != '') {
      setTitle('Change Weightings filtered by: ' + selectedBUFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '') {
      setTitle('Change Weightings filtered by: ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Change Weightings filtered by: ' + selectedBUFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter != '' && selectedBUFilter != '') {
      setTitle('Change Weightings filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Change Weightings filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter == '' && selectedJobRoleFilter == '' && selectedBUFilter == '') {
      setTitle('Change Weightings');
    }
  }, [selectedBUFilter, selectedJobRoleFilter, selectedLocationFilter]);
  const data = {
    labels: changeWeighting[0],

    datasets: [
      {
        data: changeWeighting[1],
        backgroundColor: ['#0070AD', '#12ABDB', '#8BD5EC']
      }
    ]
  };

  var getElementAtEvent = elems => {
    if (elems.length > 0) {
      var changeImpactValues = {
        change_impact_weight: `${elems[0]._model.label}`
      };
      props.setCiaFilter(changeImpactValues);
      history.push('/change-impact-assessment');
    } else {
      props.onMessage('There is no data where you clicked', 'success');
    }
  };

  var options = {
    responsive: true,
    maintainAspectRatio: true,

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
      text: title
    },
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
    }
  };

  return <Pie data={data} height={400} width={550} options={options} getElementAtEvent={getElementAtEvent} />;
}
export default ChangeWeighting;
