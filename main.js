// create Kendo chart
function createChart() {
  $('#chart').kendoChart({
    title: {
      position: 'bottom',
      text: 'Share of Internet Population Growth, 2007 - 2012'
    },
    legend: {
      visible: false
    },
    chartArea: {
      background: ''
    },
    seriesDefaults: {
      labels: {
        visible: true,
        background: 'transparent',
        template: '#= category #: \n #= value#%'
      }
    },
    series: [
      {
        type: 'pie',
        startAngle: 150,
        data: [
          {
            category: 'Asia',
            value: 53.8,
            color: '#9de219'
          },
          {
            category: 'Europe',
            value: 16.1,
            color: '#90cc38'
          },
          {
            category: 'Latin America',
            value: 11.3,
            color: '#068c35'
          },
          {
            category: 'Africa',
            value: 9.6,
            color: '#006634'
          },
          {
            category: 'Middle East',
            value: 5.2,
            color: '#004d38'
          },
          {
            category: 'North America',
            value: 3.6,
            color: '#033939'
          }
        ]
      }
    ],
    tooltip: {
      visible: true,
      format: '{0}%'
    }
  });
}

$(document).ready(function() {
  // ArcGIS
  require(['esri/Map', 'esri/views/MapView'], function(Map, MapView) {
    var map = new Map({
      basemap: 'topo-vector'
    });

    var view = new MapView({
      container: 'viewDiv',
      map: map,
      center: [-118.71511, 34.09042],
      zoom: 11
    });
  });

  // initiate Kendo chart
  createChart();
});
// bind Kendo chart skinChange event
$(document).bind('kendo:skinChange', createChart);
