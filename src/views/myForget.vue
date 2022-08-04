<template>
  <div class="forget">
    <!-- 头部 -->
    <div>
      <van-nav-bar title="忘记密码" left-arrow @click-left="onClickLeft" />
    </div>
    <!-- 中间 -->
    <div>
      <van-field
        v-model="username"
        type="tel"
        label="手机号："
        placeholder="请输入手机号"
      />
      <van-field
        v-model="password"
        type="password"
        label="新密码："
        placeholder="请输入新密码"
      />
      <van-field
        v-model="vercode"
        center
        clearable
        label="验证码"
        placeholder="请输入短信验证码"
        @click="vercodeA"
      >
        <template #button>
          <van-button size="small" type="primary" @click="vercodeA"
            >发送验证码</van-button
          >
        </template>
      </van-field>
    </div>
    <!-- 尾部 -->
    <div class="footer">
      <button @click="change">确认修改</button>
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
    };
  },
  methods: {
    onClickLeft() {
      this.$router.push("/login");
    },
    vercodeA() {
      this.axios
        .post("/user/sendSms", {
          mobile: this.username,
          type: "login",
        })
        .then((res) => {
          console.log(res);
          if (res.data.code == 0) {
            Toast.success(res.data.msg);
          } else {
            Toast.fail(res.data.msg);
          }
        });
    },
    change() {
      this.axios
        .post("/user/forget", {
          username: this.username,
          password: this.password,
          vercode: this.vercode,
        })
        .then((res) => {
          console.log(res);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.footer {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.footer button {
  height: 40px;
  width: 270px;
  text-align: center;
  background-color: #42b983;
  border: 0;
  color: #fff;
}
</style>
