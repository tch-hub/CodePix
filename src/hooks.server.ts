import type { Handle } from '@sveltejs/kit';
import { base } from '$app/paths';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleParaglide: Handle = ({ event, resolve }) => {
	const url = new URL(event.request.url);

	// ベースパスを除去した状態で Paraglide に渡す
	const urlForParaglide = new URL(event.request.url);
	if (base && urlForParaglide.pathname.startsWith(base)) {
		urlForParaglide.pathname = urlForParaglide.pathname.slice(base.length) || '/';
	}
	const modifiedRequest = new Request(urlForParaglide, event.request);

	return paraglideMiddleware(modifiedRequest, async ({ request, locale }) => {
		// Paraglide がデlocalizeし、かつベースパスのない URL を
		// ベースパスありの状態に戻して SvelteKit に渡す
		const finalUrl = new URL(request.url);
		if (base) {
			const b = base.endsWith('/') ? base.slice(0, -1) : base;
			const p = finalUrl.pathname.startsWith('/') ? finalUrl.pathname : '/' + finalUrl.pathname;
			finalUrl.pathname = b + p;
		}

		event.request = new Request(finalUrl, request);

		const response = await resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});

		// リダイレクト時の Location ヘッダーにベースパスが欠けていれば補完する
		if (response.status >= 300 && response.status < 400) {
			const location = response.headers.get('Location');
			if (location && location.startsWith('/') && !location.startsWith(base)) {
				const newResponse = new Response(response.body, response);
				newResponse.headers.set('Location', base + location);
				return newResponse;
			}
		}

		return response;
	});
};

export const handle: Handle = handleParaglide;
