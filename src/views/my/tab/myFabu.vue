<template>
  <div class="fabu">
    <!-- 头部 -->
    <van-nav-bar title="发布" />
    <van-form @submit="onSubmit">
      <!-- 中间 -->
      <div>
        <van-field v-model="title" placeholder="请输入标题" class="fiedl" />
        <van-field
          v-model="content"
          rows="2"
          autosize
          type="textarea"
          maxlength="50"
          placeholder="请输入内容"
          show-word-limit
        />
      </div>
      <!-- 选择类别 -->
      <div class="category">
        <van-field
          readonly
          clickable
          name="picker"
          :value="value"
          label="选择器"
          placeholder="点击选择城市"
          @click="showPicker = true"
          label-width="50px"
        />
        <van-popup v-model="showPicker" position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @confirm="onConfirm"
            @cancel="showPicker = false"
          />
        </van-popup>
      </div>
      <!-- 相机 -->
      <div class="camera">
        <van-field label="图片" label-width="40px" name="fileList">
          <template #input>
            <van-uploader v-model="fileList" multiple :max-count="3" />
          </template>
        </van-field>
      </div>
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>

    <!-- 按钮 -->
    <!-- <div class="btn" @click="publish">
      <van-button type="primary" size="large">确定</van-button>
    </div> -->
    <!-- 尾部 -->
    <TabBar></TabBar>
  </div>
</template>

<script>
import { Form, Popup, Picker, Toast } from "vant";
import { Uploader } from "vant";
import { Field } from "vant";
// 引入接口
import { getUploadTokeb, uploadQiniu } from "@/aip/search";

import TabBar from "./myHome.vue";

export default {
  components: {
    TabBar,
    [Form.name]: Form,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Picker.name]: Picker,
    [Toast.name]: Toast,
    [Uploader.name]: Uploader,
  },

  data() {
    return {
      lists: [],
      value: "",
      list: [],
      columns: [],
      showPicker: false,
      fileList: [], //图片上传
      title: "",
      content: "",
      cate_name: "",
      cate_id: "",
      ids: "",
      // "https://i.postimg.cc/zB5vdSxg/1.png", "https://i.postimg.cc/zB5vdSxg/1.png"
      imageSrc: [],
      author: "",
      author_id: "",
    };
  },
  mounted() {
    // 获取列表
    this.axios
      .post("/user/getuserInfo", {
        token: localStorage.getItem("tokenID"),
      })
      .then((res) => {
        console.log(res);
        this.lists = res.data.userInfo;
      });
    this.axios.post("/api/get_cate_list", {}).then((res) => {
      console.log(res);
      this.list = res.data.data;
      this.list.forEach((v) => {
        this.columns.push(v.name);
      });
      console.log(this.columns);
    });
  },

  methods: {
    // 发布上传按钮
    // publish() {
    //   this.axios
    //     .post("/api/add_article", {
    //       title: this.title,
    //       content: this.content,
    //       cate_name: this.value,
    //       cate_id: this.ids,
    //       // imageSrc: this.imageSrc,
    //       imageSrc: this.upload(this.upload),
    //       author_id: localStorage.getItem("uid"),
    //       author: this.lists.nickname,
    //     })
    //     .then((res) => {
    //       if (res.data.code == 0) {
    //         Toast.success(res.data.msg);
    //       } else {
    //         Toast.fail(res.data.msg);
    //       }
    //     });
    // },
    // 选择按钮
    onConfirm(value, index) {
      this.value = value;
      this.showPicker = false;
      this.ids = this.list[index]._id;
      console.log(this.ids);
    },
    // 图片上传
    async upload(fileList) {
      // let imageSrc = [];
      if (!fileList || fileList.length === 0) {
        return imageSrc;
      }
      // 多个的异步操作
      let task = fileList.map((v) => {
        return new Promise(async (resolve, reject) => {
          let { file } = v;
          let { type } = file;
          //  拿到类型  比如jpg
          type = type.split("/")[1];
          // 重新命名
          let file_name = `${new Date().getTime()}_${Math.random()
            .toString(36)
            .slice(2)}.${type}`;

          // 去服务器申请一个token
          let res = await getUploadTokeb();
          let { token } = res.data;
          console.log(token);

          const formdata = new FormData();
          formdata.append("file", file);
          formdata.append("token", token);
          formdata.append("key", file_name);

          uploadQiniu(formdata).then((res) => {
            resolve(`http://toutiao.longxiaokj.com/` + res.data.key);
          });
        });
      });
      this.imageSrc = await Promise.all(task);
      return this.imageSrc;
    },

    // 表单
    async onSubmit() {
      let imageSrc = await this.upload(this.fileList);
      console.log(imageSrc);
      // publish(){
      this.axios
        .post("/api/add_article", {
          title: this.title,
          content: this.content,
          cate_name: this.value,
          cate_id: this.ids,
          // imageSrc: this.imageSrc,
          imageSrc,
          author_id: localStorage.getItem("uid"),
          author: this.lists.nickname,
        })
        .then((res) => {
          if (res.data.code == 0) {
            Toast.success(res.data.msg);
          } else {
            Toast.fail(res.data.msg);
          }
        });
      // }
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  margin: 10px 0;
  padding: 6px 20px;
}
.fiedl {
  margin: 10px 0;
}
// 分类
.category {
  margin-top: 10px;
}
// 确认
.btn {
  padding: 0 50px;
}
</style>
