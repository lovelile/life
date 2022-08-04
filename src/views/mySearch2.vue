<template>
  <div class="Search2">
    <div>
      <van-nav-bar title="搜索详情" left-arrow @click-left="$router.back()" fixed placeholder />
    </div>
    <van-pull-refresh v-model="isRefresh" @refresh="onRefresh">
      <!--  容器 -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="getList">
        <div v-for="(v, i) in list" :key="i" class="xiangqi">
          <h4>{{ v.title }}</h4>
          <span>{{ v.author }}</span>
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
        <!-- <li v-for="(v, i) in list" :key="i">
          <p>{{ v.title }}</p>
          <div
            :class="{
              hide: v.poster_type == 1,
              rightImg: v.poster_type == 2,
              articleImgs: v.poster_type == 3,
            }"
          >
            <img v-for="(img, i) in v.imageSrc" :key="i" :src="img" />
          </div>
        </li> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { List, PullRefresh, Toast } from "vant";
import { NavBar } from "vant";

import { searchAll } from "@/aip/search";

export default {
  components: {
    [List.name]: List,
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
  },
  data() {
    return {
      loading: false,
      finished: false, //  是否 全部 加载完毕了
      skip: 0,
      limit: 20,
      isRefresh: false, //  是否正在刷新
      list: [],
      key_word: "",
    };
  },
  created() {
    console.log(this.$route.query);
    this.key_word = this.$route.query.key;
  },
  methods: {
    getList(flag) {
      let { key_word, skip, limit } = this;
      searchAll({
        key_word,
        skip,
        limit,
      }).then((res) => {
        console.log(res);

        if (res.data.code == 0) {
          if (flag) {
            this.list = res.data.data;
            this.isRefresh = false;
          } else {
            this.list.push(...res.data.data);
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
    onRefresh() {
      Toast("刷新成功");
      this.skip = 0;
      this.finished = false;
      this.getList(true);
    },
  },
};
</script>

<style lang="less" scoped>
.xiangqi {
  text-align: center;
  margin-bottom: 60px;
}
.xiangqi h4 {
  box-sizing: border-box;
  padding: 5px;
  display: block;
  // word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.xiangqi span {
  box-sizing: border-box;
  display: block;
  padding: 5px;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
