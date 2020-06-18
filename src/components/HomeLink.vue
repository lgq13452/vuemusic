<template>
  <ul id="nav">
    <li>
      <router-link to="/">推荐音乐</router-link>
    </li>
    <li>
      <router-link to="/hot">热歌榜</router-link>
    </li>
    <li>
      <router-link to="/search">搜索</router-link>
    </li>
  </ul>
</template>
<script>
export default {
    
};
</script>
<style lang="less">
@red: #dd001b;
#nav {
  display: flex;
  padding: 0px 30px;
  border-bottom: 1px solid rgba(219, 219, 219, 0.993);
  box-sizing: border-box;
  li {
    flex: 1;
    text-align: center;

    a {
      font-size: 15px;
      line-height: 38px;
      color: #333;
      text-decoration: none;
      display: inline-block;
      padding: 0 3px;
      box-sizing: border-box;

      &.router-link-exact-active {
        color: @red;
        border-bottom: 2px solid @red;
      }
    }
  }
}
</style>