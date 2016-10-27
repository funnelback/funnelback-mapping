/* funnelback_mapping_config.js

Purpose: User customisations for the the funnelback_mapping.js code
Author: Peter Levan, 2014

Updated: 11 Feb 2015 - add support for custom pins and addition of the customiseMap() function.
Updated: 24 Feb 2015 - add option to enable/disable pin clustering.
Updated: 16 Oct 2015 - add ability to customise popup
*/

//PL TODO - auto detect origin if set?????
//Set initial origin for the map initialisation
var ori_x = -41.155038;
var ori_y = 145.325089;

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
osm: Open Street Map
google: Google maps (ROADMAP)
google-terrain: Google maps (TERRAIN)
google-satellite: Google maps (SATELLITE)
google-hybrid: Google maps(HYBRID)
*/
var tileLayer = "google";

//DEFINE CUSTOM PINS
//default custom pin definition
var funnelbackMarker = L.icon({
    iconUrl: '/s/resources/COLLECTIONNAME/mapservice/funnelback-pin.png',
    shadowUrl: '/s/resources/COLLECTIONNAME/mapservice/funnelback-pin-shadow.png',
    iconSize:     [60, 60], // size of the icon
    shadowSize:   [60, 60], // size of the shadow
    iconAnchor:   [30, 60], // point of the icon which will correspond to marker's location (rel to top left)
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
//add additional custom pin definitions here eg.
//var customMarker1 = L.icon({
//    iconUrl: '/s/resources/COLLECTIONNAME/mapservice/customMarker1.jpg',
//    shadowUrl: '/s/resources/COLLECTIONNAME/mapservice/customMarker1-shadow.png',
//    iconSize:     [60, 60], // size of the icon
//    shadowSize:   [60, 60], // size of the shadow
//    iconAnchor:   [30, 60], // point of the icon which will correspond to marker's location (rel to top left)
//    shadowAnchor: [4, 62],  // the same for the shadow
//    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
//});

// Configure the markers that are displayed for each data point.

function markerOptions(feature) {
// Set the default pin icon to use
  var iconImg = funnelbackMarker

// Define business rules for custom pins, based on attributes relating to an individual result.  eg. 
//  if (feature.properties.metaData.C == 'MYTYPE') {
//    iconImg = customMarker1
//  }

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
    html += "<h4><a href=\"" + feature.properties.clickTrackingUrl + "\" title=\"" + feature.properties.url + "\">" + feature.properties.title + "</a></h4>"
    html += "<div><span>Office type: "+feature.properties.metaData.T+"</span></div>"
    html += "<div><span>Address: "+feature.properties.metaData.A+" "+feature.properties.metaData.B+" "+feature.properties.metaData.C+" "+feature.properties.metaData.D+"</span></div>"
    if(feature.properties.description) {
        html += "<div class=\"description\">"
        html += truncate(feature.properties.description,99)+"<a class=\"more-details-button\" href=\""+feature.properties.clickTrackingUrl+"\">More...</a></div>";
    }
    html += "</div>"
    return html;
}

function customiseMap() {
// Add additional map customisation code here
  // Add aditional map tile layers (useful for the demo)
  var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  var ggl = new L.gridLayer.googleMutant({type: 'roadmap'});
  var ggl2 = new L.gridLayer.googleMutant({type: 'terrain'});
  var ggl3 = new L.gridLayer.googleMutant({type: 'satellite'});
  var ggl4 = new L.gridLayer.googleMutant({type: 'hybrid'});
  map.addControl(new L.Control.Layers( {'OSM':osm, 'Google (Roadmap)':tileLayer, 'Google (Roadmap)':ggl, 'Google (Terrain)':ggl2, 'Google (Satellite)':ggl3, 'Google (Hybrid)':ggl4}, {}));
  //--
}
