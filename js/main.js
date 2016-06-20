var city_Latlng = new google.maps.LatLng(40.7128, -74.0059);
var mapOptions = {
  zoom:11,
  center: city_Latlng,
  mapTypeId: google.maps.MapTypeId.ROADMAP
};
var map = new google.maps.Map(document.getElementById('map'), mapOptions);

var distanceMatrixService = new google.maps.DistanceMatrixService();

var rawOrgsRespZips;
var OrgsRespZips;
