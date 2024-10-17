import { LRUCache } from 'lru-cache'

const cache = new LRUCache({
  max: 1000, // 最大缓存条数
  ttl: 1000 * 60 * 60 * 24 * 10, // 过期时间，单位毫秒
})

export default cache