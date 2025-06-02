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
	const targetUrl = `https://api.tcmai.cc${path}`;
	//const targetUrl = `https://api.tcmai.cc${url.pathname}${url.search}`;

	const headers = new Headers(request.headers);
	headers.delete("host");

	const body = (request.method === "GET" || request.method === "HEAD") ?
		null :
		await request.arrayBuffer();

	const response = await fetch(targetUrl, {
		method: request.method,
		headers,
		body,
		redirect: "manual"
	});

	const responseHeaders = new Headers(response.headers);
	for (const [key, value] of Object.entries(corsHeaders)) {
		responseHeaders.set(key, value);
	}

	const responseBody = await response.arrayBuffer();

	return new Response(responseBody, {
		status: response.status,
		statusText: response.statusText,
		headers: responseHeaders
	});
}