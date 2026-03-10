<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';

	let { children } = $props();

	function getLocalizedPath(locale: string) {
		const url = new URL(page.url.href);
		if (base && url.pathname.startsWith(base)) {
			url.pathname = url.pathname.slice(base.length) || '/';
		}
		const localizedPath = localizeHref(url.pathname, { locale });
		const b = base.endsWith('/') ? base.slice(0, -1) : base;
		const p = localizedPath.startsWith('/') ? localizedPath : '/' + localizedPath;
		return b + p;
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-screen flex-col bg-background text-foreground">
	<Header />
	{@render children()}
	<Footer />
</div>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={getLocalizedPath(locale)}>{locale}</a>
	{/each}
</div>
