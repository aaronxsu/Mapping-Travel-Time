// var orgId = 0;
// var danceNycOrganized;
// var objTemp = new Object();
// _.chain(danceNycRaw.features).map(function(datum){
//   var id = datum.properties.ORG_ID;
//   if(orgId != id){
//     objTemp = new Object();
//     orgId = id;
//     objTemp.org_id = id;
//     objTemp.org_name = datum.properties.ORG_NAME;
//     objTemp.bud_size = datum.properties.DANCENYC_Budget_Size;
//     objTemp.disc = datum.properties.DANCENYC_Discipline;
//     objTemp.address = datum.properties.Org_ADDRESS;
//     objTemp.zip = datum.properties.Org_Zip_Code;
//     objTemp.city = datum.properties.Org_City;
//     objTemp.state = datum.properties.Org_State;
//     objTemp.lat = datum.geometry.coordinates[1];
//     objTemp.lng = datum.geometry.coordinates[0];
//     objTemp.med_dist = datum.properties.med_td;
//     objTemp.avg_dist = datum.properties.avg_td;
//     objTemp.med_time =datum.properties.med_tt;
//     objTemp.avg_time = datum.properties.avg_tt;
//     objTemp.zcta.zcta_num = datum.properties.ZCTA;
//     objTemp.zcta.dist = datum.properties.Distance;
//     objTemp.zcta.time = datum.properties.TravelTime;
//     objTemp.zcta.lat = datum.properties.ZCTA_lat;
//     objTemp.zcta.lng = datum.properties.ZCTA_lng;
//   }
//   else {
//
//   }
// })

// var markerAllOrgs = _.chain(danceNycRaw.features)
//  .map(function(datum){
//   datum.properties.marker = L.marker([datum.geometry.coordinates[1], datum.geometry.coordinates[0]]);
//   return datum.properties.marker.setIcon(L.divIcon({className: 'icon-all'})).addTo(map);
// }).value();
// console.log(danceNycRaw);

var svg = d3.select(map.getPanes().overlayPane).append("svg");
var g = svg.append("g").attr("class", "leaflet-zoom-hide");

$.ajax(rawChicagoProbs).done(function(data){
  dataChiProbs = JSON.parse(data);
  _.map(dataChiProbs.features, function(datum){
    datum.properties.marker = L.marker([datum.geometry.coordinates[1], datum.geometry.coordinates[0]]);
  });
  console.log(dataChiProbs);
});

d3.json(danceNycRaw, function(error, collection) {
  // if (error) throw error;

  // code here
});
