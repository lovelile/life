<template>
  <div class="reg">
    <!-- 头部 -->
    <div class="top-n">
      <van-nav-bar left-arrow @click-left="$router.back()">
        <template #title>
          <router-link to="/login" class="aa">登录</router-link>/
          <router-link to="/reg" class="aa" active-class="color_link2 ">
            注册</router-link
          >
        </template>
      </van-nav-bar>
    </div>
    <!-- 中间 -->
    <div>
      <van-field
        v-model="username"
        type="tel"
        label="手机号"
        placeholder="请输入用户名"
      />
      <van-field
        v-model="password"
        type="password"
        label="密码"
        placeholder="请输入密码"
      />
      <van-field
        v-model="vercode"
        center
        clearable
        label="验证码"
        placeholder="请输入短信验证码"
      >
        <template #button>
          <van-button
            size="small"
            type="primary"
            :disabled="codebnt"
            @click="vercodeA"
            >{{ text }}</van-button
          >
        </template>
      </van-field>
    </div>
    <!-- 最后 -->
    <div class="bom" @click="reg">
      <van-button type="primary" size="large">登录</van-button>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
export default {
  components: {
    [Toast.name]: Toast,
  },
  data() {
    return {
      username: "",
      password: "",
      vercode: "",
      text: "发送验证码",
      codebnt: false,
    };
  },
  methods: {
    vercodeA() {
      // 成功
      try {
        this.codebnt = true;
        this.text = "发送中";
        this.axios
          .post("/user/sendSms", {
            mobile: this.username,
            type: "register",
          })
          .then((res) => {
            console.log(res);
            if (res.data.code == 0) {
              this.$toast("验证码已发送，注意查收");
              // 定时器
              let count = 10;
              let time = setInterval(() => {
                count--;
                this.text = `${count}s后再获取`;
                // 时间过后停止定时器
                if (count <= 0) {
                  clearInterval(time);
                  this.text = "再次发送";
                  this.codebnt = false;
                  count = 60;
                }
              }, 1000);
            } else {
              this.$toast("发送失败");
              this.codebnt = false;
              this.text = "再次发送";
            }
          })
          .catch((err) => {
            this.$toast(err.data.msg || "发送失败");
            this.codebnt = false;
            this.text = "再次发送";
          });
      } catch (e) {}
    },
    reg() {
      this.axios
        .post("/user/reg", {
          username: localStorage.getItem("username"),
          password: this.password,
          vercode: this.vercode,
        })
        .then((res) => {
          console.log(res);
          if (res.data.msg == "注册成功") {
            Toast.success(res.data.msg);
            // alert(res.data.msg);
            this.$router.push("login");
          } else {
            Toast.fail(res.data.msg);
            // alert(res.data.msg);
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.bom {
  margin-top: 30px;
}
.aa {
  color: #fff;
}
.color_link2 {
  font-size: 18px;
  color: blueviolet;
}
</style>
