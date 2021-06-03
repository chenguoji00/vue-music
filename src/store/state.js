import { PLAY_MODE, SEARCH_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'
const state = {
  // 顺序播放列表
  sequenceList: [],
  // 正在播放的列表
  playList: [],
  // 是否播放
  playing: false,
  // 播放模式
  playMode: PLAY_MODE.sequence,
  // 是否展开
  fullScreen: false,
  // 播放歌曲的索引
  currentIndex: 0,
  // 收藏歌曲列表
  favoriteList: [],
  // 搜索历史
  searchHistory: load(SEARCH_KEY),
  // 播放历史
  playHistory: []
}

export default state
