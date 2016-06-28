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

var pathOption = function(travelTime, opa, strk){
  var travelColor;

  if (travelTime <= 15){
    travelColor = "#00b12f";
  }
  else if (travelTime > 15 && travelTime <= 30){
    travelColor = "#0081b1";
  }
  else if (travelTime > 30 && travelTime <= 45){
    travelColor = "#ec4000";
  }
  else{
    travelColor = "#9d0073";
  }
  return {
    stroke : true,
    color: travelColor,
    weight: strk,
    opacity: opa
  };
}

 var filterAndPlot = function(){
   var orgLocation;
   var zipLocation = [];
   var zipNumber = [];
   var currentZip = 0;

   if(inputOrgComplete){
     //show the clear search button
     $('#btn-clear_org_search').show();

     //filter organization data, get the organization loacation, and its workforce ZCTAs
     _.chain(danceNycParsed.features)
     .filter(function(datum){
       return datum.properties.ORG_ID == inputOrgID;
     })
     .map(function(datum){
       orgLocation = [datum.geometry.coordinates[1],datum.geometry.coordinates[0]];
       if(currentZip != datum.properties.ZCTA){
         zipLocation.push([datum.properties.ZCTA_lat, datum.properties.ZCTA_lng]);//used for defining boundary
         zipNumber.push(datum.properties.ZCTA);//used for plotting zctas
         //create the connection
         var currentPolyline = L.polyline([orgLocation,
                                         [datum.properties.ZCTA_lat, datum.properties.ZCTA_lng]],
                                         pathOption(datum.properties.TravelTime, 0.8, 3)).addTo(map);
         serchedPolyline.push(currentPolyline);
         currentZip = datum.properties.ZCTA;
       }
     })
     .value();

     //filter zcta data, get workforce zcta to prepare for plotting
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

    //Remove all organizations their connections
     removeLeafletLayer(markerAllOrgs);
     _.each(polylineAll, function(datum){
       map.removeLayer(datum);
     });
     polylineAll = [];
     inputOrgComplete = false;


    //Plot the serched organization and the workforce zcta
    map.setView(L.latLngBounds(zipLocation).getCenter(), 12, {animate: true});
    // map.fitBounds();
    orgMarkerFocus = plotMaker('icon-all', L.marker(orgLocation));
    layerFilteredZcta = L.geoJson(workforceZctaFlattenToPlot, {style: defaultStyle("#4545ff")}).addTo(map);
    // console.log(serchedPolyline);
   }
 };


 var onSearchClear = function(){
   map.removeLayer(layerFilteredZcta);
   layerFilteredZcta = [];
   map.removeLayer(orgMarkerFocus);
   orgMarkerFocus = [];
   map.setView([40.741905, -73.911258], 12, {animate: true});
   _.map(serchedPolyline, function(datum){
     map.removeLayer(datum);
   });

  $('#btn-clear_org_search').hide();
  $('.city').val("county");
  $('.name').val("organization");

  loadData();
 };

 var bindEvents = function() {
   $('#btn-clear_org_search').click(onSearchClear);
   $('#btn-clear_org_search').hide();

 };

 var loadData =  function(){
   $.ajax("https://raw.githubusercontent.com/aronxoxo/DanceNYC/master/data/NYC_ZCTA.geojson").done(function(data) {
     nycZcta = JSON.parse(data);
     // layerAllZcta = plotGeoJsonLayer(nycZcta, '#8b61ff');
     // console.log(nycZcta);
    });

   $.ajax("https://raw.githubusercontent.com/aronxoxo/DanceNYC/master/data/dancenyc.geojson").done(function(data){
     danceNycParsed = JSON.parse(data);
     isDanceNycParsed = true;

     //draw lines connecting organizations with zctas
     _.chain(_.groupBy(danceNycParsed.features, function(datum){
       return datum.properties.ORG_ID; //Groupd data by organizations
     }))
     .map(function(data){
       _.map(data, function(datum){
         var currentPolyline = L.polyline([[datum.geometry.coordinates[1],datum.geometry.coordinates[0]],
                                         [datum.properties.ZCTA_lat, datum.properties.ZCTA_lng]],
                                         pathOption(datum.properties.TravelTime, 0.5, 2)).addTo(map);
         polylineAll.push(currentPolyline);
       });
     }).value();
    //  console.log(polylineAll);

     //store markers inside the dataset and plot it
     markerAllOrgs = _.chain(danceNycParsed.features)
                      .map(function(datum){
                       datum.properties.marker = L.marker([datum.geometry.coordinates[1], datum.geometry.coordinates[0]]);
                       return plotMaker('icon-all', datum.properties.marker)
                     })
                      .value();
     console.log(danceNycParsed);
   });
 }

 $(document).ready(function() {
   bindEvents();
   loadData();

   $('.city').change(function(e){
     $('.name').empty();
     $('.name').append("<option id='orgName' value='organization'>Organization</option>")
     var orgName = "";
     if(isDanceNycParsed){
       _.chain(danceNycParsed.features)
       .filter(function(datum){
         return $('.city').val().toUpperCase() == datum.properties.Org_City.toUpperCase();
       })
       .map(function(datum){
         if(orgName != datum.properties.ORG_NAME){
           var htmlContent = "<option class='orgName' value=' " + datum.properties.ORG_ID
                           + "'>&nbsp;&nbsp;" + datum.properties.ORG_NAME + "</option>";
           $('.name').append(htmlContent);
           orgName = datum.properties.ORG_NAME
         }
       }).value();
     }
   });

   $('.name').change(function(){
     inputOrgComplete = true;
     inputOrgID = $('.name').val();
     filterAndPlot();
   })
 });
