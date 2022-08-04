import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { getUserInfo } from '@/aip/search'
// 引入接口
import { getUploadTokeb, uploadQiniu } from "@/aip/search";

const CHANGE="change"
export default new Vuex.Store({
  // 写入数据
  state: {
    a:1,
    uid:"",
    tokenID:"", 
    userInfo:{},
    isdisplay: false,
    publish_num:0,
    liked_num:0

  },
  // vue里面的计算属性
  getters: {
  },
  // 改数据
  mutations: {
    [CHANGE](state,{key,val}){
      state[key]=val
    },
    
    // 更改数据
    clear(state){
    state.uid='';
    state.tokenID="";
    state.userInfo={};
    }

    // changeuid(state,val){
    //   state.uid=val
    // }
  },
  // dispatch  这里可以写异步操作
  actions: {
    // getuser({commit},token){
    //   commit("change", { key: "uid", val: res.data.uid });
    //   commit("change", { key: "tokenID", val: token });
    //   commit("change", { key: "userInfo", val: res.data.userInfo });
    // }

     async  getUserInfo({
      commit
    }, token) {
      //  在这里写异步 
      // console.log(json)

    return  getUserInfo({
        token
      }).then(res => {
        console.log(123);
        console.log(res)
        //  再次存起来
        if (res.data.code == 0) {
          commit('change', {
            key: "userInfo",
            val: res.data.userInfo
          })
          commit('change', {
            key: "uid",
            val: res.data.uid
          })
          commit('change', {
            key: "tokenID",
            val: res.data.userInfo.token
          })
          commit('change', {
            key: "isdisplay",
            val: true
          })
          commit('change', {
            key: "publish_num",
            val: res.data.publish_num
          })
          commit('change', {
            key: "liked_num",
            val: res.data.liked_num
          })
        } else {

        }
      })
    },
    
    // 图片上传
        async upload(commit,fileList) {
      // let imageSrc = [];
      if (!fileList || fileList.length === 0) {
        return imageSrc;
      }
      // 多个的异步操作
      let task = fileList.map((v) => {
        return new Promise(async (resolve, reject) => {
          let { file } = v;
          let { type } = file;
          //  拿到类型  比如jpg
          type = type.split("/")[1];
          // 重新命名
          let file_name = `${new Date().getTime()}_${Math.random()
            .toString(36)
            .slice(2)}.${type}`;

          // 去服务器申请一个token
          let res = await getUploadTokeb();
          let { token } = res.data;
          console.log(token);

          const formdata = new FormData();
          formdata.append("file", file);
          formdata.append("token", token);
          formdata.append("key", file_name);

          uploadQiniu(formdata).then((res) => {
            resolve(`http://toutiao.longxiaokj.com/` + res.data.key);
          });
        });
      });
      this.imageSrc = await Promise.all(task);
      return this.imageSrc;
    },


  },
  // 
  modules: {
  }
})
