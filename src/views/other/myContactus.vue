<template>
  <div class="collection">
    <!-- 头部 -->
    <div>
      <van-nav-bar
        title="联系我们"
        left-arrow
        @click-left="$router.back()"
        fixed
        placeholder
      />
    </div>
    <!-- 内容 -->
    <div class="count">
      <p>
        莱头条归宿于凯利行软件有有限公司,任何有关莱头条的意见与建议,以及合作相关事宜，请通过以下方式与我们联系：
      </p>
      <div class="count_box">
        <span>商务以及流量合作：</span>
        <p>请发送邮件至：shenghuo@reai.com</p>
      </div>
      <div class="count_box">
        <span>品牌广告投放</span>
        <p>请发送邮件至：lodivc@reai.com</p>
      </div>
      <div class="count_box">
        <span>联系电话：</span>
        <p>在线客服：400-8856-647</p>
      </div>
    </div>
    <!-- 最后 -->
    <div class="count_footer">
      <span>公司地址：</span>
      <p>郑州市管城区明湖街道117号 (邮箱：466200)</p>
      <img src="https://i.postimg.cc/7hRhSCSZ/20220802151933.jpg" alt="" />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
// 头部
::v-deep .van-nav-bar__content {
  background-color: #999;
}
// 内容
.count {
  box-sizing: border-box;
  padding: 10px 30px;
}
.count > p {
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 30px;
}
.count .count_box {
  font-size: 13px;
  margin-bottom: 20px;
}

.count .count_box span {
  font-weight: 600;
}
// 最后
.count_footer {
  // height: 100px;
  width: 88%;
  // background-color: pink;
  border-top: 1px solid #999;
  margin: 0 auto;
  font-size: 14px;
  padding-top: 10px;
}
.count_footer span {
  font-weight: 600;
}
.count_footer p {
  font-size: 13px;
}
.count_footer img {
  width: 100%;
  height: 200px;
}
</style>
pxpx
