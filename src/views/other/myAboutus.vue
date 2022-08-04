<template>
  <div class="collection">
    <!-- 头部 -->
    <div>
      <van-nav-bar
        title="关于头条"
        left-arrow
        @click-left="$router.back()"
        fixed
        placeholder
      />
    </div>
    <!-- log -->
    <div class="log">
      <img
        src="https://i.postimg.cc/tCsqQ4H9/Snipaste-2022-08-02-15-40-15.png"
        alt=""
      />
    </div>
    <!-- 内容 -->
    <div class="xiugai">
      <van-cell title="版本更新" value="以是最新版本" />
      <van-cell title="功能介绍" is-link />
      <van-cell title="官网" is-link />
      <van-cell title="帮助" is-link />
      <van-cell title="反馈" is-link />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
body {
  background-color: #fff;
}
// 头部
::v-deep .van-nav-bar__content {
  background-color: #999;
}
// log
.log {
  margin: 30px auto;
  width: 60%;
  height: 100px;
}

.log img {
  width: 100%;
  height: 100px;
  margin: 0 auto;
}
</style>
