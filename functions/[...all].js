export async function onRequest({ request }) {
  const url = new URL(request.url);
  const targetUrl = `https://api.tcmai.cc${url.pathname}${url.search}`;

  // ✅ 处理预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*', // 也可以写你的前端域名
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const newHeaders = new Headers(request.headers);
  newHeaders.delete('host');

  let body = null;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    body = await request.arrayBuffer();
  }

  const response = await fetch(targetUrl, {
    method: request.method,
    headers: newHeaders,
    body,
    redirect: 'manual',
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.set('Access-Control-Allow-Origin', '*');
  responseHeaders.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const clonedBody = await response.arrayBuffer();

  return new Response(clonedBody, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}
