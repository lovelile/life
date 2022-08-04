<template>
  <div class="home">
    <div>
      <van-tabbar route>
        <van-tabbar-item replace to="/" icon="home-o">首页</van-tabbar-item>
        <van-tabbar-item replace to="/fabu" icon="add-o"></van-tabbar-item>
        <van-tabbar-item replace to="/wode" icon="friends-o"
          >我的</van-tabbar-item
        >
      </van-tabbar>
    </div>
  </div>
</template>

<script>
export default {
  name: "tabBar",
};
</script>

<style lang="less" scoped>
.home > div {
  overflow: hidden;
}
</style>
