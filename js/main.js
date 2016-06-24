var map = L.map('map', {
  center: [40.7831, -73.9712],
  zoom: 12
});
var Stamen_Toner = new L.StamenTileLayer("toner");
map.addLayer(Stamen_Toner);

var danceNycParsed;
var markerAllOrgs;
var nycZcta;
var layerAllZcta;
var inputOrgComplete = false;
var inputOrgName;
var layerFilteredZcta;
var orgMarkerFocus;
