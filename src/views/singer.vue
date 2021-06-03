<template>
    <div class='singer' v-loading="!singers.length">
      <index-list
        :data='singers'
        @select="selectSinger"
      ></index-list>
      <router-view v-slot="{ Component }">
        <transition appear name="slide">
          <component :is="Component" :data="selectedSinger" />
        </transition>
      </router-view>
    </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/index-list/index-list'
import Storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
export default {
  components: { IndexList },
  data () {
    return {
      singers: [],
      selectedSinger: null
    }
  },
  methods: {
    selectSinger (singer) {
      this.selectedSinger = singer
      this.cacheSinger(singer)
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
    },
    cacheSinger (singer) {
      Storage.session.set(SINGER_KEY, singer)
    }
  },
  async created () {
    const result = await getSingerList()
    this.singers = result.singers
  }
}
</script>

<style lang="scss" scoped>
  .singer{
    position: fixed;
    width: 100%;
    top:88px;
    bottom:0;
  }
</style>
