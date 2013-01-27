// convert Google Maps into an AMD module
define('googlemaps', ['async!http://maps.google.com/maps/api/js?v=3&sensor=false&v=3&libraries=geometry'],
function()
{
    // return the gmaps namespace for brevity
    return window.google.maps;
});
