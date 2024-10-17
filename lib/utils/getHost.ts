export default function getHost() {
  switch (process.env.NEXT_PUBLIC_NODE_ENV) {
    case 'production':
      return 'https://www.topmind.video'
    case 'development':
    default:
      return 'http://localhost:3000'
  }
}