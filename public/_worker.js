export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const objectName = url.pathname.slice(1)
    if (objectName.startsWith('api/')) {
      return fetch(`https://${env.HOST}/${objectName.substring(4)}`, {
        method: request.method,
        body: request.body,
        headers: request.headers,
        cf: request.cf,
      })
    }
    return env.ASSETS.fetch(request)
  },
};
