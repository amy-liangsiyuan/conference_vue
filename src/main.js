import {createApp} from 'vue'

import '../src/assets/css/global.css'
import 'animate.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import App from './App.vue'
import axios from 'axios'
import * as Icons from '@element-plus/icons-vue'
import JsEncrypt from 'jsencrypt'
import VueI18n from './language'
//md编辑器
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
// Prism
import Prism from 'prismjs';
// highlight code
import 'prismjs/components/prism-json';

VMdEditor.use(vuepressTheme, {
    Prism,
});

const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(VueI18n)
app.use(VMdEditor)
app.mount('#app')
//注册使用icon
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key])
})

/*
注意因为是前后端分离开发，每次前端的ajax请求都是新的，每次请求的sessionID都不一样，所以每次使用的session不是同一个，以至于登录时session里面的值为null。
需要在vue项目的main.js中配置axios.defaults.withCredentials为true，使得每次请求都带上浏览器的cookie，这样后端使用的session就是同一个了。
*/
axios.defaults.withCredentials = true;
//http请求，挂载全局变量
axios.defaults.headers['Content-Type'] = 'application/json;charset=UTF-8'
app.config.globalProperties.$http = axios
//加密传输
app.config.globalProperties.$encryption = function (obj) {
    const encrypt = new JsEncrypt()
    encrypt.setPublicKey('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwYUA+IvrCTFry+48Futz\n' +
        'ykuFWWc+zoQIn/eQPGQMVtLtJm8g+lD3RMWaP+c7cik6NULTVVYQcEhvNBls/du+\n' +
        'FMF0Mb8PUVc1E00hAwpOdDgl8+7eWz77co8c+06tI1c4aj9zjFyUv13W968hjlGE\n' +
        'zGXq4XPUEhTvUm+gQ3j5gqR3MktFoXQmkMIl2l/OiVf6hA9qRd+rpYbyFDM6xU75\n' +
        'CHJbUd43DVXCAJsDdSvuZcCbeDoXIz30jsbe5ZZQuzz610fQW6dLGJDJ20/ERS8J\n' +
        'AI6LIOT8LsgwlwpTGxs/HNAwQ08ha2oO+0Qegn8Wo3tFi1E1Fj/lfxQG3hdOfSJi\n' +
        'GwIDAQAB')
    return encrypt.encrypt(obj)

}
axios.interceptors.request.use(config => {
    config.headers.token = window.sessionStorage.getItem("token")
    // 在最后必须 return config
    return config
})
axios.interceptors.response.use(config => {
    return config
})



// 路由判断登录 根据路由配置文件的参数
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限
        if (sessionStorage.token) { // 判断当前的token是否存在 ； 登录存入的token
            next();
        } else {
            next({
                path: '/login',
            })

        }
    } else {
        next();
    }
});
