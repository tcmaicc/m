export async function onRequest({ request }) {
  const url = new URL(request.url);
  const path = url.searchParams.get("url") || "/";

  const targetUrl = `https://api.tcmai.cc/${path}`;

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const headers = new Headers(request.headers);
  headers.delete("host");

  const body = request.method === "GET" || request.method === "HEAD" ? null : await request.arrayBuffer();

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    redirect: "manual"
  });

  const resHeaders = new Headers(response.headers);
  resHeaders.set("Access-Control-Allow-Origin", "*");
  resHeaders.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
  resHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  const resBody = await response.arrayBuffer();

  return new Response(resBody, {
    status: response.status,
    statusText: response.statusText,
    headers: resHeaders,
  });
}
