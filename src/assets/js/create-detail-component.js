import MusicList from '@/components/music-list/music-list'
import Storage from 'good-storage'
import { processSongs } from '@/service/song'
export default function createDetailComponent (name, key, fetch) {
  return {
    name,
    components: { MusicList },
    data () {
      return {
        songs: [],
        loading: true
      }
    },
    props: {
      data: Object
    },
    computed: {
      computedData () {
        let ret = null
        const data = this.data
        //* 如果data存在则使用data
        if (data) {
          ret = data
        } else {
          //* 如果data不存在则从缓存中取
          const cached = Storage.session.get(key)
          if (cached && (cached.mid || cached.id + '') === this.$route.params.id) {
            ret = cached
          }
        }
        return ret
      },
      pic () {
        const data = this.computedData
        return data && data.pic
      },
      title () {
        const data = this.computedData
        return data && (data.name || data.title)
      }
    },
    async created () {
      const data = this.computedData
      if (!data) {
        const path = this.$route.matched[0].path
        this.$router.push({
          path
        })
        return
      }
      const result = await fetch(data)
      this.songs = await processSongs(result.songs)
      this.loading = false
    }
  }
}
