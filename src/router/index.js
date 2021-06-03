import { createRouter, createWebHashHistory } from 'vue-router'
//* 异步组件
const Recommend = () => import('@/views/recommend'/*
webpackChunkName:"recommend" */)

const Singer = () => import('@/views/singer'/*
webpackChunkName:"Singer" */)

const topList = () => import('@/views/top-list'/*
webpackChunkName:"topList" */)

const Search = () => import('@/views/search'/*
webpackChunkName:"Search" */)

const SingerDetail = () => import('@/views/singer-detail'/*
webpackChunkName:"SingerDetail" */)

const Album = () => import('@/views/album'/*
webpackChunkName:"Album" */)

const TopDetail = () => import('@/views/top-detail'/*
webpackChunkName:"TopDetail" */)

const UserCenter = () => import('@/views/user-center'/*
webpackChunkName:"UserCenter" */)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/top-list',
    component: topList,
    children: [
      {
        path: ':id',
        component: TopDetail
      }
    ]
  },
  {
    path: '/search',
    component: Search,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/user',
    components: {
      user: UserCenter
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
