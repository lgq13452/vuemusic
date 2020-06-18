<template>
  <div class="hot">
    <div class="loading" v-if="loading">
      <img src="../assets/loading.svg" alt style="width: 44px" />
    </div>
    <keep-alive>
      <HomeLink></HomeLink>
    </keep-alive>
    <div class="hotop">
      <div class="hotbg">
        <div class="hoticon"></div>
        <div class="hottime">更新日期：{{date}}</div>
      </div>
    </div>
    <ul class="hotList">
      <SongList
        v-for="(item, index) in playlist.tracks"
        :item="item"
        :key="index"
        :options="{order: index,info: true,hot: true}"
        :currentSong="currentSong"
        @getSong="$emit('getSong', $event)"
      ></SongList>
    </ul>
  </div>
</template>
<script>
import HomeLink from "@/components/HomeLink.vue";
import SongList from "@/components/SongList.vue";

export default {
  props: {
    currentSong: Object
  },
  data() {
    return {
      playlist: Object,
      date: String,
      loading: false
    };
  },
  components: {
    HomeLink,
    SongList
  },
  methods: {
    getHotSong() {
      const hotPlaylist = JSON.parse(localStorage.getItem("hot-playlist"));
      if (hotPlaylist && hotPlaylist.expire > Date.now()) {
        console.log("从缓存中获取");
        this.playlist = hotPlaylist.playlist;
      } else {
        this.loading = true;

        this.axios
          .get("top/list?idx=1")
          .then(response => {
            this.loading = false;
            console.log(response.data.playlist);
            this.playlist = response.data.playlist;
            localStorage.setItem(
              "hot-playlist",
              JSON.stringify({
                expire: Date.now() + 60 * 60 * 1000 * 24 * 7,
                playlist: response.data.playlist
              })
            );
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    // 更新日期
    updatedDate() {
      // Object.keys(this.playlist).length != 0
      if (this.playlist) {
        var updateTime = this.playlist.updateTime;
        var time = new Date(updateTime);

        var m = time.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        var d = time.getDate() + 1;
        d = d < 10 ? "0" + d : d;

        this.date = m + "月" + d + "日";
      }
    }
  },
  created() {
    this.getHotSong();
  },
  watch: {
    playlist() {
      this.updatedDate();
    }
  }
};
</script>

<style lang="less" >
.hot {
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
  .hotop {
    background-image: url(../assets/hot_music_bg_2x.jpg);
    background-size: contain;
    width: 100%;
    height: 147px;
    .hotbg {
      padding: 30px 20px;
      .hoticon {
        width: 142px;
        height: 67px;
        background-image: url(../assets/index_icon.png);
        background-size: 166px 97px;
        background-position: -24px -30px;
      }
      .hottime {
        color: white;
        font-size: 12px;
      }
    }
  }
  .hotList {
    .songlistitem:nth-of-type(-n + 3) {
      .left {
        .order {
          color: #dd001b;
        }
      }
    }
  }
}
</style>