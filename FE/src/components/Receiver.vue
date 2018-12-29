<template>
    <div>
        <h1>{{msg}}</h1>
        <b-row>
            <b-col cols="12" md="6">
                <b-form>
                    <b-form-group label="Họ tên:"
                                    label-for="userName"
                                    class="text-left">
                        <b-form-input id="userName"
                                    type="text"
                                    v-model="Customer.UserName"
                                    placeholder="Họ tên">
                        </b-form-input>
                    </b-form-group>
                    <b-form-group label="Điện thoai:"
                                    label-for="phoneNumber"
                                    class="text-left">
                        <b-form-input id="phoneNumber"
                                    type="text"
                                    v-model="Customer.PhoneNumber"
                                    maxlength="20"
                                    placeholder="Điện thoại">
                        </b-form-input>
                    </b-form-group>
                        <b-form-group label="Ghi chú:"
                                    label-for="note"
                                    class="text-left">
                        <b-form-textarea id="note"
                                    type="text"
                                    v-model="Customer.Note"
                                    maxlength="500"
                                    :rows="3"
                                    :max-rows="6"
                                    placeholder="Ghi chú">
                        </b-form-textarea>
                    </b-form-group>
                        <b-form-group label="Địa chỉ:"
                                    label-for="address"
                                    class="text-left">
                        <b-form-input id="address"
                                    type="text"
                                    v-model="Customer.Address"
                                    placeholder="Địa chỉ">
                        </b-form-input>
                    </b-form-group>
                    <b-form-group class="pt-3">
                        <b-button type="button" 
                        @click="confirm()" 
                        variant="success" 
                        :disabled="isDisabled"
                        class="w-100">Xác nhận</b-button>                                                    
                    </b-form-group>
                </b-form>
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
    name :"receiver",
    data() {
        return {
            map:{},
            msg: 'Nhận yêu cầu',
            Customer: {
                UserName:'',
                PhoneNumber: '',
                Address: '',
                Note:'',
                location:{
                    lat:config.GoogleMaps.DefaultLocation.lat,
                    lng:config.GoogleMaps.DefaultLocation.lng,
                }
            },
        }
    },
    computed:{
        isDisabled: function(){
            if(this.Customer.UserName !== "" 
            && this.Customer.PhoneNumber !== "" 
            && this.Customer.Note !== "" 
            && this.Customer.Address !== ""){
                return false;
            }
            return true;
        }
    },
    methods: {
        confirm() {
            var self = this;
            var model = self.Customer;
            model.Location1 = JSON.stringify(self.Customer.location);
            service.requestInfoCustomer(model).then(res => {
                if(res.status == 201){
                    //alert
                    self.Customer.UserName = '';
                    self.Customer.PhoneNumber = '';
                    self.Customer.Note = '';
                    self.Customer.Address = '';
                    self.Customer.location = {
                        lat:config.GoogleMaps.DefaultLocation.lat,
                        lng:config.GoogleMaps.DefaultLocation.lng,
                    }
                    self.$swal({
                    title: 'Thông báo',
                    text: 'Gửi yêu cầu thành công',
                    type: 'success',
                });
                }
            }).catch(err => {
                self.$swal({
                    title: 'Thông báo',
                    text: 'Gửi yêu cầu thất bại',
                    type: 'error',
                });                
                console.log(err);
            });
        }
    },
    mounted(){
        this.$socket.emit('joinApp1');        
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
        //init search box
        var input = document.getElementById('address');
        var searchBox = new google.maps.places.SearchBox(input);
        // Bias the SearchBox results towards current map's viewport.
        self.map.addListener('bounds_changed', function() {
          searchBox.setBounds(self.map.getBounds());
        });
        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }
          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: self.map,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          self.map.fitBounds(bounds);
          self.Customer.location.lat = bounds.f.b;
          self.Customer.location.lng = bounds.b.b;
        });
        });
    }
}
</script>
<style>
#receiverMap {
    width: 100%;
    height: 100%;
    }
</style>
