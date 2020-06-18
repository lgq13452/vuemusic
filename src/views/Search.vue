<template>
  <div class="search">
    <div class="loading" v-if="showLoading">
      <img src="../assets/loading.svg" alt style="width: 44px" />
    </div>
    <keep-alive>
      <HomeLink></HomeLink>
    </keep-alive>
    <div class="top">
      <i class="fas fa-search"></i>
      <input
        type="text"
        v-model="inputword"
        placeholder="搜索歌曲、歌手、专辑"
        @keyup.enter="searchShow = true;keyword = inputword"
      />
      <i class="dele" @click.stop=" inputword = null;searchShow = false"></i>
    </div>
    <!-- 实时搜索 -->
    <template v-if="inputSuggest && inputSuggest != '' ">
      <!-- 建议 -->
      <div class="recom">
        <ul>
          <template v-if="searchShow">
            <SearchList
              v-for="(item, index) in songs"
              :item="item"
              :key="index"
              :options="{info: true}"
              :currentSong="currentSong"
              @getSong="$emit('getSong', $event)"
            ></SearchList>
          </template>

          <template v-else>
            <h3 @click="searchShow = true;keyword = inputword">搜索"{{inputword}}"</h3>
            <li
              v-for="(item,index) in inputSuggest"
              :key="index"
              class="searchLi"
              @click="keyword = item.keyword;searchShow = true"
            >
              <i class="fas fa-search"></i>
              <span>{{item.keyword}}</span>
            </li>
          </template>
        </ul>
      </div>
    </template>

    <!-- 默认推荐 -->
    <template v-else>
      <div class="default">
        <div class="hotSearch">
          <h3>热门搜索</h3>
          <ul>
            <li
              v-for="(item, index) in hots"
              :key="index"
              @click="inputword=item.first;keyword = item.first;searchShow = true;"
            >{{item.first}}</li>
          </ul>
        </div>

        <template v-if="searchHistory">
          <div class="historySearch">
            <ul>
              <li
                v-for="(item, index) in searchHistory"
                :key="index"
                @click="inputword=item;keyword = item;searchShow = true;"
              >
                <i class="fas fa-history"></i>
                <span>{{item}}</span>
                <i class="dele" @click.stop="removeSearchHistory(item)"></i>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
<script>
import HomeLink from "@/components/HomeLink.vue";
import SearchList from "@/components/SearchList.vue";

export default {
  props: {
    currentSong: Object
  },
  data() {
    return {
      inputword: null,
      inputSuggest: null,

      keyword: null,
      songs: null,
      hots: null,
      searchShow: false,

      searchHistory: [],
      showLoading: false
    };
  },
  components: {
    HomeLink,
    SearchList
  },
  methods: {
    // 实时搜索建议
    translatekeyword() {
      // console.log(keyword)
      if (this.inputword) {
        this.axios
          .get(`search/suggest?keywords= ${this.inputword}&type=mobile`)
          .then(response => {
            console.log(response.data.result.allMatch);
            this.inputSuggest = response.data.result.allMatch;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    //确认的关键字搜索
    searchKeyword() {
      // 根据关键词拿数据
      this.showLoading = true;
      if (this.keyword) {
        this.axios
          .get("search", {
            params: {
              keywords: this.keyword
            }
          })
          .then(response => {
            this.songs = response.data.result.songs;
            // console.log(this.songs)
            this.showLoading = false;
          })
          .catch(error => {
            console.log(error);
            this.showLoading = false;
          });
      }
    },

    //热搜列表(简)
    hotsearch() {
      this.axios
        .get("search/hot")
        .then(response => {
          console.log(response.data.result.hots);
          this.hots = response.data.result.hots;
        })
        .catch(error => {
          console.log(error);
        });
    },

    //搜索历史
    UpdateSearchHistory(keyword) {
      let isExist = this.searchHistory.some(item => item == keyword);
      console.log(isExist);

      if (!isExist) {
        this.searchHistory.unshift(keyword);
        localStorage.setItem(
          "searchHistory",
          JSON.stringify(this.searchHistory)
        );
      }
    },

    //删除搜索历史
    removeSearchHistory(del) {
      let index = this.searchHistory.indexOf(del);
      if (index > -1) {
        this.searchHistory.splice(index, 1);
      }

      localStorage.setItem("searchHistory", JSON.stringify(this.searchHistory));
    }
  },
  created() {
    const searchHistorylocal = JSON.parse(
      localStorage.getItem("searchHistory")
    );
    if (searchHistorylocal) {
      this.searchHistory = searchHistorylocal;
    }
  },
  mounted() {
    this.hotsearch();
  },
  watch: {
    inputword() {
      this.inputSuggest = [];
      this.translatekeyword();
      // this.searchShow = false;
    },
    keyword(value) {
      this.searchKeyword();
      this.UpdateSearchHistory(value);
    }
  }
};
</script>
<style lang="less" scoped>
.search {
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
  .top {
    padding: 15px 10px;
    position: relative;
    color: #c9c9c9;
    border-bottom: 1px solid #ebecec;
    i {
      position: absolute;
      top: 23px;
      margin: 0 8px;
      font-size: 13px;
    }
    input {
      height: 30px;
      width: 100%;
      line-height: 18px;
      background: #ebecec;
      border-radius: 30px;
      font-size: 14px;
      border: 0;
      padding: 0 24px;
      color: #c9c9c9;
      outline: none;
      border: none;
    }
    .dele {
      position: absolute;
      right: 12px;
      width: 11px;
      height: 11px;
      background: url(../assets/dele.svg) no-repeat;
    }
  }
  .recom {
    z-index: 999;
    ul {
      h3 {
        height: 50px;
        margin-left: 10px;
        padding-right: 10px;
        font-size: 15px;
        line-height: 50px;
        color: #507daf;
      }
      .searchLi {
        display: flex;
        align-items: center;
        height: 45px;
        padding-left: 10px;
        i {
          color: #ebecec;
        }
        span {
          display: inline-block;
          flex: 1;
          padding: 0 10px;
          font-size: 15px;
          line-height: 45px;
          color: #333;
          border-bottom: 1px solid #ebecec;

          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: normal;
        }
      }
    }
  }
  .hotSearch {
    padding: 15px 10px 0;
    h3 {
      font-size: 12px;
      line-height: 12px;
      color: #666;
    }
    ul {
      margin: 10px 0 7px;
      li {
        display: inline-block;
        height: 32px;
        margin-right: 8px;
        margin-bottom: 8px;
        padding: 0 14px;
        font-size: 14px;
        line-height: 32px;
        color: #333;
        border: 1px solid #ebecec;
        border-radius: 22px;
      }
    }
  }
  .historySearch {
    padding: 15px 15px 0;
    ul {
      li {
        display: flex;
        padding: 10px 0;
        height: 45px;
        align-items: center;
        border-bottom: 1px solid #ebecec;
        i {
          color: #999899;
        }
        span {
          flex: 1;
          padding: 0 10px;
        }
        .dele {
          width: 12px;
          height: 12px;
          background-image: url(../assets/dele.svg);
        }
      }
    }
  }
}
</style>
