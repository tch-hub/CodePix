import { deLocalizeUrl } from '$lib/paraglide/runtime';
import { base } from '$app/paths';

export const reroute = (event) => {
	const url = new URL(event.url);
	if (base && url.pathname.startsWith(base)) {
		// ベースパスを除去してからデlocalize
		const pathWithoutBase = url.pathname.slice(base.length) || '/';
		url.pathname = pathWithoutBase;
		const deLocalized = deLocalizeUrl(url);
		// デlocalizeされたパスにベースパスを戻す
		return base + (deLocalized.pathname === '/' ? '' : deLocalized.pathname);
	}
	return deLocalizeUrl(event.url).pathname;
};
