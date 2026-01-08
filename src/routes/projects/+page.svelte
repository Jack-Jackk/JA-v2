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
	
	const projects = [
		{
			title: "JunePoint",
			role: "Co-Founder / Full Stack Developer",
			status: "ACTIVE",
			date: "2024 - Present",
			description: "Cross-platform development agency building beautiful apps for iOS, Android, and web using modern technologies like React Native, Expo, and cloud infrastructure",
			highlights: [
				"Personal & business websites with React and TailwindCSS",
				"Full-stack cross-platform mobile apps with React Native & Expo",
				"Video games using Godot and Unreal Engine",
				"Photo galleries with cloud storage integration"
			],
			tech: ["React", "React Native", "Expo", "Node.js", "TypeScript", "NeonDB", "Google Cloud"],
			link: "https://junepoint.com"
		},
		{
			title: "Unnamed Project",
			role: "Founder / Full Stack Developer",
			status: "IN DEVELOPMENT",
			date: "2023 - Present",
			description: "Platform connecting creators to customers through innovative algorithms",
			highlights: [
				"Infrastructure to intelligently serve customers and creators",
				"Optimized user experience algorithms",
				"Easy-to-use interfaces and social experiences"
			],
			tech: ["React Native", "Node.js", "PostgreSQL", "Express"]
		},
		{
			title: "iCO Emergency",
			role: "Lead Developer / Project Manager",
			status: "BETA",
			date: "2023 - Present",
			description: "Automated safety monitoring that alerts trusted contacts when you need help most. Set & forget emergency tracking with GPS, crash detection, and privacy-first design",
			highlights: [
				"Automated SMS alerts with location history access",
				"Advanced crash detection and alert system",
				"Privacy-first: locations deleted after check-in",
				"Scalable infrastructure for fluctuating MAUs"
			],
			tech: ["React Native", "Expo", "Google Cloud", "NeonDB"],
			link: "https://icoemergency.com"
		},
		{
			title: "Burn Journal",
			role: "Lead Developer",
			status: "ACTIVE",
			date: "2025",
			description: "A therapeutic journaling app where writing meets release. Features Quick Notes, Weekly/Monthly journals with unique burn animation for emotional catharsis",
			highlights: [
				"Open-Source journaling platform",
				"Completely free with zero data collection",
				"Unique scramble & burn feature for letting go",
				"Daily tasks and progress tracking"
			],
			tech: ["Expo", "React Native", "EAS"],
			link: "https://burnjournals.com"
		},
		{
			title: "JAC-MAN",
			role: "Front-End Developer",
			status: "ACTIVE",
			date: "2025",
			description: "Retro arcade style display of achievements.",
			highlights: [
				"First Svelte Project",
				"Smooth Animations",
				"Unique experience and navigation"
			],
			tech: ["Svelte", "Javascript", "HTML", "CSS"]
		}
	];
	
	function moveUp() {
		if (selectedIndex > 0) {
			selectedIndex--;
		}
	}
	
	function moveDown() {
		if (selectedIndex < projects.length - 1) {
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
				<div class="header-title">║           PROJECT DATABASE - SELECT FILE         ║</div>
				<div class="header-line">╚════════════════════════════════════════════════════╝</div>
			</header>

			<!-- Main Display -->
			<main class="display-area">
				<!-- Left Column: Project Select List -->
				<div class="left-column">
					<div class="select-list">
						{#each projects as project, i}
							<button 
								class="select-item" 
								class:selected={i === selectedIndex}
								onclick={() => selectedIndex = i}
							>
								<span class="selector">{i === selectedIndex ? '►' : ' '}</span>
								<span class="project-number">[{i + 1}]</span>
								<span class="project-title">{project.title}</span>
								<span class="status-badge {project.status.toLowerCase().replace(/\s+/g, '-')}">{project.status}</span>
							</button>
						{/each}
					</div>
				</div>

				<!-- Right Column: Details Panel -->
				<div class="right-column">
					<div class="details-panel">
						<div class="panel-border">
							<div class="detail-header">
								<div class="project-name">{projects[selectedIndex].title}</div>
								<div class="meta-info">
									<span class="role">{projects[selectedIndex].role}</span>
									<span class="separator">|</span>
									<span>{projects[selectedIndex].date}</span>
								</div>
							</div>
							
							<div class="description">{projects[selectedIndex].description}</div>
							
							{#if projects[selectedIndex].link}
								<div class="project-link">
									<span class="link-icon">🔗</span>
									<a href={projects[selectedIndex].link} target="_blank" rel="noopener noreferrer" class="link-url">
										{projects[selectedIndex].link}
									</a>
								</div>
							{/if}
							
							<div class="highlights">
								{#each projects[selectedIndex].highlights as highlight}
									<div class="highlight-item">• {highlight}</div>
								{/each}
							</div>
							
							<div class="tech-stack">
								<span class="tech-label">TECH:</span>
								{#each projects[selectedIndex].tech as tech}
									<span class="tech-badge">{tech}</span>
								{/each}
							</div>
						</div>					<div class="scroll-indicator">
						<span class="scroll-arrow">▼</span>
					</div>					</div>
				</div>
			</main>

			<!-- Controls Footer -->
			<footer class="arcade-footer">
				<div class="counter">PROJECT: {selectedIndex + 1}/{projects.length}</div>
				<div class="navigation-controls">
					<button class="control-btn nav-left" onclick={moveUp} disabled={selectedIndex === 0}>
						▲ UP
					</button>
					<button class="control-btn nav-right" onclick={moveDown} disabled={selectedIndex === projects.length - 1}>
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

	.project-number {
		color: #888;
		font-size: 0.875rem;
	}

	.project-title {
		flex: 1;
	}

	.status-badge {
		font-size: 0.75rem;
		padding: 0.125rem 0.5rem;
		border-radius: 2px;
	}

	.status-badge.active {
		background: rgba(0, 255, 0, 0.2);
		color: #0f0;
		border: 1px solid #0f0;
	}

	.status-badge.beta {
		background: rgba(255, 165, 0, 0.2);
		color: #ffa500;
		border: 1px solid #ffa500;
	}

	.status-badge.in-development {
		background: rgba(138, 43, 226, 0.2);
		color: #ba55d3;
		border: 1px solid #ba55d3;
	}

	.status-badge.completed {
		background: rgba(100, 100, 100, 0.2);
		color: #888;
		border: 1px solid #666;
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
		margin-bottom: 1rem;
	}

	.project-name {
		color: #fff;
		font-size: 1.25rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.meta-info {
		color: #aaa;
		font-size: 0.875rem;
	}

	.role {
		color: #ccc;
	}

	.separator {
		margin: 0 0.5rem;
	}

	.description {
		color: #ccc;
		font-size: 0.9375rem;
		margin-bottom: 1rem;
		line-height: 1.5;
	}

	.project-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
		padding: 0.75rem;
		background: rgba(255, 255, 0, 0.05);
		border: 1px solid #444;
		border-radius: 4px;
	}

	.link-icon {
		font-size: 1rem;
	}

	.link-url {
		color: #ffff00;
		text-decoration: none;
		font-size: 0.875rem;
		transition: all 0.2s;
	}

	.link-url:hover {
		color: #fff;
		text-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
	}

	.highlights {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.highlight-item {
		color: #aaa;
		font-size: 0.875rem;
		line-height: 1.4;
	}

	.tech-stack {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		align-items: center;
		padding-top: 1rem;
		border-top: 1px solid #444;
	}

	.tech-label {
		color: #888;
		font-size: 0.75rem;
		font-weight: bold;
	}

	.tech-badge {
		background: #222;
		color: #ffff00;
		padding: 0.25rem 0.5rem;
		font-size: 0.75rem;
		border: 1px solid #444;
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

		.project-name {
			font-size: 0.9375rem;
		}

		.description, .highlight-item {
			font-size: 0.8125rem;
			line-height: 1.5;
		}
		
		.tech-badge {
			font-size: 0.6875rem;
			padding: 0.125rem 0.375rem;
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
