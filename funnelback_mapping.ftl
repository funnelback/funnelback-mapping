<#---
    Macros required for Funnelback mapping.  
-->

<#--- @begin MapResources -->
<#---
    Generates the CSS and Javascript links for the page footer.

    @param tileservice Defines the tileservice to use for additional javascript loads.  'google' - use google maps. TODO: extend for bing, yandex.  osm doesn't require any additional JS

    @param mapdiv ID of div that will be used as the map container
-->
<#macro MapResources tileservice="osm" mapdiv="mapResults">
<@MapCSS tileservice="osm" mapdiv="mapResults"/>
<@MapJS tileservice="osm" mapdiv="mapResults"/>
</#macro>

<#macro MapCSS tileservice="osm" mapdiv="mapResults">
<!--==================== FUNNELBACK MAPPING ==================-->

<!-- Set the height for the map results div - this must be done before the map is initialised; and the styling for the no results text -->
<style>
#${mapdiv?html} {height:500px;}
#${mapdiv?html} a {text-decoration: none;}
#mapnoresults {z-index:500; position:absolute; top: 46%; left: 0; bottom: 0; right: 0;}
#mapnoresults p {text-align:center;}
#mapnoresults span {background:#fff; padding:5px; border: 3px solid #f00; border-radius:5px}
</style>

<!-- Funnelback mapping CSS -->
<link rel="stylesheet" href="/s/resources/${question.inputParameterMap["collection"]}/mapservice/leaflet.css" />

<!-- CSS required for the Marker Clusters -->
<link rel="stylesheet" href="/s/resources/${question.inputParameterMap["collection"]}/mapservice/MarkerCluster.css" />
<link rel="stylesheet" href="/s/resources/${question.inputParameterMap["collection"]}/mapservice/MarkerCluster.Default.css" />

<!-- fullscreen plugin -->
<link href='//api.tiles.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v0.0.2/leaflet.fullscreen.css' rel='stylesheet' />

<!-- Font Awesome -->
<link rel='stylesheet' type='text/css' href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">

<!-- icon-based markers -->
<link rel="stylesheet" href="/s/resources/${question.inputParameterMap["collection"]}/mapservice/leaflet.awesome-markers.css">

</#macro>

<#macro MapJS tileservice="osm" mapdiv="mapResults">
<!-- Javascript required for maps -->
<script src="/s/resources/${question.inputParameterMap["collection"]}/mapservice/leaflet.js"></script>

<!-- Javascript to prevent unwanted map scrolling -->
<script src="/s/resources/${question.inputParameterMap["collection"]}/mapservice/Leaflet.Sleep.js"></script>

<!-- Javascript required for the Marker Clusters -->
<script src="/s/resources/${question.inputParameterMap["collection"]}/mapservice/leaflet.markercluster-src.js"></script>

<!-- Plugin to display loading icon -->
<script src="/s/resources/${question.inputParameterMap["collection"]}/mapservice/spin.min.js"></script>
<script src="/s/resources/${question.inputParameterMap["collection"]}/mapservice/leaflet.spin.js"></script>

<!-- load the fullscreen plugin -->
<script src='//api.tiles.mapbox.com/mapbox.js/plugins/leaflet-fullscreen/v0.0.2/Leaflet.fullscreen.min.js'></script>

<!-- plugin for icon-based markers -->
<script src="/s/resources/${question.inputParameterMap["collection"]}/mapservice/leaflet.awesome-markers.js"></script>

<#if tileservice == "google">
<!-- Use Google Maps tiles -->
<script src="//maps.googleapis.com/maps/api/js?key=${question.collection.configuration.value("map.apikey.google")!""}"></script>
<script src="/s/resources/${question.inputParameterMap["collection"]}/mapservice/Leaflet.GoogleMutant.js"></script>
</#if>

<!-- Funnelback-specific  mapping javascript -->
<script src="/s/resources/${question.inputParameterMap["collection"]}/mapservice/funnelback_mapping_config.js"></script>
<script src="/s/resources/${question.inputParameterMap["collection"]}/mapservice/funnelback_mapping.js"></script>
<script>
    jQuery('document').ready( function(){
        mapdataurl = "${question.collection.configuration.value("ui.modern.search_link")}?${removeParam(QueryString,["start_rank","form","num_ranks","profile"])}&form=geojson&profile=mapservice";
        funnelback_map(mapdataurl);
    });
</script>
<!--==================== /FUNNELBACK MAPPING ==================-->
</#macro>
