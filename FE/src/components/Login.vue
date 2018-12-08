<template>
    <div id="login" class="mt-5">
        <b-row class="justify-content-center">
        <b-col cols="12" md="5">
            <b-card>
                <b-form>
                <img src="../assets/logo.png">
                <b-form-group label="Tên đăng nhập:"
                                label-for="userName"
                                class="text-left">
                    <b-form-input id="userName"
                                type="text"
                                v-model="userName"
                                placeholder="Tên đăng nhập">
                    </b-form-input>
                </b-form-group>
                <b-form-group label="Mật khẩu:"
                                label-for="password"
                                class="text-left">
                    <b-form-input id="password"
                                type="password"
                                v-model="password"
                                @keyup.enter.native="login"
                                placeholder="Mật khẩu">
                    </b-form-input>
                </b-form-group>
                <b-form-group class="pt-3">
                    <b-button type="button" v-on:click="login()" variant="primary" class="w-100">Login</b-button>                                                    
                </b-form-group>
                </b-form>
            </b-card>    
        </b-col>
    </b-row>
    </div>
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
                var objCookie = {
                    ID:res.data.userEntity.ID,
                    access_token:res.data.access_token,
                    Role: res.data.userEntity.Role,
                    Name: res.data.userEntity.Name
                }
                setCookieToken(objCookie,1);
                this.$store.dispatch('setLogged',{
                    ID: res.data.userEntity.ID,
                    IsLogged : true,
                    Name: res.data.userEntity.Name,
                    Role: res.data.userEntity.Role
                });
                switch(res.data.userEntity.Role){
                    case 1:
                        self.$router.push({name : "Receiver"});
                    break;
                    case 2:
                        self.$router.push({name : "Customer"});
                    break;
                    case 3:
                        self.$router.push({name : "Driver"});
                    break;
                }

            }
        }).catch(err => {
            console.log(err);
        });
    }
  }
}
</script>