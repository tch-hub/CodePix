<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Sun, Moon, ListTodo, FileText, Zap, ZapOff, Play, Pause } from '@lucide/svelte';
	import { uiState } from '$lib/states.svelte';
	import * as m from '$lib/paraglide/messages.js';
</script>

<header
	class="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="flex items-center gap-2 text-xl font-bold tracking-tight">
		<div
			class="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground"
		>
			KT
		</div>
		KopiaTile
	</div>
	<div class="flex items-center gap-2">
		<Button
			variant="ghost"
			size="sm"
			class="flex items-center gap-2"
			onclick={() => (uiState.isProblemSidebarOpen = true)}
		>
			<ListTodo class="h-4 w-4" />
			<span class="hidden sm:inline">{m.problem_list_title()}</span>
		</Button>
		<Button
			variant="ghost"
			size="sm"
			class="flex items-center gap-2"
			onclick={() => (uiState.isDocsOpen = true)}
		>
			<FileText class="h-4 w-4" />
			<span class="hidden sm:inline">{m.documentation()}</span>
		</Button>
		<div class="mx-2 h-4 w-px bg-border"></div>
		<Button
			variant="ghost"
			size="icon"
			onclick={() => (uiState.isLowPerformanceMode = !uiState.isLowPerformanceMode)}
			class={uiState.isLowPerformanceMode ? 'text-yellow-500' : 'text-muted-foreground'}
			title={m.low_performance_mode()}
		>
			{#if uiState.isLowPerformanceMode}
				<Zap class="h-5 w-5 fill-current" />
			{:else}
				<ZapOff class="h-5 w-5" />
			{/if}
			<span class="sr-only">{m.low_performance_mode()}</span>
		</Button>
		<Button
			variant="ghost"
			size="icon"
			onclick={() => (uiState.isAutoRunEnabled = !uiState.isAutoRunEnabled)}
			class={uiState.isAutoRunEnabled ? 'text-primary' : 'text-muted-foreground'}
			title={m.auto_run_label()}
		>
			{#if uiState.isAutoRunEnabled}
				<Play class="h-5 w-5 fill-current" />
			{:else}
				<Pause class="h-5 w-5" />
			{/if}
			<span class="sr-only">{m.auto_run_label()}</span>
		</Button>
		<Button variant="ghost" size="icon" onclick={() => uiState.toggleDarkMode()}>
			{#if uiState.isDarkMode}
				<Moon class="h-5 w-5 text-muted-foreground" />
			{:else}
				<Sun class="h-5 w-5 text-muted-foreground" />
			{/if}
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>
</header>
