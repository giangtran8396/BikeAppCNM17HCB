<template>
    <b-navbar v-if="getUser.IsLogged" toggleable="md" type="dark" variant="success">
    <b-collapse is-nav id="nav_collapse">
    <!-- Right aligned nav items -->
    <b-navbar-nav class="ml-auto">
      <b-nav-item-dropdown right>
        <!-- Using button-content slot -->
        <template slot="button-content">
          <em>{{getUser.Name}}</em>
        </template>
        <b-dropdown-item href="javascript:;" v-on:click="logout()">Signout</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </b-collapse>
</b-navbar>
</template>
<script>
import {delete_cookie,getCookieToken} from '@/helpers/helper'
import { mapGetters , mapActions } from 'vuex'
export default {
    name:'navbaruser',
    computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'getUser',
    ])
    },
    methods:{
        logout(){
            delete_cookie();
            this.$store.dispatch('setLogged',null);
            this.$router.push({name:'Login'});
    }
  },
  watch:{
      getUser(){
        var self = this;
        var _cookie = getCookieToken();
        if(_cookie) {
            var _user = {
                ID : _cookie.ID,
                IsLogged : true,
                Name: _cookie.Name
            }
            this.$store.dispatch('setLogged',_user);
        }
        else{
            this.$router.push({name:'Login'});
        }
      }
    },
  created(){
    var self = this;
        var _cookie = getCookieToken();
        if(_cookie) {
            var _user = {
                ID : _cookie.ID,
                IsLogged : true,
                Name: _cookie.Name
            }
            this.$store.dispatch('setLogged',_user);
        }
        else{
            this.$router.push({name:'Login'});
        }
  }
}
</script>
