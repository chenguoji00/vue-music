<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="showNormalPlayer">
      <div class="cd-wrapper">
        <div class="cd" ref="cdRef">
          <img
            ref="cdImageRef"
            :src="currentSong.pic"
            width="40"
            height="40"
            :class="cdCls"
          />
        </div>
      </div>
      <div ref="sliderWrapperRef" class="slider-wrapper">
        <div class="slider-group">
          <div class="slider-page" v-for="song in playList" :key="song.id">
            <h2 class="name">{{ song.name }}</h2>
            <p class="desc">{{ song.singer }}</p>
          </div>
        </div>
      </div>
      <div class="control">
        <progress-cicle :progress="progress" :radius="32">
          <i
            @click.stop="togglePlay"
            class="icon-mini"
            :class="miniPlayIcon"
          ></i>
        </progress-cicle>
      </div>
      <div class="control">
        <i class='icon-playlist' @click.stop="showPlayList"></i>
      </div>
      <play-list ref='playListRef'></play-list>
    </div>
  </transition>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import useCd from './use-cd'
import useMiniSlider from './use-mini-slider'
import progressCicle from './progress-circle'
import playList from './playlist'
export default {
  components: {
    progressCicle,
    playList
  },
  props: {
    progress: {
      type: Number,
      default: 0
    },
    togglePlay: Function
  },
  setup () {
    const playListRef = ref(null)
    const store = useStore()
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playList = computed(() => store.state.playList)
    const playing = computed(() => store.state.playing)
    const miniPlayIcon = computed(() => {
      return playing.value ? 'icon-pause-mini' : 'icon-play-mini'
    })
    const { cdRef, cdImageRef, cdCls } = useCd()
    const { sliderWrapperRef } = useMiniSlider()
    function showNormalPlayer () {
      store.commit('setFullScreen', true)
    }
    function showPlayList () {
      playListRef.value.show()
    }
    return {
      playListRef,
      showPlayList,
      fullScreen,
      currentSong,
      // cd
      cdRef,
      cdImageRef,
      cdCls,
      showNormalPlayer,
      miniPlayIcon,
      playList,
      //* mini-slider
      sliderWrapperRef
    }
  }
}
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd {
      height: 100%;
      width: 100%;
      img {
        border-radius: 50%;
        &.playing {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }
  .name {
    margin-bottom: 2px;
    @include no-wrap();
    font-size: $font-size-medium;
    color: $color-text;
  }
  .desc {
    @include no-wrap();
    font-size: $font-size-small;
    color: $color-text-d;
  }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-d;
    }
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
  }
  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from,
  &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>
