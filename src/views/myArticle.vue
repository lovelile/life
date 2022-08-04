<template>
  <div class="article">
    <!-- 头部 -->
    <div class="nav">
      <van-nav-bar
        title="文章详情"
        left-arrow
        @click-left="$router.back()"
        fixed
        placeholder
      />
    </div>
    <!-- <van-cell is-link @click="showPopup">展示弹出层</van-cell> -->

    <div ref="renderContent">
      <!-- 中上 -->
      <div class="z-top">
        <h3>{{ lists.title }}</h3>
        <div class="zzz">
          <div class="box-b">
            <div class="box-l">
              <img :src="lists.imageSrc" alt="" />
              <div class="zuzhe">
                <span>{{ lists.author }}</span>
                <p>{{ formatDate(lists.time) }}</p>
              </div>
            </div>
            <div class="box-r">
              <van-button round type="info">+ 已关注</van-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 内容 -->
      <div class="content-t">
        <p>{{ lists.content }}</p>
      </div>
    </div>
    <!-- 点赞 -->
    <div class="box-A">
      <div class="thumbs" v-for="(v, i) in list_p" :key="i">
        <div class="box-b">
          <div class="box-l">
            <img :src="v.info.avatar" alt="" />
            <div class="zuzhe">
              <span>{{ v.info.nickname }}</span>
              <span class="bbb">{{ v.content }}</span>
              <div class="aaa">
                <p>{{ formatDate(v.create_time) }}</p>
                <span @click="showPopup(v, i)">{{ v.reply_num }} 回复 </span>
                <!-- 弹出层 -->
                <van-popup
                  v-model="show"
                  closeable
                  close-icon="close"
                  position="bottom"
                  :style="{ height: '100%' }"
                >
                  <!-- 内部二级评论 -->
                  <div class="comments-tow">
                    <div>
                      <img :src="list_p[aaa].info.avatar" alt="" />
                    </div>
                    <div>
                      <p>{{ list_p[aaa].info.nickname }}</p>
                      <b>{{ list_p[aaa].content }}</b>
                      <span>{{ formatDate(list_p[aaa].create_time) }}</span>
                    </div>
                    <div>
                      <span
                        ><van-icon
                          name="good-job"
                          size="18"
                          @click="like(v, i)"
                          :style="{ color: v.is_like ? 'red' : '#ccc' }"
                        />{{ list_p[aaa].like_count }}</span
                      >
                    </div>
                  </div>
                  <!-- 二级别人的评论 -->
                  <div
                    class="comments-three"
                    v-for="(ve, ie) in list_tow"
                    :key="ie"
                  >
                    <div>
                      <img :src="ve.info.avatar" alt="" />
                    </div>
                    <div>
                      <p>{{ ve.info.nickname }}</p>
                      <b>{{ ve.content }}</b>
                      <span>{{ formatDate(ve.create_time) }}</span>
                    </div>
                    <div>
                      <span
                        ><van-icon
                          @click="like(v, i)"
                          name="good-job"
                          size="18"
                          :style="{ color: v.is_like ? 'red' : '#ccc' }"
                        />{{ ve.like_count }}</span
                      >
                    </div>
                  </div>
                  <!-- 二级评论 -->
                  <div class="footer">
                    <input type="text" placeholder="写评论" v-model="value" />
                    <van-icon
                      name="comment-o"
                      size="26"
                      @click="comments_tow(v, i)"
                    />
                    <van-icon
                      name="star"
                      size="26"
                      @click="collection"
                      :style="{ color: lists.is_fav ? 'red' : '#ccc' }"
                    />
                    <van-icon
                      name="good-job"
                      size="26"
                      @click="dain"
                      :style="{ color: lists.is_like ? 'red' : '#ccc' }"
                    />
                    <van-icon name="share-o" size="26" />
                  </div>
                </van-popup>
              </div>
            </div>
          </div>
          <!-- 点赞 -->
          <div class="box-r" style="margin-right: 20px">
            <span
              ><van-icon
                @click="like(v, i)"
                name="good-job"
                size="18"
                :style="{ color: v.is_like ? 'red' : '#ccc' }"
              />{{ v.like_count }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <!-- 最后 -->
    <div class="footer">
      <input type="text" placeholder="写评论" v-model="value" />
      <van-icon name="comment-o" size="26" @click="comments" />
      <van-icon
        name="star"
        size="26"
        @click="collection"
        :style="{ color: lists.is_fav ? 'red' : '#ccc' }"
      />
      <van-icon
        name="good-job"
        size="26"
        @click="dain"
        :style="{ color: lists.is_like ? 'red' : '#ccc' }"
      />
      <van-icon name="share-o" size="26" @click="showShare = true" />
    </div>
    <!-- 分享 -->
    <div>
      <van-share-sheet
        v-model="showShare"
        title="立即分享给好友"
        :options="options"
        @select="onSelect"
      />
      <!-- 二维码 -->
      <van-popup v-model="qrcodepopup" round>
        <van-image :src="qrcodeURL"> 扫一扫 </van-image>
      </van-popup>
    </div>
    <!-- 海报 -->
    <van-popup v-model="renderContent" round>
      <van-image :src="renderURL"></van-image>
    </van-popup>
  </div>
</template>

<script>
import { Image, Toast, Popup, CellGroup, ShareSheet } from "vant";
import { watch } from "vue";
import QRCode from "qrcode";
import html2canvas from "html2canvas";

export default {
  components: {
    [Image.name]: Image,
    [Toast.name]: Toast,
    [Popup.name]: Popup,
    [ShareSheet.name]: ShareSheet,
  },
  data() {
    return {
      value: "",
      lists: [],
      color: true,
      list_p: [],
      show: false,
      aaa: 0,
      qq: 0,
      list_tow: [],
      cc_id: "",
      // 分享
      showShare: false,
      options: [
        { name: "微信", icon: "wechat" },
        { name: "QQ", icon: "qq" },
        { name: "微博", icon: "weibo" },
        { name: "复制链接", icon: "link" },
        { name: "分享海报", icon: "poster" },
        { name: "二维码", icon: "qrcode" },
      ],
      // 二维码
      qrcodepopup: false,
      qrcodeURL: "",
      // 海报
      renderContent: false,
      renderURL: "",
    };
  },
  mounted() {
    // 文章详情
    this.axios
      .post("/api/get_article_detail", {
        article_id: this.$route.query.article_id,
        user_id: localStorage.getItem("uid"),
      })
      .then((res) => {
        console.log(res);
        // if (res.data.code == 0) {
        this.lists = res.data.data;
        // } else {
        // }
      });
    // 评论列表
    this.axios
      .post("/api/get_comment_list", {
        article_id: this.$route.query.article_id,
        user_id: localStorage.getItem("uid"),
      })
      .then((res) => {
        console.log(res);
        this.list_p = res.data.data;
        console.log(this.list_p);
      });
  },
  methods: {
    // 分享
    onSelect({ name }) {
      let href = window.location.href;
      let title = this.lists.title;
      switch (name) {
        case "QQ":
          window.location.href = `http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=${title}&href=${href}&content=${title}`;
          break;

        case "微博":
          window.location.href = `http://service.weibo.com/share/share.php?url=${href}&sharesource=weibo&title=${title}`;
          break;

        case "复制链接":
          let input = document.createElement("input");
          input.value = href;
          document.body.appendChild(input);
          input.select();
          document.execCommand("Copy");
          document.body.removeChild(input);
          Toast("复制成功");
          break;

        case "分享海报":
          html2canvas(this.$refs.renderContent).then((canvas) => {
            document.body.appendChild(canvas);
            // console.log(canvas);
            let url = canvas.toDataURL();
            this.renderURL = url;
            this.renderContent = true;
            console.log(url);
          });

          break;

        case "二维码":
        case "微信":
          QRCode.toDataURL("I am a pony!")
            .then((url) => {
              // console.log(url);
              this.qrcodeURL = url;
              this.qrcodepopup = true;
            })
            .catch((err) => {
              console.error(err);
            });
          break;
      }
    },

    // 收藏
    collection() {
      this.lists.is_fav = !this.lists.is_fav;
      if (this.lists.is_fav) {
        this.axios
          .post("/api/add_fav", {
            article_id: this.$route.query.article_id,
            user_id: localStorage.getItem("uid"),
          })
          .then((res) => {
            console.log(res);
            // this.axios
            //   .post("/api/get_article_detail", {
            //     article_id: this.$route.query.article_id,
            //     user_id: localStorage.getItem("uid"),
            //   })
            //   .then((res) => {
            //     console.log(res);
            //     this.lists = res.data.data;
            //   });
            if (res.data.code == 0) {
              Toast.success(res.data.msg);
            } else {
              Toast.fail(res.data.msg);
            }
          });
      } else {
        this.axios
          .post("/api/remove_fav", {
            article_id: this.$route.query.article_id,
            user_id: localStorage.getItem("uid"),
          })
          .then((res) => {
            console.log(res);
            // this.axios
            //   .post("/api/get_article_detail", {
            //     article_id: this.$route.query.article_id,
            //     user_id: localStorage.getItem("uid"),
            //   })
            //   .then((res) => {
            //     console.log(res);
            //     this.lists = res.data.data;
            //   });
            if (res.data.code == 0) {
              Toast.success(res.data.msg);
            } else {
              Toast.fail(res.data.msg);
            }
          });
      }
    },

    // 点赞
    dain() {
      this.lists.is_like = !this.lists.is_like;
      if (this.lists.is_like) {
        this.axios
          .post("/api/like", {
            article_id: this.$route.query.article_id,
            user_id: localStorage.getItem("uid"),
          })
          .then((res) => {
            console.log(res);
            if (res.data.code == 0) {
              Toast.success(res.data.msg);
            } else {
              Toast.fail(res.data.msg);
            }
          });
      } else {
        this.axios
          .post("/api/unlike", {
            article_id: this.$route.query.article_id,
            user_id: localStorage.getItem("uid"),
          })
          .then((res) => {
            console.log(res);
            if (res.data.code == 0) {
              Toast.success(res.data.msg);
            } else {
              Toast.fail(res.data.msg);
            }
          });
      }
    },

    // 评论点赞
    like(v, i) {
      let uid = localStorage.getItem("uid");
      if (!uid) {
        Toast("请先登录");
        // this.$router.push("/login");
        return this.$router.push("/login");
      }
      v.is_like = !v.is_like;
      if (v.is_like == true) {
        v.like_count++;
        this.axios
          .post("/api/comment_like", {
            user_id: localStorage.getItem("uid"),
            comment_id: this.list_p[i]._id,
          })
          .then((res) => {
            console.log(res);
            if (res.data.code == 0) {
              Toast.success(res.data.msg);
            } else {
              Toast.fail(res.data.msg);
            }
          });
      } else if (v.is_like == false) {
        v.like_count--;
        this.axios
          .post("/api/comment_unlike", {
            user_id: localStorage.getItem("uid"),
            comment_id: this.list_p[i]._id,
          })
          .then((res) => {
            console.log(res);
            if (res.data.code == 0) {
              Toast.success(res.data.msg);
            } else {
              Toast.fail(res.data.msg);
            }
          });
      }
    },

    // 评论
    comments() {
      this.axios
        .post("/api/add_comment", {
          user_id: localStorage.getItem("uid"),
          article_id: this.lists._id,
          comment_type: 0,
          content: this.value,
        })
        .then((res) => {
          this.value = "";
          this.axios
            .post("/api/get_comment_list", {
              article_id: this.$route.query.article_id,
              user_id: localStorage.getItem("uid"),
            })
            .then((res) => {
              console.log(res);
              this.list_p = res.data.data;
              console.log(this.list_p);
            });
          console.log(res);
        });
    },
    // 回复
    showPopup(v, i) {
      console.log(i);
      this.aaa = i;
      this.cc_id = this.list_p[i]._id;
      // console.log(this.list_p[ie]._id);
      // console.log(ie);
      this.show = true;
      this.axios
        .post("/api/get_reply_list", {
          article_id: this.lists._id,
          reply_comment_id: this.list_p[i]._id,
          // skip: 0,
          // limit: 3,
        })
        .then((res) => {
          this.list_tow = res.data.data;
          console.log(res);
        });
    },
    // 二级评论
    comments_tow(v, i) {
      // this.qq = i;
      console.log(this.list_p);
      this.axios
        .post("/api/add_comment", {
          user_id: localStorage.getItem("uid"),
          article_id: this.lists._id,
          comment_type: "1",
          content: this.value,
          reply_comment_id: this.cc_id,
        })
        .then((res) => {
          this.value = "";
          console.log(res);
        });
    },
    // 时间戳
    formatDate(value) {
      // 时间戳转换日期格式方法
      if (value == null) {
        return "";
      } else {
        let date = new Date(value);
        let y = date.getFullYear(); // 年
        let MM = date.getMonth() + 1; // 月
        MM = MM < 10 ? "0" + MM : MM;
        let d = date.getDate(); // 日
        d = d < 10 ? "0" + d : d;
        // let h = date.getHours(); // 时
        // h = h < 10 ? "0" + h : h;
        // let m = date.getMinutes(); // 分
        // m = m < 10 ? "0" + m : m;
        // let s = date.getSeconds(); // 秒
        // s = s < 10 ? "0" + s : s;
        // return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
        return y + "-" + MM + "-" + d;
      }
    },
  },
};
</script>

<style lang="less" scoped>
// 头部
// .nav {
//   position: fixed;
//   top: 0;
//   left: 0;
// }
::v-deep .van-image {
  text-align: center;
}
::v-deep .van-nav-bar__content {
  background-color: #999;
}
// 中上
.article .z-top h3 {
  padding: 8px 0 8px 20px;
  font-size: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.box-b {
  display: flex;
  width: 100%;
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
.box-l .zuzhe {
  padding-left: 10px;
  // height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.box-l .zuzhe span {
  font-size: 16px;
  font-weight: 400;
}
.box-l .zuzhe p {
  font-size: 13px;
  font-weight: 400;
  color: #999;
}
.box-r {
  margin-right: 10px;
}
.z-top .van-button--info {
  background-color: #fff;
  color: #000;
  border: 1px solid #ccc;
}
.z-top .van-button {
  height: 8vw;
}
.z-top .zzz {
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
}
.thumbs .box-b .zuzhe .bbb {
  display: inline-block;
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  // white-space: nowrap;
  // word-break: break-all;
  // white-space: normal;
  height: 20px;
  // background-color: pink;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.thumbs .box-b:last-child {
  margin-bottom: 16vm;
}

// 内容
.article .content-t {
  width: 100%;
  // height: 300px;
  // background-color: pink;
  margin-bottom: 20px;
}
.article .content-t p {
  box-sizing: border-box;
  display: inline-block;
  max-height: 300px;
  padding: 10px 15px;
  line-height: 1.8;
  font-size: 16px;
  font-weight: 500;
  width: 100%;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
  word-break: break-all;
  overflow-y: auto;
}
// 点赞
.box-A {
  margin-bottom: 19vw;
}
.thumbs {
  margin-bottom: 30px;
}
.thumbs .box-l .zuzhe span:first-child {
  font-size: 14px;
  color: rgb(138, 138, 236);
}
.thumbs .box-l .zuzhe .aaa {
  width: 37vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.thumbs .box-l .zuzhe .aaa p {
  display: inline-block;
}
.zuzhe .aaa span {
  box-sizing: border-box;
  display: inline-block;
  font-size: 13px;
  font-weight: 400;
  color: rgb(103, 101, 101);
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 3px 5px;
}
// 最后
.footer {
  width: 100%;
  height: 55px;
  background-color: #eee;
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 1px solid #ccc;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.footer input {
  border: 1px solid #ccc;
  text-align: center;
  font-size: 18px;
  padding: 8px 0;
  border-radius: 20px;
  background-color: #eee;
  width: 200px;
}
// 二级评论
.aaa .comments-tow {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  // background-color: pink;
  align-items: center;
  padding-bottom: 30px;
  border-bottom: 2px solid #000;
}
.aaa .comments-tow > div:nth-child(1) > img {
  height: 70px;
  width: 70px;
}
.aaa .comments-tow > div:nth-child(2) {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 250px;
  // background-color: aqua;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.aaa .comments-tow > div:nth-child(2) > p {
  margin: 0;
  font-size: 16px;
  color: rgb(138, 138, 236);
}
.aaa .comments-tow > div:nth-child(2) > b {
  padding: 5px 0;
}
.aaa .comments-tow > div:nth-child(2) > span {
  border: 0;
  padding: 0;
  color: rgb(103, 101, 101);
}
// 二级别人的评论
.aaa .comments-three {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  align-items: center;
}
.aaa .comments-three > div:nth-child(1) > img {
  width: 50px;
  height: 50px;
}
.aaa .comments-three > div:nth-child(2) {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.aaa .comments-three > div:nth-child(2) > p {
  margin: 0;
  font-size: 15px;
  color: rgb(138, 138, 236);
}
.aaa .comments-three > div:nth-child(2) > b {
  font-size: 12px;
  padding: 5px 0;
}
.aaa .comments-three > div:nth-child(2) > span {
  font-size: 12px;
  border: 0;
  padding: 0;
  color: rgb(103, 101, 101);
}
</style>
