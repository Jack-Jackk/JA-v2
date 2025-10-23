<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	
	let hasGameState = $state(false);
	
	onMount(() => {
		// Check if there's a saved game state
		hasGameState = sessionStorage.getItem('pacmanGameState') !== null;
	});
	
	function resumeGame() {
		goto('/');
	}
</script>

{#if hasGameState}
	<div class="resume-game-container">
		<button onclick={resumeGame} class="resume-game-button">
			<span class="button-icon">▶</span>
			Resume Game
		</button>
	</div>
{/if}

<style>
	.resume-game-container {
		position: fixed;
		top: 2rem;
		right: 2rem;
		z-index: 1000;
		animation: pulse-glow 2s ease-in-out infinite;
	}
	
	@keyframes pulse-glow {
		0%, 100% { 
			filter: drop-shadow(0 0 10px rgba(255, 255, 0, 0.6));
		}
		50% { 
			filter: drop-shadow(0 0 20px rgba(255, 255, 0, 0.9));
		}
	}
	
	.resume-game-button {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 2rem;
		font-size: 1.25rem;
		font-weight: bold;
		font-family: 'Courier New', monospace;
		background: linear-gradient(180deg, #FFFF00 0%, #FFD700 100%);
		color: #000;
		border: 3px solid #FFFF00;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s;
		text-transform: uppercase;
		letter-spacing: 2px;
		box-shadow: 
			0 0 20px rgba(255, 255, 0, 0.5),
			0 4px 6px rgba(0, 0, 0, 0.3);
	}
	
	.resume-game-button:hover {
		transform: scale(1.05) translateY(-2px);
		box-shadow: 
			0 0 30px rgba(255, 255, 0, 0.8),
			0 6px 12px rgba(0, 0, 0, 0.4);
	}
	
	.resume-game-button:active {
		transform: scale(1.02) translateY(0);
	}
	
	.button-icon {
		font-size: 1.5rem;
		color: #000;
	}
	
	@media (max-width: 768px) {
		.resume-game-container {
			top: 1rem;
			right: 1rem;
		}
		
		.resume-game-button {
			padding: 0.75rem 1.5rem;
			font-size: 1rem;
		}
		
		.button-icon {
			font-size: 1.25rem;
		}
	}
</style>
