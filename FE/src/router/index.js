import Vue from 'vue'
import VueSweetalert2 from 'vue-sweetalert2';
import Router from 'vue-router'
import {getCookieToken} from '@/helpers/helper'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Driver from '@/components/Driver'
import Customer from '@/components/Customer'
import Receiver from '@/components/Receiver'
import LocationIdentifier from '@/components/LocationIdentifier'

Vue.use(Router);
Vue.use(VueSweetalert2);

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
    {
      path: '/Receiver',
      name: 'Receiver',
      component: Receiver,
      meta: { requiresAuth: true }
    },
    {
      path: '/LocationIdentifier',
      name: 'LocationIdentifier',
      component: LocationIdentifier,
      meta: { requiresAuth: true }
    },
    {
      path: '/Customer',
      name: 'Customer',
      component: Customer,
      meta: { requiresAuth: true }
    }
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