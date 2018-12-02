import axios from 'axios'
import {getCookieToken} from '@/helpers/helper'
export default () => {
    let auth = getCookieToken();
    let token = "";
    if(auth){
        token =  auth;
    }
    return axios.create({
        headers: {'x-access-token': token},
        baseURL: `http://localhost:3000/`
    })
}