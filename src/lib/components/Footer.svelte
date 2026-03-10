<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Globe } from '@lucide/svelte';
	import { base } from '$app/paths';
	import { setLocale, getLocale, localizeHref } from '$lib/paraglide/runtime.js';

	function toggleLanguage() {
		const current = getLocale();
		const nextLocale = current === 'ja' ? 'en' : 'ja';

		// setLocale(..., { reload: false }) で内部状態とクッキーを更新し、
		// ベースパスを考慮したパスへ手動で遷移する
		setLocale(nextLocale, { reload: false });

		const pathWithoutBase = window.location.pathname.startsWith(base)
			? window.location.pathname.slice(base.length) || '/'
			: window.location.pathname;

		const localizedPath = localizeHref(pathWithoutBase, { locale: nextLocale });
		const b = base.endsWith('/') ? base.slice(0, -1) : base;
		const p = localizedPath.startsWith('/') ? localizedPath : '/' + localizedPath;
		window.location.href = b + p;
	}
</script>

<div class="mx-auto mt-auto w-full max-w-5xl px-4 pb-8">
	<Separator class="my-8" />

	<!-- Bottom Operations -->
	<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
		<div class="flex items-center gap-4">
			<Button
				variant="ghost"
				size="sm"
				class="gap-2 text-muted-foreground"
				onclick={toggleLanguage}
			>
				<Globe class="h-4 w-4" />
				{getLocale() === 'ja' ? 'English' : '日本語'}
			</Button>
		</div>
	</div>
</div>
