<template>
    <div>
        <h1 class="py-3">{{msg}}</h1>
        <b-row>
            <b-col cols="12" md="6" >
            <b-card bg-variant="light">
            <div class="text-right py-1">
            <b-button type="button" 
            variant="success" 
            :disabled="isDisabled"
            v-on:click="saveLocation2()"
            class="text-right"><font-awesome-icon icon="check" /> Xác nhận</b-button>
            </div>
            <div class="scroll-auto">
                <b-list-group>
                <b-list-group-item v-for="item in listRequest" :key="item.Id"
                v-on:click="getItem($event)"
                :data-id="item.Id"
                class="mb-1 item-request" button>
                      <div title="Card Title"
                        class="mb-2">
                        <b-row>
                            <b-col cols="12" md="8" class="text-left pr-0"><h5 class="text-left">{{item.Name}} </h5></b-col>
                            <b-col cols="12" md="4" class="text-right px-md-0">
                                <span>
                                    <b-badge class="text-right" variant="info">Chưa được định vị</b-badge>
                                </span>
                            </b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="12" md="3" class="text-left pr-0 mw-22 font-bold-custom"><span>Điện thoại :</span></b-col>
                            <b-col cols="12" md="9" class="text-left px-md-0 font-custom"><span>{{item.Phone}}</span></b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="12" md="3" class="text-left pr-0 mw-22 font-bold-custom"><span>Vị trí :</span></b-col>
                            <b-col cols="12" md="9" class="text-left px-md-0 font-custom"><span>{{item.Address}}</span></b-col>
                        </b-row>
                        <b-row>
                            <b-col cols="12" md="3" class="text-left pr-0 mw-22 font-bold-custom"><span>Ghi chú :</span></b-col>
                            <b-col cols="12" md="9" class="text-left px-md-0 font-custom note-italic"><span>{{item.Note}}</span></b-col>
                        </b-row>
                    </div>
                </b-list-group-item>
            </b-list-group>
            </div>                
            </b-card>
            </b-col>
            <b-col cols="12" md="6">
                <div id="receiverMap">

                </div>
            </b-col>
        </b-row>
    </div>
</template>
<script>
import config from '../utilities/config'
import GoogleMapsLoader from 'google-maps'
import service from '../api/manager'
export default {
    name: "locationidentifer",
    computed:{
        isDisabled: function(){
            if(this.selectedElement == null){
                return true;
            }
            return false;
        }
    },
    data() {
        return {
            selectedElement:null,
            marker:null,
            map:{},
            msg : 'Xác định thông tin khách hàng',
            listRequest : [],
        }
    },
    methods: {
        resetList() {
            var self = this;
            service.getRequest(1).then(res => {
                self.listRequest = res.data;
            }).catch(err =>{
                console.log(err);
            });
        },
        saveLocation2() {
            var self = this;
            if(self.selectedElement.Location2){
                self.selectedElement.Location2 = JSON.stringify(self.selectedElement.Location2);
                self.selectedElement.Status = config.Status.Identify;
            }
            service.reverseLocation(self.selectedElement).then(res => {
                self.selectedElement = null;
                // Clear out the old markers.
                if(self.marker){
                    self.marker.setMap(null);
                }
                self.$swal({
                    title: 'Thông báo',
                    text: 'Xác nhận vị trí thành công',
                    type: 'success',
                });            
            }).catch(err => {
                console.log(err);
                self.$swal({
                    title: 'Thông báo',
                    text: 'Xác nhận vị trí thất bại',
                    type: 'error',
                });
            });
        },
        getItem($event){
            var self = this;
            var elements = document.querySelectorAll(".item-request");
            for(var i = 0 ; i < elements.length; i++){
                elements[i].classList.remove('active-item');
            }
            var $element = $event.target.closest('.item-request');
            $element.classList.add('active-item');
            var id = $element.getAttribute('data-id');
            self.selectedElement = self.getItembyId(id);
            var pos = JSON.parse(self.selectedElement.Location1);
            self.selectedElement.Location2 = pos;
            self.map.setCenter(pos);
            self.map.setZoom(17);
            // Clear out the old markers.
            if(self.marker){
                self.marker.setMap(null);
            }
            //marker
			self.marker = new google.maps.Marker({
				position: pos,
				map: self.map,
				draggable:true,
				title: self.selectedElement.Name,
             });
            self.marker.addListener('dragend', function(eventMarker){
                self.selectedElement.Location2 = {
                    lat: eventMarker.latLng.lat(),
                    lng: eventMarker.latLng.lng()
                }
            });
        },
        getItembyId(id){
            var self = this;
            for (var i = 0 ;i < self.listRequest.length ; i++ ){
                if(self.listRequest[i].Id == id){
                    return self.listRequest[i];
                }
            }
        }
    },
    sockets:{
        listRequestLocation(data) {
            var self = this;
            self.listRequest = data;
        }
    },
    created(){
        this.$socket.emit('joinApp2');        
    },
    mounted(){
    var self = this;
        GoogleMapsLoader.KEY = config.GoogleMaps.Key;
        GoogleMapsLoader.VERSION = config.GoogleMaps.Version;
        GoogleMapsLoader.LANGUAGE = config.GoogleMaps.Language;
        GoogleMapsLoader.LIBRARIES = config.GoogleMaps.Libraies;
        GoogleMapsLoader.load(function(google){
           self.map = new google.maps.Map(document.getElementById('receiverMap'), {
            center: config.GoogleMaps.DefaultLocation,
            zoom: 15
            });
        //set current position
        if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
                self.map.set(pos);
            });
        }
        });    
    }
}
</script>
<style>
    .mw-22{
        max-width: 22%;
    }
    .active-item{
        background-color: #a3f3a3;
    }
    .list-group-item-action:hover, .list-group-item-action:focus{
        background-color: #a3f3a3;        
    }
    .scroll-auto{
        height: 500px;
        overflow-y: auto;
    }
    #receiverMap {
        width: 100%;
        height: 100%;
    }
    .font-bold-custom{
        font-size: 13px;
        font-weight: 600;
    }
    .font-custom{
        font-size:13px;
    }
    .note-italic{
        font-style: italic;
    }
</style>
