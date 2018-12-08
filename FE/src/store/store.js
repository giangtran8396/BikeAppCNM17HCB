import Vue from 'vue'
import Vuex from 'vuex'
 
Vue.use(Vuex)
 
export default new Vuex.Store({
    state: {
        ID : null,
        Name:'',
        IsLogged : false,
        Role : '',
    },
    mutations: {
        setLogged(state , user) {
            var _user = user || {};
            state.ID = _user.ID || null;
            state.IsLogged = _user.IsLogged || false;
            state.Name = _user.Name || "";
            state.Role = _user.Role || "";
        }
    },
    actions: {
        setLogged({commit},user){
            commit('setLogged',user);
        }
    },
    getters: {
        getUser : state =>  {
            return state;
        }
    }
})