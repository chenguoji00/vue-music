<template>
  <div>
    <Header></Header>
    <Tab></Tab>
    <router-view v-slot="{ Component }" :style="viewStyle">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>

    <router-view :style="viewStyle" v-slot="{ Component }" name="user">
      <transition appear name="slide">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
    <player></player>
  </div>
</template>
<script>
import Header from '@/components/header/header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'
import { mapState } from 'vuex'
export default {
  components: {
    Header,
    Tab,
    Player
  },
  computed: {
    ...mapState(['playList']),
    viewStyle () {
      const bottom = this.playList.length ? '60px' : '0'
      return {
        bottom
      }
    }
  }
}
</script>
<style lang="scss"></style>
