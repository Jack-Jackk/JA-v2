<script>
	let { onComplete } = $props();
</script>

<div class="tutorial-overlay">
	<div class="tutorial-content">
		<div class="tutorial-header">
			<h2 class="tutorial-title">PORTFOLIO NAVIGATION</h2>
		</div>
		
		<div class="tutorial-body">
			<div class="tutorial-grid">
				<div class="tutorial-item">
					<div class="item-icon control-icon">
						↑ ↓
					</div>
					<div class="item-details">
						<div class="item-header">
							<span class="item-label">Scroll Content</span>
						</div>
						<div class="item-description">Use arrow keys or scroll to navigate page content</div>
					</div>
				</div>
				
				<div class="tutorial-item">
					<div class="item-icon nav-icon">
						🎮
					</div>
					<div class="item-details">
						<div class="item-header">
							<span class="item-label">Resume Game Button</span>
						</div>
						<div class="item-description">Click the button at the top to return to the game</div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="tutorial-footer">
			<button onclick={onComplete} class="tutorial-button start-button">
				Got it!
			</button>
		</div>
	</div>
</div>

<style>
	.tutorial-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(8px);
		z-index: 1000;
	}
	
	.tutorial-content {
		background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%);
		border: 3px solid #FFFF00;
		border-radius: 12px;
		padding: 1.5rem;
		max-width: 500px;
		width: 90%;
		box-shadow: 
			0 0 30px rgba(255, 255, 0, 0.5),
			inset 0 0 20px rgba(255, 255, 0, 0.1);
		font-family: 'Courier New', monospace;
	}
	
	.tutorial-header {
		text-align: center;
		margin-bottom: 1.5rem;
		border-bottom: 2px solid #444;
		padding-bottom: 1rem;
	}
	
	.tutorial-title {
		font-size: 1.5rem;
		margin: 0;
		color: #FFFF00;
		text-shadow: 0 0 15px #FFFF00;
		letter-spacing: 2px;
	}
	
	.tutorial-body {
		margin-bottom: 1.5rem;
	}
	
	.tutorial-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.75rem;
	}
	
	.tutorial-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem;
		background: rgba(37, 99, 235, 0.1);
		border: 1px solid rgba(37, 99, 235, 0.3);
		border-radius: 6px;
	}
	
	.item-icon {
		font-size: 1.75rem;
		min-width: 50px;
		text-align: center;
		font-weight: bold;
		font-family: 'Courier New', monospace;
	}
	
	.item-icon.control-icon {
		color: #FFFFFF;
		font-size: 1.25rem;
	}
	
	.item-icon.nav-icon {
		font-size: 2rem;
	}
	
	.item-details {
		flex: 1;
		min-width: 0;
	}
	
	.item-header {
		margin-bottom: 0.25rem;
	}
	
	.item-label {
		font-size: 0.875rem;
		color: #FFFF00;
		font-weight: bold;
	}
	
	.item-description {
		font-size: 0.75rem;
		color: #AAA;
		line-height: 1.3;
	}
	
	.tutorial-footer {
		display: flex;
		justify-content: center;
		padding-top: 1rem;
		border-top: 2px solid #444;
	}
	
	.tutorial-button {
		padding: 0.75rem 2rem;
		font-size: 0.875rem;
		font-weight: bold;
		font-family: 'Courier New', monospace;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.3s;
		text-transform: uppercase;
		letter-spacing: 1px;
		border: 2px solid;
	}
	
	.start-button {
		background: linear-gradient(180deg, #FFFF00 0%, #FFD700 100%);
		color: #000;
		border-color: #FFFF00;
		box-shadow: 0 0 15px rgba(255, 255, 0, 0.4);
	}
	
	.start-button:hover {
		transform: scale(1.05);
		box-shadow: 0 0 20px rgba(255, 255, 0, 0.6);
	}
	
	@media (max-width: 768px) {
		.tutorial-content {
			padding: 1.25rem;
		}
		
		.tutorial-title {
			font-size: 1.25rem;
		}
		
		.item-icon {
			font-size: 1.5rem;
			min-width: 40px;
		}
		
		.item-label {
			font-size: 0.75rem;
		}
		
		.item-description {
			font-size: 0.6875rem;
		}
		
		.tutorial-button {
			padding: 0.625rem 1.5rem;
			font-size: 0.75rem;
		}
	}
</style>
