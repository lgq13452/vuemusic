<template>
  <div id="app" @touchstart="touchstart" @touchend="touchend" :class="{active: currentSong}">
    <!-- 一级路由出口 -->
    <keep-alive>
      <router-view @getSong="currentSong = $event" :currentSong="currentSong"></router-view>
    </keep-alive>
    <!-- 底部播放器 -->
    <PlayControls v-if="currentSong" :currentSong="currentSong" @getSong="currentSong = $event"></PlayControls>
  </div>
</template>
<script>
import PlayControls from "@/components/PlayControls.vue";

export default {
  data() {
    return {
      currentSong: null,
      touchstartX: 0,
      touchstartY: 0
    };
  },
  components: {
    PlayControls
  },
  methods: {
    touchstart(e) {
      // console.log("开始==>", e.changedTouches[0].clientX);
      this.touchstartX = e.changedTouches[0].clientX;
      this.touchstartY = e.changedTouches[0].clientY;
    },
    touchend(e) {
      // console.log("结束==>", e.changedTouches[0].clientX);
      if (e.changedTouches[0].clientX - this.touchstartX > 50) {
        console.log("从左往右滑动,后退");
        this.touchstartX = 0;
        this.touchstartY = 0;
        this.routerBack();
      }
      if (e.changedTouches[0].clientX - this.touchstartX < -50) {
        console.log("从右滑左动,前进");
        this.touchstartX = 0;
        this.touchstartY = 0;
        this.routerForward();
      }
    },
    routerBack() {
      this.$router.back();
    },
    routerForward() {
      this.$router.forward();
    }
  },
  watch: {
    currentSongId() {}
  }
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  &.active {
    padding-bottom: 50px;
  }
}
</style>
