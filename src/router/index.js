import Vue from 'vue'
import VueRouter from 'vue-router'
import myLogin from '../views/my/myLogin.vue'
import myReg from '../views/my/myReg.vue'
import myHome from '../views/my/tab/myHome.vue'
//tabat
import mySoye from '../views/my/tab/mySoye.vue'
import myFabu from '../views/my/tab/myFabu.vue'
import myWode from '../views/my/tab/myWode.vue'
// 搜索
import mySearch from '../views/mySearch.vue'
// 搜索 2
import mySearch2 from '../views/mySearch2.vue'
// 个人信息
import myUser from '../views/myUser.vue'
import myRevise from '../views/myRevise.vue'
//忘记密码
import myForget from '../views/myForget.vue'
// 文章详情
import myArticle from '../views/myArticle.vue'
// 收藏
import myCollection from '../views/other/myCollection.vue'
// 浏览历史
import myHistory from '../views/other/myHistory.vue'
// 联系我们
import myContactus from '../views/other/myContactus.vue'
// 关于我们
import myAboutus from '../views/other/myAboutus.vue'
// 我的发布
import myPublish from '../views/other/myPublish.vue'











Vue.use(VueRouter)

const routes = [
  {
    path: '/reg',
    name:'reg',
    component:myReg
  },
  {
    path: '/login',
    name: 'login',
    component: myLogin,
    meta:{
      keep:true
    }
  },
  {
    path: '/home',
    name: 'home',
    component: myHome,
  },
  {
    path: '/',
    name: 'soye',
    component: mySoye,
    meta:{
      keep:true
    }
  },{
    path: '/fabu',
    name: 'fabu',
    component: myFabu,
    meta:{
      keep:true
    }
  },{
    path: '/wode',
    name: 'wode',
    component: myWode,
  
  },
  // 个人信息
  {
    path:"/user",
    name:'user',
    component: myUser,
    meta:{
      keep:true
    }
  },
  // 修改密码
  {
    path:'/revise',
    name:"revise",
    component:myRevise
  },
  // 忘记密码
  {
    path:'/forget',
    name:"forget",
    component:myForget
  },
  // 文章详情
  {
    path:"/article",
    name:"article",
    component:myArticle
  },
  // 搜索
   {
    path: '/search',
    name:'serch',
    component:mySearch
  },
  // 搜索 2
  {
    path: '/search2',
    name:'search2',
    component:mySearch2
  },
  // 收藏
  {
   path: '/collection',
   name:'collection',
   component:myCollection 
  },
  // 浏览历史
  {
   path: '/history',
   name:'history',
   component:myHistory 
  },
  // 联系我们
  {
   path: '/contactus',
   name:'contactus',
   component:myContactus 
  },
  // 关于我们
  {
   path: '/aboutus',
   name:'aboutus',
   component:myAboutus 
  },
  // 我的发布
  {
    path:'/publish',
    name:'publish',
    component:myPublish
  }
  
]


const router = new VueRouter({
  routes
})

export default router
