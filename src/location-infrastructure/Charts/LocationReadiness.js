import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useHistory } from 'react-router-dom';

function LocationReadiness(props) {
  const { LocationReadinessData, selectedBUFilter, selectedLocationFilter, selectedTaskFilter } = props;
  const [title, setTitle] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (selectedLocationFilter !== '') {
      setTitle('Location Readiness filtered by: ' + selectedLocationFilter);
    }
    if (selectedBUFilter !== '') {
      setTitle('Location Readiness filtered by: ' + selectedBUFilter);
    }
    if (selectedTaskFilter !== '') {
      setTitle('Location Readiness filtered by: ' + selectedTaskFilter);
    }
    if (selectedBUFilter !== '' && selectedTaskFilter !== '') {
      setTitle('Location Readiness filtered by: ' + selectedBUFilter + ',' + selectedTaskFilter);
    }
    if (selectedBUFilter !== '' && selectedLocationFilter !== '') {
      setTitle('Location Readiness filtered by: ' + selectedBUFilter + ',' + selectedLocationFilter);
    }
    if (selectedLocationFilter !== '' && selectedTaskFilter !== '') {
      setTitle('Location Readiness filtered by: ' + selectedLocationFilter + ',' + selectedTaskFilter);
    }
    if (selectedBUFilter !== '' && selectedTaskFilter !== '' && selectedLocationFilter !== '') {
      setTitle('Location Readiness filtered by: ' + selectedBUFilter + ',' + selectedLocationFilter + ',' + selectedTaskFilter);
    }
    if (selectedBUFilter === '' && selectedTaskFilter === '' && selectedLocationFilter === '') {
      setTitle('Location Readiness');
    }
  }, [selectedBUFilter, selectedTaskFilter, selectedLocationFilter]);

  const data = {
    labels: LocationReadinessData[0],
    datasets: [
      {
        backgroundColor: '#12ABDB',
        label: 'Readiness(in Percentage)',
        data: LocationReadinessData[1]
      }
    ]
  };

  var getElementAtEvent = elems => {
    if (elems.length > 0) {
      var locInfraFilter = {
        location: `${elems[0]._model.label}`
      };
      props.setLocInfraFilter(locInfraFilter);
      history.push('/location-infrastructure');
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
              if (LocationReadinessData[0].length <= 5 && /\s/.test(label)) {
                return label.split(' ');
              } else {
                return label;
              }
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Locations'
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
            labelString: 'Readiness(in Percentage)'
          }
        }
      ]
    },
    maintainAspectRatio: false,
    title: {
      display: true,
      text: title
    },
    tooltips: {
      callbacks: {
        label: function (tooltipItem, data) {
          var allData = data.datasets[tooltipItem.datasetIndex].data;
          var tooltipData = allData[tooltipItem.index];
          return tooltipData.toFixed(2) + '%';
        }
      }
    }
  };

  return <Bar data={data} height={400} width={550} options={options} getElementAtEvent={getElementAtEvent} />;
}

export default LocationReadiness;
