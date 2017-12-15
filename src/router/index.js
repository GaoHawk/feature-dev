import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import tree from '@/components/datatree';
import login from '@/components/login';
import travel from '@/components/TravelDays';
import transfer from '@/components/transfer';
import orderInfo from '@/components/orderInfo';
import admin from '@/page/adminlist';
import role from '@/page/rolelist';
import resourcelist from '@/page/resourcelist';
import citylist from '@/page/citylist';
import hotellist from '@/page/hotellist';
import locallist from '@/page/locallist';
import trafficlist from '@/page/trafficlist';
import triplist from '@/page/triplist';
import orderlist from '@/page/orderlist';
import seller from '@/page/sellerlist';
import roleRes from '../page/roleRelate/roleResource.vue';
import roleToAdd from '../page/roleRelate/roleToAddRes.vue';
import listResource from '../page/menuRes/listResource';
import showResource from '../page/menuRes/showResource';
import orderStars from '../page/orderWithStars';
import orderRefund from '../page/orderWithRefund';

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/orderDetail',
            name: 'orderDetail',
            component: orderInfo
        },
        {
            path: '/console/listResource/list',
            name: 'listResource',
            component: listResource
        },
        {
            path: '/console/showResource/list',
            name: 'showResource',
            component: showResource
        },
        {
            path: '/console/orderWithStars/list',
            name: 'orderWithStars',
            component: orderStars
        },
        {
            path: '/console/orderWithRefund/list',
            name: 'orderWithRefund',
            component: orderRefund
        },
        {
            path: '/hello',
            name: 'hello',
            component: HelloWorld
        },
        {
            path: '/transfer/:roleMenu',
            name: 'transfer',
            component: transfer,
            alias: ['/console/:roleMenu/transTree']
        },
        {
            path: '/console/roleResource/list',
            name: 'roleRes',
            component: roleRes
        },
        {
            path: '/console/roleToAddRes/list',
            name: 'roleToAdd',
            component: roleToAdd
        },
        {
            path: '/travel/:id',
            name: 'travel',
            component: travel
        },
        {
            path: '/',
            name: 'login',
            component: login,
        },
        {
            path: '/console/admin/list',
            name: 'admin',
            component: admin,
            // alias: ['/console/:menu/list']
        },
        {
            path: '/console/hotel/list',
            name: 'hotel',
            component: hotellist
        },
        {
            path: '/console/city/list',
            name: 'city',
            component: citylist
        },
        {
            path: '/console/resource/list',
            name: 'resource',
            component: resourcelist
        },
        {
            path: '/console/local/list',
            name: 'local',
            component: locallist
        },
        {
            path: '/console/traffic/list',
            name: 'traffic',
            component: trafficlist
        },
        {
            path: '/console/trip/list',
            name: 'trip',
            component: triplist
        },
        {
            path: '/console/order/list',
            name: 'order',
            component: orderlist
        },
        {
            path: '/console/seller/list',
            name: 'order',
            component: seller
        },
        {
            path: '/console/role/list',
            name: 'role',
            component: role
        },
        // {
        //     path: '/user/:menu/list',
        //     name: '用户列表',
        //     component: userlist,
        //     alias: ['/console/:menu/list']
        // },
        {
            path: '/tree/:backend',
            name: '后台管理树',
            component: tree,
            alias: ['/console/:backend/tree']
        }
    ]
})