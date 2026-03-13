<script lang="ts">
	import { Card } from '$lib/components/ui/card/index.js';
	import { Play, Eye } from '@lucide/svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { GRID_RADIUS, GRID_SIZE } from '$lib/config';
	import { uiState } from '$lib/states.svelte';

	const axisLabels = Array.from({ length: GRID_SIZE }, (_, i) => i - GRID_RADIUS);
	const yAxisLabels = [...axisLabels].reverse();

	let {
		grid = [],
		error = null,
		title = m.preview_title(),
		isSolved = false
	} = $props<{
		grid?: number[][];
		isRunning?: boolean;
		code?: string;
		error?: { line: number; message: string } | null;
		title?: string;
		isSolved?: boolean;
	}>();

	let canvas: HTMLCanvasElement | null = $state(null);
	let hoveredCoords: { x: number; y: number } | null = $state(null);

	function handleCanvasMouseMove(e: MouseEvent) {
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const cellSize = rect.width / GRID_SIZE;
		const gridX = Math.floor(mouseX / cellSize);
		const gridY = Math.floor(mouseY / cellSize);

		if (gridX >= 0 && gridX < GRID_SIZE && gridY >= 0 && gridY < GRID_SIZE) {
			hoveredCoords = {
				x: gridX - GRID_RADIUS,
				y: GRID_RADIUS - gridY
			};
		} else {
			hoveredCoords = null;
		}
	}

	function handleCellHover(lx: number, ly: number, isEntering: boolean) {
		if (isEntering) {
			hoveredCoords = { x: lx, y: ly };
		} else {
			hoveredCoords = null;
		}
	}

	$effect(() => {
		if (uiState.isLowPerformanceMode && canvas && grid.length > 0) {
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			const cellSize = canvas.width / GRID_SIZE;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const colors = [
				'transparent',
				'#ffffff', // WHITE
				'#000000', // BLACK
				'#ef4444', // RED
				'#f59e0b', // YELLOW
				'#10b981', // GREEN
				'#3b82f6', // BLUE
				'#8b5cf6', // PURPLE
				'#ec4899' // PINK
			];

			grid.forEach((row: number[], y: number) => {
				row.forEach((colorIndex: number, x: number) => {
					if (colorIndex > 0) {
						ctx.fillStyle = colors[colorIndex] || 'transparent';
						ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

						// タイル間の線を描画
						ctx.strokeStyle = uiState.isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
						ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
					}
				});
			});
		}
	});
</script>

<div class="flex h-full flex-col">
	<Card
		class="relative flex flex-1 flex-col gap-0 overflow-hidden bg-muted/30 p-0 shadow-inner {uiState.isLowPerformanceMode
			? ''
			: 'transition-all duration-500'} {isSolved
			? 'border-primary/30 bg-primary/5 shadow-[0_0_20px_rgba(var(--primary),0.1)] ring-2 ring-primary/40'
			: ''}"
	>
		<!-- Card Header -->
		<div class="flex items-center gap-2 border-b bg-muted/50 px-4 py-2">
			<Eye class="h-4 w-4 text-muted-foreground/70" />
			<span class="text-xs font-bold tracking-wider text-muted-foreground uppercase">
				{title}
			</span>
		</div>

		<div class="flex flex-1 flex-col items-center justify-center p-8">
			<div class="relative z-10 grid grid-cols-[auto_320px] grid-rows-[320px_auto] gap-1">
				<!-- Y axis labels (left) -->
				<div
					class="relative col-start-1 row-start-1 flex flex-col font-mono text-sm font-medium text-muted-foreground"
				>
					<!-- Y axis line -->
					<div class="absolute top-0 right-0 bottom-0 w-[2px] bg-muted-foreground/40"></div>
					<!-- Y axis arrow -->
					<div
						class="absolute -top-[5px] right-[-3px] h-0 w-0 border-x-[4px] border-b-[6px] border-x-transparent border-b-muted-foreground/40"
					></div>
					<!-- y label -->
					<div
						class="absolute -top-6 right-2 font-sans text-base font-bold text-muted-foreground italic"
					>
						y
					</div>

					{#each yAxisLabels as label (label)}
						<div class="relative flex flex-1 items-center justify-end">
							<span class="mr-3">{label}</span>
							<!-- Tick mark -->
							<div
								class="absolute top-1/2 right-[-2px] h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-muted-foreground/60"
							></div>
						</div>
					{/each}
				</div>

				<!-- Empty bottom-left corner -->
				<div class="relative col-start-1 row-start-2"></div>

				<!-- X axis labels (bottom) -->
				<div
					class="relative col-start-2 row-start-2 flex font-mono text-sm font-medium text-muted-foreground"
				>
					<!-- X axis line -->
					<div class="absolute top-0 right-0 left-0 h-[2px] bg-muted-foreground/40"></div>
					<!-- X axis arrow -->
					<div
						class="absolute top-[-3px] -right-[5px] h-0 w-0 border-y-[4px] border-l-[6px] border-y-transparent border-l-muted-foreground/40"
					></div>
					<!-- x label -->
					<div
						class="absolute top-2 -right-2 font-sans text-base font-bold text-muted-foreground italic"
					>
						x
					</div>

					{#each axisLabels as label (label)}
						<div class="relative flex flex-1 items-start justify-center">
							<span class="mt-2">{label}</span>
							<!-- Tick mark -->
							<div
								class="absolute top-[-2px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-muted-foreground/60"
							></div>
						</div>
					{/each}
				</div>

				<div
					class="relative col-start-2 row-start-1 flex h-[320px] w-[320px] items-center justify-center"
				>
					{#if error}
						<div
							class="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-lg border border-destructive bg-background/80 p-4 text-center backdrop-blur-sm"
						>
							<div class="flex flex-col items-center gap-2 font-mono text-sm text-destructive">
								<span class="font-bold">Error</span>
								<span>{m.terminal_error_line({ line: error.line, message: error.message })}</span>
							</div>
						</div>
					{/if}

					{#if grid.length > 0}
						{#if uiState.isLowPerformanceMode}
							<canvas
								bind:this={canvas}
								width="320"
								height="320"
								onmousemove={handleCanvasMouseMove}
								onmouseleave={() => (hoveredCoords = null)}
								class="z-20 h-full w-full rounded-md"
							></canvas>
						{:else}
							<div
								class="z-20 grid h-full w-full"
								style="grid-template-columns: repeat({GRID_SIZE}, 1fr); grid-template-rows: repeat({GRID_SIZE}, 1fr);"
							>
								{#each grid as row, y (y)}
									{#each row as colorIndex, x (x)}
										<div
											role="gridcell"
											tabindex="-1"
											onmouseenter={() => handleCellHover(x - GRID_RADIUS, GRID_RADIUS - y, true)}
											onmouseleave={() => handleCellHover(x - GRID_RADIUS, GRID_RADIUS - y, false)}
											style="background-color: {colorIndex === 0
												? 'transparent'
												: `var(--kopiatile-${colorIndex})`}; {uiState.isLowPerformanceMode
												? 'transition: transform 0.2s, opacity 0.2s; box-shadow: none;'
												: ''}"
											class="flex h-full w-full items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] select-none {colorIndex ===
											0
												? 'scale-50 opacity-0'
												: 'z-10 scale-[0.92] rounded-md border border-black/20 opacity-100 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),inset_0_-3px_4px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.4)]'} {uiState.isLowPerformanceMode
												? 'will-change-transform'
												: ''}"
										></div>
									{/each}
								{/each}
							</div>
						{/if}
					{:else}
						<!-- Dummy visual for empty canvas -->
						<div class="absolute inset-0 flex flex-col items-center justify-center gap-2">
							<Play class="h-8 w-8 text-muted-foreground/20" />
							<span class="text-xs font-medium text-muted-foreground/50">320x320 Canvas Render</span
							>
						</div>
					{/if}

					{#if hoveredCoords}
						<div
							class="pointer-events-none absolute right-2 bottom-2 z-40 rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur-sm"
						>
							x: {hoveredCoords.x}, y: {hoveredCoords.y}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</Card>
</div>
