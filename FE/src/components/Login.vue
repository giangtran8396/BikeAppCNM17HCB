<template>
    <b-row class="justify-content-center">
        <b-col cols="12" md="5">
            <b-card>
                <b-form>
                <img src="../assets/logo.png">
                <b-form-group label="User name:"
                                label-for="userName"
                                class="text-left">
                    <b-form-input id="userName"
                                type="text"
                                v-model="userName"
                                placeholder="UserName">
                    </b-form-input>
                </b-form-group>
                <b-form-group label="Password:"
                                label-for="password"
                                class="text-left">
                    <b-form-input id="password"
                                type="password"
                                v-model="password"
                                @keyup.enter.native="login"
                                placeholder="Password">
                    </b-form-input>
                </b-form-group>
                <b-form-group class="pt-3">
                    <b-button type="button" v-on:click="login()" variant="primary" class="w-100">Login</b-button>                                                    
                </b-form-group>
                </b-form>
            </b-card>    
        </b-col>
    </b-row>
</template>
<script>
import service from '../api/user'
import {setCookieToken} from '@/helpers/helper'
export default {
    data () {
    return {
        userName:'',
        password:'',
    }
  },
  methods: {
    login() {
        var self = this;
        var userModel = {
            "UserName":self.userName,
            "Password":self.password
        }
        service.UserLogin(userModel).then(res => {
             if(res.status == 200){
                setCookieToken(res.data.access_token,1);
                self.$router.push({name : "Driver"});
            }
        }).catch(err => {
            console.log(err);
        });
    }
  }
}
</script>
