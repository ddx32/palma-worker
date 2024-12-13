import { WebClient } from '@slack/web-api';

export async function sendSlackMessage(channelId: string, token: string, messageText: string) {
	const web = new WebClient(token);
	try {
		const result = await web.chat.postMessage({
			channel: channelId,
			text: messageText,
		});

		console.log('Message sent successfully:', result);
	} catch (error) {
		console.error('Error sending message:', error);
	}
}
