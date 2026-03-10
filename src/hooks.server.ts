import type { Handle } from '@sveltejs/kit';
import { base } from '$app/paths';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleParaglide: Handle = ({ event, resolve }) => {
	const originalUrl = new URL(event.request.url);

	// ベースパスがある場合、Paraglideにはベースパスを除いたURLで渡す
	if (base && originalUrl.pathname.startsWith(base)) {
		const urlWithoutBase = new URL(event.request.url);
		urlWithoutBase.pathname = urlWithoutBase.pathname.slice(base.length) || '/';
		const modifiedRequest = new Request(urlWithoutBase, event.request);

		return paraglideMiddleware(modifiedRequest, async ({ request, locale }) => {
			// ParaglideがデlocalizeしたURLにベースパスを戻す
			const finalUrl = new URL(request.url);
			finalUrl.pathname = base + (finalUrl.pathname === '/' ? '' : finalUrl.pathname);

			event.request = new Request(finalUrl, request);

			const response = await resolve(event, {
				transformPageChunk: ({ html }) =>
					html
						.replace('%paraglide.lang%', locale)
						.replace('%paraglide.dir%', getTextDirection(locale))
			});

			// リダイレクト先がベースパスを含まない場合、追加する
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
	}

	return paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) =>
				html
					.replace('%paraglide.lang%', locale)
					.replace('%paraglide.dir%', getTextDirection(locale))
		});
	});
};

export const handle: Handle = handleParaglide;
