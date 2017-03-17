var map = L.map('map', {
  center: [40.741905, -73.911258],
  zoom: 12
});
var cartoBasemap = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

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
