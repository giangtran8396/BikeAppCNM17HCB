<template>
    <div>
        <h1>{{msg}}</h1>
        <div id="managementMap">

        </div>
    </div>
</template>
<script>
import config from '../utilities/config'
import GoogleMapsLoader from 'google-maps'
export default {
    name :"management",
    data() {
        return {
            msg: 'management'
        }
    },
    mounted(){
        GoogleMapsLoader.KEY = config.GoogleMaps.Key;
        GoogleMapsLoader.VERSION = config.GoogleMaps.Version;
        GoogleMapsLoader.LANGUAGE = config.GoogleMaps.Language;
        GoogleMapsLoader.LIBRARIES = config.GoogleMaps.Libraies;
        GoogleMapsLoader.load(function(google){
            var map = new google.maps.Map(document.getElementById('managementMap'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
            });
        });
    }
}
</script>
<style>
#managementMap {
    width: 100%;
    height: 300px;
    }
</style>
