import { ref, watch, nextTick, computed } from 'vue'

export default function useFixed (props) {
  const TITLE_HEIGHT = 30
  const groupRef = ref(null)
  const listHeights = ref([])
  const scrollY = ref(0)
  const currentIndex = ref(0)
  const distance = ref(0)
  // *根据索引获取fixedTitle
  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT)
      ? distanceVal - TITLE_HEIGHT : 0
    return {
      Transform: `translate3d(0,${diff}px,0)`
    }
  })
  watch(() => props.data, async () => {
    await nextTick()
    calculate()
  })
  // 监听scrollY的变化
  watch(scrollY, (newY) => {
    const listHeightsVal = listHeights.value
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      // *每个区间的头部高度
      const heightTop = listHeightsVal[i]
      // *每个区间的尾部高度
      const heightBottom = listHeightsVal[i + 1]
      // *当前滚动的数值在当前遍历区间之间 得到当前区域索引
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - newY
      }
    }
  })
  function calculate () {
    const list = groupRef.value.children
    const listHeightsVal = listHeights.value
    let height = 0

    listHeightsVal.length = 0
    listHeightsVal.push(height)

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }
  }
  function onScroll (pos) {
    scrollY.value = -pos.y
  }
  return { groupRef, onScroll, fixedTitle, fixedStyle, currentIndex }
}
