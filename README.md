# Funnelback mapping

This code implements map visualisation code for geospatial enabled Funnelback results.

It allows for easy deployment of results onto a map.

Provides: 

* a standardised way to integrating Funnelback search results with popular mapping services with minimal customisation.
* a default set of Freemarker macros to handle map presentation.
* flexibility in the choice of mapping service (eg. Google Maps vs. OpenStreetMap vs. Bing Maps) with minimal changes to code
* the ability to use custom pins, info boxes and pin clustering.
* a GeoJSON endpoint that can be accessed by other services

# Documentation

## Using Funnelback search results to populate a map

### Background

Funnelback search results can be used to populate a map (eg. Google Maps or OpenStreetMaps).

The following tutorial details how to set this up.

At a high level the implementation works this way:

* Funnelback index is built containing geo-coded results
* A template is created within Funnelback that is configured to return results as GeoJSON
* LeafletJS is used to read in this GeoJSON data and populate the items onto a Map.

The advantage of using LeafletJS is that the Funnelback component is very compact (only the GeoJSON template is required), and the map layer is very flexible (you can choose to use Google Maps, or Bing Maps, or OpenStreetMap etc). LeafletJS also contains many plugins to easily extend the functionality.

The basic implementation includes built-in support for:

* Data feed from Funnelback search results via a GeoJSON template
* Clustering of result pins
* Customisation of pin icons, pin information popups
* Configuration of the mapping service to use (eg. Google/Bing/OSM)
* Full screen mode
* Easy extension of functionality

### Working demonstration

A working demonstration of the mapping code is available at: http://showcase.funnelback.com/s/search.html?collection=showcase-mapping

This demo provides an iteractive map based on a dataset of global airport locations.

## Implementation steps

1. Create a Funnelback collection. The Funnelback index must include geo-coded items in the index (note: the metadata doesn't need to be treated as geospatial type 2 metadata by Funnelback, unless you wish to do geospatial search (search specifying an origin and maxdist). This implementation assumes the geospatial data is stored within the latlong metadata class.
2. Add a `collection.cfg` setting to tell the mapping service what field is used for the geospatial metadata. e.g. if you have the geospatial metadata held in a the latlong class:
	```
	map.geospatialClass=latlong
	```
3. Download the code bundle and decompress this inside the conf folder for the collection. It will create a mapservice profile for the collection.
4. Configure the mime type for the geojson template by adding the following line to collection.cfg:
	```ini
	ui.modern.form.geojson.content_type=application/javascript
	```
5. Add the following to your result template.
	1. To the very top of the file (below the funnelback.ftl import)
		```html
		<#import "/conf/<COLLECTION_NAME>/funnelback_mapping.ftl" as map/>
		```
	2. After the jquery, completion and angular JS script tags: 
		```html
		<#-- MAPS STUFF -->
		<@map.MapResources/>
		```
	3. Add a mapResults div as a container for the map.  eg. before the best bets div add: 
		```html
		<div id="mapResults"></div>
		```
6. Configure `funnelback_mapping_config.js`, located in the mapservice web resources folder. This is where all the variable settings are - customise the result popup html, tile layer, map div id (and map icons)
7. If using Google Maps tiles ensure you generate an API key and add this to your `collection.cfg`, and ensure that you set the tile layer to use google instead of osm in the `funnelback_mapping_config.js`:
	```
	map.apikey.google=<YOUR API KEY>
	```
8. Edit the mapservice padre_opts:
	* Ensure the SF value includes all the metadata classes required to populate the popups as configured in the `funnelback_mapping_config.js`. The latlong metadata class that is configured in `collection.cfg` must be included as a minimum.
	* Set the appropriate `num_ranks` value that should be applied to map queries.
	* Set an appropriate value for `MBL`
	* If map usage is not of interest for analytics disable logging (add `-log=false`)

## Basic usage

## Configuring the map tile layer to use

The code currently has support for Google and OpenStreetMap tile layers. The Leaflet libraries used by the stencil support of number of other service (e.g. Bing, Yandex) - configuration of these services is possible but requires further customisation of the code. The tile layer is set by editing the tileLayer variable used in `funnelback_mapping_config.js`.

Note: For Google Maps and API key is required, and this must be configured in collection.cfg. Use of most other map services (Bing, Yandex etc) also require API keys.

To use Google roadmaps:

```javascript
var tileLayer = "google";
````

To use Google terrain maps:

```javascript
var tileLayer = "google-terrrain";
To use Google satellite maps:

```javascript
var tileLayer = "google-satellite";
````

To use Google hybrid maps:

```javascript
var tileLayer = "google-hybrid";
````

To use OpenStreetMap maps:

```javascript
var tileLayer = "osm";
````

To use pin clustering:

```javascript
var useClusters = true
````

Note: A tile layer switcher can be configured to allow switching between the different map types (eg. roadmap/satellite/terrain). The `customiseMap()` function has some example code that sets this up.

### Configuring the map ID

The ID of the div within the search result template to which the map is bound can be configured by setting the mapdiv variable in `funnelback_mapping_config.js`.

### Configuring the pin popup

The pin popup can be used to display information about the pin. This is sourced from metadata associated with the result item, in a similar manner to how a search result item is customised in standard search results.

The format for the pin popup is defined in the createPopup(feature) function in the funnelback_mapping_config.js file. e.g.

```javascript
// Configure the code that should be returned for each popup. 
function createPopup(feature) {
    if (feature.properties.metaData.c) {var summary = feature.properties.metaData.c.trim()} else {var summary = ""}
 
 
    var html = ""
    html += "<div class=\"mapitem-popup\">"
    html += "<h2><a href=\""+feature.properties.liveUrl+"\">"+feature.properties.title+"</a></h2>"
    html += "<p>"+summary+"</p></div>"
    return html;
}
```

### Configuring custom no results text

The no results text can be configured by setting the noResultsText variable in funnelback_mapping_config.js

If you edit the message the styles for the div positioning may require adjustment. These styles are defined in funnelback_mapping.ftl

Note: Don't forget to update the padre_opts.cfg for the mapservice profile to return any custom metadata fields that you require for the popup display (SF query processor option).

## Advanced usage

### Configuring custom marker pins

Customising the marker pins is very easy and requires a three steps:

Define the custom pin variables in `funnelback_mapping_config.js` e.g.

```javascript
var planeMarker = L.AwesomeMarkers.icon ({
    icon: 'plane',
    prefix: 'fa',
    markerColor: 'red'
});
```

Define marker options to associate the custom pin variable with the feature type. e.g.

```javascript
  if (feature.properties.metaData.type == 'airport') {
    var iconImg = planeMarker
  } else if (feature.properties.metaData.type == 'station') {
    var iconImg = trainMarker
  } else if (feature.properties.metaData.type == 'port') {
    var iconImg = boatMarker
  } else {
    var iconImg = funnelbackMarker
  }
```

Further information regarding pin customisation can be found here: https://github.com/lvoogdt/Leaflet.awesome-markers

Note: Don't forget to update the `padre_opts.cfg` for the `mapservice` profile to return any custom metadata fields that you require for the business rules (`SF` query processor option).

## Loading additional Leaflet plugins to extend functionality

The loading of additional leaflet plugins requires editing of the `funnelback_mapping.ftl` file. There is a commented section on where to add the plugin load calls so that you can utilise them from your code.

The plugins need to be added after the leaflet Javascript libraries are loaded, but before the map is initialised. Once the plugins are loaded the `customiseMap()` function in `funnelback_mapping_config.js` can be used to apply additional customisation to the map.

### Example: Add the KML plugin so that custom layers can be added to the map.

Download the KML plugin and add this to the mapservice web resources folder. (`$COLLECTION/conf/mapservice/web/`)

Edit `funnelback_mapping.ftl` and add the script tag to load the library:

```html
<#-- Load custom Leaflet plugins here -->
<!-- load the KML library -->
<script src="/s/resources/${question.inputParameterMap["collection"]}/mapservice/KML.js"></script>
<#-- END custom leaflet plugins-->
```

Edit the `customiseMap()` function in `funnelback_mapping_config.js` to load the KML layer and enable it via the layer switch control:

```javascript
function customiseMap() {
// Add additional map customisation code here
  // e.g. Add the KML layer containing the LGA boundaries
  var lgaLayer = new L.KML('/s/resources/'+COLLECTIONNAME+'/mapservice/lga.kml', {async: true});
  map.addControl(new L.Control.Layers( {}, {'LGA boundaries':lgaLayer}));
}
```

## Notes

It is very important to optimise the query to avoid problems with memory usage in Jetty and response times. The following settings are applied by default (in the `mapservice/padre_opts.cfg`) but can be adjusted as required.

The idea here is to make the Padre XML and modern UI data model as small as possible.

Default padre opts are currently set to `-SM=meta -SF=[t,x,A,B,C,D,T,latLong] -bb=false -MBL=255 -num_ranks=500`

* `-SM=meta` - return metadata summaries only
* `-SF=[t,x,A,B,C,D,T,latLong]` - return only the specified metadata fields
* `-bb=false` - Disable best bets
* `-MBL=255` - Set a short metadata buffer length (of 255 characters). This will need to be adjusted to be large enough for your largest metadata field required for presentation and is likely to be determined by the max length of the metadata value you'll be using for your popup's description text.
* `-num_ranks=500` - This value sets the maximum number of map pins that will be returned. Set num_ranks to as small a value as possible to minimise the query's memory requirements. Defaults to 500 results.

If collection-level faceted navigation is used for the collection then it is recommended that rmcf and gscope counts are disabled. This can be done using a pre_datafetch hook script.

# Dependencies

The following third party code is used for this implementation:

* [Leaflet.js 1.0.1](http://leafletjs.com/download.html)
* [Leaflet.markercluster ](https://github.com/Leaflet/Leaflet.markercluster) - Marker clustering plugin
* [Leaflet.GridLayer.GoogleMutant](https://gitlab.com/IvanSanchez/Leaflet.GridLayer.GoogleMutant) - Implements mapping tile layers using services such as Google Maps and Open Street Map.
* [Leaflet.fullscreen](https://github.com/Leaflet/Leaflet.fullscreen)  - fullscreen control
* [Leaflet.Spin](https://github.com/makinacorpus/Leaflet.Spin) - spinner plugin
* [SpinJS](http://fgnass.github.io/spin.js/) - Javascript spinner
* [pLeaflet.Sleep](https://github.com/CliffCloud/Leaflet.Sleep) - deactivates the map so that it doesn't zoom when you scroll a page containing the map
* [Leaflet.awesome-markers](https://github.com/lvoogdt/Leaflet.awesome-markers) - easy marker customisation using Font Awesome icons
* [Font Awesome 4.7.0](https://fontawesome.com/v4.7.0/)

# Example implementation

* [International airport locations demo](http://showcase.funnelback.com/s/search.html?collection=showcase-mapping)
