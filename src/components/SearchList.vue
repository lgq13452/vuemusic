<template>
  <li class="songlistitem" @click="getItemId = item.id">
    <div class="left">
      <span class="order" v-if="options.order !== undefined">{{ options.order + 1 }}</span>
      <div class="info">
        <h3>
          {{item.name}}
          <span class="alias">{{ item.alias[0]}}</span>
        </h3>
        <div class="bt" v-if="options.info !== false">
          <span class="quality"></span>
          <span class="artists">{{ joinArtists(item.artists) }}-{{ item.album.name }}</span>
        </div>
      </div>
    </div>
    <div class="play">
      <img
        v-if="currentSong && item.id === currentSong.id"
        class="playing"
        src="../assets/playing.svg"
        alt
      />
      <span v-else></span>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    options: Object,
    item: Object,
    currentSong: Object
  },
  data() {
    return {
      itemd: Object,
      getItemId: Number
    };
  },
  methods: {
    joinArtists(artists) {
      return artists.map(artist => artist.name).join("/");
    },
    //获取歌曲详情
    getSongDetail(nv) {
      this.axios
        .get("/song/detail?ids=" + nv)
        .then(response => {
          console.log(response.data.songs[0]);

          this.itemd = response.data.songs[0];
        })
        .catch(function(error) {
          console.log(error);
        })
        .then(() => {
          this.$emit("getSong", this.itemd);
        });
    }
  },
  watch: {
    getItemId(nv) {
      this.getSongDetail(nv);
    }
  }
};
</script>

<style lang="less" scoped>
.songlistitem {
  display: flex;
  align-items: center;
  // height: 54px;
  border-bottom: 1px solid #ededee;
  font-size: 17px;

  .icon() {
    background-image: url("../assets/index_icon.png");
    background-size: 166px 97px;
    display: inline-block;
  }
  .left {
    flex: 8;
    display: flex;
    width: 80%;
    .order {
      width: 18px;
      padding-left: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .info {
      padding: 5px 0px 5px 15px;
      width: 100%;
      h3 {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: normal;
        .alias {
          color: #888;
        }
      }
      .bt {
        font-size: 12px;
        line-height: 2em;
        color: #888;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: normal;
        .quality {
          .icon();
          width: 12px;
          height: 12px;
          background-position: 0 0;
          margin-bottom: -4px;
        }

        .artists {
          margin-left: 4px;
        }
      }
    }
  }

  .play {
    flex: 2;
    height: 57px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      .icon();
      .ic-size();
      background-position: -24px 0;
    }
    .ic-size() {
      margin-left: 15px;
      width: 24px;
      height: 24px;
    }
    .playing {
      .ic-size();
    }
  }
}
</style>