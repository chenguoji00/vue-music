import BScroll from '@better-scroll/core'
// ObserveDOM 自动探测dom的改变执行refresh
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue'

BScroll.use(ObserveDOM)
export default function useScroll (wrapperRef, options, emit) {
  const scroll = ref(null)
  // 初始化scroll
  onMounted(() => {
    const scrollVal = scroll.value = new BScroll(wrapperRef.value, {
      disableTouch: false,
      observeDOM: true,
      ...options
    })
    if (options.probeType > 0) {
      // 监听scroll事件
      scrollVal.on('scroll', (pos) => {
        // 派发事件
        emit('scroll', pos)
      })
    }
  })
  // 卸载scroll实例
  onUnmounted(() => {
    scroll.value.destroy()
  })
  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })
  onDeactivated(() => {
    scroll.value.disable()
  })
  return scroll
}
