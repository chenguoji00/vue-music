<template>
  <teleport to="body">
    <transition>
      <div class="add-song" v-show="visible">
        <div class="header">
          <h1 class="title">添加歌曲到列表</h1>
          <div class="close" @click="hide">
            <i class="icon-close"></i>
          </div>
        </div>
        <div class="search-input-wrapper">
          <search-input
            v-model="query"
            placeholder="搜索歌曲"
          >
          </search-input>
        </div>
        <div v-show="!query">
          <switches
            :items="['最近播放', '搜索历史']"
            v-model="currentIndex"
          >
          </switches>
          <div class="list-wrapper">
            <scroll
              v-if="currentIndex === 0"
              class="list-scroll"
              ref="scrollRef"
            >
              <div class="list-inner">
                <song-list
                  :songs="playHistory"
                  @select="selectSongBySongList"
                >
                </song-list>
              </div>
            </scroll>
            <scroll
              v-if="currentIndex === 1"
              class="list-scroll"
              ref="scrollRef"
            >
              <div class="list-inner">
                <search-list
                  :searches="searchHistory"
                  :show-delete="false"
                  @select="addQuery"
                  :showDelete="false"
                ></search-list>
              </div>
            </scroll>
          </div>
        </div>
        <div class="search-result" v-show="query">
          <suggest
            :query="query"
            :showSinger="false"
            @select-song = "selectSongBySuggest"
          >
          </suggest>
        </div>
        <message ref="messageRef">
          <div class="message-title">
            <i class="icon-ok"></i>
            <span class='text'>一首歌曲已经添加到播放列表</span>
          </div>
        </message>

      </div>
    </transition>
  </teleport>
</template>
<script>
import { ref, computed, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
import SearchInput from '@/components/search/search-input'
import Suggest from '@/components/search/suggest'
import Switches from '@/components/base/switches/switches'
import SongList from '@/components/base/song-list/song-list'
import SearchList from '@/components/base/search-list/search-list'
import Scroll from '@/components/wrap-scroll'
import Message from '@/components/base/message/message'
import useSearchHistory from '@/components/search/use-search-history'
export default {
  components: {
    SearchInput,
    Suggest,
    Switches,
    SongList,
    SearchList,
    Scroll,
    Message
  },
  setup () {
    const visible = ref(false)
    const query = ref('')
    const currentIndex = ref(0)
    const scrollRef = ref(null)
    const messageRef = ref(null)
    const store = useStore()
    const { saveSearch } = useSearchHistory()
    const searchHistory = computed(() => store.state.searchHistory)
    const playHistory = computed(() => store.state.playHistory)
    // * query变化时会展示不同的滚动列表 refresh 使这些列表可以正常滚动
    watch(query, async () => {
      await nextTick()
      refreshScroll()
    })
    async function show () {
      visible.value = true
      //* 首次渲染时refresh滚动
      await nextTick()
      refreshScroll()
    }

    function hide () {
      visible.value = false
    }

    function refreshScroll () {
      scrollRef.value.scroll.refresh()
    }
    function addQuery (s) {
      query.value = s
    }

    function selectSongBySongList ({ song }) {
      addSong(song)
    }
    function selectSongBySuggest (song) {
      addSong(song)
      saveSearch(query.value)
    }
    function addSong (song) {
      store.dispatch('addSong', song)
      showMessage()
    }
    function showMessage () {
      messageRef.value.show()
    }
    return {
      visible,
      query,
      show,
      hide,
      currentIndex,
      searchHistory,
      playHistory,
      addQuery,
      selectSongBySongList,
      selectSongBySuggest,
      scrollRef,
      messageRef
    }
  }
}
</script>

<style lang="scss" scoped>
.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 300;
  background: $color-background;
  .header {
    position: relative;
    height: 44px;
    text-align: center;
    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 8px;
      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }
  .search-input-wrapper {
    margin: 20px;
  }
  .list-wrapper {
    position: absolute;
    top: 165px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }
}

.message-title {
  text-align: center;
  padding: 18px 0;
  font-size: 0;
  .icon-ok {
    font-size: $font-size-medium;
    color: $color-theme;
    margin-right: 4px;
  }
  .text {
    font-size: $font-size-medium;
    color: $color-text;
  }
}
</style>
