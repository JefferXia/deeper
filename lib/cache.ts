import { LRUCache } from 'lru-cache'

const cache = new LRUCache({
  max: 200,
  ttl: 1000 * 10,
})

export default cache