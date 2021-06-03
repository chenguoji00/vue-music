import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'
// *点击歌曲时提交mutation
export function selectPlay ({ commit }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlayList', list)
  commit('setCurrentIndex', index)
}
// *随机播放
export function randomPlay ({ commit }, list) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  // shuffle函数随机打乱播放列表
  commit('setPlayList', shuffle(list))
  commit('setCurrentIndex', 0)
}
// *改变模式
export function changeMode ({ commit, state, getters }, mode) {
  // 缓存当前播放歌曲
  const currentSongId = getters.currentSong.id
  // 随机播放修改playList
  if (mode === PLAY_MODE.random) {
    commit('setPlayList', shuffle(state.sequenceList))
  } else {
    commit('setPlayList', state.sequenceList)
  }
  // 找到当前播放歌曲在随机播放列表中的索引
  const index = state.playList.findIndex(song => {
    return song.id === currentSongId
  })
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}
// *删除歌曲
export function removeSong ({ commit, state }, song) {
  const sequenceList = state.sequenceList.slice()
  const playList = state.playList.slice()
  const sequenceIndex = findSongIndex(sequenceList, song)
  const playIndex = findSongIndex(playList, song)
  if (sequenceIndex < 0 || playIndex < 0) {
    return
  }
  sequenceList.splice(sequenceIndex, 1)
  playList.splice(playIndex, 1)

  let currentIndex = state.currentIndex
  //* 如果删除的歌曲的索引小于正在播放歌曲的索引或者歌曲是最后一首时
  //* 保证歌曲的索引不发生改变
  if (playIndex < currentIndex || currentIndex === playList.length) {
    currentIndex--
  }
  commit('setSequenceList', sequenceList)
  commit('setPlayList', playList)
  commit('setCurrentIndex', currentIndex)
  if (!playList.length) {
    commit('playingState', false)
  }
}
//* 清空歌曲列表
export function clearSongList ({ commit }) {
  commit('setSequenceList', [])
  commit('setPlayList', [])
  commit('setCurrentIndex', 0)
  commit('setPlayingState', false)
}
//* 添加歌曲到播放列表
export function addSong ({ commit, state }, song) {
  const playList = state.playList.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  //* 在播放列表在查找是否有当前点击的这首歌
  const playIndex = findSongIndex(playList, song)
  if (playIndex > -1) {
    //* 如果有就将当前播放索引设置成点击的歌的索引
    currentIndex = playIndex
  } else {
    // 没有则添加到末尾
    playList.push(song)
    currentIndex = playList.length - 1
  }

  const sequenceIndex = findSongIndex(sequenceList, song)
  if (sequenceIndex === -1) {
    sequenceList.push(song)
  }
  commit('setSequenceList', sequenceList)
  commit('setPlayList', playList)
  commit('setCurrentIndex', currentIndex)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
}
function findSongIndex (list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}
