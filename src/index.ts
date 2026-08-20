import { DEFAULT_HEADERS, RESERVED_PATHNAMES } from './constants.ts';
import { getUrlForRequest } from './router.ts';

export default {
	fetch(request): Response {
		const requestUrl = new URL(request.url);

		if (requestUrl.pathname === RESERVED_PATHNAMES.favicon) {
			return new Response(null, {
				status: 404,
				headers: {
					...DEFAULT_HEADERS,
					'cache-control': 'private, max-age=86400',
				},
			});
		}

		const url = getUrlForRequest(requestUrl);

		if (url) {
			return new Response(null, {
				status: 302,
				headers: {
					...DEFAULT_HEADERS,
					location: url,
					'cache-control': 'private, max-age=300',
				},
			});
		}

		return new Response(null, {
			status: 404,
			headers: {
				...DEFAULT_HEADERS,
				'cache-control': 'private, no-store',
			},
		});
	},
} satisfies ExportedHandler<Env>;
