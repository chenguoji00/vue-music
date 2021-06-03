import { computed, ref } from 'vue'

export default function useShortcut (props, groupRef) {
  const ANCHOR_HEIGHT = 18
  const scrollRef = ref(null)
  const touch = {}
  // 获得索引列表
  const shortcutList = computed(() => {
    return props.data.map(group => {
      return group.title
    })
  })

  function onShortcutTouchStart (e) {
    // 当滚动到索引区域外时 获取不到anchorIndex(NAN)
    const anchorIndex = parseInt(e.target.dataset.index)
    scrollTo(anchorIndex)
    // 记录手指第一次触碰的位置
    touch.y1 = e.touches[0].pageY
    // 保存初始索引
    touch.anchorIndex = anchorIndex
  }
  function onShortcutTouchMove (e) {
    // 记录手指移动时的位置
    touch.y2 = e.touches[0].pageY
    // 计算手指移动的偏移量 向下取整 math.floor()
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    // 计算滚动后的偏移量
    const anchorIndex = touch.anchorIndex + delta
    // 滚动动指定位置
    scrollTo(anchorIndex)
  }

  function scrollTo (index) {
    // 当滚动到索引区域外时 return
    if (isNaN(index)) {
      return
    }
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEl = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetEl, 0)
  }
  return { shortcutList, onShortcutTouchStart, onShortcutTouchMove, scrollRef }
}
