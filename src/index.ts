import { sendSlackMessage } from './sendSlackMessage';

const breakpoints = [40, 60, 80];

function updateSlackChannel(currentMoisture: number, newMoisture: number, channel: string, token: string) {
	if (!channel) {
		return;
	}

	if (currentMoisture > newMoisture) {
		return new Response('Value is less than current value', { status: 400 });
	}

	const message = `The moisture level has been updated to ${newMoisture}.`;
	return sendSlackMessage(channel, token, message);
}

export default {
	async fetch(request, env): Promise<Response> {
		if (request.method === 'GET') {
			const value = await env.PALMA_HAYEK_KV.get('MOISTURE');
			if (value === null) {
				return new Response('Value not found', { status: 404 });
			}
			return new Response(value);
		}

		if (request.method === 'POST') {
			const value = await request.text();
			const moisture = Number(value);
			if (isNaN(moisture) || moisture < 0 || moisture > 100) {
				return new Response('Invalid value', { status: 400 });
			}

			const current = await env.PALMA_HAYEK_KV.get('MOISTURE');

			await env.PALMA_HAYEK_KV.put('MOISTURE', String(moisture));
			await updateSlackChannel(Number(current), moisture, env.SLACK_CHANNEL_ID, env.SLACK_API_TOKEN);
			return new Response('OK', { status: 200 });
		}

		return new Response('Method not allowed', { status: 405 });
	},
} satisfies ExportedHandler<Env>;
