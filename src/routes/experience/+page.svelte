<script>
	import ResumeGameButton from '$lib/components/ResumeGameButton.svelte';
	import GameStats from '$lib/components/GameStats.svelte';
	import PortfolioTutorial from '$lib/components/PortfolioTutorial.svelte';
	import { onMount } from 'svelte';
	
	let selectedIndex = $state(0);
	let showTutorial = $state(false);
	
	onMount(() => {
		// Check if tutorial has been shown before
		const tutorialShown = sessionStorage.getItem('portfolioTutorialShown');
		if (!tutorialShown) {
			showTutorial = true;
		}
	});
	
	function closeTutorial() {
		showTutorial = false;
		sessionStorage.setItem('portfolioTutorialShown', 'true');
	}
	
	const experiences = [
		{
			title: "FULL STACK SOFTWARE DEVELOPER",
			company: "Allwater Marine Group",
			location: "Charleston, SC",
			date: "May 2023 - Present",
			achievements: [
				"Mentored junior developer on coding techniques and best practices",
				"Collaborated with product owners to define scope and meet deadlines",
				"Pioneered a much faster release cycle",
				"Spearheaded .NET MAUI to React Native migration"
			]
		},
		{
			title: "ASSISTANT CAPTAIN",
			company: "Towboat US Charleston",
			location: "Charleston, SC",
			date: "Apr 2021 - Mar 2023",
			achievements: [
				"Assisted with vessel operations and pre/post-voyage checks",
				"Maintained deck equipment and vessel exterior",
				"Acted as lookout and supervised deck activities",
				"Participated in safety and emergency drills"
			]
		},
		{
			title: "WILDLIFE REHABILITATOR",
			company: "World Class Wildlife Removal",
			location: "Largo, FL",
			date: "Feb 2020 - Apr 2020",
			achievements: [
				"Removed wildlife humanely using trapping and relocation",
				"Inspected properties to identify entry points",
				"Rehabilitated 100+ animals including snakes and alligators"
			]
		},
		{
			title: "FOOD RUNNER / BUSSER",
			company: "Wasabi",
			location: "Mount Pleasant, SC",
			date: "Mar 2019 - Mar 2020",
			achievements: [
				"Prepared dining areas and supported efficient service",
				"Provided responsive customer service",
				"Maintained knowledge of 30+ menu items and specials"
			]
		}
	];
	
	function moveUp() {
		if (selectedIndex > 0) {
			selectedIndex--;
		}
	}
	
	function moveDown() {
		if (selectedIndex < experiences.length - 1) {
			selectedIndex++;
		}
	}
</script>

{#if showTutorial}
	<PortfolioTutorial onComplete={closeTutorial} />
{/if}

<svelte:window onkeydown={(e) => {
	if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
		e.preventDefault();
		moveUp();
	} else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
		e.preventDefault();
		moveDown();
	}
}} />

<div class="page-container">
	<div class="mobile-header">
		<GameStats />
	</div>

	<div class="arcade-screen">
	<div class="screen-border">
		<div class="screen-content">
			<!-- Header -->
			<header class="arcade-header">
				<div class="header-line">╔════════════════════════════════════════════════════╗</div>
				<div class="header-title">║         WORK EXPERIENCE - PLAYER SELECT         ║</div>
				<div class="header-line">╚════════════════════════════════════════════════════╝</div>
			</header>

			<!-- Main Display -->
			<main class="display-area">
				<!-- Left Column: Experience Select List -->
				<div class="left-column">
					<div class="select-list">
						{#each experiences as exp, i}
							<button 
								class="select-item" 
								class:selected={i === selectedIndex}
								onclick={() => selectedIndex = i}
							>
								<span class="selector">{i === selectedIndex ? '►' : ' '}</span>
								<span class="job-number">[{i + 1}]</span>
								<span class="job-title">{exp.title}</span>
							</button>
						{/each}
					</div>
				</div>

				<!-- Right Column: Details Panel -->
				<div class="right-column">
					<div class="details-panel">
						<div class="panel-border">
							<div class="detail-header">
								<div class="company-name">{experiences[selectedIndex].company}</div>
								<div class="meta-info">
									<span>{experiences[selectedIndex].location}</span>
									<span class="separator">|</span>
									<span>{experiences[selectedIndex].date}</span>
								</div>
							</div>
							
							<div class="achievements">
								{#each experiences[selectedIndex].achievements as achievement}
									<div class="achievement-item">• {achievement}</div>
								{/each}
							</div>
						</div>					<div class="scroll-indicator">
						<span class="scroll-arrow">▼</span>
					</div>					</div>
				</div>
			</main>

			<!-- Controls Footer -->
			<footer class="arcade-footer">
				<div class="counter">POSITION: {selectedIndex + 1}/{experiences.length}</div>
				<div class="navigation-controls">
					<button class="control-btn nav-left" onclick={moveUp} disabled={selectedIndex === 0}>
						▲ UP
					</button>
					<button class="control-btn nav-right" onclick={moveDown} disabled={selectedIndex === experiences.length - 1}>
						▼ DOWN
					</button>
				</div>
				<div class="resume-button-container">
					<ResumeGameButton />
				</div>
			</footer>
		</div>
	</div>
	</div>
</div>

<style>
	.page-container {
		width: 100%;
		height: 100%;
	}
	
	.mobile-header {
		display: none;
	}
	
	@media (max-width: 768px) {
		.page-container {
			overflow-y: auto;
			height: 100vh;
		}
		
		.mobile-header {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 3rem 0.5rem 0 0.5rem;
			gap: 0.5rem;
			background: #000;
		}
		
		.arcade-screen {
			height: auto;
			min-height: calc(100vh - 8rem);
		}
	}
	
	:global(body) {
		overflow: hidden;
		height: 100vh;
		overscroll-behavior: none;
	}

	.arcade-screen {
		height: 100vh;
		background: #000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		font-family: 'Courier New', monospace;
		overflow: hidden;
	}

	.screen-border {
		background: #1a1a1a;
		border: 8px solid #333;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 
			inset 0 0 50px rgba(0, 0, 0, 0.5),
			0 0 30px rgba(255, 255, 0, 0.2);
		max-width: 900px;
		width: 100%;
		max-height: calc(100vh - 2rem);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.screen-content {
		background: #000;
		border: 4px solid #444;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;
		overflow: hidden;
	}

	.arcade-header {
		color: #ffff00;
		margin-bottom: 2rem;
		text-align: center;
		font-size: 0.875rem;
		line-height: 1.4;
		flex-shrink: 0;
	}

	.header-title {
		letter-spacing: 1px;
	}

	.display-area {
		display: grid;
		grid-template-columns: 1fr 1.5fr;
		gap: 1.5rem;
		margin-bottom: 2rem;
		flex: 1;
		min-height: 0;
		overflow: hidden;
	}

	.left-column {
		display: flex;
		flex-direction: column;
		min-height: 0;
		overflow: hidden;
	}

	.right-column {
		display: flex;
		flex-direction: column;
		min-height: 0;
		overflow: hidden;
	}

	.select-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.select-item {
		background: transparent;
		border: none;
		color: #aaa;
		padding: 0.75rem 1rem;
		text-align: left;
		font-family: 'Courier New', monospace;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.select-item.selected {
		color: #ffff00;
		background: rgba(255, 255, 0, 0.1);
		border-left: 4px solid #ffff00;
	}

	.select-item:hover {
		color: #fff;
	}

	.selector {
		color: #ffff00;
		font-weight: bold;
		width: 1rem;
	}

	.job-number {
		color: #888;
		font-size: 0.875rem;
	}

	.job-title {
		flex: 1;
	}

	.details-panel {
		background: rgba(255, 255, 0, 0.05);
		border: 2px solid #ffff00;
		padding: 1.5rem;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.scroll-indicator {
		position: absolute;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		pointer-events: none;
		z-index: 10;
	}

	.scroll-arrow {
		display: block;
		color: #ffff00;
		font-size: 1.5rem;
		animation: scroll-pulse 2s ease-in-out infinite;
		text-shadow: 0 0 10px #ffff00, 0 0 20px #ffff00;
	}

	@keyframes scroll-pulse {
		0%, 100% {
			opacity: 0.3;
			transform: translateY(0);
		}
		50% {
			opacity: 1;
			transform: translateY(4px);
		}
	}

	.panel-border {
		border-left: 4px solid #ffff00;
		padding-left: 1rem;
		overflow-y: auto;
		flex: 1;
		min-height: 0;
	}

	.panel-border::-webkit-scrollbar {
		width: 6px;
	}

	.panel-border::-webkit-scrollbar-track {
		background: transparent;
	}

	.panel-border::-webkit-scrollbar-thumb {
		background: #ffff00;
		border-radius: 3px;
	}

	.detail-header {
		margin-bottom: 1.5rem;
	}

	.company-name {
		color: #fff;
		font-size: 1.25rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.meta-info {
		color: #aaa;
		font-size: 0.875rem;
	}

	.separator {
		margin: 0 0.5rem;
	}

	.achievements {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.achievement-item {
		color: #ccc;
		font-size: 0.9375rem;
		line-height: 1.5;
	}

	.arcade-footer {
		border-top: 2px solid #444;
		padding-top: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		flex-shrink: 0;
	}

	.counter {
		color: #ffff00;
		font-size: 0.875rem;
		text-align: center;
	}

	.navigation-controls {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		width: 100%;
	}

	.control-btn {
		background: #222;
		border: 2px solid #666;
		color: #ffff00;
		padding: 0.75rem 1rem;
		font-family: 'Courier New', monospace;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.control-btn:hover:not(:disabled) {
		background: #333;
		border-color: #ffff00;
		box-shadow: 0 0 10px rgba(255, 255, 0, 0.3);
	}

	.control-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.resume-button-container {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	@media (max-width: 768px) {
		.arcade-screen {
			padding: 0.5rem;
		}
		
		.screen-border {
			padding: 0.75rem;
			border-width: 4px;
		}

		.screen-content {
			padding: 0.75rem;
		}

		.arcade-header {
			font-size: 0.65rem;
			margin-bottom: 1rem;
		}

		.display-area {
			grid-template-columns: 1fr;
			max-height: none;
			gap: 1rem;
		}

		.left-column {
			max-height: 200px;
			overflow-y: auto;
		}
		
		.right-column {
			overflow-y: auto;
			max-height: 300px;
		}

		.select-item {
			font-size: 0.8125rem;
			padding: 0.5rem 0.75rem;
			gap: 0.5rem;
		}

		.company-name {
			font-size: 0.9375rem;
		}

		.achievement-item {
			font-size: 0.8125rem;
			line-height: 1.5;
		}

		.arcade-footer {
			gap: 0.75rem;
		}

		.navigation-controls {
			gap: 0.75rem;
		}

		.control-btn {
			padding: 0.875rem 1rem;
			font-size: 0.9375rem;
			touch-action: manipulation;
		}

		.counter {
			font-size: 0.8125rem;
		}
	}
</style>
