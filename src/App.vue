<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keep"></router-view>
    </keep-alive>

    <router-view v-if="!$route.meta.keep"></router-view>
  </div>
</template>

<style lang="scss">
// 引入图标文件
@import url("@/assets/iconfont/iconfont.css");

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.router-link-exact-active {
  color: #42b983;
}
.van-nav-bar__title {
  max-width: 75%;
}
body {
  background-color: rgb(245, 247, 249);
}
</style>
