var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 55.8546033, lng: -2.8656555},
        zoom: 9,
        mapTypeId: google.maps.MapTypeId.HYBRID
    });
    var ctaLayer = new google.maps.KmlLayer({
        url: 'https://dl.dropboxusercontent.com/u/14680511/cta.kml',
        map: map
    });
}
function humbie() {
    var humbieLayer = new google.maps.KmlLayer({
        url: 'https://dl.dropboxusercontent.com/u/14680511/coverage_layer.kml',
        map: map
    });
    humbieLayer.setMap(map);
}
function cta() {
    var ctaLayer = new google.maps.KmlLayer({
        url: 'https://dl.dropboxusercontent.com/u/14680511/cta.kml',
        map: map
    });
    ctaLayer.setMap(map);
}
