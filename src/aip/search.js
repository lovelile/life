import axios from './index.js';


// 搜索
// export function searchAll(params){
//    return  axios.get('/api/search',{
//       params
//    })
// }

// 搜索
export function searchAll(params){
   return  axios.post('/api/search',params)
}

// 获取七牛云token
export function getUploadTokeb(){
   return  axios.get('/upload/token')
}

// 上传到七牛云
export function uploadQiniu(formData){
   return  axios.post('https://upload-z1.qiniup.com',formData)
}

export function getUserInfo(params){
    return axios.post('/user/getuserInfo',params)
}

