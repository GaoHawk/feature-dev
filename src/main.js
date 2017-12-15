// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.


import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';
import router from './router';
import store from './store/index.js';
import { sync } from 'vuex-router-sync';
import axios from 'axios';
import VueAxios from 'vue-axios';
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import VueAMap from 'vue-amap';
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.use(VueAMap);

VueAMap.initAMapApiLoader({
    key: '1310843a2b5c0d09fdc5c57c5a741759',
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor']
});

Vue.use(VueGoogleMaps, {
        load: {
            key: 'AIzaSyD6azlvaIiwXysgci4U4vTDtZcBgMpUr3o',
            libraries: 'places',
        }
    })
    // 没有cookie 登陆跳转
router.beforeEach((to, from, next) => {
    let token = localStorage.cookies;
    let menu = to.path.split('/')[2];

    store.commit('TABLE_NAME', menu);
    console.log(menu);
    if (to.path === '/') {
        store.commit('SET_TOKEN', '');
        next();
    } else
    if (token && to.path !== '/') {
        store.commit('SET_TOKEN', token)
        next();
    } else {
        next('/')
    }
    // next()
})

router.afterEach((to, from) => {
    console.log(to);
    //  const path = to.path.split('/')[1];
    const list = to.params.list;
    let tableColumns = '';
    if (list) {
        switch (list) {
            case 'userlist':
                tableColumns = 'userlist'
                store.commit('LIST_ROUTE', tableColumns)
                break;
            case 'systemlist':
                tableColumns = 'systemlist'
                store.commit('LIST_ROUTE', tableColumns)
                break;
            case 'sourcelist':
                tableColumns = 'sourcelist'
                store.commit('LIST_ROUTE', tableColumns)
                break;
        }
    }
    // let token = localStorage.cookies;
    // console.log(token);
    // if(token){
    //   store.commit('SET_TOKEN', token)
    // }
    store.commit('SET_PAGE', to)
})

Vue.use(VueAxios, axios);
sync(store, router);
Vue.use(VueRouter);
Vue.use(iView);


/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})