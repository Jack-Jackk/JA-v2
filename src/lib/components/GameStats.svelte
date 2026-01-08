<script>
	import { onMount } from 'svelte';
	
	let score = $state(0);
	let lives = $state(3);
	let fruitsCollected = $state(0);
	
	function loadGameStats() {
		if (typeof window !== 'undefined') {
			const savedState = sessionStorage.getItem('pacmanGameState');
			if (savedState) {
				try {
					const gameState = JSON.parse(savedState);
					score = gameState.score || 0;
					lives = gameState.lives || 3;
					fruitsCollected = gameState.fruitsCollectedCount || 0;
				} catch (e) {
					console.error('Error loading game stats:', e);
				}
			}
		}
	}
	
	onMount(() => {
		loadGameStats();
		
		// Update stats when storage changes (e.g., when resuming game)
		const handleStorageChange = () => {
			loadGameStats();
		};
		
		window.addEventListener('storage', handleStorageChange);
		
		// Also check periodically in case we're on the same tab
		const interval = setInterval(loadGameStats, 500);
		
		return () => {
			window.removeEventListener('storage', handleStorageChange);
			clearInterval(interval);
		};
	});
</script>

<div class="game-stats">
	<div class="stat-item">
		<span class="stat-label">SCORE:</span>
		<span class="stat-value">{score}</span>
	</div>
	<div class="stat-divider">|</div>
	<div class="stat-item">
		<span class="stat-label">LIVES:</span>
		<span class="stat-value">{lives}</span>
	</div>
	<div class="stat-divider">|</div>
	<div class="stat-item">
		<span class="stat-label">FRUITS:</span>
		<span class="stat-value">{fruitsCollected}/3</span>
	</div>
</div>

<style>
	.game-stats {
		position: fixed;
		top: 7rem;
		right: 2rem;
		background: rgba(0, 0, 0, 0.9);
		border: 2px solid #ffff00;
		padding: 0.5rem 1rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-family: 'Courier New', monospace;
		font-size: 0.75rem;
		z-index: 1000;
		box-shadow: 0 0 10px rgba(255, 255, 0, 0.3);
	}
	
	.stat-item {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
	
	.stat-label {
		color: #888;
	}
	
	.stat-value {
		color: #ffff00;
		font-weight: bold;
	}
	
	.stat-divider {
		color: #444;
	}
	
	@media (max-width: 768px) {
		.game-stats {
			position: static;
			margin: 0 auto 1rem auto;
			width: fit-content;
			font-size: 0.625rem;
			padding: 0.375rem 0.75rem;
			gap: 0.5rem;
		}
	}
</style>
