import { browser } from '$app/environment';

class UIState {
	isProblemSidebarOpen = $state(false);
	isDocsOpen = $state(false);
	isLowPerformanceMode = $state(false);
	isAutoRunEnabled = $state(true);
	isDarkMode = $state(false);

	constructor() {
		if (browser) {
			const savedMode = localStorage.getItem('kopiatile_low_performance');
			if (savedMode !== null) this.isLowPerformanceMode = savedMode === 'true';

			const savedAutoRun = localStorage.getItem('kopiatile_auto_run');
			if (savedAutoRun !== null) this.isAutoRunEnabled = savedAutoRun === 'true';

			const savedTheme = localStorage.getItem('kopiatile_theme');
			if (savedTheme !== null) {
				this.isDarkMode = savedTheme === 'dark';
				this.applyTheme();
			} else {
				// デフォルトはシステムの好みに合わせる
				this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
				this.applyTheme();
			}
		}

		// 設定変更時に保存するためのEffect
		$effect.root(() => {
			$effect(() => {
				if (browser) {
					localStorage.setItem('kopiatile_low_performance', String(this.isLowPerformanceMode));
				}
			});

			$effect(() => {
				if (browser) {
					localStorage.setItem('kopiatile_auto_run', String(this.isAutoRunEnabled));
				}
			});

			$effect(() => {
				if (browser) {
					localStorage.setItem('kopiatile_theme', this.isDarkMode ? 'dark' : 'light');
					this.applyTheme();
				}
			});
		});
	}

	private applyTheme() {
		if (browser) {
			if (this.isDarkMode) {
				document.documentElement.classList.add('dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		}
	}

	toggleDarkMode() {
		this.isDarkMode = !this.isDarkMode;
	}
}

export const uiState = new UIState();
