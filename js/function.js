var markerAllOrgs = _.chain(danceNycRaw.features)
 .map(function(datum){
  datum.properties.marker = L.marker([datum.geometry.coordinates[1], datum.geometry.coordinates[0]]);
  return datum.properties.marker.setIcon(L.divIcon({className: 'icon-all'})).addTo(map);
}).value();
console.log(danceNycRaw);
