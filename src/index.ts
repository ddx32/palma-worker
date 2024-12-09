export default {
	async fetch(request, env, ctx): Promise<Response> {
		if (request.method === 'GET') {
			const value = await env.PALMA_HAYEK_KV.get('MOISTURE');
			if (value === null) {
				return new Response('Value not found', { status: 404 });
			}
			return new Response(value);
		}

		if (request.method === 'POST') {
			const value = await request.text();
			await env.PALMA_HAYEK_KV.put('MOISTURE', String(value));
			return new Response('Value set');
		}

		return new Response('Method not allowed', { status: 405 });
	},
} satisfies ExportedHandler<Env>;
