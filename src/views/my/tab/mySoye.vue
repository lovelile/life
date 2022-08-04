<template>
  <div class="soye">
    <!-- 头部 -->
    <div style="height: 50px">
      <van-nav-bar fixed placeholder>
        <template #title>
          <div class="search-S">
            <router-link to="/search">
              <van-icon name="search" class="#fff" size="20" />
              <span class="span-s">搜索</span>
            </router-link>
          </div>
        </template>
      </van-nav-bar>
    </div>
    <!-- tab导航 -->
    <van-tabs @click="emit">
      <van-tab v-for="(v, i) in arr" :key="i" :title="v.name"></van-tab>
    </van-tabs>
    <!-- 列表 -->
    <div style="padding-bottom: 60px">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh"
        ><van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :immediate-check="false"
        >
          <div
            class="list"
            v-for="(v, i) in list"
            :key="i"
            @click="jump(i)"
            :class="{
              box_a: v.poster_type == 1,
              box_b: v.poster_type == 2,
              box_c: v.poster_type == 3,
            }"
          >
            <div class="count_aa">
              <h4>{{ v.title }}</h4>
              <span>{{ v.author }}</span>
              <i>日期：{{ formatDate(v.time) }}</i>
            </div>

            <div
              :class="{
                display_a: v.poster_type == 1,
                display_b: v.poster_type == 2,
                display_c: v.poster_type == 3,
              }"
            >
              <img
                v-for="(img, i) in v.imageSrc"
                :key="i"
                :src="img"
                :v-lazy="img"
              />
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 尾部 -->
    <TabBar></TabBar>
  </div>
</template>

<script>
import { Tab, Tabs } from "vant";
import { List } from "vant";
import { PullRefresh } from "vant";
import { Toast, Lazyload } from "vant";
import { Image as VanImage } from "vant";

import TabBar from "./myHome.vue";
export default {
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [Lazyload.name]: Lazyload,
    [VanImage.name]: VanImage,

    TabBar,
  },
  data() {
    return {
      arr: [],
      obj: "",
      list2: [],
      list: [],
      loading: false, // 上拉加载
      finished: false, // 判断上拉加载是否完毕
      // count: 0,
      isLoading: false, //下拉刷新
      skip: 0,
      limit: 10,
    };
  },
  mounted() {
    // 文章列表
    this.axios.post("/api/get_cate_list", {}).then((res) => {
      this.arr = res.data.data;
      console.log(res);
      this.obj = res.data.data[0]._id;
      this.axios
        .post("/api/get_article_list", {
          cate_id: this.obj,
          skip: 0,
          limit: 10,
        })
        .then((res) => {
          console.log(res);
          res.data.data.forEach((v, i) => {
            if (!v.imageSrc.length == 0) {
              this.list.push(v);
            }
          });

          //
        });
    });
  },
  methods: {
    emit(i) {
      this.obj = this.arr[i]._id;
      // console.log(this.obj);
      this.axios
        .post("/api/get_article_list", {
          cate_id: this.obj,
        })
        .then((res) => {
          this.list = [];
          res.data.data.forEach((v, i) => {
            if (!v.imageSrc.length == 0) {
              this.list.push(v);
            }
          });
          // console.log(res);
        });
    },

    // 上拉加载
    onLoad(flag) {
      let { skip, limit } = this;
      this.axios
        .post("/api/get_article_list", {
          cate_id: this.obj,
          skip,
          limit,
        })
        .then((res) => {
          console.log(res);

          // 图片懒加载;
          res.data.data = res.data.data.map((v) => {
            if (v.imageSrc.length) {
              v.imageSrc = v.imageSrc.map((v) => {
                return v + "?imageslim";
              });
            }
            return v;
          });

          //去除无图片
          // this.list2.forEach((v, i) => {
          //   if (v.poster_type != 1) {
          //     this.list.push(res.data.data[i]);
          //   } else {
          //     return;
          //   }
          // });

          //拉加载
          if (res.data.code == 0) {
            if (flag) {
              res.data.data.forEach((v, i) => {
                if (!v.imageSrc.length == 0) {
                  this.list.push(v);
                }
              });
              this.isRefresh = false;
            } else {
              res.data.data.forEach((v, i) => {
                if (!v.imageSrc.length == 0) {
                  this.list.push(v);
                }
              });
            }

            let len = this.list.length;

            if (len >= res.data.count) {
              this.finished = true;
            } else {
              this.loading = false;
              this.skip = len;
            }
          }
        });
    },

    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        Toast("刷新成功");
        this.isLoading = false;
        this.skip = 0;
        this.finished = false;
        this.axios
          .post("/api/get_article_list", {
            cate_id: this.obj,
            skip: 0,
            limit: 10,
          })
          .then((res) => {
            // console.log(res);
            this.list = res.data.data;
          });
      }, 1000);
    },

    // 跳转到文章详情页
    jump(i) {
      console.log(this.list);
      // this.$router.push("/article");
      this.$router.push({
        name: "article",
        query: {
          article_id: this.list[i]._id,
        },
      });
    },

    // 时间戳
    formatDate(value) {
      // 时间戳转换日期格式方法
      if (value == null) {
        return "";
      } else {
        let date = new Date(value);
        let y = date.getFullYear(); // 年
        let MM = date.getMonth() + 1; // 月
        MM = MM < 10 ? "0" + MM : MM;
        let d = date.getDate(); // 日
        d = d < 10 ? "0" + d : d;
        // let h = date.getHours(); // 时
        // h = h < 10 ? "0" + h : h;
        // let m = date.getMinutes(); // 分
        // m = m < 10 ? "0" + m : m;
        // let s = date.getSeconds(); // 秒
        // s = s < 10 ? "0" + s : s;
        // return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
        return y + "-" + MM + "-" + d;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.search-S {
  height: 32px;
  width: 270px;
  background-color: rgb(247 255 247 /50%);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.span-s {
  color: #fff;
  font-size: 18px;
}

// 导航
::v-deep .van-tab {
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
}
::v-deep .van-tab:nth-child(7) {
  border-right: none;
}
::v-deep .van-tabs__line {
  bottom: 5.5vw;
  width: 3.66667vw;
  background-color: #42b983;
}
::v-deep .van-nav-bar__placeholder {
  height: 50px;
}

// 列表详情
.soye .list {
  // text-align: center;
  margin-top: 20px;
  // overflow: hidden;
}
.soye .list h4 {
  // float: left;
  // display: inline-block;
  font-size: 14px;
  color: cornflowerblue;
  box-sizing: border-box;
  padding: 5px;
  margin: 0;
  display: block;
  // word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  // white-space: nowrap;
}
.soye .list span {
  // display: inline-block;
  // float: left;
  font-size: 13px;
  box-sizing: border-box;
  display: block;
  padding: 5px;
  word-break: break-all;
}
.display_a img {
  width: 100%;
  height: 200px;
}
.display_b img {
  width: 100%;
  height: 100%;
  // float: right;
}
.display_c {
  display: flex;
  justify-content: space-around;
}
.display_c img {
  width: 32%;
  height: 120px;
}
// 整体排版
.box_a {
  display: none;
}
.box_b {
  display: flex;
  justify-content: space-between;
}
.count_aa {
  padding-left: 5px;
  width: 200px;
}
.count_aa i {
  text-decoration: none;
  color: #999;
  font-style: normal;
  font-size: 12px;
  padding: 5px;
}
.display_b {
  width: 150px;
  height: 120px;
}
//
.box_c .count_aa {
  text-align: center;
  width: 100%;
}

.box_c i {
  display: none;
}
</style>
