<template>
  <div class="wode">
    <!-- 头部 -->
    <div class="header" v-if="isdisplay">
      <div class="box-b">
        <div class="box-l">
          <img :src="list.avatar" alt="" />
          <span>{{ list.nickname }}</span>
        </div>
        <div class="box-r">
          <router-link to="/user">
            <van-button round type="info"> 编辑资料 </van-button>
          </router-link>
        </div>
      </div>
      <div class="box-bom">
        <div class="totiao">
          <ul>
            <li>{{ lists.publish_num }}</li>
            <li>头条</li>
          </ul>
        </div>
        <div class="huosai">
          <ul>
            <li>{{ lists.liked_num }}</li>
            <li>获赞</li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 头部2 -->
    <div class="head2" v-else>
      <div class="content">
        <van-image
          round
          width="4rem"
          height="4rem"
          src="https://img01.yzcdn.cn/vant/cat.jpeg"
        ></van-image>
        <span>
          <router-link to="/login" class="aa">登录</router-link>
          <router-link to="/reg" class="aa"> / 注册</router-link>
        </span>
      </div>
    </div>
    <!-- 收藏 -->
    <div class="box">
      <van-tabbar>
        <van-tabbar-item icon="star-o" @click="$router.push('/collection')"
          ><span>收藏</span></van-tabbar-item
        >
        <van-tabbar-item icon="underway-o" @click="$router.push('/history')"
          ><span>历史</span></van-tabbar-item
        >
      </van-tabbar>
    </div>
    <!-- 修改 -->
    <div class="xiugai">
      <van-cell title="修改密码" is-link to="/revise" />
      <van-cell title="我的发布" is-link to="/publish" />
      <van-cell title="联系我们" is-link to="/contactus" />
      <van-cell title="关于我们" is-link to="/aboutus" />
    </div>
    <!-- 退出 -->
    <div class="btn" @click="quit">
      <van-button color="#ccc" type="primary" size="large" v-show="isdisplay"
        >退出登录</van-button
      >
    </div>
    <!-- 尾部 -->
    <TabBar></TabBar>
  </div>
</template>

<script>
import { Dialog } from "vant";
import { ActionSheet, Cell } from "vant";

// 引入vuex文件
import { mapState } from "vuex";

import TabBar from "./myHome.vue";
export default {
  components: {
    TabBar,
    [ActionSheet.name]: ActionSheet,
    [Cell.name]: Cell,
    [Dialog.Component.name]: Dialog.Component,
  },
  data() {
    return {
      list: [],
      lists: [],
      // isdisplay: false,
    };
  },

  computed: {
    ...mapState(["uid", "tokenID", "userInfo", "isdisplay"]),
    // uid() {
    //   return this.$store.state.uid;
    // },
  },

  // created() {
  //   let { uid, tokenID, userInfo } = localStorage;
  //   // let uid = localStorage.getItem("uid");
  //   // console.log(uid);
  //   if (uid) {
  //     this.isdisplay = true;
  //   } else {
  //     this.isdisplay = false;
  //   }
  // },

  mounted() {
    this.axios
      .post("/user/getuserInfo", {
        token: localStorage.getItem("tokenID"),
      })
      .then((res) => {
        let { uid, token, userInfo } = res.data;

        this.$store.commit("change", { key: "uid", val: uid });
        this.$store.commit("change", { key: "tokenID", val: token });
        this.$store.commit("change", { key: "userInfo", val: userInfo });

        console.log(res);
        this.lists = res.data;
        this.list = userInfo;
      });
  },

  methods: {
    // 退出登录
    quit() {
      Dialog.confirm({
        title: "提示",
        message: "你确定要退出登录吗？",
      })
        .then(() => {
          localStorage.clear();
          this.$store.commit("change", { key: "isdisplay", val: false });
          this.$store.commit("clear");
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
// 头部
.header {
  overflow: hidden;
  height: 190px;
  width: 100%;
  background: url("https://i.postimg.cc/xj7HHvBK/20220802170915.jpg") no-repeat;
  background-size: cover;
}

//
.box-b {
  display: flex;
  width: 100%;
  margin-top: 50px;
  // margin-bottom: 10px;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.box-l {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
.box-l img {
  border-radius: 50%;
  width: 60px;
  height: 60px;
  background-color: #ccc;
}
.box-l span {
  font-size: 16px;
  padding-left: 10px;
  color: #fff;
}
.box-r {
  margin-right: 10px;
}
.header .van-button {
  height: 6.73333vw;
}
.van-button--info {
  background-color: rgba(245, 245, 245, 0);
  color: #fff;
  border: 0;
}
.header .box-bom {
  display: flex;
}
.header .box-bom .totiao,
.huosai {
  width: 50%;
  height: 90px;
  color: #fff;
  font-size: 16px;
}
.header .box-bom .totiao ul,
.huosai ul {
  display: flex;
  height: 90px;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
// 头部2
.head2 {
  height: 190px;
  background: url("https://i.postimg.cc/xj7HHvBK/20220802170915.jpg") no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.head2 .content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.head2 span {
  color: #fff;
  margin-top: 10px;
}
.head2 .aa {
  color: #fff;
}
// 剩下
.box .van-tabbar--fixed {
  position: static;
}
.box .van-tabbar-item--active {
  color: #646566;
}
.box .van-tabbar {
  padding: 10px;
}
.box .van-tabbar span {
  font-size: 16px;
}

.btn {
  margin-top: 50px;
  padding: 0 50px;
}

.xiugai {
  margin-top: 10px;
}
</style>
