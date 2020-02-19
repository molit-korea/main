/*
2019 - MOLIT

FUNC.js

*/

///////////////////////////////////////////
// Openlayers Functions 2019.05.28
///////////////////////////////////////////

// Create Openlayers
var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([37.41, 8.82]),
        zoom: 4
    })
});

map.getViewport().addEventListener("click", function(e) {
    map.forEachFeatureAtPixel(map.getEventPixel(e), function (feature, layer) {
        console.log(feature);
    });
});

map.getViewport().addEventListener("pointermove", function(e) {
    map.forEachFeatureAtPixel(map.getEventPixel(e), function (feature, layer) {
        mouse_position(feature.values_.uri);
    });
});

// move Center
function move_center(lon,lat){
    map.getView().setCenter(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));
    map.getView().setZoom(17);
}

// add Layer
function add_layer(){
    // VectorSource 
    var vectorSource = new ol.source.Vector({});
    map.addLayer(new ol.layer.Vector({
        source: vectorSource
    }));
    return vectorSource;
}

////////////////////////////////////////
/*             draw data              */
////////////////////////////////////////

// remove data
function remove_point(vectorSource){
    vectorSource.clear();
}

// add point
function add_point(vectorSource, name, Lat, Lon, uri){
    var point = new ol.geom.Point(ol.proj.transform([Lat, Lon], 'EPSG:4326', 'EPSG:3857'));
    style = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 3,
            stroke: new ol.style.Stroke({
                color: 'rgba(255, 204, 0, 0.2)'
                
            }),
            fill: new ol.style.Fill({
                color: 'rgba(176, 61, 35, 0.4)'
            })
        })
    });

    var featurething = new ol.Feature({
        name: name,
        geometry: point,
        uri:uri
    });
    featurething.setStyle(style);
    vectorSource.addFeature( featurething );
}


function add_line(name, latlon, uri){
    //var thing = new ol.geom.Point([Lat, Lon]);
    var data = [];
    for(var i =0;i<latlon.length;i++){
        data.push(ol.proj.transform([latlon[0], latlon[1]], 'EPSG:4326', 'EPSG:3857'))
    }
    var thing = new ol.geom.LineString(data);
    style = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 3,
            stroke: new ol.style.Stroke({
                color: 'rgba(255, 204, 0, 0.2)'
                
            }),
            fill: new ol.style.Fill({
                color: 'rgba(176, 61, 35, 0.4)'
            })
        })
    });

    var featurething = new ol.Feature({
        name: name,
        geometry: thing,
        uri:uri
    });
    featurething.setStyle(style);
    vectorSource.addFeature( featurething );
}
