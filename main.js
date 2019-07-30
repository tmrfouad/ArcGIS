require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/layers/GraphicsLayer",
  "esri/Graphic",
  "esri/widgets/BasemapToggle",
  "esri/widgets/BasemapGallery"
], function(
  Map,
  MapView,
  FeatureLayer,
  GraphicsLayer,
  Graphic
) {
  var map = new Map({
    basemap: "topo-vector"
  });

  // the main map view
  var view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-122.26327786399997, 37.49918710999998],
    zoom: 11
  });

  // Reference the feature layer to query
  var featureLayer = new FeatureLayer({
    url:
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0"
  });

  // Layer used to draw graphics returned
  var graphicsLayer = new GraphicsLayer();
  map.add(graphicsLayer);

  function addGraphics(result) {
    graphicsLayer.removeAll();
    result.features.forEach(function(feature) {
      var g = new Graphic({
        geometry: feature.geometry,
        attributes: feature.attributes,
        symbol: {
          type: "simple-marker",
          color: [0, 0, 0],
          outline: {
            width: 2,
            color: [0, 255, 255]
          },
          size: "20px"
        },
        popupTemplate: {
          title: "{TRL_NAME}",
          content: "This a {PARK_NAME} trail located in {CITY_JUR}."
        }
      });
      graphicsLayer.add(g);
    });
  }

  function queryFeatureLayer(
    point,
    distance,
    spatialRelationship,
    sqlExpression
  ) {
    var query = {
      geometry: point,
      distance: distance,
      units: "miles",
      spatialRelationship: spatialRelationship,
      outFields: ["*"],
      returnGeometry: true,
      where: sqlExpression
    };

    featureLayer
      .queryFeatures(query)
      .then(function(result) {

        if (result.features && result.features.length > 0) {
          // if there is results show the chart & the grid and populate them.
          $("#tblResults").show();
          $("#chart-container").show();

          // result grid
          $("#tblResults")
            .find("tr:gt(0)")
            .remove();
          result.features.forEach(f => {
            $("#tblResults").append(`
            <tr>
              <td>${f.attributes.objectid}</td>
              <td>${f.attributes.areaname}</td>
              <td>${f.attributes.class}</td>
              <td>${f.attributes.st}</td>
              <td>${f.attributes.capital}</td>
              <td>${f.attributes.pop2000}</td>
              <td>[${f.geometry.x}, ${f.geometry.y}]</td>
            </tr>`);
          });

          // prepare data for the chart.
          var counts = {};
          for (var i = 0; i < result.features.length; i++) {
            counts[result.features[i].attributes.class] =
              1 + (counts[result.features[i].attributes.class] || 0);
          }

          var chartData = Object.keys(counts).map(key => ({
            category: key,
            value: counts[key]
          }));

          // create chart
          $("#chart").kendoChart({
            title: {
              position: "bottom",
              text: "Features per class"
            },
            legend: {
              visible: false
            },
            chartArea: {
              background: ""
            },
            seriesDefaults: {
              labels: {
                visible: true,
                background: "transparent",
                template: "#= category #: \n #= value#"
              }
            },
            series: [
              {
                type: "pie",
                startAngle: 150,
                data: chartData
              }
            ],
            tooltip: {
              visible: true,
              format: "{0}"
            }
          });
        } else {
          // if there is no result hide the chart & thr grid.
          $("#tblResults").hide();
          $("#chart-container").hide();
        }

        // add the graphics of the result to the map
        addGraphics(result, true);
      })
      .catch(err => console.error(err));
  }

  // on pressing enter on the search textbox start querying for features.
  $("#txtSearch").on("keyup", function(event) {
    if (event.keyCode === 13) {
      var sql = `areaname like '%${$(this).val()}%'`;
      queryFeatureLayer(view.center, 1500, "intersects", sql);
    }
  });
});
