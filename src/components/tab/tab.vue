<template>
    <div class="tab">
        <router-link
            class='tab-item'
            v-for="(tab,index) in tabs"
            :key='index'
            :to="tab.path"
        >
            <span class="tab-link">
                {{tab.name}}
            </span>
        </router-link>
    </div>
</template>

<script>
export default {
  data () {
    return {
      tabs: [
        {
          name: '推荐',
          path: '/recommend'
        },
        {
          name: '歌手',
          path: '/singer'
        },
        {
          name: '排行',
          path: '/top-list'
        },
        {
          name: '搜索',
          path: '/search'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
    .tab{
        display: flex;
        height: 44px;
        line-height: 44px;
        .tab-item{
            flex: 1;
            text-align: center;
            .tab-link{
                color:$color-text-l;
                padding-bottom: 5px;
            }
            &.router-link-active{
                .tab-link{
                    border-bottom: 1px solid $color-theme;
                    color:$color-theme
                }
            }

        }
    }
</style>
