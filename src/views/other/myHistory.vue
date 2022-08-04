<template>
  <div class="collection">
    <!-- 头部 -->
    <div>
      <van-nav-bar
        title="浏览历史"
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
      </van-list>
    </div>
  </div>
</template>

<script>
import { getHistory } from "@/aip/other";
import { List, PullRefresh, Toast, NavBar } from "vant";

export default {
  components: {
    [List.name]: List,
    [NavBar.name]: NavBar,
    [PullRefresh.name]: PullRefresh,
  },
  data() {
    return {
      uid: "",
      skip: 0,
      limit: 10,
      list: [],
      loading: false,
      finished: false,
    };
  },
  methods: {
    getList() {
      let { skip, limit } = this;
      getHistory({
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
  },
};
</script>

<style lang="less" scoped>
// 头部
::v-deep .van-nav-bar__content {
  background-color: #999;
}
// 内容
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
