import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';

function ChangeThemes(props) {
  const { changeThemes, selectedLocationFilter, selectedJobRoleFilter, selectedBUFilter } = props;
  const [title, setTitle] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (selectedLocationFilter != '') {
      setTitle('Change Themes filtered by: ' + selectedLocationFilter);
    }
    if (selectedJobRoleFilter != '') {
      setTitle('Change Themes filtered by: ' + selectedJobRoleFilter);
    }
    if (selectedBUFilter != '') {
      setTitle('Change Themes filtered by: ' + selectedBUFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '') {
      setTitle('Change Themes filtered by: ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Change Themes filtered by: ' + selectedBUFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter != '' && selectedBUFilter != '') {
      setTitle('Change Themes filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter);
    }
    if (selectedLocationFilter != '' && selectedJobRoleFilter != '' && selectedBUFilter != '') {
      setTitle('Change Themes filtered by: ' + selectedBUFilter + ' , ' + selectedLocationFilter + ' , ' + selectedJobRoleFilter);
    }
    if (selectedLocationFilter == '' && selectedJobRoleFilter == '' && selectedBUFilter == '') {
      setTitle('Change Themes');
    }
  }, [selectedBUFilter, selectedJobRoleFilter, selectedLocationFilter]);
  const data = {
    labels: changeThemes[0],

    datasets: [
      {
        data: changeThemes[1],
        backgroundColor: ['#0070AD', '#12ABDB', '#23D1D0', '#6fe3f2', '#9dcaeb', '#57e0ff']
      }
    ]
  };

  var getElementAtEvent = elems => {
    if (elems.length > 0) {
      var changeImpactValues = {
        spending_our_money_wisely: `${elems[0]._model.label}` === 'Spending Our Money Wisely' ? true : false,
        insights_decision_making: `${elems[0]._model.label}` === 'Insights Decision Making' ? true : false,
        a_new_way_to_buy: `${elems[0]._model.label}` === 'A New Way To Buy' ? true : false,
        receipting_culture: `${elems[0]._model.label}` === 'Receipting Culture' ? true : false,
        other: `${elems[0]._model.label}` === 'Other' ? true : false
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
          return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
        }
      }
    }
  };

  return <Pie data={data} height={400} width={550} options={options} getElementAtEvent={getElementAtEvent} />;
}
export default ChangeThemes;
