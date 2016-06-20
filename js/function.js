OrgsRespZips = rawOrgsRespZips.features;
console.log(OrgsRespZips);

OrgsRespZipsSubset1 = _.first(OrgsRespZips,100);

// for(i=0; i<=9; i++){
//   var organization = new google.maps.LatLng(OrgsRespZipsSubset1[i].geometry.coordinates[1],OrgsRespZipsSubset1[i].geometry.coordinates[0]);
//   var zipcode = new google.maps.LatLng(OrgsRespZipsSubset1[i].properties.z_lat, OrgsRespZipsSubset1[i].properties.z_lng);
//   distanceMatrixService.getDistanceMatrix(
//     {
//       origins: [organization],
//       destinations: [zipcode],
//       travelMode: google.maps.TravelMode.TRANSIT,
//       unitSystem: google.maps.UnitSystem.METRIC
//     }, function (response, status){
//       if (status !== google.maps.DistanceMatrixStatus.OK) {
//           alert('Error was: ' + status);
//       }
//       else{
//         OrgsRespZipsSubset1[i].properties.dist = response.rows[0].elements[0].distance.text;
//         // OrgsRespZipsSubset1[i].properties.traveltime = response.rows[0].elements[0].duration.text;
//         console.log(response.rows[0].elements[0].duration.text)
//       }
//     });
// }



  _.chain(OrgsRespZipsSubset1).map(function(datum){
    var organization = new google.maps.LatLng(datum.geometry.coordinates[1],datum.geometry.coordinates[0]);
    var zipcode = new google.maps.LatLng(datum.properties.z_lat, datum.properties.z_lng);
    distanceMatrixService.getDistanceMatrix(
      {
        origins: [organization],
        destinations: [zipcode],
        travelMode: google.maps.TravelMode.TRANSIT,
        unitSystem: google.maps.UnitSystem.METRIC
      }, function (response, status){
        if (status !== google.maps.DistanceMatrixStatus.OK) {
            alert('Error was: ' + status);
        }
        else{
          datum.properties.dist = response.rows[0].elements[0].distance.text;
          datum.properties.traveltime = response.rows[0].elements[0].duration.text;
        }
      });
  }).value();
  console.log(OrgsRespZipsSubset1);
    console.log(OrgsRespZipsSubset1.length);
