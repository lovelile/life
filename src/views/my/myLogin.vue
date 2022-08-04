<template>
  <div class="login">
    <!-- 头部 -->
    <div class="top">
      <van-nav-bar left-arrow @click-left="$router.back()">
        <template #title>
          <router-link to="/login" class="aa" active-class="color_link"
            >登录</router-link
          >
          <router-link to="/reg" class="aa" active-class="color_link2">
            / 注册</router-link
          >
        </template>
      </van-nav-bar>
    </div>
    <!-- 中间 -->
    <div class="">
      <van-field
        v-model="username"
        type="tel"
        label="手机号"
        placeholder="请输入手机号"
      />
      <van-field
        v-model="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
      />
    </div>
    <!-- 忘记密码 -->
    <div class="forget" @click="forget_m">
      <a href="javascript:;">忘记密码</a>
    </div>
    <!-- 按钮 -->
    <div class="bom" @click="gohome">
      <van-button type="primary" size="large">登录</van-button>
    </div>
  </div>
</template>

<script>
// import { validate } from "json-schema";
import { Toast } from "vant";

export default {
  components: {
    [Toast.name]: Toast,
  },
  data() {
    return {
      username: "",
      password: "",
      uid: "",
      tokenID: "",
      userInfo: {},
    };
  },
  methods: {
    onClickLeft() {
      Toast("按钮");
    },
    gohome() {
      this.axios
        .post("/user/login", {
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          console.log(res);
          if (res.data.code == 0) {
            let { uid, token, userInfo, username } = res.data;
            console.log(res.data);

            localStorage.setItem("username", username);
            // localStorage.tokenID = token;
            localStorage.setItem("uid", uid);
            localStorage.setItem("tokenID", token);
            localStorage.setItem("userInfo", JSON.stringify(userInfo));

            this.$store.commit("change", { key: "uid", val: uid });
            this.$store.commit("change", { key: "tokenID", val: token });
            this.$store.commit("change", { key: "userInfo", val: userInfo });
            this.$store.commit("change", { key: "isdisplay", val: true });

            // this.$store.commit("changeuid", uid);

            Toast.success(res.data.msg);
            this.$router.push("/wode");
          } else {
            Toast.fail(res.data.msg);
          }
        });
    },
    // 忘记密码
    forget_m() {
      this.$router.push("/forget");
    },
  },
};
</script>

<style lang="less" scoped>
html {
  background-color: rgb(251, 247, 247);
}
.bom {
  margin-top: 30px;
}
.aa {
  color: #fff;
}
// 忘记密码
.forget {
  margin: 10px 0;
  width: 100%;
  text-align: right;
}
.forget a {
  padding-right: 10px;
}
// 选中后的颜色
.color_link {
  font-size: 18px;
  color: blueviolet;
  // font-weight: 600;
}
</style>
