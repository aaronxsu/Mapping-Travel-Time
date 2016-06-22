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

$.ajax("https://raw.githubusercontent.com/aronxoxo/DanceNYC/master/data/dancenyc.geojson").done(function(data){
  danceNycParsed = JSON.parse(data);
  markerAllOrgs = _.chain(danceNycParsed.features)
   .map(function(datum){
    datum.properties.marker = L.marker([datum.geometry.coordinates[1], datum.geometry.coordinates[0]]);
    return datum.properties.marker.setIcon(L.divIcon({className: 'icon-all'})).addTo(map);
  }).value();
  console.log(danceNycParsed);
});

$.ajax("https://raw.githubusercontent.com/aronxoxo/DanceNYC/master/data/NYC_ZCTA.geojson").done(function(data) {
  nycZcta = JSON.parse(data);
  layerAllZcta = L.geoJson(nycZcta, {style: defaultStyle('#8b61ff')}).addTo(map);
 });

 var filterAndPlot = function(){
   var orgLocation;
   var zipLocation = [];
   var zipNumber = [];
   if(inputOrgComplete){
     _.chain(danceNycParsed.features)
     .filter(function(datum){
       return datum.properties.ORG_NAME.toUpperCase() == inputOrgName.toUpperCase();
     }).map(function(datum){
       orgLocation = datum.geometry.coordinates;
       zipLocation.push([datum.properties.ZCTA_lat, datum.properties.ZCTA_lng]);
       zipNumber.push(datum.properties.ZCTA);
     });
     var concatedLocations = zipLocation.concat(orgLocation);
     var locationBounds = L.LatLngBounds(concatedLocations);
     //continue here
   }
 };

 var onOrgSelection = function(){
   inputOrgComplete = true;
   inputOrgName = this.value;
   filterAndPlot();
 };

 var bindEvents = function() {
   $('#org_name').keyup(onOrgSelection);
 };

 $(document).ready(function() {
   bindEvents();
 });
