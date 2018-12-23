<template>
    <div>
        <h1>{{msg}}</h1>
        <b-row>
            <b-col cols="12" md="12"  >
                <b-row>
                    <b-col cols="6" md="3">
                        <b-form-group class="pt-3">
                            <b-button type="button" 
                                @click="confirm()" 
                                variant="success" 
                                class="w-100"
                                id="confirmBtn">Xác nhận</b-button>                                                    
                        </b-form-group>
                    </b-col>
                    <b-col cols="6" md="3">
                        <b-form-group class="pt-3">
                            <b-button type="button" 
                                @click="changStatus()" 
                                variant="success" 
                                class="w-100"
                                id="statusBtn">ON/OFF</b-button>                                                    
                        </b-form-group>
                    </b-col>
                </b-row>    
                <b-row>
                    <b-col cols="6" md="3">
                        <b-form-group class="pt-3">
                            <b-button type="button" 
                                @click="start()" 
                                variant="success" 
                                class="w-100"
                                id="startBtn">Bắt đầu</b-button>                                                    
                        </b-form-group>
                    </b-col>
                    <b-col cols="6  " md="3">
                        <b-form-group class="pt-3">
                            <b-button type="button" 
                                @click="end()" 
                                variant="success" 
                                class="w-100"
                                id="endBtn">Kết thúc</b-button>                                                    
                        </b-form-group>
                    </b-col>
                </b-row>   
            </b-col>
            <b-col cols="12" md="12" id="driverMap" >
            
            </b-col>
        </b-row>
    </div>
</template>
<script>
import config from '../utilities/config'
import GoogleMapsLoader from 'google-maps'
import service from '../api/manager'
export default {
    name :"driver",
    data() {
        return {
            msg: 'Tài xế',
            disable: self.disabled = true
        }
    },
    methods: {
        changStatus(){
            if( self.disabled == true){
                self.disabled = false;           
                self.confirmBtn.disabled = false;
           }else{
                self.disabled = true;
                self.confirmBtn.disabled = true;
           }
        },
        confirm() {
        var self = this;    
        self.statusBtn.disabled = true;
        self.startBtn.disabled = false;
        self.directionsService = new google.maps.DirectionsService();
        self.directionsDisplay = new google.maps.DirectionsRenderer();
        self.directionsDisplay.setMap(self.map);
        var start = new google.maps.LatLng(self.pos.lat,self.pos.lng);
        var end = new google.maps.LatLng(10.77329378731486,106.68930771939631);
        var request = {
            origin: start,
            destination: end,
            travelMode: 'DRIVING'
            }
            self.directionsService.route({
                origin: start,
                destination: end,
                travelMode: 'DRIVING'
                }, function(response, status) {
                    if (status === 'OK') {
                    self.directionsDisplay.setDirections(response);
                    } else {
                    window.alert('Directions request failed due to ' + status);
                    }
            });       
        },
        start() {
            var self = this;
            self.confirmBtn.disabled = true;
            self.startBtn.disabled = true;
            self.endBtn.disabled = false;
        },
        end(){
            var self = this;
            self.endBtn.disabled = true;
            self.directionsDisplay.setMap(null);
            self.statusBtn.disabled = false;
            self.map.setCenter(self.pos);
            self.map.setZoom(18)
        },
    },
    mounted(){
        var self = this;
        self.confirmBtn = document.getElementById("confirmBtn");
        self.startBtn = document.getElementById("startBtn");
        self.endBtn = document.getElementById("endBtn");
        self.statusBtn = document.getElementById("statusBtn");
        self.confirmBtn.disabled = true;
        self.startBtn.disabled = true;
        self.endBtn.disabled = true;
        var mapDiv = document.getElementById('driverMap');
        GoogleMapsLoader.KEY = config.GoogleMaps.Key;
        GoogleMapsLoader.VERSION = config.GoogleMaps.Version;
        GoogleMapsLoader.LANGUAGE = config.GoogleMaps.Language;
        GoogleMapsLoader.LIBRARIES = config.GoogleMaps.Libraies;
        if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
			    self.pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
                };
                GoogleMapsLoader.load(function(google){
                    self.map = new google.maps.Map(mapDiv, {
                        center: {lat: self.pos.lat, lng: self.pos.lng},
                        zoom: 18
                        });    
                    var gMarketConfig = new google.maps.Marker({
                        position: self.pos,
                        map: self.map,
                        draggable:true,
                        title: "Vị trí hiện tại của bạn",
                    });
                    var circle = new google.maps.Circle({
                        strokeColor: '#1E90FF',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#1E90FF',
                        fillOpacity: 0.3,
                        map: self.map,
                        center: self.pos,
                        radius: 100
                    });
                    var rad = function(x) {
                        return x * Math.PI / 180;
                    };
                    function haversine(pos1,pos2){
                        var R = 6378137; // Earth’s mean radius in meter
                        var dLat = rad(pos1.lat() - pos2.lat);
                        var dLong = rad(pos1.lng() - pos2.lng);
                        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                            Math.cos(rad(pos2.lat)) * Math.cos(rad(pos1.lat())) *
                            Math.sin(dLong / 2) * Math.sin(dLong / 2);
                        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                        var d = R * c;
                        return d
                    };
                    function updateLocation(pos1){
                        if (haversine(pos1,self.pos) > 100)
                        {
                            alert("Vui lòng chọn vị trí cách vị trí hiện tại dưới 100m")
                        }
                        else
                        {                
                            self.pos = {
                                lat: pos1.lat(),
                                lng: pos1.lng()
                            };    
                            gMarketConfig.setMap(null);  
                            gMarketConfig = new google.maps.Marker({
                                position: self.pos,
                                map: self.map,
                                draggable:true,
                                title: "Vị trí hiện tại của bạn",
                            });
                            circle.setOptions({center: self.pos})
                            self.map.setCenter(self.pos);
                        }
                    };
                    self.map.addListener('click', function(e) {   
                        updateLocation(e.latLng)
                    });
                    circle.addListener('click', function(e) {  
                        updateLocation(e.latLng)
                    });         
                });  
            });
        }     
    }
}
</script>
<style>
#driverMap {
    width: 100%;
    height: 520px;
    }
</style>
