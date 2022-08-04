<template>
  <div class="search">
    <!-- 搜索 -->
    <van-search
      show-action
      v-model="value"
      :placeholder="text"
      @cancel="$router.back()"
      @search="onSearch"
      @input="onInput"
    />

    <div v-show="listSearch.length" class="list">
      <van-cell :title="v.title" v-for="(v, i) in listSearch" :key="i" @click="Recording(v.title)">
      </van-cell>
    </div>
    <!-- 历史记录 -->
    <div class="search_h">
      <!-- 上 -->
      <van-cell title="搜索历史">
        <div>
          <span @click="removerAll">全部删除</span>
        </div>
      </van-cell>
      <!-- 下 -->
      <van-cell
        :title="v"
        v-for="(v, i) in recording"
        :key="i"
        :to="{ path: '/seaarch2', query: { key: v } }"
      >
        <van-icon name="close" @click="remove(i)"></van-icon>
      </van-cell>
    </div>
  </div>
</template>

<script>
import { Search } from "vant";
import { Cell, CellGroup } from "vant";
import { Toast } from "vant";

function debounce(fn, t = 500) {
  let time = null;
  return function (...arg) {
    clearTimeout(time);
    time = setTimeout((v) => {
      fn.apply(this, arg);
    }, t);
  };
}

import { searchAll } from "@/aip/search";

export default {
  components: {
    [Search.name]: Search,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
  },

  data() {
    return {
      value: "",
      text: "热爱生活",
      listSearch: [],
      recording: [], //历史记录的储存
    };
  },
  // 页面进行加载时，进行判断
  created() {
    // 检查第一次来是否有历史记录
    let recording = localStorage.getItem("recording");
    // 如果有
    if (recording) {
      this.recording = JSON.parse(recording);
    }
  },
  methods: {
    onInput: debounce(function (e) {
      e = e.trim(); // 去掉前后空格
      if (e.length === 0) return;
      searchAll({
        key_word: e,
      }).then((res) => {
        console.log(res);
        if (res.data.code == 0) {
          this.listSearch = res.data.data;
        }
      });
    }),
    onSearch(e) {
      e = e.trim(); //去掉空格
      e = e || this.text;

      // 键盘按键逻辑的复用
      this.Recording(e);
    },
    // 搜索后点击跳转
    Recording(title) {
      let index = this.recording.findIndex((v) => v === title);
      if (index >= 0) {
        this.recording.splice(index, 1);
      }

      this.recording.unshift(title);
      localStorage.setItem("recording", JSON.stringify(this.recording));
      this.$router.push({
        path: "/search2",
        query: { key: title },
      });
    },
    // 删除个别历史记录
    remove(i) {
      this.recording.splice(i, 1);
      localStorage.setItem("recording", JSON.stringify(this.recording));
    },
    // 删除所有的历史记录
    removerAll() {
      this.recording = [];
      localStorage.setItem("recording", JSON.stringify(this.recording));
    },
  },
  // 监听数据的变换
  watch: {
    value(a) {
      if (a.trim().length === 0) {
        this.listSearch = [];
      }
    },
  },
};
</script>

<style lang="less" scoped>
.list {
  position: fixed;
  left: 0;
  right: 0;
  top: 54px;
  bottom: 0;
  overflow-y: auto;
  z-index: 999;
  background: #eee;
}
</style>
