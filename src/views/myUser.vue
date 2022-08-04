<template>
  <div class="user">
    <!-- {{ this.$store.state.userInfo }} -->
    <!-- 导航 -->
    <div>
      <van-nav-bar title="个人信息" left-arrow @click-left="onClickLeft" />
    </div>
    <!-- 修改 -->
    <div class="inp">
      <!-- <van-cell title="头像" is-link class="img-z">
        <img src="https://i.postimg.cc/zB5vdSxg/1.png" alt="" />
      </van-cell> -->
      <input
        type="file"
        hidden
        id="file"
        accept="image/*"
        ref="file"
        @change="change"
      />
      <van-cell title="头像" center>
        <label for="file">
          <van-image
            width="50"
            height="50"
            round
            fit="cover"
            :src="userInfo.avatar"
          />
        </label>
      </van-cell>

      <!-- 昵称 -->
      <van-cell-group>
        <van-field
          v-model="nicheng"
          label="昵称"
          :placeholder="userInfo.nickname"
        />
      </van-cell-group>

      <!-- 性别 -->
      <div class="category">
        <van-field
          readonly
          clickable
          name="picker"
          :value="value"
          label="选择性别"
          placeholder="点击选择性别"
          @click="showPicker = true"
        />
        <van-popup v-model="showPicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @confirm="onConfirm2"
            @cancel="showPicker = false"
          />
        </van-popup>
      </div>

      <!-- 选择日期 -->
      <div>
        <van-cell
          title="选择出生日期"
          :value="date"
          @click="show = true"
          is-link
        />
        <van-calendar
          v-model="show"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="onConfirm"
        />
      </div>
    </div>
    <!-- 按钮 -->
    <div class="butt" @click="edit">
      <van-button type="primary" size="large">确定</van-button>
    </div>
  </div>
</template>

<script>
import { Calendar, Picker, Toast, Popup, DatetimePicker } from "vant";

import { mapState, mapActions } from "vuex";

export default {
  components: {
    [Calendar.name]: Calendar,
    [Picker.name]: Picker,
    [Toast.name]: Toast,
    [Popup.name]: Popup,
    [DatetimePicker.name]: DatetimePicker,
  },
  data() {
    return {
      userInfos: {},
      value: "",
      date: "",
      nicheng: "",
      show: false,
      showPicker: false,
      // minDate: new Date(2000, 0, 1),
      // maxDate: new Date(2025, 10, 1),
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2022, 0, 31),
      columns: ["男", "女"],
      avatar: "",
      nickname: "",
      sex: "",
      birthday: "",
    };
  },
  // created() {
  //   let userInfo = localStorage.getItem("userInfo");
  //   console.log(JSON.parse(userInfo));
  // },
  computed: {
    ...mapState(["userInfo"]),
  },
  // watch: {
  //   "$store.state.userInfo": {
  //     immediate: true,
  //     handler(n, o) {
  //       this.userInfo = JSON.parse(JSON.stringify(n));
  //     },
  //   },
  // },
  methods: {
    ...mapActions(["upload"]),
    // 头像
    async change(e) {
      // console.log(e.target.files);

      let file = e.target.files[0];
      // // 前端预览图片
      this.userInfo.file = file;
      let filrReader = new FileReader();
      filrReader.readAsDataURL(file);
      filrReader.onload = (e) => {
        // console.log(e.target.result);
        this.userInfo.avatar = e.target.result;
      };
      // let fileList = [
      //   {
      //     file,
      //   },
      // ];
      // console.log(fileList);
      // let res = await this.upload(fileList);
      // console.log(res);
    },
    // 返回我的
    onClickLeft() {
      this.$router.push("/wode");
    },
    // 性别
    onConfirm2(value, index) {
      this.value = value;
      this.showPicker = false;
      this.value = this.columns[index];
    },
    // 生日
    formatDate(date) {
      return ` ${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm(date) {
      const start = date;
      this.show = false;
      this.date = this.formatDate(start);
    },
    // 调用接口
    async edit() {
      let { file } = this.userInfo;
      if (file) {
        let fileList = [
          {
            file,
          },
        ];
        let res = await this.upload(fileList);
        this.avatar = res[0];
      }

      this.axios
        .post("/user/editUserInfo", {
          avatar: this.avatar,
          nickname: this.nicheng,
          sex: this.value,
          birthday: this.date,
          uid: localStorage.getItem("uid"),
        })
        .then((res) => {
          console.log(res);
          // this.cc = res.data.data;
          if (res.data.code == 0) {
            Toast.success(res.data.msg);
          } else {
            Toast.fail(res.data.msg);
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
// 头像
.img-z img {
  height: 30px;
  width: 30px;
  border-radius: 50%;
}
.user .butt {
  margin-top: 40px;
  padding: 0 50px;
}
</style>
