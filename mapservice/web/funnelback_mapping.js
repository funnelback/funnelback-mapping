/* funnelback_mapping.js

Purpose: add GeoJSON map data to a LeafletJS map
Author: Peter Levan, 2014

Updated: Nov 2017 - Add support for an origin marker
Updated: 11 Feb 2015 - add support for custom pins and addition of the customiseMap() function.
Updated: 24 Feb 2015 - add option to enable/disable pin clustering.
Updated: 25 Feb 2015 - add loading icons.
Updated: 2 Mar 2015 - add fullscreen control.
Updated: 16 Oct 2015 - add ability to customise popup
Updated: 27 Oct 2016 - upgraded to Leaflet 1.x. Also upgraded to Leaflet.GoogleMutant and MarkerCluster plugin for 1.x branch
*/

// Create the map origin - The values of ori_x and ori_y are defined in funnelback_mapping_config.js
var origin = new L.LatLng(ori_x, ori_y);

// Create the map object
var map = new L.Map(mapdiv, {center: origin, zoom: def_zoom, fullscreenControl: true});

// GeoJSON object containing the map data pins
var mapPoints;

// Layer to hand marker clustering
var marker_clusters;

// Layer to hold the map pins
var markers;

// Set up tile layer
switch(tileLayer) {
  case "osm":
    //console.log("using OSM")
    tileLayer =  new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    break;
  case "google":
   // console.log("using Google Roadmap")
    tileLayer = new L.gridLayer.googleMutant({ type: 'roadmap'  });
    break;
  case "google-hybrid":
   //console.log("using Google Hybrid")
    tileLayer = new L.gridLayer.googleMutant({ type: 'hybrid'  });
    break;
  case "google-satellite":
   // console.log("using Google Satellite")
    tileLayer = new L.gridLayer.googleMutant({ type: 'satellite'  });
    break;
  case "google-terrain":
    //console.log("using Google Terrain")
    tileLayer = new L.gridLayer.googleMutant({ type: 'terrain'  });
    break;
  default: console.log("Error: no tile layer defined")
}
map.addLayer(tileLayer);

// Call the customiseMap() function from the funnelback_mapping_config.js file to add additional mapping customisation
customiseMap();

function funnelback_map(jsondataurl) {
  map.spin(true); // display loading icon
  var jqxhr = jQuery.ajax({
      url: jsondataurl,
      dataType: "jsonp"
  })
  .done(function(data) {
    mapPoints = data
    addPoints(mapPoints)
     map.spin(false); // remove loading icon
  })
  .fail(function(jqxhr, textStatus, thrownError) {
     map.spin(false); // remove loading icon
  })
  .always(function() {
    map.spin(false); // remove loading icon
  });

}

// Function to add a specific data point to the map
function pointToLayer(feature, latlng) {
    var pin = new L.marker(latlng, markerOptions(feature));
    var popupContent = createPopup(feature);
    pin.bindPopup(popupContent, popupOptions(feature));
    return pin;
}

// Function to add the GeoJSON data to the map
function addPoints(data) {
	// catch empty result sets
	if (data.type) {
		mapPoints = data
		markers = new L.geoJson(mapPoints, {pointToLayer: pointToLayer});

		// pin results as clusters, or individually
		if (useClusters) {
		marker_clusters = L.markerClusterGroup();
		marker_clusters.addLayer(markers);
		map.addLayer(marker_clusters);
		map.fitBounds(marker_clusters.getBounds());
		}
		else {
		map.addLayer(markers);
		map.fitBounds(markers.getBounds());
		}
	        if(typeof(fborigin) !== 'undefined'){		
		    markers = L.marker(origin,{icon: originMarker,alt: "You are here"}).addTo(map)
		    map.setView(origin,12);
		}
    }
	else {
		// Display the no results text
		jQuery("#mapResults").append("<div id=\"mapnoresults\"><p><span>"+noResultsText+"</span></p></div>")
	}
	// redraw the map
	map.fitBounds(map.getBounds());
}
                                                                                                          
