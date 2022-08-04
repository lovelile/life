<template>
  <div class="revise">
    <!-- 头部 -->
    <div>
      <van-nav-bar title="修改密码" left-arrow @click-left="onClickLeft" />
    </div>
    <!-- 中间 -->
    <div>
      <van-field
        v-model="oldPassword"
        type="tel"
        label="旧密码："
        placeholder="请输入旧密码"
      />
      <van-field
        class="for-inp"
        v-model="newPassword"
        type="tel"
        label="新密码："
        placeholder="请输入新密码"
      />
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
      oldPassword: "",
      newPassword: "",
    };
  },
  methods: {
    onClickLeft() {
      this.$router.push("/wode");
    },
    change() {
      this.axios
        .post("/user/updatePwd", {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
          uid: localStorage.getItem("uid"),
        })
        .then((res) => {
          console.log(res);
          if (res.data.code == 0) {
            Toast.success(res.data.msg);
            this.$router.push("/login");
          } else {
            Toast.fail(res.data.msg);
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.for-inp {
  margin: 20px 0;
}
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
