<template>
  <li class="card" @click="routerToSongSheetPage(item.id)">
    <div class="itemcard">
      <img :src="item.picUrl" alt />
      <span>
        <i class="fas fa-headphones-alt"></i>
        {{dealPlayCount(item.playCount)}}
      </span>
    </div>
    <h5>{{item.name}}</h5>
  </li>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: function() {
        return {
          id: 4969079749,
          type: 0,
          name: "欧美 | 欢快小调拯救你的不开心",
          copywriter: "编辑推荐：音乐是治愈人心的良药",
          picUrl:
            "https://p2.music.126.net/nflx5ZxSSPivvGnyS5WRGw==/109951164906376339.jpg",
          canDislike: false,
          trackNumberUpdateTime: 1586934907095,
          playCount: 1573663,
          trackCount: 100,
          highQuality: false,
          alg: "featured"
        };
      }
    }
  },
  methods: {
    //处理下载次数
    dealPlayCount(n) {
      if (n > 100000000) {
        return (n = (n / 100000000).toFixed(1) + "亿");
      } else if (n > 10000) {
        return (n = (n / 10000).toFixed(1) + "万");
      }
    },
    routerToSongSheetPage(id) {
      this.$router.push({path: "SongSheetPage",query:{id:id}});
    }
  }
};
</script>

<style lang="less" scoped>
.card:nth-child(3n + 2) {
  margin: 0 3px;
}
.card {
  flex-basis: 32%;
  flex-grow: 1;
  margin-bottom: 12px;
  .itemcard {
    position: relative;

    img {
      // 设置元素的垂直对齐方式
      // 去除底部缝隙
      vertical-align: middle;
    }
    span {
      position: absolute;
      top: 0;
      right: 0;
      color: white;
    }
  }
  h5 {
    font-size: 13px;
    margin: 5px 3px 3px 0;
    line-height: 1.2em;
    height: 2.4em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>