export async function onRequest({
	request
}) {
	const corsHeaders = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
		'Access-Control-Allow-Headers': 'Authorization, X-Port, Content-Type',
		'Access-Control-Max-Age': '86400'
	};

	if (request.method === 'OPTIONS') {
		return new Response(null, {
			status: 204,
			headers: corsHeaders
		});
	}

	const url = new URL(request.url);
	const path = url.searchParams.get("url") || "/";
	const targetUrl = `https://api.imtcm.com${path}`;

	const headers = new Headers(request.headers);
	headers.delete("host");
	
	headers.set('x-forwarded-Proto-cloudflare', url.protocol.replace(':', ''));
	headers.set('x-forwarded-host-cloudflare', `${url.host}${url.pathname}?url=`);

	const body = (request.method === "GET" || request.method === "HEAD") ?
		null :
		await request.arrayBuffer();

	const response = await fetch(targetUrl, {
		method: request.method,
		headers,
		body,
		redirect: "manual"
	});

	// 复制目标响应头，并加上 CORS 头
	const responseHeaders = new Headers(response.headers);
	for (const [key, value] of Object.entries(corsHeaders)) {
		responseHeaders.set(key, value);
	}

	// 如果是 SSE，强制确保 content-type 正确
	if (responseHeaders.get("content-type")?.startsWith("text/event-stream")) {
		responseHeaders.set("Content-Type", "text/event-stream");
	}

	// 不使用 arrayBuffer，而是直接转发原始 stream
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: responseHeaders
	});
}