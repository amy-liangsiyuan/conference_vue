import {createRouter, createWebHistory} from 'vue-router'

const Test = () => import("../components/test")
//路由分配
const routes = [
    {
        path: '/test', component: Test
    },
    {
        path: '/:pathMatch(.*)*', component: () => import('../views/404page')
    },
    {
        path: '/', component: () => import("../views/home")
    },
    {
        path: '/conferencePage', component: () => import("../views/conferencePage"), meta: {
            requireId: true
        }
    },
    {
        path: '/home',
        component: () => import("../views/home")
    },
    {
        path: '/searchconference',
        component: () => import('../views/searchconference')
    },
    {
        path: '/about',
        component: () => import("../views/About")
    },
    {
        path: '/login',
        component: () => import("../views/Login")
    },
    {
        path: '/newconference',
        component: () => import("../views/newconference"),
        meta: {requireAuth: true}
    },
    {
        path: '/register', component: () => import("../views/register")
    },
    {
        path: '/admin',
        component: () => import("../components/AdminMenu"),
        redirect: '/admin/userinfo',
        meta: {requireAuth: true},
        children:
            [
                {path: 'userinfo', component: () => import("../views/admin/UserInfo")},
                {path: 'myconference', component: () => import("../views/admin/MyConferences")}

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
