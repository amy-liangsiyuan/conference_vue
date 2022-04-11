import {createRouter, createWebHistory} from 'vue-router'

const Test = () => import("../components/test")
//路由分配
const routes = [
    {path: '/test', component: Test},
    {path: '/', component: () => import("../views/home")},
    {path: '/home', component: () => import("../views/home")},
    {path: '/searchconference', component :()=>import(/* webpackChunkName: "new" */ '../views/searchconference')},
    {path: '/about', component: () => import("../views/About")},
    {path: '/login', component: () => import("../views/Login")},
    {
        path: '/newconference', component: () => import("../views/newconference"), meta: {
            requireAuth: true
        }
    },
    {path: '/conferenceinfo', component: () => import("../views/conferenceinfo")},
    {path: '/register', component: () => import("../views/register")},
    {
        path: '/admin',
        component: () => import("../components/AdminMenu"),
        redirect: '/admin/userinfo',
        meta: {
            requireAuth: true
        },
        children:
            [
                {path: 'userinfo', component: ()=>import("../views/admin/UserInfo")},
                {path: 'myconference', component:  () => import("../views/admin/MyConferences")}

            ]
    }

]

//启用历史模式
const router = createRouter({
    history: createWebHistory(),
    routes
})

//暴露router
export default router
