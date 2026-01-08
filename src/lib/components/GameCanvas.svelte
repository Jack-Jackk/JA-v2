<script>
	import { GRID_WIDTH, GRID_HEIGHT, CELL_SIZE, COLORS, MAZE_LAYOUT } from '$lib/game/constants.js';
	import Ghost from '$lib/components/Ghost.svelte';
	import Fruit from '$lib/components/Fruit.svelte';

	// Props from parent component
	let { player, ghosts, fruits, dots, isInvincible, isTeleporting, powerPellets, powerMode, maze = MAZE_LAYOUT } = $props();

	// Calculate total grid size
	const gridWidth = GRID_WIDTH * CELL_SIZE;
	const gridHeight = GRID_HEIGHT * CELL_SIZE;

	function getCellType(x, y) {
		if (y >= maze.length || x >= maze[0].length) return 0;
		return maze[y][x];
	}

	// Calculate Pacman mouth angle based on direction
	function getPacmanRotation() {
		// This will be used for CSS rotation in the future
		return 0;
	}
</script>

<div class="game-canvas-wrapper">
	<div
		class="game-canvas"
		style="
      position: relative;
      width: {gridWidth}px;
      height: {gridHeight}px;
      display: grid;
      grid-template-columns: repeat({GRID_WIDTH}, {CELL_SIZE}px);
      grid-template-rows: repeat({GRID_HEIGHT}, {CELL_SIZE}px);
      background-color: {COLORS.BACKGROUND};
    "
	>
		<!-- Render maze cells -->
		{#each Array(GRID_HEIGHT) as _, y}
			{#each Array(GRID_WIDTH) as _, x}
				{@const cellType = getCellType(x, y)}
				{@const hasDot = dots[y] && dots[y][x]}
				<div
					class="cell"
					class:wall={cellType === 1}
					class:dot={hasDot}
					class:path={cellType === 0}
					style="
            background-color: {cellType === 1 ? COLORS.WALL : COLORS.BACKGROUND};
          "
				>
					{#if hasDot}
						<div class="dot-pellet"></div>
					{/if}
				</div>
			{/each}
		{/each}

		<!-- Render power pellets -->
		{#each powerPellets as pellet}
			{#if pellet.active}
				<div
					class="power-pellet"
					style="
            position: absolute;
            left: {pellet.x * CELL_SIZE + CELL_SIZE / 2 - 8}px;
            top: {pellet.y * CELL_SIZE + CELL_SIZE / 2 - 8}px;
            width: 16px;
            height: 16px;
            background: radial-gradient(circle, #FFFF00 0%, #FFB8AE 50%, #FF6B6B 100%);
            border-radius: 50%;
            box-shadow: 0 0 20px #FFFF00, 0 0 10px #FFB8AE;
            animation: power-pulse 0.5s ease-in-out infinite;
            z-index: 5;
          "
				></div>
			{/if}
		{/each}

		<!-- Render Pacman player -->
		<div
			class="pacman"
			class:invincible={isInvincible}
			class:teleporting={isTeleporting}
			style="
        position: absolute;
        left: {player.x * CELL_SIZE}px;
        top: {player.y * CELL_SIZE}px;
        width: {CELL_SIZE}px;
        height: {CELL_SIZE}px;
        transition: left 0.15s linear, top 0.15s linear;
        z-index: 10;
      "
		>
			<div
				class="pacman-body"
				style="
          width: {CELL_SIZE * 0.9}px;
          height: {CELL_SIZE * 0.9}px;
          background: {COLORS.PACMAN};
          border-radius: 50%;
          position: relative;
          margin: {CELL_SIZE * 0.05}px;
          box-shadow: 0 0 {CELL_SIZE / 2}px {COLORS.PACMAN}88;
          animation: pacman-chomp 0.3s steps(2) infinite;
        "
			></div>
		</div>

		<!-- Render ghosts -->
		{#each ghosts as ghost}
			{#if !ghost.eaten}
				<Ghost {ghost} cellSize={CELL_SIZE} color={ghost.color} vulnerable={ghost.vulnerable} teleporting={ghost.teleporting} />
			{/if}
		{/each}

		<!-- Render fruits -->
		{#each fruits as fruit}
			{#if fruit.active}
				<div
					class="fruit"
					style="
						position: absolute;
						left: {fruit.x * CELL_SIZE}px;
						top: {fruit.y * CELL_SIZE}px;
						width: {CELL_SIZE}px;
						height: {CELL_SIZE}px;
						display: flex;
						align-items: center;
						justify-content: center;
						z-index: 10;
					"
				>
					<div
						class="fruit-container"
						style="
							width: {CELL_SIZE * 0.8}px;
							height: {CELL_SIZE * 0.8}px;
							background: radial-gradient(circle, #1a1a2e 0%, #0f0f1e 70%, #000000 100%);
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
							box-shadow: 0 0 {CELL_SIZE / 2}px {fruit.color}, 0 0 {CELL_SIZE}px {fruit.color}88;
							border: 2px solid {fruit.color};
							animation: fruit-pulse 1.5s ease-in-out infinite;
						"
					>
						<span
							class="fruit-emoji"
							style="
								font-size: {CELL_SIZE * 0.8}px;
								filter: drop-shadow(0 0 4px {fruit.color});
								color: {fruit.color};
								font-weight: bold;
								font-family: 'Courier New', monospace;
								text-shadow: 0 0 8px {fruit.color};
							"
						>
							{fruit.label}
						</span>
					</div>
					<div
						class="fruit-label"
						style="
							position: absolute;
							bottom: -{CELL_SIZE * 0.3}px;
							font-size: {CELL_SIZE * 0.4}px;
							font-weight: bold;
							color: white;
							text-shadow: 0 0 4px {fruit.color}, 0 0 8px {fruit.color};
							animation: float 2s ease-in-out infinite;
						"
					>
						{fruit.label}
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.game-canvas-wrapper {
		display: inline-block;
		border: 3px solid #000;
		box-shadow: 0 0 0 3px #000;
	}

	.cell {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.cell.wall {
		background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
		box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.5);
	}

	.cell.dot {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.fruit {
		pointer-events: none;
	}

	.fruit-container {
		animation: fruit-pulse 1.5s ease-in-out infinite;
	}

	@keyframes fruit-pulse {
		0%, 100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.1);
			opacity: 0.9;
		}
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-3px);
		}
	}

	.dot-pellet {
		width: 3px;
		height: 3px;
		background: #FFB8AE;
		border-radius: 50%;
		box-shadow: 0 0 4px #FFB8AE;
	}

	.game-canvas {
		margin: 0 auto;
		overflow: visible;
	}

	.pacman {
		pointer-events: none;
	}

	.pacman.invincible {
		animation: flash 0.2s ease-in-out infinite;
	}

	.pacman.teleporting {
		opacity: 0;
	}

	.pacman-body {
		animation: pacman-chomp 0.3s steps(2) infinite;
	}

	@keyframes flash {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.3;
		}
	}

	@keyframes power-pulse {
		0%, 100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.3);
			opacity: 0.7;
		}
	}

	@keyframes pacman-chomp {
		0% {
			clip-path: polygon(
				50% 50%,
				0% 0%,
				0% 100%,
				100% 100%,
				100% 0%,
				50% 50%,
				100% 0%
			);
		}
		50% {
			clip-path: polygon(
				50% 50%,
				0% 10%,
				0% 90%,
				100% 90%,
				100% 10%,
				50% 50%,
				100% 10%
			);
		}
	}
</style>
