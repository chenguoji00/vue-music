import axios from 'axios'

const ERR_OK = 0
// 生产环境时改为线上地址
const baseURL = process.env.NODE_ENV === 'production' ? 'http://congxin0616.top/vue-music' : '/'

axios.defaults.baseURL = baseURL

export function get (url, params) {
  return axios.get(url, {
    params
  }).then(res => {
    const serverData = res.data
    if (serverData.code === ERR_OK) {
      return serverData.result
    }
  }).catch(e => {
    console.log(e)
  })
}
