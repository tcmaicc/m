export async function onRequest(context) {
	const {
		request
	} = context;
	const url = new URL(request.url);

	// 代理到你的真实服务器
	const targetUrl = `https://api.tcmai.cc${url.pathname}${url.search}`;

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
	responseHeaders.set('Access-Control-Allow-Headers', '*');

	if (request.method === 'OPTIONS') {
		return new Response(null, {
			status: 204,
			headers: responseHeaders
		});
	}

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: responseHeaders,
	});
}