import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';

function ChangeImpactClassification(props) {
  const { changeImpactClassificationData, selectedLocationFilter, selectedJobRoleFilter, selectedBUFilter } = props;
  const [title, setTitle] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (selectedLocationFilter != '') {
      setTitle('Change Impact Classification filtered by: ' + selectedLocationFilter);
    }
    if (selectedJobRoleFilter != '') {
      setTitle('Change Impact Classification filtered by: ' + selectedJobRoleFilter);
    }
    if (selectedBUFilter != '') {
      setTitle('Change Impact Classification filtered by: ' + selectedBUFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '') {
      setTitle('Change Impact Classification filtered by: ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Change Impact Classification filtered by: ' + selectedBUFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter != '' && selectedBUFilter != '') {
      setTitle('Change Impact Classification filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Change Impact Classification filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter == '' && selectedJobRoleFilter == '' && selectedBUFilter == '') {
      setTitle('Change Impact Classification');
    }
  }, [selectedBUFilter, selectedJobRoleFilter, selectedLocationFilter]);

  const data = {
    labels: changeImpactClassificationData[0],
    datasets: [
      {
        data: changeImpactClassificationData[1],
        backgroundColor: ['#0070AD', '#12ABDB', '#23D1D0', '#57e0ff', '#6fe3f2', '#9dcaeb', '#2B0A3D']
      }
    ]
  };

  var getElementAtEvent = elems => {
    if (elems.length > 0) {
      var changeImpactValues = {
        org_design: `${elems[0]._model.label}` === 'Org Design' ? true : false,
        culture: `${elems[0]._model.label}` === 'Culture' ? true : false,
        roles_and_responsibility: `${elems[0]._model.label}` === 'Roles and Responsibility' ? true : false,
        communication_and_engagement: `${elems[0]._model.label}` === 'Communication and Engagement' ? true : false,
        policy: `${elems[0]._model.label}` === 'Policy' ? true : false,
        training: `${elems[0]._model.label}` === 'Training' ? true : false,
        process: `${elems[0]._model.label}` === 'Process' ? true : false,
        performance_management: `${elems[0]._model.label}` === 'Performance Management' ? true : false
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
          return tooltipLabel + ': ' + tooltipData + '(' + tooltipPercentage + '%)';
        }
      }
    }
  };

  return <Pie data={data} height={400} width={550} options={options} getElementAtEvent={getElementAtEvent} />;
}
export default ChangeImpactClassification;
