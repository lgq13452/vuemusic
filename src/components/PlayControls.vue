<template>
  <div class="playcontrols">
    <!-- 底部控制栏 -->
    <div class="buttom" @click="showFullscreen=true">
      <template v-if="currentSong.picUrl">
        <img :src="currentSong.picUrl" :class="{active:playState}" alt />
      </template>
      <template v-else>
        <img :src="currentSong.al.picUrl" :class="{active:playState}" alt />
      </template>
      <div class="content">
        <h5>{{currentSong.name}}</h5>
        <template v-if="currentSong.song">
          <span>{{joinArtists(currentSong.song.artists)}}</span>
        </template>
        <template v-if="currentSong.ar">
          <span>{{joinArtists(currentSong.ar)}}</span>
        </template>
      </div>
      <div class="play" @click.stop="playState = !playState">
        <canvas id="canvas" width="30" height="30"></canvas>
        <i v-if="playState" class="fas fa-pause"></i>
        <i v-else class="fas fa-play"></i>
      </div>
      <div class="songlist" @click.stop="songlistShow = !songlistShow">
        <span class="fas fa-list"></span>
      </div>
    </div>

    <transition
      name="custom-classes-transition"
      enter-active-class="animated slideInUp"
      leave-active-class="animated slideOutDown"
    >
      <div v-show="songlistShow" class="defaultSongList">
        <ul>
          <SongList
            v-for="(item, index) in defaultSongList"
            :item="item"
            :key="index"
            :options="{order: index, info: false}"
            :currentSong="currentSong"
            @getSong="$emit('getSong', $event)"
          ></SongList>
        </ul>
      </div>
    </transition>
    <!-- 歌曲详情页 -->
    <transition
      name="custom-classes-transition"
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOutDown"
    >
      <div v-show="showFullscreen" class="fullscreen">
        <div class="maskd"></div>
        <div
          v-if="currentSong.picUrl"
          class="mask"
          :style="{backgroundImage:`url(${currentSong.picUrl})`}"
        ></div>
        <div v-else class="mask" :style="{backgroundImage:`url(${currentSong.al.picUrl})`}"></div>
        <div class="masks"></div>
        <div class="head">
          <i class="fas fa-arrow-left" @click="showFullscreen=false"></i>
          <div class="info">
            <h5>{{currentSong.name}}</h5>
            <template v-if="currentSong.song">
              <span>{{joinArtists(currentSong.song.artists)}}</span>
            </template>
            <template v-if="currentSong.ar">
              <span>{{joinArtists(currentSong.ar)}}</span>
            </template>
          </div>
        </div>
        <div
          v-show="showjukebox"
          class="jukebox"
          :class="{active: playState}"
          @click="showjukebox = false"
        >
          <div class="needle"></div>
          <div class="record">
            <img v-if="currentSong.picUrl" :src="currentSong.picUrl" alt />
            <img v-else :src="currentSong.al.picUrl" alt />
          </div>
        </div>
        <div v-show="!showjukebox" class="volumeProgress">
          <span>
            <i class="fas fa-volume-down"></i>
          </span>
          <div>
            <input type="range" min="0" max="100" v-model="volumeLength" />
            <div class="jindu">
              <div class="smask" :style="{width:volumeLength + '%'}"></div>
              <div class="bg"></div>
            </div>
          </div>
        </div>
        <div v-show="!showjukebox" class="lrc" @click="showjukebox = true">
          <ul class="scroll" :style="{transform:`translateY(${-currentLyricIndex*30}px)`}">
            <li
              v-for="(item, index) in dealLrc"
              :key="index"
              :class="{active: index===currentLyricIndex}"
            >
              <span :class="{active: index===currentLyricIndex}">{{item.text}}</span>
            </li>
          </ul>
        </div>
        <div class="foot">
          <!-- 进度条 -->
          <div class="progress">
            <!-- 当前时间 -->
            <span class="currentTime">{{currentTime}}</span>
            <div class="content">
              <input
                type="range"
                min="0"
                max="100"
                step="0.01"
                v-model="inputLength"
                @input="changeProgress"
              />
              <div class="jindu">
                <div class="smask" :style="{width:inputLength + '%'}"></div>
                <div class="bg"></div>
              </div>
            </div>
            <!-- 总时长 -->
            <span class="durationTime">{{durationTime}}</span>
          </div>
          <div class="contral">
            <div class="order" @click="modes++ ;modes = modes > 2 ? 0 : modes">
              <img v-if="modes == 0" src="../assets/liebiao.png" alt />
              <img v-if="modes == 1" src="../assets/random.png" alt />
              <img v-if="modes == 2" src="../assets/danqu_32.png" alt />
            </div>
            <div class="content">
              <div class="prev" @click.stop="prev">
                <img src="../assets/prev.png" alt />
              </div>
              <div class="play" @click.stop="playState = !playState">
                <img v-if="playState" src="../assets/pause.png" alt />
                <img v-else src="../assets/play.png" alt />
              </div>
              <div class="next" @click.stop="next">
                <img src="../assets/next.png" alt />
              </div>
            </div>
            <div class="list" @click.stop="songlistShow = !songlistShow">
              <span class="fas fa-list"></span>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <audio :src="currentSongUrl" autoplay></audio>
  </div>
</template>

<script>
import SongList from "@/components/SongList.vue";

export default {
  props: {
    currentSong: Object
  },
  data() {
    return {
      playState: false,
      showFullscreen: false,
      showjukebox: true,
      lyric: null,
      currentLyricIndex: 0,
      songlistShow: false,
      defaultSongList: [this.currentSong],
      inputLength: 0,
      volumeLength: 40,
      currentTime: "00:00",
      durationTime: "00:00",
      isDown: false,
      modes: 0
    };
  },
  components: {
    SongList
  },
  computed: {
    currentSongUrl() {
      if (this.currentSong) {
        return ` https://music.163.com/song/media/outer/url?id=${this.currentSong.id}.mp3`;
      } else {
        return "";
      }
    },

    dealLrc() {
      // [00:01.000] || [00:01.005] || [by:Chatoyantsuga]
      if (this.lyric) {
        var lrcData = this.lyric.split("\n[");
        lrcData;
        // console.log(lrcData);
        // for (var i = 0; i < lrcData.length; i++) {
        //   var currentLrc = lrcData[i].split("]");
        //   // console.log(currentLrc);
        //   if (i == 0) {
        //     currentLrc[0] = currentLrc[0].replace("[", "");
        //   }
        //   if (i == lrcData.length - 1) {
        //     currentLrc[1] = currentLrc[1].trim();
        //   }
        //   if (currentLrc[1] == "") {
        //     continue;
        //   }
        //   //将时间转换为秒
        //   var times = currentLrc[0].split(":");
        //   var m = times[0];
        //   var s = times[1];

        //   return {
        //     time: Number(m) * 60 + Number(s),
        //     text: currentLrc[1]
        //   };
        // }

        return this.lyric.split("\n[").map(item => {
          var regex = /\d{2}:\d{2}\.\d+/i;
          if (item.search(regex) != -1) {
            var time = item.match(/\d{2}:\d{2}\.\d+/i)[0];
            var m = time.substr(0, 2);
            var s = time.substr(3, 2);
            var n = time.substr(5);
          }
          var currentLrc = item.split("]");

          return {
            time: Number(m) * 60 + Number(s) + Number(n),
            text: currentLrc[1] || ". . . . . . . . ."
          };
        });
      } else {
        return null;
      }
    },
    //播放下标
    currentSongIndex: {
      get() {
        for (let i = 0; i < this.defaultSongList.length; i++) {
          if (this.defaultSongList[i].id == this.currentSong.id) {
            return i;
          }
        }
        return 0;
      },
      set(v) {
        v;
      }
    }
  },
  methods: {
    joinArtists(artists) {
      return artists.map(artist => artist.name).join("/");
    },
    //处理时间方法
    countTime(sTime) {
      if (!sTime) {
        return;
      }
      var m = Math.floor(sTime / 60);
      var s = Math.floor(sTime % 60);
      m = m > 9 ? m : "0" + m;
      s = s > 9 ? s : "0" + s;
      return m + ":" + s;
    },
    drawProgress() {
      /** @type {HTMLCanvasElement} */
      var canvas = this.$el.querySelector("#canvas");
      var audio = this.$el.querySelector("audio");

      var durationTime = this.$el.querySelector(".durationTime");

      audio.ondurationchange = () => {
        durationTime.innerText = this.countTime(audio.duration);
      };

      audio.ontimeupdate = () => {
        var duration = audio.duration * 1000;
        // console.log(duration);

        var context = canvas.getContext("2d");
        context.clearRect(0, 0, 30, 30);

        context.beginPath();
        context.arc(15, 15, 14, 0, 2 * Math.PI);
        context.closePath();
        context.lineWidth = "1";
        context.strokeStyle = "#ededee";
        context.stroke();
        // console.log(duration, "当前播放时间", audio.currentTime * 1000);
        context.beginPath();
        context.arc(
          15,
          15,
          14,
          -0.5 * Math.PI,
          -0.5 * Math.PI + 2 * Math.PI * ((audio.currentTime * 1000) / duration)
        );
        context.lineWidth = "1";
        context.strokeStyle = "#dd001b";
        context.stroke();

        // 滚动歌词
        // audio.currentTime
        // currentLyricIndex
        let index;

        for (let i = 0; i < this.dealLrc.length; i++) {
          if (audio.currentTime + 0.15 < this.dealLrc[i].time) {
            index = i - 1;
            break;
          }
        }
        if (index === undefined) {
          index = this.dealLrc.length - 1;
        }
        this.currentLyricIndex = index;

        //超长歌词一行滚动显示
        var longLrcLiWith = this.$el.querySelector("li.active").offsetWidth;

        var longLrcSpan = this.$el.querySelector("span.active");
        // console.log(longLrcSpan.offsetWidth);

        if (longLrcSpan.offsetWidth > longLrcLiWith) {
          var moveX = longLrcLiWith - longLrcSpan.offsetWidth;
          longLrcSpan.animate(
            [
              { transform: "translateX(0px)" },
              { transform: `translateX(${moveX}px)` }
            ],
            {
              duration: 300
              // fill: "both"
            }
          );
        }

        this.currentTime = this.countTime(audio.currentTime);

        if (this.isDown) {
          return;
        }

        this.inputLength = Math.floor(
          ((audio.currentTime * 1000) / duration) * 100
        );
      };
    },
    //拖动进度条
    changeProgress() {
      //获取相对目标元素的鼠标坐标
      var audio = this.$el.querySelector("audio");

      if (!this.isDown) {
        // 拖动完成后才触发修改音频的播放进度
        audio.currentTime = audio.duration * (this.inputLength / 100);

        this.currentTime = this.countTime(audio.currentTime);
      }
    },
    getLrc() {
      const localLyric = localStorage.getItem(`lyric-${this.currentSong.id}`);

      if (localLyric) {
        console.log("从缓存中获取");
        // console.log(localLyric);
        this.lyric = localLyric;
      } else {
        console.log("从请求中获取");
        this.axios
          .get("/lyric", {
            params: {
              id: this.currentSong.id
            }
          })
          .then(response => {
            // console.log(response.data.lrc.lyric);
            this.lyric = response.data.lrc.lyric;

            localStorage.setItem(
              `lyric-${this.currentSong.id}`,
              response.data.lrc.lyric
            );
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    //更新默认歌曲数据
    updateDdefaultSongList(canshu) {
      let isExist = this.defaultSongList.some(
        item => item.id == this.currentSong.id
      );
      console.log(isExist);

      // Array.prototype.remove = function(canshu) {
      //   var index = this.indexOf(canshu);
      //   if (index > -1) {
      //     this.splice(index, 1);
      //   }
      // };
      // if (isExist) {
      //   this.defaultSongList.remove(canshu);
      //   this.defaultSongList.unshift(canshu);
      // }

      if (!isExist) {
        this.defaultSongList.unshift(canshu);
        localStorage.setItem(
          "defaultSongList",
          JSON.stringify(this.defaultSongList)
        );
      }
    },

    //按照类型播放
    playNext(type) {
      var audio = this.$el.querySelector("audio");

      //获取播放模式
      if (this.modes == 0) {
        if (type == "next") {
          this.$emit(
            "getSong",
            this.defaultSongList[
              this.currentSongIndex + 1 >= this.defaultSongList.length - 1
                ? 0
                : this.currentSongIndex + 1
            ]
          );
        } else {
          this.$emit(
            "getSong",
            this.defaultSongList[
              this.currentSongIndex - 1 <= 0
                ? this.defaultSongList.length - 1
                : this.currentSongIndex - 1
            ]
          );
        }
      } else if (this.modes == 1) {
        let k = Math.floor(Math.random() * this.defaultSongList.length);
        this.$emit(
          "getSong",
          this.defaultSongList[k]
        );
      } else {
        audio.load();
      }
      //播放下一首
      audio.play();
    },
    // 上一首
    prev() {
      this.playNext("prev");
    },
    // 下一首
    next() {
      this.playNext("next");
    }
  },
  mounted() {
    this.drawProgress();
    var audio = this.$el.querySelector("audio");

    audio.onplay = () => {
      this.playState = true;
    };
    audio.onpause = () => {
      this.playState = false;
    };
    audio.onended = () =>{
      this.playNext()
    }
  },
  created() {
    this.getLrc();

    const defaultSongList = JSON.parse(localStorage.getItem("defaultSongList"));
    if (defaultSongList) {
      this.defaultSongList = defaultSongList;
    }
    this.updateDdefaultSongList(this.currentSong);
  },
  watch: {
    playState(value) {
      var audio = this.$el.querySelector("audio");
      if (value) {
        audio.play();
      } else {
        audio.pause();
      }
    },
    currentSong(value) {
      this.getLrc();
      //默认播放列表
      this.updateDdefaultSongList(value);

      // if (!this.defaultSongList.includes(value)) {
      //   this.defaultSongList.unshift(value);
      // }
    },
    volumeLength() {
      var audio = this.$el.querySelector("audio");
      audio.volume = this.volumeLength / 100;
    }
  }
};
</script>

<style lang="less" scoped>
@keyframes playing {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.playcontrols {
  width: 100%;
  .buttom {
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    border-top: 1px solid #ededee;
    padding: 8px 5px;
    background-color: white;
    position: fixed;
    bottom: 0;
    z-index: 10;
    img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      animation: playing 5s linear infinite;
      animation-play-state: paused;
      &.active {
        animation-play-state: running;
      }
    }
    .content {
      flex: 1;
      line-height: 18px;
      padding: 0 15px;
      width: 60%;
      h5 {
        font-size: 14px;
        width: 100%;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      span {
        font-size: 12px;
        color: #888;
        width: 80%;
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .play {
      width: 30px;
      height: 30px;
      position: relative;
      //   margin: 0 10px;
      canvas {
        width: 100%;
      }
      i {
        font-size: 12px;
        color: lightgray;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -6px;
        margin-left: -5px;
        &.fa-pause {
          color: rgba(168, 19, 19, 0.877);
        }
      }
    }
    .songlist {
      width: 28px;
      height: 28px;
      margin: 0 10px;
      span {
        padding: 2px 5px;
        font-size: 24px;
        color: #888;
      }
    }
  }
  .defaultSongList {
    position: fixed;
    background-color: white;
    width: 90%;
    left: 5%;
    bottom: 35px;
    border-radius: 15px;
    box-shadow: 0px 1px 6px 0px rgba(29, 28, 28, 0.795);
    z-index: 99;

    ul {
      transition: all 0.3s;
      height: 190px;
      overflow-y: auto;
      li {
        height: 36px;
      }
    }
  }
  .fullscreen {
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    position: fixed;
    display: flex;
    flex-direction: column;
    z-index: 11;
    .bgsize() {
      width: 100%;
      height: 100%;
      position: absolute;
    }
    .maskd {
      .bgsize();
      background-color: gray;
      z-index: -3;
    }

    .mask {
      .bgsize();
      background-position: center;
      background-size: cover;
      // background-color: aquamarine;
      filter: blur(30px) brightness(0.5);
      transform: scale(2);
      z-index: -2;
    }
    .masks {
      .bgsize();
      opacity: 0.5;
      z-index: -1;
    }
    .head {
      width: 100%;
      color: white;
      display: flex;
      padding: 5px;
      align-items: center;
      i {
        font-size: 22px;
      }
      .info {
        width: 100%;
        margin-left: 15px;
        h5 {
          font-size: 16px;
          width: 80%;
          word-break: keep-all;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        span {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.664);
          width: 80%;
          word-break: keep-all;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .jukebox {
      position: relative;
      text-align: center;
      flex: 1;
      .needle {
        background-image: url(../assets/needle.png);
        width: 96px;
        height: 136px;
        background-size: 100%;
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -14px;
        transform: rotate(-16deg);
        transform-origin: 18px 0;
        z-index: 1;
      }
      .record {
        display: inline-block;
        background-image: url("../assets/disc_light.png"),
          url("../assets/disc_default.png");
        background-size: 100%;
        border-radius: 50%;
        padding: 54px;
        margin-top: 80px;
        animation: playing 6s linear infinite;
        animation-play-state: paused;
        img {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          vertical-align: middle;
        }
      }
      &.active {
        .needle {
          transform: rotate(0);
        }
        .record {
          animation-play-state: running;
        }
      }
    }
    .volumeProgress {
      display: flex;
      margin: 3px 20px;
      align-items: center;
      height: 21px;

      span {
        margin-top: -2px;
        i {
          color: white;
        }
      }
      & > div {
        flex: 1;
        margin: 0px 5px;
        position: relative;

        input {
          width: 100%;
          opacity: 0;
        }
        .jindu {
          .smask {
            width: 2px;
            top: 8px;
            height: 5px;
            background-color: white;
            border-radius: 5px;
            position: absolute;
            pointer-events: none;
            z-index: 1;
          }
          .bg {
            width: 100%;
            top: 8px;
            height: 5px;
            background-color: grey;
            border-radius: 5px;
            position: absolute;
            pointer-events: none;
          }
        }
      }
    }
    .lrc {
      flex: 1;
      overflow: hidden;
      position: relative;
      // text-align: center;

      .scroll {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 50%;
        margin-top: -1.5em;
        transition: transform 0.3s;
        li {
          height: 2em;
          line-height: 2em;
          font-size: 15px;
          color: rgba(189, 184, 184, 0.897);
          display: flex;
          justify-content: center;
          align-items: center;

          span {
            white-space: nowrap;
            &.active {
              color: white;
              font-size: 17px;
            }
          }
        }
      }
    }
    .foot {
      height: 100px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: white;
      // background-color: aquamarine;
      .progress {
        display: flex;
        margin: 5px 10px;
        align-items: center;
        .content {
          flex: 1;
          margin: 0px 5px;
          position: relative;
          input {
            width: 100%;
            opacity: 0;
          }
          .jindu {
            .smask {
              width: 2px;
              top: 8px;
              height: 7px;
              background-color: red;
              border-radius: 5px;
              position: absolute;
              pointer-events: none;
              z-index: 1;
            }
            .bg {
              width: 100%;
              top: 8px;
              height: 7px;
              background-color: grey;
              border-radius: 5px;
              position: absolute;
              pointer-events: none;
            }
          }
        }
      }
      .contral {
        display: flex;
        margin: 5px 15px;
        padding: 0px 15px;
        .order {
          // img{
          //   pointer-events: none;
          // }
        }
        .content {
          flex: 1;
          padding: 0px 20px;
          display: flex;
          justify-content: space-around;
          img {
            width: 32px;
            height: 32px;
          }
        }
        .list {
          padding: 3px 0px;
          .fa-list {
            font-size: 24px;
          }
        }
      }
    }
  }
  .fadeIn {
    animation-duration: 0.2s;
  }
  .fadeOutDown {
    animation-duration: 0.2s;
  }
}
</style>