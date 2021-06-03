<template>
  <div class="music-list">
    <div class="back">
      <i
        class='icon-back'
        @click='back'
      ></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div ref='bgImage' :style="bgImageStyle" class="bg-image">
      <div
        class="play-btn-wrapper"
        :style="playBtnStyle"
      >
        <div
          v-show="songs.length > 0"
          class="play-btn"
          @click="random"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div :style='filterStyle' class="filter"></div>
    </div>
    <scroll
      class='list'
      v-loading='loading'
      v-no-result='noResult'
      :style="scrollStyle"
      :probeType='3'
      @scroll = 'onScroll'
      >
      <div class="song-list-wrapper">
        <song-list
          @select="selectItem"
          :songs='songs'
          :rank='rank'
        ></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>

import SongList from '@/components/base/song-list/song-list'
import Scroll from '@/components/wrap-scroll'
import { mapActions, mapState } from 'vuex'
const RESERVED_HEIGHT = 40
export default {
  components: { SongList, Scroll },
  props: {
    songs: {
      type: Array,
      default: () => []
    },
    pic: String,
    title: String,
    loading: Boolean,
    rank: Boolean
  },
  data () {
    return {
      imageHeight: 0,
      scrollY: 0,
      maxTranslateY: 0
    }
  },
  mounted () {
    // 获取图片的高度
    this.imageHeight = this.$refs.bgImage.clientHeight
    // 可以滚动的最大距离
    this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT
  },
  computed: {
    noResult () {
      return !this.loading && !this.songs.length
    },
    playBtnStyle () {
      let display = ''
      if (this.scrollY >= this.maxTranslateY) {
        display = 'none'
      }
      return {
        display
      }
    },
    ...mapState([
      'playList'
    ]),
    scrollStyle () {
      const bottom = this.playList.length ? '60px' : '0'
      return {
        top: `${this.imageHeight}px`,
        bottom
      }
    },
    bgImageStyle () {
      const scrollY = this.scrollY
      let zIndex = 0
      let paddingTop = '70%'
      let height = 0
      let translateZ = 0
      let scale = 1
      if (scrollY > this.maxTranslateY) {
        zIndex = 10
        paddingTop = 0
        height = `${RESERVED_HEIGHT}px`
        translateZ = 1
      }
      // 向下拉时放大图片
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / this.imageHeight)
      }
      return {
        backgroundImage: `url(${this.pic})`,
        zIndex,
        paddingTop,
        height,
        transform: `scale(${scale}) translateZ(${translateZ}px)`
      }
    },
    filterStyle () {
      let blur = 0
      const scrollY = this.scrollY
      const imageHeigt = this.imageHeight
      if (scrollY >= 0) {
        blur = Math.min(this.maxTranslateY / imageHeigt, scrollY / imageHeigt) * 20
      }
      return { backdropFilter: `blur(${blur}px)` }
    }
  },
  methods: {
    back () {
      this.$router.back()
    },
    // 监听滚动事件获取滚动距离
    onScroll (pos) {
      this.scrollY = -pos.y
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ]),
    selectItem ({ song, index }) {
      this.selectPlay(
        {
          list: this.songs,
          index
        }
      )
    },
    random () {
      this.randomPlay(this.songs)
    }

  }
}
</script>
<style lang="scss" scoped>
  .music-list {
    position: relative;
    height: 100%;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 20;
      transform: translateZ(2px);
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      width: 80%;
      z-index: 20;
      transform: translateZ(2px);
      @include no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .bg-image {
      position: relative;
      width: 100%;
      transform-origin: top;
      background-size: cover;
      .play-btn-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 10;
        width: 100%;
        .play-btn {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
          border-radius: 100px;
          font-size: 0;
        }
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .list {
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 0;
      .song-list-wrapper {
        padding: 20px 30px;
        background: $color-background;
      }
    }
  }
</style>
