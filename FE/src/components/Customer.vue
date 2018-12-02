<template>
    <div>
        <h1>{{msg}}</h1>
        <div id="customerMap">

        </div>
    </div>
</template>
<script>
import config from '../utilities/config'
import GoogleMapsLoader from 'google-maps'

export default {
    name :"customer",
    data() {
        return {
            msg: 'customer'
        }
    },
    mounted(){
        GoogleMapsLoader.KEY = config.GoogleMaps.Key;
        GoogleMapsLoader.VERSION = config.GoogleMaps.Version;
        GoogleMapsLoader.LANGUAGE = config.GoogleMaps.Language;
        GoogleMapsLoader.LIBRARIES = config.GoogleMaps.Libraies;
        GoogleMapsLoader.load(function(google){
            var map = new google.maps.Map(document.getElementById('customerMap'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
            });
        });
    }
}
</script>
<style>
#customerMap {
    width: 100%;
    height: 300px;
    }
</style>
