<script>
	import ResumeGameButton from '$lib/components/ResumeGameButton.svelte';
	import GameStats from '$lib/components/GameStats.svelte';
	import PortfolioTutorial from '$lib/components/PortfolioTutorial.svelte';
	import { onMount } from 'svelte';
	
	let selectedIndex = $state(0);
	let selectListRef = $state(null);
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
	
	const achievements = [
		{
			title: "JRS CODING SCHOOL",
			category: "EDUCATION",
			type: "Full Stack Development",
			date: "2023",
			description: "Completed 480-hour intensive full stack development program",
			details: [
				"Full stack web development curriculum",
				"JavaScript, React, Node.js, databases",
				"Collaborative projects and agile methodology"
			]
		},
		{
			title: "OCEANSIDE COLLEGIATE ACADEMY",
			category: "EDUCATION",
			type: "High School",
			date: "2015 - 2019",
			description: "Advanced collegiate-level coursework",
			details: [
				"College-prep curriculum",
				"Advanced placement courses",
				"Academic excellence focus"
			]
		},
		{
			title: "CONNECTIONS ONLINE ACADEMY",
			category: "EDUCATION",
			type: "High School Diploma",
			date: "Completed",
			description: "Online high school completion program",
			details: [
				"Self-directed learning",
				"Flexible schedule management",
				"Strong time management skills"
			]
		},
		{
			title: "JAPANESE (日本語)",
			category: "LANGUAGE",
			type: "JLPT N3 Level",
			date: "Current",
			description: "Intermediate proficiency in Japanese language",
			details: [
				"Conversational fluency",
				"Kanji reading/writing (N3 level)"
			]
		},
		{
			title: "FRENCH (FRANÇAIS)",
			category: "LANGUAGE",
			type: "B1 Level",
			date: "Current",
			description: "Intermediate French language proficiency",
			details: [
				"Conversational ability",
				"Reading comprehension",
				"Basic writing skills"
			]
		},
		{
			title: "SPANISH (ESPAÑOL)",
			category: "LANGUAGE",
			type: "B1 Level",
			date: "Current",
			description: "Intermediate Spanish language proficiency",
			details: [
				"Conversational ability",
				"Travel communication",
				"Cultural understanding"
			]
		},
		{
			title: "Led iCO Migration from .NET MAUI to React Native",
			category: "ACHIEVEMENT",
			type: "Migration Success",
			date: "2024",
			description: "Rebuilt an app that took 3 years, in 3 months utilizing new technologies..",
			details: [
				"Reduced deployment time dramatically",
				"Automated testing integration",
				"Ensured compliance with HIPAA, GDPR, and other regulations. "
			]
		},
		{
			title: "Published a Production App",
			category: "ACHIEVEMENT",
			type: "Publishing Success",
			date: "2025",
			description: "Published Burn Journal on the App Store",
			details: [
				"Open-Source Software",
				"Completely Free for Life",
				"0 data collection , 0 recorded entries."
			]
		},
		{
			title: "FULL STACK MASTERY",
			category: "SKILL",
			type: "Technical Expertise",
			date: "Ongoing",
			description: "Comprehensive full-stack development skillset",
			details: [
				"React / React Native / Next.js",
				"Node.js / Express / PostgreSQL",
				"Three.js / HTML / CSS / JS"
			]
		},
		{
			title: "VESSEL OPERATIONS",
			category: "SKILL",
			type: "Marine Expertise",
			date: "2021 - 2023",
			description: "Professional maritime operations experience",
			details: [
				"Commercial vessel operation",
				"Safety protocols & compliance",
				"Navigation & seamanship"
			]
		},
		{
			title: "PROJECT LEADERSHIP",
			category: "SKILL",
			type: "Management",
			date: "Ongoing",
			description: "Leading technical team on complex projects",
			details: [
				"Agile methodology expertise",
				"Cross-functional collaboration",
				"Technical decision-making"
			]
		}
	];
	
	function moveUp() {
		if (selectedIndex > 0) {
			selectedIndex--;
			scrollToSelected();
		}
	}
	
	function moveDown() {
		if (selectedIndex < filteredAchievements.length - 1) {
			selectedIndex++;
			scrollToSelected();
		}
	}
	
	function scrollToSelected() {
		// Wait for the next tick to ensure DOM is updated
		setTimeout(() => {
			const selectedButton = selectListRef?.querySelector('.select-item.selected');
			if (selectedButton) {
				selectedButton.scrollIntoView({ 
					behavior: 'smooth', 
					block: 'nearest',
					inline: 'nearest'
				});
			}
		}, 0);
	}
	
	// Group achievements by category for filter
	const categories = ['ALL', 'EDUCATION', 'LANGUAGE', 'ACHIEVEMENT', 'SKILL'];
	let selectedCategory = $state('ALL');
	
	let filteredAchievements = $derived(
		selectedCategory === 'ALL' 
			? achievements 
			: achievements.filter(a => a.category === selectedCategory)
	);
</script>

<ResumeGameButton />
<GameStats />

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

<div class="arcade-screen">
	<div class="screen-border">
		<div class="screen-content">
			<!-- Header -->
			<header class="arcade-header">
				<div class="header-line">╔════════════════════════════════════════════════════╗</div>
				<div class="header-title">║        ACHIEVEMENT RECORDS - ACCESS GRANTED      ║</div>
				<div class="header-line">╚════════════════════════════════════════════════════╝</div>
			</header>

			<!-- Category Filter -->
			<div class="category-filter">
				{#each categories as cat}
					<button 
						class="filter-btn" 
						class:active={selectedCategory === cat}
						onclick={() => { selectedCategory = cat; selectedIndex = 0; }}
					>
						{cat}
					</button>
				{/each}
			</div>

			<!-- Main Display -->
			<main class="display-area">
				<!-- Left Column: Achievement Select List -->
				<div class="left-column">
					<div class="select-list" bind:this={selectListRef}>
						{#each filteredAchievements as achievement, i}
							<button 
								class="select-item" 
								class:selected={i === selectedIndex}
								onclick={() => selectedIndex = i}
							>
								<span class="selector">{i === selectedIndex ? '►' : ' '}</span>
								<span class="achievement-number">[{i + 1}]</span>
								<span class="achievement-title">{achievement.title}</span>
								<span class="category-badge {achievement.category.toLowerCase()}">{achievement.category}</span>
							</button>
						{/each}
					</div>
				</div>

				<!-- Right Column: Details Panel -->
				<div class="right-column">
					<div class="details-panel">
						<div class="panel-border">
							<div class="detail-header">
								<div class="achievement-name">{filteredAchievements[selectedIndex].title}</div>
								<div class="meta-info">
									<span class="type">{filteredAchievements[selectedIndex].type}</span>
									<span class="separator">|</span>
									<span>{filteredAchievements[selectedIndex].date}</span>
								</div>
							</div>
							
							<div class="description">{filteredAchievements[selectedIndex].description}</div>
							
							<div class="details">
								{#each filteredAchievements[selectedIndex].details as detail}
									<div class="detail-item">▸ {detail}</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</main>

			<!-- Controls Footer -->
			<footer class="arcade-footer">
				<div class="controls">
					<button class="control-btn" onclick={moveUp} disabled={selectedIndex === 0}>
						▲ UP
					</button>
					<span class="control-hint">USE ↑↓ OR W/S TO NAVIGATE</span>
					<button class="control-btn" onclick={moveDown} disabled={selectedIndex === filteredAchievements.length - 1}>
						▼ DOWN
					</button>
				</div>
				<div class="counter">RECORD: {selectedIndex + 1}/{filteredAchievements.length}</div>
			</footer>
		</div>
	</div>
</div>

<style>
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
		margin-bottom: 1.5rem;
		text-align: center;
		font-size: 0.875rem;
		line-height: 1.4;
		flex-shrink: 0;
	}

	.header-title {
		letter-spacing: 1px;
	}

	.category-filter {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 2px solid #444;
		flex-wrap: wrap;
		flex-shrink: 0;
	}

	.filter-btn {
		background: #222;
		border: 2px solid #666;
		color: #888;
		padding: 0.5rem 1rem;
		font-family: 'Courier New', monospace;
		font-size: 0.75rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.filter-btn.active {
		background: #333;
		border-color: #ffff00;
		color: #ffff00;
		box-shadow: 0 0 10px rgba(255, 255, 0, 0.3);
	}

	.filter-btn:hover {
		border-color: #ffff00;
		color: #ffff00;
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
		overflow-y: auto;
		padding-right: 0.5rem;
	}

	.select-list::-webkit-scrollbar {
		width: 6px;
	}

	.select-list::-webkit-scrollbar-track {
		background: #1a1a1a;
	}

	.select-list::-webkit-scrollbar-thumb {
		background: #ffff00;
		border-radius: 3px;
	}

	.select-item {
		background: transparent;
		border: none;
		color: #aaa;
		padding: 0.75rem 1rem;
		text-align: left;
		font-family: 'Courier New', monospace;
		font-size: 0.9375rem;
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

	.achievement-number {
		color: #888;
		font-size: 0.75rem;
	}

	.achievement-title {
		flex: 1;
		font-size: 0.875rem;
	}

	.category-badge {
		font-size: 0.625rem;
		padding: 0.125rem 0.5rem;
		border-radius: 2px;
	}

	.category-badge.education {
		background: rgba(0, 100, 255, 0.2);
		color: #6af;
		border: 1px solid #6af;
	}

	.category-badge.language {
		background: rgba(100, 200, 100, 0.2);
		color: #8f8;
		border: 1px solid #8f8;
	}

	.category-badge.achievement {
		background: rgba(255, 200, 0, 0.2);
		color: #fc0;
		border: 1px solid #fc0;
	}

	.category-badge.skill {
		background: rgba(200, 100, 255, 0.2);
		color: #c8f;
		border: 1px solid #c8f;
	}

	.details-panel {
		background: rgba(255, 255, 0, 0.05);
		border: 2px solid #ffff00;
		padding: 1.5rem;
		overflow: hidden;
		display: flex;
		flex-direction: column;
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

	.achievement-name {
		color: #fff;
		font-size: 1.25rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.meta-info {
		color: #aaa;
		font-size: 0.875rem;
	}

	.type {
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

	.details {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.detail-item {
		color: #aaa;
		font-size: 0.875rem;
		line-height: 1.4;
	}

	.arcade-footer {
		border-top: 2px solid #444;
		padding-top: 1rem;
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 1rem;
		flex-shrink: 0;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.control-btn {
		background: #222;
		border: 2px solid #666;
		color: #ffff00;
		padding: 0.5rem 1rem;
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

	.control-hint {
		color: #888;
		font-size: 0.75rem;
	}

	.counter {
		color: #ffff00;
		font-size: 0.875rem;
	}

	@media (max-width: 768px) {
		.screen-border {
			padding: 1rem;
		}

		.screen-content {
			padding: 1rem;
		}

		.arcade-header {
			font-size: 0.75rem;
		}

		.category-filter {
			gap: 0.25rem;
		}

		.filter-btn {
			font-size: 0.625rem;
			padding: 0.375rem 0.75rem;
		}

		.display-area {
			grid-template-columns: 1fr;
			max-height: none;
		}

		.left-column {
			max-height: 250px;
		}

		.select-item {
			font-size: 0.8125rem;
			padding: 0.5rem;
		}

		.achievement-title {
			font-size: 0.75rem;
		}

		.achievement-name {
			font-size: 1rem;
		}

		.description, .detail-item {
			font-size: 0.8125rem;
		}

		.arcade-footer {
			grid-template-columns: 1fr;
		}

		.controls {
			flex-direction: column;
			width: 100%;
		}

		.control-btn {
			width: 100%;
		}

		.counter {
			text-align: center;
		}
	}
</style>
