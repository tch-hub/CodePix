import { deLocalizeUrl } from '$lib/paraglide/runtime';
import { base } from '$app/paths';

export const reroute = (event) => {
	const url = new URL(event.url);
	// ベースパスがある場合はそれを取り除く
	if (base && url.pathname.startsWith(base)) {
		url.pathname = url.pathname.slice(base.length) || '/';
	}
	// Paraglide でロケールを除去したパス（ベースなし）を返す
	return deLocalizeUrl(url).pathname;
};
