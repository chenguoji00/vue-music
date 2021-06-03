import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import { onMounted, onUnmounted, ref, onActivated, onDeactivated } from 'vue'
// 注册插件
BScroll.use(Slide)

export default function useSlider (wrapperRef) {
  const slider = ref(null)
  const currentPageIndex = ref(0)
  // dom渲染完成时初始化bscroll
  onMounted(() => {
    // this.slider
    // 缓存slider.value

    const sliderVal = slider.value = new BScroll(wrapperRef.value, {
      click: true,
      scrollX: true,
      scrollY: false,
      // 避免惯性动画带来的快速滚动时的闪烁的问题和快速滑动时一次滚动多页的问题。
      momentum: false,
      // 避免在循环衔接的时候出现闪烁。
      bounce: false,
      // 值为2或3时,拖动 slide可以
      // 实时获取到 slide 的 PageIndex 的改变
      probeType: 2,
      // slide 为true时使用默认slide配置
      slide: true,
      disableTouch: false
    })
    // 获取当前page索引
    sliderVal.on('slideWillChange', page => {
      currentPageIndex.value = page.pageX
    })
  })
  // 当组件销毁时 销毁bscroll
  onUnmounted(() => {
    slider.value.destroy()
  })
  onActivated(() => {
    slider.value.enable()
    slider.value.refresh()
  })
  onDeactivated(() => {
    slider.value.disable()
  })
  return {
    slider,
    currentPageIndex
  }
}
