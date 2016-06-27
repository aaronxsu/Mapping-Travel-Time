var map = L.map('map', {
  center: [40.741905, -73.911258],
  zoom: 12
});
var Stamen_Toner = new L.StamenTileLayer("toner");
map.addLayer(Stamen_Toner);

var danceNycParsed;
var isDanceNycParsed = false;
var markerAllOrgs;
var polylineAll = [];
var nycZcta;
var layerAllZcta;
var inputOrgComplete = false;
var inputOrgID;
var layerFilteredZcta;
var orgMarkerFocus;
var serchedPolyline = [];
