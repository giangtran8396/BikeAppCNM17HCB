<template>
    <div id="daylamap">

    </div>
</template>
<script>
import config from '../utilities/config'
import GoogleMapsLoader from 'google-maps'
export default {
    name :"driver",
    data() {
        return {
            msg: 'driver'
        }
    },
    mounted(){
        GoogleMapsLoader.KEY = config.GoogleMaps.Key;
        GoogleMapsLoader.VERSION = config.GoogleMaps.Version;
        GoogleMapsLoader.LANGUAGE = config.GoogleMaps.Language;
        GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
        console.log(GoogleMapsLoader);
        GoogleMapsLoader.load(function(google){
            var map = new google.maps.Map(document.getElementById('daylamap'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
            });
        });
    }
}
</script>
<style>
#daylamap {
width: 100%;
        height: 300px;
      }
</style>
