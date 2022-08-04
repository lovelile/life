<template>
  <div class="publish">
    <!-- 头部 -->
    <div>
      <van-nav-bar
        title="我的发布"
        left-arrow
        @click-left="$router.back()"
        fixed
        placeholder
      />
    </div>
    <!-- 内容 -->
    <div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getList"
      >
        <div v-for="(v, i) in list" :key="i" class="xiangqi">
          <van-icon name="delete-o" size="20" class="icon" @click="remove(i)" />
          <h4>标题：{{ v.title }}</h4>
          <span>昵称：{{ v.author }}</span>
          <div
            :class="{
              display_a: v.poster_type == 1,
              display_b: v.poster_type == 2,
              display_c: v.poster_type == 3,
            }"
          >
            <img v-for="(img, i) in v.imageSrc" :key="i" :src="img" alt="" />
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { List, PullRefresh, Toast, NavBar } from "vant";

import { getPublish, delUserArticle } from "@/aip/other";
import { Dialog } from "vant";

export default {
  components: {
    [List.name]: List,
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
    [Dialog.Component.name]: Dialog.Component,
  },
  data() {
    return {
      skip: 0,
      limit: 10,
      list: [],
      loading: false,
      finished: false,
    };
  },
  methods: {
    // 我的发布
    getList() {
      let { skip, limit } = this;
      getPublish({
        uid: localStorage.getItem("uid"),
        skip,
        limit,
      }).then((res) => {
        console.log(res);
        // this.list = res.data.data;
        if (res.data.code == 0) {
          this.list.push(...res.data.data);

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
    // 删除我的发布
    remove(i) {
      Dialog.confirm({
        title: "标题",
        message: "删除之后不可找回",
      })
        .then(() => {
          console.log(2);

          delUserArticle({
            uid: localStorage.getItem("uid"),
            _id: this.list[i]._id,
          }).then((res) => {
            console.log(res);
            console.log(1);
            this.list.splice(i, 1);
            if (res.data.data) {
              Toast.success("删除成功");
            } else {
              Toast.fail("删除失败");
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>

<style lang="less" scoped>
// 头部
::v-deep .van-nav-bar__content {
  background-color: #999;
}
// 删除的图标
.xiangqi .icon {
  position: absolute;
  top: 10px;
  right: 15px;
}
// 内容
.xiangqi {
  margin-bottom: 30px;
  position: relative;
}
.xiangqi h4 {
  box-sizing: border-box;
  margin: 0;
  padding: 5px;
  display: block;
  // word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: cornflowerblue;
}
.xiangqi span {
  box-sizing: border-box;
  display: block;
  padding: 5px;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}
.display_a img {
  width: 100%;
  height: 200px;
}
.display_b img {
  width: 100%;
  height: 250px;
}
.display_c {
  display: flex;
  justify-content: space-around;
}
.display_c img {
  width: 32%;
  height: 120px;
}
</style>
