import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'
const relativeCls = 'g-relative'

export default function createLoadingLikeDirective (Comp) {
  return {
    mounted (el, binding) {
      const app = createApp(Comp)
      // instance 根组件的实例
      const instance = app.mount(document.createElement('div'))
      const name = Comp.name
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance
      const title = binding.arg
      if (typeof title !== 'undefined') {
        instance.setTitle(title)
      }
      // 传递给指令的值 true or false 如果为true则添加节点
      if (binding.value) {
        append(el)
      }
    },
    // 如果传递给指令的值发生了改变 那么移除或者添加dom
    updated (el, binding) {
      if (binding.value !== binding.oldValue) {
      // true 则添加节点 false则移除节点
        binding.value ? append(el) : remove(el)
      }
    }
  }
  function append (el) {
    const name = Comp.name
    const style = getComputedStyle(el)
    // loading 组件的位置是用绝对定位控制 要求最近的祖先元素必须开启定位
    // 如果指令绑定元素的 position样式不是 'absolute', 'fixed', 'relative'
    // 其中一个 那么没有开启定位，则添加 relative 定位
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, relativeCls)
    }
    // el.instance.$el指实例的dom
    // 将dom插入到目标节点内
    el.appendChild(el[name].instance.$el)
  }
  function remove (el) {
    const name = Comp.name
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }
}
