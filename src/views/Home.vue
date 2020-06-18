<template>
  <div class="home">
    <div class="loading" v-if="showLoading">
      <img src="../assets/loading.svg" alt style="width: 44px" />
    </div>
    <keep-alive>
      <HomeLink></HomeLink>
    </keep-alive>
    <div class="personalized">
      <CardTitle>推荐歌单</CardTitle>
      <ul class="songsheet">
        <SongSheetCard v-for="(item, index) in randomPersonalized()" :item="item" :key="index"></SongSheetCard>
      </ul>
    </div>
    <div class="newsong">
      <CardTitle>最新音乐</CardTitle>
      <ul class="newsonglist">
        <SongList
          v-for="(item, index) in newSongs"
          :item="item"
          :key="index"
          :options="{info: true}"
          :currentSong="currentSong"
          @getSong="$emit('getSong', $event)"
          @getListIndex="$emit('getListIndex', $event)"
          @getnewSongs="$emit('getnewSongs',$event)"
        ></SongList>
      </ul>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeLink from "@/components/HomeLink.vue";
import CardTitle from "@/components/CardTitle.vue";
import SongSheetCard from "@/components/SongSheetCard.vue";
import SongList from "@/components/SongList.vue";

export default {
  name: "Home",
  props: {
    currentSong: Object,
    currentSongIndex: Number
  },
  data() {
    return {
      personalizeds: [],
      newSongs: Array,
      showLoading: false
    };
  },
  components: {
    HomeLink,
    CardTitle,
    SongSheetCard,
    SongList
  },
  methods: {
    //获取推荐歌单
    getPersonalized() {
      const localPersonalizeds = JSON.parse(
        localStorage.getItem("localPersonalizeds")
      );
      if (localPersonalizeds && localPersonalizeds.expire > Date.now()) {
        console.log("从缓存中获取");
        this.personalizeds = localPersonalizeds.result;
      } else {
        console.log("从请求中获取");
        this.axios
          .get("personalized")
          .then(response => {
            // console.log(response);
            this.personalizeds = response.data.result;
            localStorage.setItem(
              "localPersonalizeds",
              JSON.stringify({
                expire: Date.now() + 60 * 60 * 1000 * 1,
                result: response.data.result
              })
            );
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    //获取随机六个推荐
    randomPersonalized() {
      //截取前六个
      return [...this.personalizeds].slice(0, 6);

      // var arr = [...this.personalizeds];
      // // console.log("==>",this.personalizeds.result);
      // var newArr = [];
      // for (let i = 0; i < 6; i++) {
      //   var r = Math.floor(Math.random() * arr.length);
      //   newArr.push(...arr.splice(r, 1));
      // }
      // return newArr;
    },
    //获取最新音乐
    getNewsong() {
      const localNewSongs = JSON.parse(localStorage.getItem("NewSongs"));
      if (localNewSongs && localNewSongs.expire > Date.now()) {
        console.log("从缓存中获取");
        this.newSongs = localNewSongs.result;
      } else {
        console.log("从请求中获取");
        this.axios
          .get("personalized/newsong")
          .then(response => {
            this.newSongs = response.data.result;
            localStorage.setItem(
              "NewSongs",
              JSON.stringify({
                expire: Date.now() + 60 * 60 * 1000 * 0.5,
                result: response.data.result
              })
            );
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.showLoading = false;
    });
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    // console.log(to, from, "即将离开home");
    this.showLoading = true;
    next();
  },
  created() {
    //获取推荐歌单
    this.getPersonalized();
    //最新音乐
    this.getNewsong();
  }
};
</script>
<style lang="less" scoped>
.songsheet {
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 5px;
}
.loading {
  position: fixed;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.3);
  pointer-events: none;
}
</style>
