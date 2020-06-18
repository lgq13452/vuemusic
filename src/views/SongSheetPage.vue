<template>
  <div class="songsheet">
    <template v-if="songSheetDetail">
      <div class="songsheethead">
        <div class="mask" :style="{backgroundImage: `url(${songSheetDetail.coverImgUrl})`}"></div>
        <div class="fl">
          <img :src="songSheetDetail.coverImgUrl" />
          <span class="playcount">
            <i class="fas fa-headphones-alt"></i>
            {{dealPlayCount(songSheetDetail.playCount)}}
          </span>
          <span class="icon">歌单</span>
        </div>
        <div class="fr">
          <h3>{{ songSheetDetail.name }}</h3>
          <img :src="songSheetDetail.creator.avatarUrl" alt />
          <span>{{songSheetDetail.creator.nickname}}</span>
        </div>
      </div>
      <div class="songsheetinfo">
        <div class="tags">
          <span>标签:</span>
          <i v-for="(tag, index) in songSheetDetail.tags" :key="index">{{tag}}</i>
        </div>
        <div class="desc" :class="{showmore: showmore,showless: !showmore}">
          <span>简介:</span>
          <span>{{ songSheetDetail.description }}</span>
        </div>
        <div class="more" @click="showmore = !showmore">
          <i v-if="showmore" class="fas fa-angle-up"></i>
          <i v-else class="fas fa-angle-down"></i>
        </div>
      </div>
      <div class="songlist">
        <CardTitle>歌曲列表</CardTitle>
        <ul>
          <SongList
            v-for="(item, index) in songSheetDetail.tracks"
            :item="item"
            :key="index"
            :options="{order: index,info: true}"
            :currentSong="currentSong"
            @getSong="$emit('getSong', $event)"
          ></SongList>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
// @getSong="$emit('getSong', $event)"
import CardTitle from "@/components/CardTitle.vue";
import SongList from "@/components/SongList.vue";

export default {
   props: {
    currentSong: Object
  },
  data() {
    return {
      songSheetId: this.$route.query.id,
      songSheetDetail: null,
      showmore: false
    };
  },
  components: {
    CardTitle,
    SongList
  },
  methods: {
    getSongSheetDetail(id) {
      const localSongSheetDetail = JSON.parse(
        localStorage.getItem("ss-" + this.songSheetId)
      );
      if (localSongSheetDetail && localSongSheetDetail.expire > Date.now()) {
        console.log("从缓存中获取");
        this.songSheetDetail = localSongSheetDetail.playlist;
      } else {
        console.log("从请求中获取");
        this.axios
          .get("playlist/detail", {
            params: {
              id: id
            }
          })
          .then(response => {
            this.songSheetDetail = response.data.playlist;

            localStorage.setItem(
              "ss-" + this.songSheetId,
              JSON.stringify({
                expire: Date.now() + 60 * 60 * 1000 * 1,
                playlist: response.data.playlist
              })
            );
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    dealPlayCount(n) {
      if (n > 100000000) {
        return (n = (n / 100000000).toFixed(1) + "亿");
      } else if (n > 10000) {
        return (n = (n / 10000).toFixed(1) + "万");
      }
    },

    joinArtists(artists) {
      return artists.map(artist => artist.name).join("/");
    }
  },

  // created() {
  //   this.getSongSheetDetail(this.songSheetId);
  // },

  beforeRouteEnter(to, from, next) {
    const localSongSheetDetail = JSON.parse(
      localStorage.getItem("ss-" + to.query.id)
    );
    if (localSongSheetDetail && localSongSheetDetail.expire > Date.now()) {
      console.log("从缓存中获取");
      next(vm => {
        // 通过 `vm` 访问组件实例
        vm.songSheetDetail = localSongSheetDetail.playlist;
      });
    } else {
      console.log("从请求中获取");
      window.axios
        .get("playlist/detail", {
          params: {
            id: to.query.id
          }
        })
        .then(response => {
          next(vm => {
            // 通过 `vm` 访问组件实例
            vm.songSheetId = Number(to.query.id);
            vm.songSheetDetail = response.data.playlist;
          });

          localStorage.setItem(
            "ss-" + to.query.id,
            JSON.stringify({
              expire: Date.now() + 60 * 60 * 1000 * 1,
              playlist: response.data.playlist
            })
          );
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }

  // beforeRouteUpdate(to, from, next) {
  //   from;
  //   this.songSheetId = Number(to.query.id);
  //   next();
  // },
  // watch: {
  //   songSheetId: function() {
  //     console.log("变化了");
  //     this.getSongSheetDetail(this.songSheetId);
  //   }
  // }
};
</script>

<style lang="less" scoped>
.songsheethead {
  height: 200px;
  padding: 30px 10px 30px 15px;
  position: relative;
  display: flex;
  color: white;
  overflow: hidden;
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    filter: blur(25px) brightness(0.8);
    transform: scale(1.5);
    background-position: center;
  }
  .fl {
    position: relative;
    flex: 3.5;
    font-size: 12px;
    & > img {
      width: 126px;
    }
    .playcount {
      position: absolute;
      top: 0;
      right: 0;
    }
    .icon {
      position: absolute;
      top: 15px;
      left: 0;
      padding: 0 8px;
      height: 17px;
      line-height: 17px;
      background-color: rgba(217, 48, 48, 0.8);
      border-top-right-radius: 17px;
      border-bottom-right-radius: 17px;
    }
  }
  .fr {
    flex: 6.5;
    padding-left: 14px;
    h3 {
      margin-bottom: 20px;
      font-size: 17px;
    }
    img {
      width: 30px;
      border-radius: 50%;
      vertical-align: middle;
    }
    span {
      font-size: 14px;
    }
  }
}
.songsheetinfo {
  padding-left: 15px;
  line-height: 1.5em;
  font-size: 14px;
  .tags {
    margin: 10px 0;
    span {
      vertical-align: middle;
      margin-right: 5px;
    }
    i {
      font-size: 12px;
      margin-right: 5px;
      font-style: normal;
      border: 1px solid lightgray;
      border-radius: 12px;
      padding: 2px 5px;
    }
  }
  .desc {
    height: 4.5em;

    &.showless {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    &.showmore {
      height: auto;
    }
    span {
      white-space: pre-wrap;
      vertical-align: baseline;
    }
  }
  .more {
    overflow: hidden;
    i {
      float: right;
      margin-right: 10px;
      font-size: 22px;
      color: lightgray;
    }
  }
}
</style>