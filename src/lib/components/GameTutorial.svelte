<script>
	import Ghost from '$lib/components/Ghost.svelte';
	
	let { onComplete } = $props();
	let currentStep = $state(0);
	
	const steps = [
		{
			title: "CONTROLS",
			content: [
				{ icon: "↑ ↓ ← →", label: "Arrow Keys", description: "Move Jac-Man (Desktop)", isControl: true },
				{ icon: "W A S D", label: "WASD Keys", description: "Alternative movement (Desktop)", isControl: true },
				{ icon: "👆", label: "Swipe", description: "Move Jac-Man (Mobile)", isControl: true },
				{ icon: "ESC", label: "Pause", description: "Pause/Resume game (Desktop)", isControl: true },
				{ icon: "R", label: "Restart", description: "Restart game", isControl: true }
			]
		},
	{
		title: "PORTFOLIO FRUITS",
		content: [
			{ icon: "E", label: "Experience Fruit", points: "1000 pts", description: "View work experience + invincibility boost", color: "#3b82f6" },
			{ icon: "P", label: "Projects Fruit", points: "1000 pts", description: "View projects + invincibility boost", color: "#10b981" },
			{ icon: "A", label: "Achievements Fruit", points: "1000 pts", description: "View achievements + invincibility boost", color: "#f59e0b" }
		]
	},
	{
		title: "GAME ELEMENTS",
		content: [
			{ isDot: true, label: "Bit", points: "10 pts", description: "Collect all the bits" },
			{ isPowerPellet: true, label: "Forum Post", points: "50 pts", description: "Debug Mode. Makes bugs catchable for 10 seconds" },
			{ isGhost: true, label: "Bugs", points: "100 pts", description: "Catch bugs while in debug mode" }
		]
	}
];

function nextStep() {
	if (currentStep < steps.length - 1) {
		currentStep++;
	} else {
		onComplete();
	}
}	function prevStep() {
		if (currentStep > 0) {
			currentStep--;
		}
	}
	
	function skipTutorial() {
		onComplete();
	}
</script>

<div class="tutorial-overlay">
	<div class="tutorial-content">
		<div class="tutorial-header">
			<h2 class="tutorial-title">{steps[currentStep].title}</h2>
			<div class="step-indicator">
				<span class="step-text">STEP {currentStep + 1} OF {steps.length}</span>
			</div>
		</div>
		
		<div class="tutorial-body">
		{#if steps[currentStep].content}
			<div class="tutorial-grid">
				{#each steps[currentStep].content as item}
					<div class="tutorial-item">
						{#if item.isDot}
							<div class="item-icon pellet-icon">
								<div class="dot-pellet-tutorial"></div>
							</div>
						{:else if item.isPowerPellet}
							<div class="item-icon pellet-icon">
								<div class="power-pellet-tutorial"></div>
							</div>
						{:else if item.isGhost}
							<div class="item-icon ghost-icon">
								<Ghost 
									ghost={{ x: 0, y: 0 }} 
									cellSize={40} 
									color="#FF0000" 
									vulnerable={true} 
								/>
							</div>
						{:else}
							<div 
								class="item-icon" 
								class:control-icon={item.isControl}
								style={item.color ? `color: ${item.color}; text-shadow: 0 0 8px ${item.color};` : ''}
							>
								{item.icon}
							</div>
						{/if}
						<div class="item-details">
							<div class="item-header">
								<span class="item-label">{item.label}</span>
								{#if item.points}
									<span class="item-points">{item.points}</span>
								{/if}
							</div>
							<div class="item-description">{item.description}</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}			{#if steps[currentStep].sections}
				<div class="tutorial-sections">
					{#each steps[currentStep].sections as section}
						<div class="tutorial-section">
							<h3 class="section-subtitle">{section.subtitle}</h3>
							<div class="tutorial-grid">
								{#each section.items as item}
									<div class="tutorial-item">
										<div class="item-icon" style={item.color ? `color: ${item.color}; font-size: 1.5rem;` : ''}>{item.icon}</div>
										<div class="item-details">
											<div class="item-header">
												<span class="item-label">{item.label}</span>
												{#if item.points}
													<span class="item-points">{item.points}</span>
												{/if}
											</div>
											<div class="item-description">{item.description}</div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
		
		<div class="tutorial-footer">
			<button onclick={prevStep} class="tutorial-button nav-button" disabled={currentStep === 0}>
				← Back
			</button>
			<button onclick={skipTutorial} class="tutorial-button skip-button">
				Skip
			</button>
			<button onclick={nextStep} class="tutorial-button nav-button next">
				{currentStep < steps.length - 1 ? 'Next →' : 'Start!'}
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
		max-height: 80vh;
		overflow-y: auto;
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
		margin: 0 0 0.5rem 0;
		color: #FFFF00;
		text-shadow: 0 0 15px #FFFF00;
		letter-spacing: 2px;
	}
	
	.step-text {
		font-size: 0.75rem;
		color: #888;
		letter-spacing: 1px;
	}
	
	.tutorial-body {
		margin-bottom: 1.5rem;
		min-height: 280px;
	}
	
	.tutorial-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 0.75rem;
	}
	
	.tutorial-sections {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	
	.tutorial-section {
		background: rgba(255, 255, 0, 0.05);
		border: 1px solid #444;
		border-radius: 6px;
		padding: 1rem;
	}
	
	.section-subtitle {
		font-size: 1rem;
		color: #00FFFF;
		margin: 0 0 0.75rem 0;
		text-align: center;
		text-shadow: 0 0 8px #00FFFF;
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
	
	.ghost-icon {
		position: relative;
		width: 50px;
		height: 50px;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: 5px;
	}
	
	.pellet-icon {
		width: 50px;
		height: 50px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.dot-pellet-tutorial {
		width: 8px;
		height: 8px;
		background: #FFB8AE;
		border-radius: 50%;
		box-shadow: 0 0 8px #FFB8AE;
	}
	
	.power-pellet-tutorial {
		width: 16px;
		height: 16px;
		background: radial-gradient(circle, #FFFF00 0%, #FFB8AE 50%, #FF6B6B 100%);
		border-radius: 50%;
		box-shadow: 0 0 20px #FFFF00, 0 0 10px #FFB8AE;
		animation: power-pulse 0.5s ease-in-out infinite;
	}
	
	@keyframes power-pulse {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.2); }
	}
	
	.item-details {
		flex: 1;
		min-width: 0;
	}
	
	.item-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
	}
	
	.item-label {
		font-size: 0.875rem;
		color: #FFFF00;
		font-weight: bold;
	}
	
	.item-points {
		font-size: 0.75rem;
		color: #00FF00;
		font-weight: bold;
		white-space: nowrap;
	}
	
	.item-description {
		font-size: 0.75rem;
		color: #AAA;
		line-height: 1.3;
	}
	
	.tutorial-footer {
		display: grid;
		grid-template-columns: auto 1fr auto;
		gap: 0.75rem;
		padding-top: 1rem;
		border-top: 2px solid #444;
	}
	
	.tutorial-button {
		padding: 0.625rem 1.25rem;
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
	
	.skip-button {
		background: transparent;
		color: #888;
		border-color: #444;
	}
	
	.skip-button:hover {
		color: #FFF;
		border-color: #888;
	}
	
	.nav-button {
		background: rgba(37, 99, 235, 0.3);
		color: #00FFFF;
		border-color: #2563eb;
	}
	
	.nav-button:hover:not(:disabled) {
		background: rgba(37, 99, 235, 0.5);
		box-shadow: 0 0 15px rgba(37, 99, 235, 0.5);
	}
	
	.nav-button.next {
		background: linear-gradient(180deg, #FFFF00 0%, #FFD700 100%);
		color: #000;
		border-color: #FFFF00;
		box-shadow: 0 0 15px rgba(255, 255, 0, 0.4);
	}
	
	.nav-button.next:hover {
		transform: scale(1.05);
		box-shadow: 0 0 20px rgba(255, 255, 0, 0.6);
	}
	
	.nav-button:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
	
	@media (max-width: 768px) {
		.tutorial-content {
			padding: 1.25rem;
			max-height: 85vh;
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
		
		.item-points,
		.item-description {
			font-size: 0.6875rem;
		}
		
		.tutorial-footer {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}
		
		.tutorial-button {
			width: 100%;
			padding: 0.5rem 1rem;
			font-size: 0.75rem;
		}
	}
</style>
