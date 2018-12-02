import Vue from 'vue'
import Router from 'vue-router'
import {getCookieToken} from '@/helpers/helper'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Driver from '@/components/Driver'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Driver',
      name: 'Driver',
      component: Driver,
      meta: { requiresAuth: true }
    },
  ]
})

router.beforeEach((to, from, next) => {
    var loggedIn = getCookieToken() || "";
    if(loggedIn != ""){
      loggedIn = true;
    }
    const publicPages = ['/Login'];
    const authRequired = !publicPages.includes(to.path);
    if (authRequired && !loggedIn) {
      return next({name : 'Login'});
    }
    next();
});

export default router;