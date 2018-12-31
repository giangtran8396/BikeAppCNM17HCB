<template>
    <div>
        <h1>{{msg}}</h1>
            <b-modal id="modalInfo" @hide="resetModal" :title="modalInfo.title" @ok="confirm">
            <pre>Thông tin khách hàng : {{modalInfo.content.Name}} </pre>
            <pre>Điện thoại: {{modalInfo.content.Phone}} </pre>
            <pre>Địa chỉ: {{modalInfo.content.Address}} </pre>
            <pre>Ghi chú: {{modalInfo.content.Note}} </pre>
            </b-modal>
        <b-row>
            <b-col cols="12" md="12"  >
                <b-row>
                    <b-col cols="6" md="3">
                        <b-form-group class="pt-3">
                            <b-button type="button" 
                                @click="changStatus()" 
                                variant="success" 
                                class="w-100"
                                id="statusBtn">{{status}}</b-button>                                                    
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
import service from '../api/driver'
import {getCookieToken} from '@/helpers/helper'
export default {
    name :"driver",
    data() {
        return {
            msg: 'Tài xế',
            modalInfo: { title: '', content: '' },
            status: 'Waiting',
        }
    },
    methods: {
        changStatus(){   
            var self = this;         
            if(self.status == "ON"){
                var model = {
                    Id: self.Id,
                    Status: 1
                };  
                self.status = "OFF";
                service.updatestatusdriver(model) 
            }
            else{
                var model = {
                    Id: self.Id,
                    Status: 0
                };  
                self.status = "ON";
                service.updatestatusdriver(model)           
            } 
           
        },
        confirm() {
        var self = this;    
        self.startBtn.disabled = false;
        self.directionsService = new google.maps.DirectionsService();
        self.directionsDisplay = new google.maps.DirectionsRenderer();
        self.directionsDisplay.setMap(self.map);
        var start = new google.maps.LatLng(self.pos.lat,self.pos.lng);
        var location = JSON.parse(self.items.Location1);
        var end = new google.maps.LatLng(location.lat,location.lng);
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
            var model = {
                Id: self.Id,
                Status: 2
            };  
            service.updatestatusdriver(model) 
            var model1 = {
                Id: self.items.Id,
                Status: 3
            };  
            service.updatestatusrequest(model1)
            var model2 = {
                IDRequest: self.items.Id,
                IDDriver: self.Id,
            };  
            service.receiverDriverRequest(model2)    
        },
        start() {
            var self = this;
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
            var model = {
                    Id: self.Id,
                    Status: 1
                };  
            service.updatestatusdriver(model) 
            var model1 = {
                Id: self.items.Id,
                Status: 4
            };  
            service.updatestatusrequest(model1)
            var model2 = {
                IDRequest: self.items.Id,
                IDDriver: self.Id,
            };  
            var model2 = {
                Id: self.Id,
                Location: JSON.parse(self.items.Location1)
            }
            service.updatelocationdrive(model2)  
        },
        resetModal () {
            this.modalInfo.title = ''
            this.modalInfo.content = ''
        },
    },
    sockets:{
        listApp4(data) {
            var self = this;
            self.items = data[0];
            self.modalInfo.title = `Thông tin khách hàng`
            self.modalInfo.content = ''
            self.modalInfo.content = self.items;
            self.$root.$emit('bv::show::modal', 'modalInfo');
            setTimeout(function(){
                self.$root.$emit('bv::hide::modal', 'modalInfo');
            }, 10000);     
        }
    },
    mounted(){
        var self = this;
        var _cookie = getCookieToken();
        if(_cookie) {
            self.Id = _cookie.ID
        }
        var model = {
            Id: self.Id,
        }
        self.statusBtn = document.getElementById("statusBtn");
        service.getStatusDriver(model).then(result =>{
            if(result.data[0].Status == 1){
                self.status = "OFF"
            }
            else{
                self.status = "ON"
            }
        })
        self.startBtn = document.getElementById("startBtn");
        self.endBtn = document.getElementById("endBtn");
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
                    var model = {
                        Id: self.Id,
                        Location: JSON.stringify(self.pos)
                    }
                    service.updatelocationdrive(model)  
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
                            var model = {
                                Id: self.Id,
                                Location: JSON.stringify(self.pos)
                            }
                            service.updatelocationdrive(model)  
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
        this.$socket.emit('joinApp4',self.Id);  
    }
}
</script>
<style>
#driverMap {
    width: 100%;
    height: 520px;
    }
</style>
