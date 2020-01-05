/* funnelback_mapping_config.js

Purpose: User customisations for the the funnelback_mapping.js code
Author: Peter Levan, 2014

Updated: Nov 2017 - swap marker pins to use Awesome Markers plugin
Updated: 11 Feb 2015 - add support for custom pins and addition of the customiseMap() function.
Updated: 24 Feb 2015 - add option to enable/disable pin clustering.
Updated: 16 Oct 2015 - add ability to customise popup
*/

//PL TODO - auto detect origin if set?????

if (typeof(fborigin) !== 'undefined') {
var ori_x = fboriginx;
var ori_y = fboriginy;
} else {

//Set initial origin for the map initialisation
var ori_x = -41.155038;
var ori_y = 145.325089;
}

//Set default zoom for the map initialisation
var def_zoom = 12;

//Set the ID of the div that will contain the map
var mapdiv = 'mapResults'

//Should clustering be applied to the pins
var useClusters = true

// Define the no results text
var noResultsText = "No search results";

// Configure the tile layer library to use
/*
Available values for tileLayer are:
osm: Open Street Map (default)
google: Google maps (ROADMAP)
google-terrain: Google maps (TERRAIN)
google-satellite: Google maps (SATELLITE)
google-hybrid: Google maps(HYBRID)
*/
var tileLayer = "osm";

// DEFINE CUSTOM PINS 
// default custom pin definitions
// Note - icons are chosen from Font Awesome 4.7 icon set, colour values are from a preset list - see: https://github.com/lvoogdt/Leaflet.awesome-markers

var unknownMarker = L.AwesomeMarkers.icon ({
    icon: 'question-circle',
    prefix: 'fa',
    markerColor: 'purple'
});

/* examples:
var planeMarker = L.AwesomeMarkers.icon ({
    icon: 'plane',
    prefix: 'fa',
    markerColor: 'red'
});

var trainMarker = L.AwesomeMarkers.icon ({
    icon: 'train',
    prefix: 'fa',
    markerColor: 'green'
});

var boatMarker = L.AwesomeMarkers.icon ({
    icon: 'boat',
    prefix: 'fa',
    markerColor: 'blue'
});

var originMarker = L.AwesomeMarkers.icon ({
    icon: 'user',
    prefix: 'fa',
    markerColor: 'black'
});
*/

// Configure the markers that are displayed for each data point. 

function markerOptions(feature) {
// Set the default pin icon to use
var iconImg = unknownMarker

/* Example of how to set different icons for different feature types, these definitions reference the example markers defined above in comments.
  if (feature.properties.metaData.type == 'airport') {
    var iconImg = planeMarker
  } else if (feature.properties.metaData.type == 'station') {
    var iconImg = trainMarker
  } else if (feature.properties.metaData.type == 'port') {
    var iconImg = boatMarker
  } else {
    var iconImg = funnelbackMarker
  }
*/ 

  var mOpts = {
    icon: iconImg
  }
  return mOpts;
}

// Configure options for markup popups
function popupOptions(feature) {

  var pOpts = {
    //eg. set a max height for the popup
	maxHeight: 450
  }
  return pOpts;

}

// Configure the code that should be returned for each popup
function createPopup(feature) {
    var html = ""
    html += "<div class=\"mapitem-popup\">"
    html += "<h4>"+feature.properties.title+"</h4>"
/* Example html for formatting the contents of the pin popup 
    html += "<h4>"+feature.properties.metaData.name+"</h4>"
    html += "<div><span>City: "+feature.properties.metaData.city+", "+feature.properties.metaData.country+"</span></div>"
    if(feature.properties.description) {
        html += "<div class=\"description\">"
        html += truncate(feature.properties.description,99)+"<a class=\"more-details-button\" href=\""+feature.properties.clickTrackingUrl+"\">More...</a></div>";
    }
*/    
    html += "</div>"
    return html;
}

function customiseMap() {
// Add additional map customisation code here

  /* Example:  Add aditional map tile layers (useful for the demo) and provide a tile layer switcher control
  var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  var ggl = new L.gridLayer.googleMutant({type: 'roadmap'});
  var ggl2 = new L.gridLayer.googleMutant({type: 'terrain'});
  var ggl3 = new L.gridLayer.googleMutant({type: 'satellite'});
  var ggl4 = new L.gridLayer.googleMutant({type: 'hybrid'});
  map.addControl(new L.Control.Layers( {'OSM':osm, 'Google (Roadmap)':tileLayer, 'Google (Roadmap)':ggl, 'Google (Terrain)':ggl2, 'Google (Satellite)':ggl3, 'Google (Hybrid)':ggl4}, {}));
  */

}
