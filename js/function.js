var defaultStyle = function(colorToFill){
  return {
    weight: 1,
    opacity: 1,
    color: "white",
    dashArray: '3',
    fillOpacity: 0.7,
    fillColor: colorToFill
  };
}

var plotMaker = function (name, marker){
  return marker.setIcon(L.divIcon({className: name})).addTo(map);
}

var plotGeoJsonLayer = function (data, color){
  return L.geoJson(data, {style: defaultStyle(color)}).addTo(map);
}

var removeLeafletLayer = function (layer){
  _.each(layer, function(datum){
    map.removeLayer(datum);
  });
  layer = [];
}

$.ajax("https://raw.githubusercontent.com/aronxoxo/DanceNYC/master/data/dancenyc.geojson").done(function(data){
  danceNycParsed = JSON.parse(data);
  markerAllOrgs = _.chain(danceNycParsed.features)
                   .map(function(datum){
                    datum.properties.marker = L.marker([datum.geometry.coordinates[1], datum.geometry.coordinates[0]]);
                    return plotMaker('icon-all', datum.properties.marker)
                  })
                   .value();
  console.log(danceNycParsed);
});

$.ajax("https://raw.githubusercontent.com/aronxoxo/DanceNYC/master/data/NYC_ZCTA.geojson").done(function(data) {
  nycZcta = JSON.parse(data);
  layerAllZcta = plotGeoJsonLayer(nycZcta, '#8b61ff');
  // console.log(nycZcta);
 });

 var filterAndPlot = function(){
   var orgLocation;
   var zipLocation = [];
   var zipNumber = [];
   var boundPoints = [];

   if(inputOrgComplete){
     $('#btn-clear_org_search').show();
     _.chain(danceNycParsed.features)
     .filter(function(datum){
       return datum.properties.ORG_NAME.toUpperCase() == inputOrgName.toUpperCase();
     })
     .map(function(datum){
       orgLocation = [datum.geometry.coordinates[1], datum.geometry.coordinates[0]];
       zipLocation.push([datum.properties.ZCTA_lat, datum.properties.ZCTA_lng]);
       zipNumber.push(datum.properties.ZCTA);
     }).value();

     map.setView(orgLocation, 15, {animate: true});
     removeLeafletLayer(markerAllOrgs);
     map.removeLayer(layerAllZcta);
     inputOrgComplete = false;

    var workforceZcta = _.map(zipNumber, function(zip){
      return _.filter(nycZcta.features, function(datum){
        return zip == datum.properties.zcta;
      })
    });

    var workforceZctaFlatten = _.flatten(workforceZcta);

    var workforceZctaFlattenToPlot = {
      type: "FeatureCollection",
      features: workforceZctaFlatten
    };

    // console.log(workforceZctaFlattenToPlot);
    layerFilteredZcta = L.geoJson(workforceZctaFlattenToPlot, {style: defaultStyle("#4545ff")}).addTo(map);
   }
   orgMarkerFocus = plotMaker('icon-focus', L.marker(orgLocation));
 };

 var onOrgSelection = function(){
   inputOrgComplete = true;
   inputOrgName = this.value;
   filterAndPlot();
 };

 var onSearchClear = function(){
   map.removeLayer(layerFilteredZcta);
   layerFilteredZcta = [];
   map.removeLayer(orgMarkerFocus);
   orgMarkerFocus = [];
   console.log(layerFilteredZcta, orgMarkerFocus);
   map.setView([40.7831, -73.9712], 12, {animate: true});
   layerAllZcta = plotGeoJsonLayer(nycZcta, '#8b61ff');
   markerAllOrgs = _.chain(danceNycParsed.features)
                    .map(function(datum){
                     datum.properties.marker = L.marker([datum.geometry.coordinates[1], datum.geometry.coordinates[0]]);
                     return plotMaker('icon-all', datum.properties.marker)
                   });
  $('#btn-clear_org_search').hide();
  $('#org_name').val("");
 };

 var bindEvents = function() {
   $('#org_name').keyup(onOrgSelection);
   $('#btn-clear_org_search').click(onSearchClear);
 };

 $(document).ready(function() {
   bindEvents();
   $('#btn-clear_org_search').hide();
 });
