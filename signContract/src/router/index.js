import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/home/home'
import { Message } from 'element-ui'

Vue.use(Router)

var router = new Router({
    // mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: home,
            children: [
                // {name: "首页", path: '/main', component: () => import('@/views/home/main')},
                /*************************** 妈妈电子合同*************************************/
                {name: "我的主页", path: '/myMain', component: () => import('@/views/myMain/myMain')},
                {name: "客户管理", path: '/management', component: () => import('@/views/management/management')},
                {name: "新增客户", path: '/managementNew', component: () => import('@/views/management/managementNew')},
                {name: "客户详情", path: '/managementDetail', component: () => import('@/views/management/managementDetail')},
                {name: "模板管理", path: '/template', component: () => import('@/views/template/template')},
                {name: "模板详情", path: '/templateDetail', component: () => import('@/views/template/templateDetail')},
                {name: "合同管理", path: '/contract', component: () => import('@/views/contract/contract')},
                {name: "新增合同", path: '/addcontract', component: () => import('@/views/contract/addcontract')},
                {name: "合同详情", path: '/contractDetail', component: () => import('@/views/contract/contractDetail')},
                {name: "审计管理", path: '/audit', component: () => import('@/views/audit/audit')},
                {name: "系统管理", path: '/system', component: () => import('@/views/system/system')}

            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/login/login')
        }

    ]
})

router.beforeEach((to, from, next) => {
    // 登录拦截
    if (to.fullPath == '/'){
        if (sessionStorage.getItem('user')){
            next({ path: '/myMain' })
            return
        } else {
            Message({
                message: '会话已过期,请重新登录!',
                showClose: true,
                type: 'warning'
            });

            next({ path: '/login' })
            return
        }
    } else if (to.fullPath == '/login'){
        next();
        return
    } else {
        if (sessionStorage.getItem('user')){
            next();
            return
        } else {
            // Message({
            //     message: '会话已过期,请重新登录!',
            //     showClose: true,
            //     type: 'warning'
            // });

            next({ path: '/login' })
            return
        }
    }
})
export default router
