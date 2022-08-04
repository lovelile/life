import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

axios.defaults.baseURL="https://d33a5037-6c63-4e92-8bb1-30018ab701ea.bspapp.com/http"
// 全局引用
import { Button,NavBar,Field ,Icon,Tabbar, TabbarItem, Cell, CellGroup, } from 'vant';
import { Image as VanImage } from 'vant';
Vue.use(VanImage);
Vue.use(Button)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(NavBar)
Vue.use(Field)
Vue.use(Icon)
Vue.use(Tabbar)
Vue.use(TabbarItem)




new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


// // Vue.prototype.$bus = new Vue()

let token = localStorage.getItem("tokenID")
if(token){
  
   store.dispatch('getUserInfo',token)
}

// }else{
//     new Vue({
//     router,
//     store,
//     render: h => h(App)
// })}
