<template>
  <teleport to='body'>
    <transition name='list-fade'>
      <div
        class="playlist"
        v-show="visible && playList.length"
        @click='hide'
      >
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class='title'>
              <i
                class='icon'
                :class='modeIcon'
                @click='changeMode'
              >
              </i>
              <span class='text'>{{modeText}}</span>
              <span class='clear' @click='showConfirm'>
                <i class='icon-clear'></i>
              </span>
            </h1>
          </div>
          <scroll
            class='list-content'
            ref='scrollRef'
          >
            <transition-group
              name='list'
              ref='listRef'
              tag='ul'
            >
              <li
                class='item'
                v-for="song in sequenceList"
                :key="song.id"
                @click='selectItem(song)'
              >
              <i
                class="current"
                :class='getCurrentIcon(song)'
              ></i>
              <span class="text">{{song.name}}</span>
              <span class="favorite" @click.stop="toggleFavorite(song)">
                <i :class="getFavoriteIcon(song)"></i>
              </span>
              <span
                class='delete'
                @click.stop='removeSong(song)'
                :class="{'disable':removing}"
              >
                <i class='icon-delete'></i>
              </span>
              </li>
            </transition-group>
          </scroll>
          <div class="list-add">
            <div class="add" @click="showAddSong">
              <i class='icon-add'>
                <span class='text'>添加歌曲到队列</span>
              </i>
            </div>
          </div>
          <div class="list-footer" @click.stop='hide'>
            <span>关闭</span>
          </div>
        </div>
        <confirm
          ref='confirmRef'
          @confirm='confirmClear'
          text='是否清空播放列表'
          confirm-btn-text='清空'
        ></confirm>
        <add-song ref="addSongRef"></add-song>
      </div>
    </transition>
  </teleport>
</template>

<script>
import Scroll from '@/components/base/scroll/scroll'
import Confirm from '@/components/base/confirm/confirm'
import AddSong from '@/components/add-song/add-song'
import { computed, ref, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import useMode from './use-mode'
import useFavorite from './use-favorite'

export default {
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  setup () {
    const addSongRef = ref(null)
    const confirmRef = ref(null)
    const listRef = ref(null)
    const removing = ref(false)
    const scrollRef = ref(null)
    const visible = ref(false)
    const store = useStore()
    const playList = computed(() => store.state.playList)
    const sequenceList = computed(() => store.state.sequenceList)
    const currentSong = computed(() => store.getters.currentSong)

    const { modeIcon, changeMode, modeText } = useMode()
    const { toggleFavorite, getFavoriteIcon } = useFavorite()

    watch(currentSong, async (newSong) => {
      if (!visible.value || !newSong.id) {
        return
      }
      await nextTick()
      scrollToCurrent()
    })

    async function show () {
      visible.value = true
      // 数据改变dom不会立即更新 在nextTick后dom更新完成
      await nextTick()
      refreshScroll()
      scrollToCurrent()
    }
    function hide () {
      visible.value = false
    }
    function refreshScroll () {
      scrollRef.value.scroll.refresh()
    }
    function scrollToCurrent () {
      const index = sequenceList.value.findIndex(song => {
        return currentSong.value.id === song.id
      })
      if (index === -1) {
        return
      }
      const target = listRef.value.$el.children[index]
      scrollRef.value.scroll.scrollToElement(target, 300)
    }
    function selectItem (song) {
      const index = playList.value.findIndex(item => {
        return item.id === song.id
      })
      store.commit('setCurrentIndex', index)
      store.commit('setPlayingState', true)
    }
    function removeSong (song) {
      // 防止多次点击
      if (removing.value) {
        return
      }
      removing.value = true
      store.dispatch('removeSong', song)
      if (!playList.value.length) {
        hide()
      }
      setTimeout(() => {
        removing.value = false
      })
    }
    function getCurrentIcon (song) {
      if (song.id === currentSong.value.id) {
        return 'icon-play'
      }
    }
    function showConfirm () {
      confirmRef.value.show()
    }
    function confirmClear () {
      store.dispatch('clearSongList')
      hide()
    }

    function showAddSong () {
      addSongRef.value.show()
    }
    return {
      //* store
      playList,
      sequenceList,
      getCurrentIcon,
      // *mode
      modeIcon,
      changeMode,
      modeText,
      toggleFavorite,
      getFavoriteIcon,
      //* playlist
      visible,
      show,
      hide,
      scrollRef,
      listRef,
      selectItem,
      removeSong,
      removing,
      //* comfirm
      confirmRef,
      showConfirm,
      confirmClear,
      //* addSong
      showAddSong,
      addSongRef
    }
  }
}
</script>

<style lang="scss" scoped>
  .playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: $color-background-d;
    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: opacity .3s;
      .list-wrapper {
        transition: all .3s;
      }
    }
    &.list-fade-enter-from, &.list-fade-leave-to {
      opacity: 0;
      .list-wrapper {
        transform: translate3d(0, 100%, 0);
      }
    }
    .list-wrapper {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 210;
      width: 100%;
      background-color: $color-highlight-background;
      .list-header {
        position: relative;
        padding: 20px 30px 10px 20px;
        .title {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 10px;
            font-size: 24px;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .clear {
            @include extend-click();
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
      .list-content {
        max-height: 240px;
        overflow: hidden;
        .item {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;
          overflow: hidden;
          .current {
            flex: 0 0 20px;
            width: 20px;
            font-size: $font-size-small;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            @include no-wrap();
            font-size: $font-size-medium;
            color: $color-text-d;
          }
          .favorite {
            @include extend-click();
            margin-right: 15px;
            font-size: $font-size-small;
            color: $color-theme;
            .icon-favorite {
              color: $color-sub-theme;
            }
          }
          .delete {
            @include extend-click();
            font-size: $font-size-small;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
          }
        }
      }
      .list-add {
        width: 140px;
        margin: 20px auto 30px auto;
        .add {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid $color-text-l;
          border-radius: 100px;
          color: $color-text-l;
          .icon-add {
            margin-right: 5px;
            font-size: $font-size-small-s;
          }
          .text {
            font-size: $font-size-small;
          }
        }
      }
      .list-footer {
        text-align: center;
        line-height: 50px;
        background: $color-background;
        font-size: $font-size-medium-x;
        color: $color-text-l;
      }
    }
  }
</style>
