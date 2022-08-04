import axios from './index.js';

// 收藏列表
export function getFavList(params){
   return  axios.post('/api/get_fav_list',params)
}
// 浏览历史
export function getHistory(params){
   return  axios.post('/api/get_history_list',params)
}
// 我的发布
export function getPublish(params){
   return  axios.get('/api/get_user_article_list',{
      params
   })
}
// 删除我的发布
export function delUserArticle(params){
   return  axios.post('/api/del_user_article',params)
}