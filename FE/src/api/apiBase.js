import axios from 'axios'
import {getCookieToken} from '@/helpers/helper'
export default () => {
    let auth = getCookieToken() || false;
    let token = "";
    if(auth){
        token =  auth.access_token;
    }
    return axios.create({
        headers: {'x-access-token': token},
        baseURL: `http://localhost:3000/`
    })
}