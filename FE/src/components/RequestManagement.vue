<template>
   <div>
     <h2 style="margin-top:10px;margin-bottom: 10px">
       QUẢN LÝ YÊU CẦU
     </h2>
        <b-container fluid>
            <!-- User Interface controls -->
            <b-row>
            <b-col md="6" class="my-1">
                <b-form-group horizontal label="Filter" class="mb-0">
                <b-input-group>
                    <b-form-input v-model="filter" placeholder="Tìm kiếm" />
                    <b-input-group-append>
                    <b-btn :disabled="!filter" @click="filter = ''">Xóa</b-btn>
                    </b-input-group-append>
                </b-input-group>
                </b-form-group>
            </b-col>
            <b-col md="6" class="my-1">
                <b-form-group horizontal label="Sort" class="mb-0">
                <b-input-group>
                    <b-form-select v-model="sortBy" :options="sortOptions">
                    <option slot="first" :value="null">-- Chọn --</option>
                    </b-form-select>
                    <b-form-select :disabled="!sortBy" v-model="sortDesc" slot="append">
                    <option :value="false">Tăng dần</option>
                    <option :value="true">Giảm dần</option>
                    </b-form-select>
                </b-input-group>
                </b-form-group>
            </b-col>
            </b-row>

            <!-- Main table element -->
            <b-table show-empty
                    stacked="md"
                    :items="items"
                    :fields="fields"
                    :current-page="currentPage"
                    :per-page="perPage"
                    :filter="filter"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :sort-direction="sortDirection"
                    @filtered="onFiltered"
            >
            <template slot="actions" slot-scope="row">
                <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
                <b-button v-if="row.item.Status == 3" size="sm" @click.stop="info(row.item, row.index, $event.target)" class="mr-1">
                Thông tin tài xế
                </b-button>
            </template>
            <template slot="Status" slot-scope="row">
              <div v-html="returnStatus(row.item.Status)">
              </div>
            </template>
            <template slot="row-details" slot-scope="row">
                <b-card>
                <ul>
                    <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value}}</li>
                </ul>
                </b-card>
            </template>
            </b-table>
            <b-row>
            <b-col md="6" class="my-1">
                <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
            </b-col>
            </b-row>
            <!-- Info modal -->
            <b-modal id="modalInfo" @hide="resetModal" :title="modalInfo.title" ok-only>
            <pre>Tên tài xế : {{ modalInfo.content.Name }} </pre>
            <pre>Điện thoại: {{ modalInfo.content.Phone }} </pre>
            <div id="driverMap"></div>
            </b-modal>

        </b-container>
  </div>
</template>
<script>

import service from '../api/manager'
import config from '../utilities/config'
import GoogleMapsLoader from 'google-maps'
export default {
  data () {
    return {
      map: null,
      marker: null,
      items: [],
      fields: [
        { key: 'Id', label: 'Mã yêu cầu' },
        { key: 'Name', label: 'Tên người dùng', sortable: true, sortDirection: 'desc' },
        { key: 'Phone', label: 'Số điện thoại', sortable: true, 'class': 'text-center' },
        { key: 'Status', label: 'Trạng thái' },
        { key: 'Address', label: 'Địa chỉ' },
        { key: 'actions', label: 'Hành động' }
      ],
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      pageOptions: [ 5, 10, 15 ],
      sortBy: null,
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      modalInfo: { title: '', content: '' }
    }
  },
  computed: {
    sortOptions () {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => { return { text: f.label, value: f.key } })
    }
  },
  
  methods: {
    info (item, index, button) {
      var self = this;
      var abc = service.locationdrive(item.Id).then(res => {
        console.log(res);
        self.modalInfo.title = `Thông tin tài xế`
        self.modalInfo.content = res.data[0];
        var location = JSON.parse(res.data[0].Location);
        if(self.marker){
          self.marker.setMap(null);
        }
        self.marker = new google.maps.Marker({
                        position: location,
                        map: self.map,
                        title: "Vị trí của tài xế : " + res.data[0].Name,
                    });
        self.map.setCenter(location);         
        self.map.setZoom(17);         
        self.$root.$emit('bv::show::modal', 'modalInfo', button);

        
      });
    },
    resetModal () {
      this.modalInfo.title = ''
      this.modalInfo.content = ''
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    returnStatus(status) {
      switch(status){
        case 2:
        return `<span class="badge badge-warning">Chưa có xe nhận</span>`;
        case 3:
        return `<span class="badge badge-info">Đã có xe nhận</span>`;
        case 4:
        return `<span class="badge badge-success">Kết thúc</span>`;
        case 5:
        return `<span class="badge badge-danger">Không có xe nhận</span>`;
        default:
        return `<span class="badge badge-secondary">Không xác định</span>`;
      }
    }
  },
  sockets:{
    listApp3(data) {
          var self = this;
          self.items = data;
    }
  },
  mounted() {
      var self = this;
      GoogleMapsLoader.KEY = config.GoogleMaps.Key;
        GoogleMapsLoader.VERSION = config.GoogleMaps.Version;
        GoogleMapsLoader.LANGUAGE = config.GoogleMaps.Language;
        GoogleMapsLoader.LIBRARIES = config.GoogleMaps.Libraies;
        GoogleMapsLoader.load(function(google){
            self.map = new google.maps.Map(document.getElementById('driverMap'), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 8
            });
        });
    this.$socket.emit('joinApp3');   
  }
}
</script>
<style>
#driverMap {
    width: 100%;
    height: 300px;
    }
</style>
