<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import GameCanvas from '$lib/components/GameCanvas.svelte';
	import GameTutorial from '$lib/components/GameTutorial.svelte';
	import {
		INITIAL_PLAYER_POSITION,
		INITIAL_DIRECTION,
		GAME_SPEED,
		GHOST_SPEED,
		GHOST_CHASE_RANGE,
		KEY_MAPPINGS,
		FRUITS,
		GHOST_START_POSITIONS,
		COLORS,
		DIRECTIONS,
		MAZE_LAYOUT,
		DOT_POINTS,
		TELEPORT_RIGHT,
		TELEPORT_LEFT,
		INITIAL_LIVES,
		RESPAWN_POSITION,
		INVINCIBILITY_DURATION,
		POWER_PELLET_DURATION,
		POWER_PELLET_RESPAWN_TIME,
		GHOST_EAT_POINTS,
		POWER_PELLET_POSITIONS
	} from '$lib/game/constants.js';
	import { checkWallCollision, checkGhostCollision } from '$lib/game/collision.js';
	import { 
		isIntersection, 
		canContinueDirection, 
		getRandomDirection,
		getDirectionToward,
		manhattanDistance
	} from '$lib/game/maze.js';
	import { generateRandomMaze, getAllValidPositionsFromMaze } from '$lib/game/mazeGenerator.js';

	// Game state using Svelte 5 runes
	let gameStarted = $state(false);
	let showTutorial = $state(false);
	let player = $state({ ...INITIAL_PLAYER_POSITION });
	let direction = $state(null); // Start with null direction (no movement)
	let nextDirection = $state(null);
	let lastDirection = $state(null);
	let isGameOver = $state(false);
	let isPaused = $state(false);
	let score = $state(0);
	let lives = $state(INITIAL_LIVES);
	let isInvincible = $state(false);
	let isTeleporting = $state(false);
	let invincibilityTimeout = $state(null);
	let gameLoopId = $state(null);
	let ghostLoopId = $state(null);
	let fruitsCollectedCount = $state(0); // Track how many fruits collected
	
	// High score system
	let showNameEntry = $state(false);
	let nameEntry = $state(['A', 'A', 'A']);
	let nameEntryPosition = $state(0);
	let leaderboard = $state([
		{ name: 'ACE', score: 15420 },
		{ name: 'BIT', score: 12890 },
		{ name: 'CPU', score: 10560 }
	]);

	// Power pellet state
	let powerMode = $state(false);
	let powerModeTimeout = $state(null);
	let powerPelletRespawnTimeout = $state(null);
	let fruitRespawnTimeout = $state(null);
	
	// Randomized maze mode
	let isRandomMazeMode = $state(false);
	let currentMaze = $state(MAZE_LAYOUT);
	let highlightedNav = $state(null); // Track which nav link to highlight
	let navHighlightTimeout = $state(null);
	
	// Check if position is in unreachable area
	function isUnreachablePosition(x, y) {
		// Top-left unreachable area: (0,8) to (4,8) and (0,12) to (4,12)
		if (x >= 0 && x <= 4 && (y === 8 || y === 12)) {
			return true;
		}
		// Top-right unreachable area: (23,8) to (27,8) and (23,12) to (27,12)
		if (x >= 23 && x <= 27 && (y === 8 || y === 12)) {
			return true;
		}
		return false;
	}
	
	// Get all valid (non-wall) positions for power pellets
	function getAllValidPositions() {
		const validPositions = [];
		const mazeToUse = currentMaze;
		for (let y = 0; y < mazeToUse.length; y++) {
			for (let x = 0; x < mazeToUse[y].length; x++) {
				// Add position if it's not a wall (0 or 2)
				// In random maze mode, no positions are unreachable
				if (mazeToUse[y][x] !== 1 && (isRandomMazeMode || !isUnreachablePosition(x, y))) {
					validPositions.push({ x, y });
				}
			}
		}
		return validPositions;
	}
	
	// Initialize with one random power pellet in any valid position
	function getRandomPowerPellet() {
		const validPositions = getAllValidPositions();
		const randomIndex = Math.floor(Math.random() * validPositions.length);
		const selectedPosition = validPositions[randomIndex];
		
		return [{
			...selectedPosition,
			id: 0,
			active: true
		}];
	}
	
	let powerPellets = $state(getRandomPowerPellet());

	// Dots state - create a 2D array tracking which dots are collected
	let dots = $state(initializeDots());

	// Initialize dots from maze layout
	function initializeDots() {
		return currentMaze.map(row => row.map(cell => cell === 2));
	}

	// Count remaining dots
	function countRemainingDots() {
		return dots.flat().filter(dot => dot).length;
	}

	// Initialize fruits with random positions
	function initializeFruits() {
		const validPositions = getAllValidPositions();
		const fruitArray = [];
		
		Object.entries(FRUITS).forEach(([key, fruit]) => {
			// Find a position that's at least 7 cells away from all other fruits
			let position;
			let attempts = 0;
			const maxAttempts = 1000;
			
			do {
				const randomIndex = Math.floor(Math.random() * validPositions.length);
				position = validPositions[randomIndex];
				attempts++;
				
				// Check if this position is at least 7 cells away from all existing fruits
				const isFarEnough = fruitArray.every(existingFruit => {
					const dx = Math.abs(position.x - existingFruit.x);
					const dy = Math.abs(position.y - existingFruit.y);
					const distance = Math.max(dx, dy); // Chebyshev distance (diagonal included)
					return distance >= 7;
				});
				
				if (isFarEnough || attempts >= maxAttempts) {
					break;
				}
			} while (true);
			
			fruitArray.push({ 
				...fruit, 
				x: position.x, 
				y: position.y, 
				active: true,
				id: key
			});
		});
		
		return fruitArray;
	}
	
	// Save game state to sessionStorage
	function saveGameState() {
		const gameState = {
			player,
			direction,
			nextDirection,
			lastDirection,
			score,
			lives,
			isInvincible,
			dots,
			fruits,
			ghosts,
			powerPellets,
			powerMode,
			fruitsCollectedCount
		};
		sessionStorage.setItem('pacmanGameState', JSON.stringify(gameState));
	}
	
	// Restore game state from sessionStorage
	function restoreGameState() {
		const savedState = sessionStorage.getItem('pacmanGameState');
		if (savedState) {
			const gameState = JSON.parse(savedState);
			player = gameState.player;
			direction = gameState.direction;
			nextDirection = gameState.nextDirection;
			lastDirection = gameState.lastDirection;
			score = gameState.score;
			lives = gameState.lives;
			isInvincible = gameState.isInvincible;
			dots = gameState.dots;
			fruits = gameState.fruits;
			ghosts = gameState.ghosts;
			powerPellets = gameState.powerPellets;
			powerMode = gameState.powerMode;
			fruitsCollectedCount = gameState.fruitsCollectedCount;
			
			// Clear the saved state
			sessionStorage.removeItem('pacmanGameState');
			
			// Resume game
			gameStarted = true;
			isPaused = false;
			
			// Activate power mode when returning from a fruit page
			activatePowerMode();
			
			// Restart game loops
			if (gameLoopId) clearInterval(gameLoopId);
			if (ghostLoopId) clearInterval(ghostLoopId);
			gameLoopId = setInterval(gameLoop, GAME_SPEED);
			ghostLoopId = setInterval(ghostLoop, GHOST_SPEED);
			
			return true;
		}
		return false;
	}
	
	// Fruits state (track which are collected) - random positions
	let fruits = $state(initializeFruits());

	// Ghosts state (each ghost has position, color, current direction, and vulnerability)
	let ghosts = $state(
		GHOST_START_POSITIONS.map((pos, index) => ({
			...pos,
			id: index,
			color: [COLORS.GHOST_RED, COLORS.GHOST_PINK, COLORS.GHOST_CYAN, COLORS.GHOST_ORANGE][index],
			direction: ['UP', 'DOWN', 'LEFT', 'RIGHT'][index], // Each starts with different direction
			vulnerable: false,
			eaten: false,
			teleporting: false
		}))
	);

	// Player game loop
	function gameLoop() {
		if (isPaused || isGameOver || !gameStarted) return;
		
		// Don't move if direction is null (game just started)
		if (direction === null) return;

	// Try to turn to the next direction if it's valid
	const nextDirVector = DIRECTIONS[nextDirection];
	const testX = player.x + nextDirVector.x;
	const testY = player.y + nextDirVector.y;
	
	// Only change direction if the next direction is not a wall
	if (!checkWallCollision(testX, testY, currentMaze)) {
		direction = nextDirection;
	}

	// Calculate new position in current direction
	const dirVector = DIRECTIONS[direction];
	let newX = player.x + dirVector.x;
	let newY = player.y + dirVector.y;

	// Check for teleportation
	if (newX === TELEPORT_RIGHT.x && newY === TELEPORT_RIGHT.y) {
		isTeleporting = true;
		newX = TELEPORT_LEFT.x;
		setTimeout(() => { isTeleporting = false; }, 100);
	} else if (newX === TELEPORT_LEFT.x && newY === TELEPORT_LEFT.y) {
		isTeleporting = true;
		newX = TELEPORT_RIGHT.x;
		setTimeout(() => { isTeleporting = false; }, 100);
	}

	// Check wall collision
	if (checkWallCollision(newX, newY, currentMaze)) {
		// Can't move, stay in place
		return;
	}		// Update player position
		player = { x: newX, y: newY };

		// Check dot collection
		if (dots[player.y] && dots[player.y][player.x]) {
			dots[player.y][player.x] = false;
			score += DOT_POINTS;

			// Check if all dots collected
			if (countRemainingDots() === 0) {
				// Refill all dots
				dots = initializeDots();
			}
		}

		// Check power pellet collection
		powerPellets.forEach(pellet => {
			if (pellet.active && pellet.x === player.x && pellet.y === player.y) {
				pellet.active = false;
				activatePowerMode();
			}
		});

		// Check fruit collision
		fruits.forEach(fruit => {
			if (fruit.active && fruit.x === player.x && fruit.y === player.y) {
				fruit.active = false;
				score += 1000; // Give 1000 points for fruit
				fruitsCollectedCount += 1;
				
				if (isRandomMazeMode) {
					// In random maze mode, just highlight the nav link
					highlightNavLink(fruit.id);
					
					// Check if all 3 fruits collected - respawn them
					if (fruitsCollectedCount >= 3) {
						// Clear any existing fruit respawn timeout
						if (fruitRespawnTimeout) {
							clearTimeout(fruitRespawnTimeout);
						}
						
						// Set 5 second timer to respawn all fruits
						fruitRespawnTimeout = setTimeout(() => {
							fruits = initializeFruits();
							fruitsCollectedCount = 0;
							fruitRespawnTimeout = null;
						}, 5000);
					}
				} else {
					// Normal mode - navigate to page
					// Check if all 3 fruits have been collected
					if (fruitsCollectedCount >= 3) {
						// Clear any existing fruit respawn timeout
						if (fruitRespawnTimeout) {
							clearTimeout(fruitRespawnTimeout);
						}
						
						// Check if all dots are also collected
						if (countRemainingDots() === 0) {
							// Game beaten! Switch to random maze mode
							activateRandomMazeMode();
							
							// Respawn fruits immediately in new maze
							fruits = initializeFruits();
							fruitsCollectedCount = 0;
							fruitRespawnTimeout = null;
							return; // Don't navigate
						}
						
						// Set 5 second timer to respawn all fruits
						fruitRespawnTimeout = setTimeout(() => {
							fruits = initializeFruits();
							fruitsCollectedCount = 0;
							fruitRespawnTimeout = null;
						}, 5000);
					}
					
					// Pause the game
					isPaused = true;
					
					// Clear intervals when paused
					if (gameLoopId) clearInterval(gameLoopId);
					if (ghostLoopId) clearInterval(ghostLoopId);
					
					// Save game state
					saveGameState();
					
					// Navigate to fruit's route
					goto(fruit.route);
				}
			}
		});

		// Check ghost collision
		if (!isInvincible) {
			ghosts.forEach(ghost => {
				if (ghost.x === player.x && ghost.y === player.y && !ghost.eaten) {
					if (powerMode && ghost.vulnerable) {
						// Eat the ghost
						eatGhost(ghost);
					} else if (!powerMode) {
						// Die
						handleDeath();
					}
				}
			});
		}
	}

	// Handle player death
	function handleDeath() {
		lives -= 1;

		if (lives <= 0) {
			// Game over
			isGameOver = true;
			
			// Clear invincibility on game over
			isInvincible = false;
			if (invincibilityTimeout) {
				clearTimeout(invincibilityTimeout);
				invincibilityTimeout = null;
			}
			
			// Check if score qualifies for leaderboard (over 4000)
			if (score > 4000) {
				showNameEntry = true;
			}
			
			// Respawn fruits in new random locations
			fruits = initializeFruits();
		} else {
			// Respawn player at new location
			player = { x: 13, y: 10 };
			direction = null;
			nextDirection = null;
			
			// Grant invincibility
			isInvincible = true;
			
			// Clear existing timeout if any
			if (invincibilityTimeout) {
				clearTimeout(invincibilityTimeout);
			}
			
			// Remove invincibility after duration
			invincibilityTimeout = setTimeout(() => {
				isInvincible = false;
			}, INVINCIBILITY_DURATION);
		}
	}

	// Activate random maze mode (game beaten)
	function activateRandomMazeMode() {
		isRandomMazeMode = true;
		
		// Generate new random maze
		currentMaze = generateRandomMaze();
		
		// Reset dots for new maze
		dots = initializeDots();
		
		// Reset player to center
		player = { x: 13, y: 15 };
		direction = null;
		nextDirection = null;
		
		// Reset ghosts
		ghosts = GHOST_START_POSITIONS.map((pos, index) => ({
			...pos,
			id: index,
			color: [COLORS.GHOST_RED, COLORS.GHOST_PINK, COLORS.GHOST_CYAN, COLORS.GHOST_ORANGE][index],
			direction: ['UP', 'DOWN', 'LEFT', 'RIGHT'][index],
			vulnerable: false,
			eaten: false,
			teleporting: false
		}));
		
		// Give bonus points for beating the game
		score += 5000;
	}
	
	// Highlight a nav link temporarily
	function highlightNavLink(fruitId) {
		// Map fruit ID to route
		const routeMap = {
			'experience': '/experience',
			'projects': '/projects',
			'achievements': '/achievements'
		};
		
		highlightedNav = routeMap[fruitId];
		
		// Clear existing timeout
		if (navHighlightTimeout) {
			clearTimeout(navHighlightTimeout);
		}
		
		// Clear highlight after 3 seconds
		navHighlightTimeout = setTimeout(() => {
			highlightedNav = null;
			navHighlightTimeout = null;
		}, 3000);
	}
	
	// Activate power mode
	function activatePowerMode() {
		powerMode = true;
		
		// Make all ghosts vulnerable
		ghosts = ghosts.map(ghost => ({ ...ghost, vulnerable: true }));
		
		// Clear existing timeout if any
		if (powerModeTimeout) {
			clearTimeout(powerModeTimeout);
		}
		
		// Deactivate power mode after duration
		powerModeTimeout = setTimeout(() => {
			powerMode = false;
			ghosts = ghosts.map(ghost => ({ ...ghost, vulnerable: false }));
			
			// Start 30 second timer to spawn new power pellet
			if (powerPelletRespawnTimeout) {
				clearTimeout(powerPelletRespawnTimeout);
			}
			
			powerPelletRespawnTimeout = setTimeout(() => {
				// Spawn a new power pellet in a random valid location
				const validPositions = getAllValidPositions();
				const randomIndex = Math.floor(Math.random() * validPositions.length);
				const newPosition = validPositions[randomIndex];
				
				powerPellets[0] = {
					...newPosition,
					id: 0,
					active: true
				};
			}, POWER_PELLET_RESPAWN_TIME);
		}, POWER_PELLET_DURATION);
	}

	// Eat a ghost
	function eatGhost(ghost) {
		score += GHOST_EAT_POINTS;
		ghost.eaten = true;
		ghost.vulnerable = false;
		
		// Respawn ghost at new location after delay
		setTimeout(() => {
			const ghostIndex = ghosts.findIndex(g => g.id === ghost.id);
			if (ghostIndex !== -1) {
				ghosts[ghostIndex] = {
					...ghosts[ghostIndex],
					x: 13,
					y: 10,
					eaten: false,
					vulnerable: powerMode
				};
			}
		}, 3000);
	}

	// Ghost AI loop - smooth movement with intersection-based decisions
	function ghostLoop() {
		if (isPaused || isGameOver || !gameStarted) return;

		ghosts = ghosts.map(ghost => {
			// Skip movement if ghost is eaten
			if (ghost.eaten) {
				return ghost;
			}

			// Calculate distance to player
			const distanceToPlayer = manhattanDistance(ghost.x, ghost.y, player.x, player.y);
		const isChasing = distanceToPlayer <= GHOST_CHASE_RANGE && !ghost.vulnerable;
		
		// Check if ghost is at an intersection
		const atIntersection = isIntersection(ghost.x, ghost.y, currentMaze);
		
		let newDirection = ghost.direction;
		
		if (atIntersection) {
			// At intersection: decide new direction
			if (isChasing) {
				// Chase mode: move toward player
				newDirection = getDirectionToward(ghost.x, ghost.y, player.x, player.y, ghost.direction, currentMaze);
			} else {
				// Random mode: pick random direction
				newDirection = getRandomDirection(ghost.x, ghost.y, ghost.direction, currentMaze);
			}
		} else {
			// Not at intersection: continue in current direction if possible
			if (!canContinueDirection(ghost.x, ghost.y, ghost.direction, currentMaze)) {
				// Hit a dead end or turn, pick a new valid direction
				newDirection = getRandomDirection(ghost.x, ghost.y, ghost.direction, currentMaze);
			}
		}			// Move ghost in the chosen direction
			const dirVector = DIRECTIONS[newDirection];
			let newX = ghost.x + dirVector.x;
			let newY = ghost.y + dirVector.y;
			let teleporting = false;

			// Check for ghost teleportation
			if (newX === TELEPORT_RIGHT.x && newY === TELEPORT_RIGHT.y) {
				teleporting = true;
				newX = TELEPORT_LEFT.x;
				setTimeout(() => {
					const idx = ghosts.findIndex(g => g.id === ghost.id);
					if (idx !== -1) ghosts[idx].teleporting = false;
				}, 100);
			} else if (newX === TELEPORT_LEFT.x && newY === TELEPORT_LEFT.y) {
				teleporting = true;
				newX = TELEPORT_RIGHT.x;
				setTimeout(() => {
					const idx = ghosts.findIndex(g => g.id === ghost.id);
					if (idx !== -1) ghosts[idx].teleporting = false;
				}, 100);
			}
			
		
		// Verify the move is valid (shouldn't hit walls with proper logic, but safety check)
		if (checkWallCollision(newX, newY, currentMaze)) {
			// If we somehow hit a wall, stay in place and reset direction next frame
			return { ...ghost, direction: 'UP' };
		}			return { 
				...ghost, 
				x: newX, 
				y: newY,
				direction: newDirection,
				teleporting
			};
		});

		// Check collision after ghost move
		if (!isInvincible) {
			ghosts.forEach(ghost => {
				if (ghost.x === player.x && ghost.y === player.y && !ghost.eaten) {
					if (powerMode && ghost.vulnerable) {
						eatGhost(ghost);
					} else if (!powerMode) {
						handleDeath();
					}
				}
			});
		}
	}

	// Touch gesture support
	let touchStartX = $state(0);
	let touchStartY = $state(0);
	let touchEndX = $state(0);
	let touchEndY = $state(0);
	const minSwipeDistance = 30; // Minimum distance for a swipe to register

	function handleTouchStart(event) {
		if (!gameStarted || showNameEntry) return;
		touchStartX = event.changedTouches[0].screenX;
		touchStartY = event.changedTouches[0].screenY;
	}

	function handleTouchEnd(event) {
		if (!gameStarted || showNameEntry) return;
		touchEndX = event.changedTouches[0].screenX;
		touchEndY = event.changedTouches[0].screenY;
		handleSwipe();
	}

	function handleSwipe() {
		const deltaX = touchEndX - touchStartX;
		const deltaY = touchEndY - touchStartY;
		const absX = Math.abs(deltaX);
		const absY = Math.abs(deltaY);

		// Check if swipe meets minimum distance
		if (absX < minSwipeDistance && absY < minSwipeDistance) return;

		// Determine swipe direction
		let swipeDirection = null;
		if (absX > absY) {
			// Horizontal swipe
			swipeDirection = deltaX > 0 ? 'right' : 'left';
		} else {
			// Vertical swipe
			swipeDirection = deltaY > 0 ? 'down' : 'up';
		}

		if (swipeDirection) {
			setDirection(swipeDirection);
		}
	}

	// Helper function to set direction (used by both keyboard and touch)
	function setDirection(newDirection) {
		const dirVector = DIRECTIONS[newDirection];
		const testX = player.x + dirVector.x;
		const testY = player.y + dirVector.y;
		
		// Only queue the direction if it's valid
		if (!checkWallCollision(testX, testY, currentMaze)) {
			lastDirection = newDirection;
			nextDirection = newDirection;
			
			// Set initial direction if this is first movement
			if (direction === null) {
				direction = newDirection;
			}
		}
		// Otherwise ignore the input
	}

	// Keyboard input handler
	function handleKeydown(event) {
		const key = event.key;

		// Handle name entry mode
		if (showNameEntry) {
			handleNameEntryInput(event);
			return;
		}

		// Don't handle input if game hasn't started
		if (!gameStarted) return;

		// Handle escape (return to start menu)
		if (key === 'Escape') {
			event.preventDefault();
			returnToStartMenu();
			return;
		}

		// Handle pause (spacebar)
		if (key === ' ') {
			event.preventDefault();
			togglePause();
			return;
		}

		// Handle restart (R key)
		if (key === 'r' || key === 'R') {
			event.preventDefault();
			restartGame();
			return;
		}

		// Handle direction change
		const mappedDirection = KEY_MAPPINGS[key];
		if (mappedDirection) {
			event.preventDefault();
			setDirection(mappedDirection);
		}
	}

	// Toggle pause
	function togglePause() {
		isPaused = !isPaused;
		
		if (isPaused) {
			// Clear intervals when paused
			if (gameLoopId) clearInterval(gameLoopId);
			if (ghostLoopId) clearInterval(ghostLoopId);
		} else {
			// Restart intervals when unpaused
			gameLoopId = setInterval(gameLoop, GAME_SPEED);
			ghostLoopId = setInterval(ghostLoop, GHOST_SPEED);
		}
	}
	
	// Return to start menu
	function returnToStartMenu() {
		// Stop game loops
		if (gameLoopId) clearInterval(gameLoopId);
		if (ghostLoopId) clearInterval(ghostLoopId);
		
		// Clear timeouts
		if (invincibilityTimeout) clearTimeout(invincibilityTimeout);
		if (powerModeTimeout) clearTimeout(powerModeTimeout);
		if (powerPelletRespawnTimeout) clearTimeout(powerPelletRespawnTimeout);
		if (fruitRespawnTimeout) clearTimeout(fruitRespawnTimeout);
		
		// Reset game state
		gameStarted = false;
		isGameOver = false;
		isPaused = false;
		showNameEntry = false;
	}
	
	// Handle name entry input
	function handleNameEntryInput(event) {
		const key = event.key;
		event.preventDefault();
		
		if (key === 'ArrowUp' || key === 'w' || key === 'W') {
			// Increment current letter
			const currentLetter = nameEntry[nameEntryPosition];
			const nextLetter = currentLetter === 'Z' ? 'A' : String.fromCharCode(currentLetter.charCodeAt(0) + 1);
			nameEntry[nameEntryPosition] = nextLetter;
		} else if (key === 'ArrowDown' || key === 's' || key === 'S') {
			// Decrement current letter
			const currentLetter = nameEntry[nameEntryPosition];
			const prevLetter = currentLetter === 'A' ? 'Z' : String.fromCharCode(currentLetter.charCodeAt(0) - 1);
			nameEntry[nameEntryPosition] = prevLetter;
		} else if (key === 'ArrowLeft' || key === 'a' || key === 'A') {
			// Move left
			nameEntryPosition = Math.max(0, nameEntryPosition - 1);
		} else if (key === 'ArrowRight' || key === 'd' || key === 'D') {
			// Move right
			nameEntryPosition = Math.min(2, nameEntryPosition + 1);
		} else if (key === 'Enter' || key === ' ') {
			// Submit name
			submitHighScore();
		}
	}
	
	// Submit high score
	function submitHighScore() {
		const playerName = nameEntry.join('');
		
		// Add to leaderboard
		leaderboard.push({ name: playerName, score });
		
		// Sort by score (descending)
		leaderboard.sort((a, b) => b.score - a.score);
		
		// Keep only top 10
		leaderboard = leaderboard.slice(0, 10);
		
		// Close name entry
		showNameEntry = false;
		nameEntry = ['A', 'A', 'A'];
		nameEntryPosition = 0;
	}

	// Show tutorial when user clicks start game
	function startGame() {
		showTutorial = true;
	}
	
	// Actually start the game after tutorial
	function beginGame() {
		showTutorial = false;
		gameStarted = true;
		player = { ...INITIAL_PLAYER_POSITION };
		direction = null;
		nextDirection = null;
		lastDirection = null;
		isGameOver = false;
		isPaused = false;
		score = 0;
		lives = INITIAL_LIVES;
		isInvincible = false;
		isTeleporting = false;
		powerMode = false;
		fruitsCollectedCount = 0;
		
		// Clear portfolio tutorial flag so it shows again when visiting portfolio pages
		sessionStorage.removeItem('portfolioTutorialShown');
		
		// Clear timeouts if they exist
		if (invincibilityTimeout) {
			clearTimeout(invincibilityTimeout);
			invincibilityTimeout = null;
		}
		if (powerModeTimeout) {
			clearTimeout(powerModeTimeout);
			powerModeTimeout = null;
		}
		if (powerPelletRespawnTimeout) {
			clearTimeout(powerPelletRespawnTimeout);
			powerPelletRespawnTimeout = null;
		}
		if (fruitRespawnTimeout) {
			clearTimeout(fruitRespawnTimeout);
			fruitRespawnTimeout = null;
		}

		// Reset power pellets to one random pellet
		powerPellets = getRandomPowerPellet();
		
		// Reset dots
		dots = initializeDots();
		
		// Reset fruits with new random positions
		fruits = initializeFruits();

		// Reset ghosts
		ghosts = GHOST_START_POSITIONS.map((pos, index) => ({
			...pos,
			id: index,
			color: [COLORS.GHOST_RED, COLORS.GHOST_PINK, COLORS.GHOST_CYAN, COLORS.GHOST_ORANGE][index],
			direction: ['UP', 'DOWN', 'LEFT', 'RIGHT'][index],
			vulnerable: false,
			eaten: false,
			teleporting: false
		}));

		// Start game loops
		if (gameLoopId) clearInterval(gameLoopId);
		if (ghostLoopId) clearInterval(ghostLoopId);
		gameLoopId = setInterval(gameLoop, GAME_SPEED);
		ghostLoopId = setInterval(ghostLoop, GHOST_SPEED);
		
		// Save initial game state so Resume Game button appears
		saveGameState();
	}

	// Restart game
	function restartGame() {
		player = { ...INITIAL_PLAYER_POSITION };
		direction = null;
		nextDirection = null;
		lastDirection = null;
		isGameOver = false;
		isPaused = false;
		showNameEntry = false;
		score = 0;
		lives = INITIAL_LIVES;
		isInvincible = false;
		isTeleporting = false;
		powerMode = false;
		fruitsCollectedCount = 0;
		
		// Clear timeouts if they exist
		if (invincibilityTimeout) {
			clearTimeout(invincibilityTimeout);
			invincibilityTimeout = null;
		}
		if (powerModeTimeout) {
			clearTimeout(powerModeTimeout);
			powerModeTimeout = null;
		}
		if (powerPelletRespawnTimeout) {
			clearTimeout(powerPelletRespawnTimeout);
			powerPelletRespawnTimeout = null;
		}
		if (fruitRespawnTimeout) {
			clearTimeout(fruitRespawnTimeout);
			fruitRespawnTimeout = null;
		}

		// Reset power pellets to one random pellet
		powerPellets = getRandomPowerPellet();
		
		// Reset dots
		dots = initializeDots();
		
		// Reset fruits with new random positions
		fruits = initializeFruits();

		// Reset ghosts
		ghosts = GHOST_START_POSITIONS.map((pos, index) => ({
			...pos,
			id: index,
			color: [COLORS.GHOST_RED, COLORS.GHOST_PINK, COLORS.GHOST_CYAN, COLORS.GHOST_ORANGE][index],
			direction: ['UP', 'DOWN', 'LEFT', 'RIGHT'][index],
			vulnerable: false,
			eaten: false,
			teleporting: false
		}));

		// Restart game loops
		if (gameLoopId) clearInterval(gameLoopId);
		if (ghostLoopId) clearInterval(ghostLoopId);
		gameLoopId = setInterval(gameLoop, GAME_SPEED);
		ghostLoopId = setInterval(ghostLoop, GHOST_SPEED);
	}

	// Setup event listeners
	onMount(() => {
		// Check if there's a saved game state to restore
		const hasRestoredGame = restoreGameState();
		
		// Add keyboard listener
		window.addEventListener('keydown', handleKeydown);

		// Add touch listeners for swipe gestures
		const gameContainer = document.querySelector('.pacman-game-container');
		if (gameContainer) {
			gameContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
			gameContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
		}

		// Cleanup
		return () => {
			window.removeEventListener('keydown', handleKeydown);
			if (gameContainer) {
				gameContainer.removeEventListener('touchstart', handleTouchStart);
				gameContainer.removeEventListener('touchend', handleTouchEnd);
			}
			if (gameLoopId) clearInterval(gameLoopId);
			if (ghostLoopId) clearInterval(ghostLoopId);
			if (invincibilityTimeout) clearTimeout(invincibilityTimeout);
			if (powerModeTimeout) clearTimeout(powerModeTimeout);
			if (powerPelletRespawnTimeout) clearTimeout(powerPelletRespawnTimeout);
			if (fruitRespawnTimeout) clearTimeout(fruitRespawnTimeout);
		};
	});
</script>

<div class="pacman-game-container" style="touch-action: none; user-select: none;">
	<!-- Start Menu -->
	{#if !gameStarted}
		<div class="start-menu">
			<div class="start-menu-content">
				<h1 class="start-title">JAC-MAN</h1>
                <h3 class="start-subtitle">Portfolio</h3>
				
				<div class="menu-options">
					
					<div class="leaderboard-section">
						<h3 class="leaderboard-title"><span class="pixel-trophy-large">◆</span> HIGHSCORES</h3>
						<div class="leaderboard">
							{#each leaderboard.slice(0, 10) as entry, index}
								<div class="leaderboard-entry">
									<span class="rank">{index + 1}.</span>
									<span class="player-name">{entry.name}</span>
									<span class="player-score">{entry.score.toLocaleString()}</span>
								</div>
							{/each}
						</div>
					</div>

                    <button onclick={startGame} class="menu-button start-button">
						▶ START GAME
					</button>
					
					<a href="/disclaimer" class="disclaimer-link">
						Legal Disclaimer & Fair Use
					</a>
					
					<div class="instructions">
						<p><span class="pixel-icon">▶</span> Use Arrow Keys or WASD to move</p>
						<p><span class="pixel-icon">●</span> Collect debug tokens to catch bugs</p>
						<p><span class="pixel-icon">♦</span> Find portfolio icons to explore sections</p>
					</div>
				</div>
			</div>
		</div>
	{:else}
	<!-- Game Content (only show when game started) -->
	<!-- Header -->
	<header class="game-header">
		<h1 class="game-title">JAC-MAN</h1>
		<p class="game-subtitle">
			Eat the power-ups to explore my portfolio!
		</p>
		
		<!-- Game Stats (Horizontal under subtitle) -->
		<div class="game-stats-bar">
			<div class="stat-item-horizontal">
				<span class="stat-label">Score:</span>
				<span class="stat-value">{score}</span>
			</div>
			<div class="stat-item-horizontal">
				<span class="stat-label">Status:</span>
				<span class="stat-value">{isPaused ? '⏸ Paused' : '▶ Playing'}</span>
			</div>
			<div class="stat-item-horizontal">
				<span class="stat-label">Lives:</span>
				<span class="stat-value">
					{#each Array(INITIAL_LIVES) as _, i}
						{#if i < lives}
							<span class="pixel-heart">♥</span>
						{:else}
							<span class="pixel-dead">✕</span>
						{/if}
					{/each}
				</span>
			</div>
		</div>
	</header>

	<!-- Main Game Layout: Left Panel + Canvas + Right Panel -->
	<div class="game-layout">
	<!-- Left Panel: Controls -->
	<aside class="side-panel left-panel">
		<!-- Controls -->
		<div class="panel-section controls-section">
			<h3 class="section-title">Controls</h3>
			{#if showNameEntry}
				<div class="control-item">
					<span class="control-icon">↑↓</span>
					<span class="control-text"><kbd>↑↓</kbd> or <kbd>WS</kbd> to change letter</span>
				</div>
				<div class="control-item">
					<span class="control-icon">←→</span>
					<span class="control-text"><kbd>←→</kbd> or <kbd>AD</kbd> to move position</span>
				</div>
				<div class="control-item">
					<span class="control-icon">⏎</span>
					<span class="control-text"><kbd>Enter</kbd> or <kbd>Space</kbd> to submit</span>
				</div>
			{:else}
				<div class="control-item">
					<span class="control-icon pixel-gamepad">▶</span>
					<span class="control-text"><kbd>↑↓←→</kbd> or <kbd>WASD</kbd></span>
				</div>
				<div class="control-item">
					<span class="control-icon pixel-pause">║</span>
					<span class="control-text"><kbd>Space</kbd> to pause</span>
				</div>
				<div class="control-item">
					<span class="control-icon pixel-restart">↻</span>
					<span class="control-text"><kbd>R</kbd> to restart</span>
				</div>
				<div class="control-item">
					<span class="control-icon pixel-home">⌂</span>
					<span class="control-text"><kbd>ESC</kbd> to menu</span>
				</div>
			{/if}
		</div>
	</aside>		<!-- Game Canvas -->
		<div class="game-area">
			<GameCanvas {player} {ghosts} {fruits} {dots} {isInvincible} {isTeleporting} {powerPellets} {powerMode} maze={currentMaze} />

			<!-- Mobile Touch Controls -->
			<div class="mobile-controls">
				<button class="control-btn control-up" onclick={() => setDirection('up')} aria-label="Move Up">▲</button>
				<button class="control-btn control-left" onclick={() => setDirection('left')} aria-label="Move Left">◀</button>
				<button class="control-btn control-down" onclick={() => setDirection('down')} aria-label="Move Down">▼</button>
				<button class="control-btn control-right" onclick={() => setDirection('right')} aria-label="Move Right">▶</button>
			</div>

			<!-- Name Entry Overlay -->
			{#if showNameEntry}
				<div class="name-entry-overlay">
					<div class="name-entry-content">
						<h2>HIGH SCORE!</h2>
						<p class="score-display">Score: {score}</p>
						<p class="name-prompt">Enter Your Name</p>
						
						<div class="name-selector">
							{#each nameEntry as letter, index}
								<div class="letter-container" class:active={nameEntryPosition === index}>
									<button 
										class="letter-button up"
										onclick={() => {
											nameEntry[index] = letter === 'Z' ? 'A' : String.fromCharCode(letter.charCodeAt(0) + 1);
										}}
									>▲</button>
									<div class="letter-display">{letter}</div>
									<button 
										class="letter-button down"
										onclick={() => {
											nameEntry[index] = letter === 'A' ? 'Z' : String.fromCharCode(letter.charCodeAt(0) - 1);
										}}
									>▼</button>
								</div>
							{/each}
						</div>
						
						<button onclick={submitHighScore} class="submit-button">Submit Score</button>
					</div>
				</div>
			{:else if isGameOver}
				<div class="game-over-overlay">
					<div class="game-over-content">
						<h2>Game Over!</h2>
						<p>A ghost caught you!</p>
						<p>Final Score: {score}</p>
						<button onclick={restartGame} class="restart-button">Play Again</button>
					</div>
				</div>
			{/if}

			<!-- Pause Overlay -->
			{#if isPaused && !isGameOver}
				<div class="pause-overlay">
					<div class="pause-content">
						<h2><span class="pixel-pause-large">║ ║</span> Paused</h2>
						<p>Press <kbd>Space</kbd> to continue</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- Right Panel: Quick Navigation -->
		<aside class="side-panel right-panel">
			<!-- Navigation -->
			<div class="panel-section nav-section">
				<h3 class="section-title">Quick Navigation</h3>
				<nav class="nav-links">
					<a href="/experience" class="nav-link" class:highlighted={highlightedNav === '/experience'}>
						<span class="nav-icon pixel-briefcase">▣</span>
						<span class="nav-text">Experience</span>
					</a>
					<a href="/projects" class="nav-link" class:highlighted={highlightedNav === '/projects'}>
						<span class="nav-icon pixel-rocket">▲</span>
						<span class="nav-text">Projects</span>
					</a>
					<a href="/achievements" class="nav-link" class:highlighted={highlightedNav === '/achievements'}>
						<span class="nav-icon pixel-trophy">◆</span>
						<span class="nav-text">Achievements</span>
					</a>
				</nav>
			</div>
		</aside>
	</div>
	{/if}
</div>

<!-- Tutorial Overlay (outside the game container) -->
{#if showTutorial}
	<GameTutorial onComplete={beginGame} />
{/if}

<style>
	/* Prevent scrolling and bouncing */
	:global(body) {
		overflow: hidden;
		height: 100vh;
		overscroll-behavior: none;
	}

	/* Start Menu Styles */
	.start-menu {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: #000;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		overflow: hidden;
	}

	.start-menu-content {
		text-align: center;
		max-width: 600px;
		padding: 3rem;
		background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%);
		border: 4px solid #2563eb;
		border-radius: 16px;
		box-shadow: 
			0 0 40px rgba(37, 99, 235, 0.5),
			inset 0 0 30px rgba(37, 99, 235, 0.1);
	}

	.start-title {
        padding-top: .5em;
		font-size: 3.5rem;
		font-weight: bold;
		margin: 0 0 0 0;
		color: #FFFF00;
		text-shadow: 
			0 0 20px #FFFF00,
			0 0 40px #FFFF00,
			0 0 60px #FFFF00;
		font-family: 'Courier New', monospace;
		letter-spacing: 4px;
		animation: pulse-glow 2s ease-in-out infinite;
	}

    .start-subtitle {
		color: #FFFF00;
		font-size: 1.25rem;
		font-family: 'Courier New', monospace;
		margin: 0 0 .5rem 0;
		text-transform: uppercase;
		letter-spacing: 2px;
	}

	@keyframes pulse-glow {
		0%, 100% { text-shadow: 0 0 20px #FFFF00, 0 0 40px #FFFF00, 0 0 60px #FFFF00; }
		50% { text-shadow: 0 0 30px #FFFF00, 0 0 60px #FFFF00, 0 0 90px #FFFF00; }
	}

	.menu-options {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.menu-button {
		padding: 1rem 2rem;
		font-size: 1.5rem;
		font-weight: bold;
		font-family: 'Courier New', monospace;
		border: 3px solid #2563eb;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s;
		text-transform: uppercase;
		letter-spacing: 2px;
	}

	.start-button {
		background: linear-gradient(180deg, #FFFF00 0%, #FFD700 100%);
		color: #000;
		box-shadow: 0 0 20px rgba(255, 255, 0, 0.5);
	}

	.start-button:hover {
		transform: scale(1.05);
		box-shadow: 0 0 30px rgba(255, 255, 0, 0.8);
	}

	.leaderboard-section {
		background: rgba(0, 0, 0, 0.5);
		border: 2px solid #2563eb;
		border-radius: 8px;
		padding: 1rem;
	}

	.leaderboard-title {
		color: #FFFF00;
		font-size: 1.25rem;
		font-family: 'Courier New', monospace;
		margin: 0 0 1rem 0;
		text-transform: uppercase;
		letter-spacing: 2px;
	}

	.leaderboard {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.leaderboard-entry {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.75rem;
		background: rgba(37, 99, 235, 0.1);
		border: 1px solid rgba(37, 99, 235, 0.3);
		border-radius: 4px;
		font-family: 'Courier New', monospace;
		color: #f7f6f6ff;
	}

	.rank {
		color: #888;
		font-weight: bold;
		min-width: 2rem;
	}

	.player-name {
		flex: 1;
		color: #00FFFF;
		font-weight: bold;
		text-align: left;
	}

	.player-score {
		color: #FFFF00;
		font-weight: bold;
	}

	.instructions {
		font-family: 'Courier New', monospace;
		color: #888;
		font-size: 0.875rem;
		line-height: 1.8;
        padding-bottom: 1em;
	}

	.instructions p {
		margin: 0.5rem 0;
	}

	.disclaimer-link {
		display: block;
		margin: 0.5rem 0 0 0;
		padding: 0;
		color: #00FF41;
		text-decoration: underline;
		font-family: 'Courier New', monospace;
		font-size: 0.75rem;
		transition: all 0.2s ease;
		text-align: center;
	}

	.disclaimer-link:hover {
		color: #00FFFF;
		text-shadow: 0 0 8px #00FF41;
	}

	/* Name Entry Overlay */
	.name-entry-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.95);
		display: flex;
		align-items: flex-start;
		justify-content: center;
		backdrop-filter: blur(4px);
		z-index: 200;
		overflow-y: auto;
		padding: 0 1rem 2rem;
	}

	.name-entry-content {
		text-align: center;
		padding: 1.5rem 2rem;
		background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%);
		border: 4px solid #FFFF00;
		border-radius: 1rem;
		box-shadow: 
			0 0 40px rgba(255, 255, 0, 0.6),
			inset 0 0 30px rgba(255, 255, 0, 0.1);
		font-family: 'Courier New', monospace;
		max-height: 100%;
		overflow-y: auto;
		margin-top: 0;
	}

	.name-entry-content h2 {
		font-size: 1.75rem;
		margin: 0 0 0.5rem 0;
		color: #FFFF00;
		text-shadow: 0 0 20px #FFFF00, 0 0 40px #FFFF00;
		animation: pulse-glow 2s ease-in-out infinite;
	}

	.score-display {
		font-size: 1.25rem;
		color: #00FFFF;
		margin: 0 0 0.75rem 0;
		font-weight: bold;
		text-shadow: 0 0 10px #00FFFF;
	}

	.name-prompt {
		font-size: 1rem;
		color: #f7f6f6ff;
		margin: 0 0 1rem 0;
	}

	.name-selector {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.letter-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.35rem;
		padding: 0.75rem;
		background: rgba(37, 99, 235, 0.1);
		border: 2px solid rgba(37, 99, 235, 0.3);
		border-radius: 8px;
		transition: all 0.3s;
	}

	.letter-container.active {
		background: rgba(255, 255, 0, 0.2);
		border-color: #FFFF00;
		box-shadow: 0 0 20px rgba(255, 255, 0, 0.3);
	}

	.letter-button {
		background: rgba(37, 99, 235, 0.3);
		border: 1px solid #2563eb;
		color: #00FFFF;
		font-size: 1rem;
		padding: 0.25rem 1rem;
		cursor: pointer;
		border-radius: 4px;
		transition: all 0.2s;
		font-family: 'Courier New', monospace;
	}

	.letter-button:hover {
		background: rgba(37, 99, 235, 0.5);
		box-shadow: 0 0 10px rgba(37, 99, 235, 0.5);
	}

	.letter-display {
		font-size: 2.5rem;
		font-weight: bold;
		color: #FFFF00;
		text-shadow: 0 0 15px #FFFF00;
		font-family: 'Courier New', monospace;
		min-width: 2rem;
		text-align: center;
	}

	.submit-button {
		background: linear-gradient(180deg, #FFFF00 0%, #FFD700 100%);
		color: #000;
		border: 3px solid #FFFF00;
		padding: 0.625rem 1.5rem;
		font-size: 1rem;
		font-weight: bold;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.3s;
		font-family: 'Courier New', monospace;
		text-transform: uppercase;
		letter-spacing: 2px;
		box-shadow: 0 0 20px rgba(255, 255, 0, 0.5);
	}

	.submit-button:hover {
		transform: scale(1.05);
		box-shadow: 0 0 30px rgba(255, 255, 0, 0.8);
	}

	.pacman-game-container {
		position: relative;
		height: 100vh;
		overflow: hidden;
		background: #000;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
	}

	.game-header {
		text-align: center;
		color: white;
		max-width: 1200px;
		width: 100%;
	}

	.game-title {
		font-size: 2.5rem;
		font-weight: bold;
		margin: 0 0 0.5rem 0;
		color: #FFFF00;
		text-shadow: 0 0 20px #FFFF00, 0 0 40px #FFFF00;
		font-family: 'Courier New', monospace;
		letter-spacing: 2px;
	}

	.game-subtitle {
		font-size: 1rem;
		margin: 0 0 1rem 0;
		color: #f7f6f6ff;
		font-family: 'Courier New', monospace;
	}

	/* Game Stats Bar (Horizontal) */
	.game-stats-bar {
		display: flex;
		justify-content: center;
		gap: 2rem;
		padding: 1rem;
		background: linear-gradient(180deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%);
		border: 2px solid rgba(37, 99, 235, 0.3);
		border-radius: 8px;
		margin: 0 auto;
		max-width: 800px;
		font-family: 'Courier New', monospace;
	}

	.stat-item-horizontal {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.stat-item-horizontal .stat-label {
		color: #00FFFF;
		font-size: 0.875rem;
		font-weight: bold;
	}

	.stat-item-horizontal .stat-value {
		color: #FFFF00;
		font-size: 1rem;
		font-weight: bold;
		text-shadow: 0 0 5px #FFFF00;
	}

	/* Main Layout: Game Canvas + Side Panel */
	.game-layout {
		display: flex;
		gap: 2rem;
		align-items: flex-start;
		max-width: 1200px;
		width: 100%;
	}

	.game-area {
		position: relative;
		flex-shrink: 0;
	}

	/* Side Panel Styling */
	.side-panel {
		background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%);
		border: 3px solid #2563eb;
		border-radius: 8px;
		padding: 1.5rem;
		min-width: 280px;
		box-shadow: 
			0 0 20px rgba(37, 99, 235, 0.3),
			inset 0 0 20px rgba(37, 99, 235, 0.1);
		font-family: 'Courier New', monospace;
	}

	.panel-section {
		margin-bottom: 1.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid rgba(37, 99, 235, 0.3);
	}

	.panel-section:last-child {
		margin-bottom: 0;
		padding-bottom: 0;
		border-bottom: none;
	}

	.section-title {
		color: #FFFF00;
		font-size: 0.875rem;
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 1px;
		margin: 0 0 1rem 0;
		text-shadow: 0 0 10px #FFFF00;
	}

	/* Stats Section */
	.stat-label {
		color: #888;
		font-size: 0.875rem;
	}

	.stat-value {
		color: #00FFFF;
		font-weight: bold;
		text-shadow: 0 0 5px #00FFFF;
	}

	/* Controls Section */
	.control-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.5rem 0;
		color: #f7f6f6ff;
		font-size: 0.875rem;
	}

	.control-icon {
		font-size: 1.25rem;
		width: 1.5rem;
		text-align: center;
		color: #00FFFF;
		text-shadow: 0 0 5px #00FFFF;
		font-weight: bold;
	}

	.control-text {
		flex: 1;
	}

	/* Pixel Icon Styles */
	.pixel-gamepad, .pixel-pause, .pixel-restart, .pixel-home {
		display: inline-block;
	}

	.pixel-heart {
		color: #FF0000;
		text-shadow: 0 0 5px #FF0000;
		font-size: 1rem;
		margin: 0 0.125rem;
	}

	.pixel-dead {
		color: #666;
		font-size: 1rem;
		margin: 0 0.125rem;
	}

	.pixel-trophy-large {
		color: #FFD700;
		text-shadow: 0 0 10px #FFD700;
		font-size: 1.5rem;
	}

	.pixel-pause-large {
		color: #FFFF00;
		text-shadow: 0 0 10px #FFFF00;
		letter-spacing: 0.5rem;
	}

	.pixel-icon {
		color: #FFFF00;
		text-shadow: 0 0 5px #FFFF00;
		font-weight: bold;
		margin-right: 0.5rem;
	}

	kbd {
		background-color: #0a0a15;
		border: 1px solid #2563eb;
		border-radius: 3px;
		padding: 0.125rem 0.375rem;
		font-family: 'Courier New', monospace;
		color: #00FFFF;
		font-size: 0.75rem;
		box-shadow: 0 0 5px rgba(37, 99, 235, 0.3);
	}

	/* Navigation Section */
	.nav-links {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		text-decoration: none;
		padding: 0.75rem;
		background: rgba(37, 99, 235, 0.1);
		border: 1px solid rgba(37, 99, 235, 0.3);
		border-radius: 4px;
		transition: all 0.2s;
	}

	.nav-link:hover {
		background: rgba(37, 99, 235, 0.2);
		border-color: rgba(37, 99, 235, 0.6);
		transform: translateX(4px);
		box-shadow: 0 0 10px rgba(37, 99, 235, 0.3);
	}
	
	.nav-link.highlighted {
		background: rgba(255, 255, 0, 0.3);
		border-color: #FFFF00;
		transform: translateX(4px);
		box-shadow: 0 0 20px rgba(255, 255, 0, 0.6);
		animation: pulse-highlight 0.5s ease-in-out infinite;
	}
	
	@keyframes pulse-highlight {
		0%, 100% {
			box-shadow: 0 0 20px rgba(255, 255, 0, 0.6);
		}
		50% {
			box-shadow: 0 0 30px rgba(255, 255, 0, 0.9);
		}
	}

	.nav-icon {
		font-size: 1.25rem;
		width: 1.5rem;
		text-align: center;
		color: #00FFFF;
		text-shadow: 0 0 5px #00FFFF;
		font-weight: bold;
	}

	.pixel-briefcase {
		color: #f7f6f6ff;
		text-shadow: 0 0 5px #f7f6f6ff;
	}

	.pixel-rocket {
		color: #FFFF00;
		text-shadow: 0 0 5px #FFFF00;
	}

	.pixel-trophy {
		color: #FFD700;
		text-shadow: 0 0 5px #FFD700;
	}

	.nav-text {
		color: #f7f6f6ff;
		font-size: 0.875rem;
		font-weight: bold;
	}

	.game-over-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.9);
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(4px);
		z-index: 100;
	}

	.game-over-content {
		text-align: center;
		color: white;
		padding: 2rem;
		background-color: rgba(255, 0, 0, 0.2);
		border-radius: 1rem;
		border: 2px solid #ef4444;
	}

	.game-over-content h2 {
		font-size: 2rem;
		margin: 0 0 1rem 0;
		color: #ef4444;
	}

	.game-over-content p {
		font-size: 1.25rem;
		margin: 0 0 0.5rem 0;
	}

	.restart-button {
		background-color: #FFFF00;
		color: #000;
		border: none;
		padding: 0.75rem 2rem;
		font-size: 1rem;
		font-weight: bold;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
		margin-top: 1rem;
	}

	.restart-button:hover {
		background-color: #FFD700;
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(255, 255, 0, 0.4);
	}

	/* Pause Overlay */
	.pause-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.85);
		display: flex;
		align-items: center;
		justify-content: center;
		backdrop-filter: blur(4px);
		z-index: 100;
	}

	.pause-content {
		text-align: center;
		color: white;
		padding: 2rem 3rem;
		background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1e 100%);
		border-radius: 1rem;
		border: 3px solid #2563eb;
		box-shadow: 
			0 0 30px rgba(37, 99, 235, 0.5),
			inset 0 0 20px rgba(37, 99, 235, 0.1);
	}

	.pause-content h2 {
		font-size: 2.5rem;
		margin: 0 0 1rem 0;
		color: #FFFF00;
		text-shadow: 0 0 20px #FFFF00;
		font-family: 'Courier New', monospace;
	}

	.pause-content p {
		font-size: 1.125rem;
		margin: 0;
		color: #f7f6f6ff;
		font-family: 'Courier New', monospace;
	}

	.pause-content kbd {
		background-color: #0a0a15;
		border: 1px solid #2563eb;
		border-radius: 3px;
		padding: 0.25rem 0.5rem;
		font-family: 'Courier New', monospace;
		color: #00FFFF;
		font-size: 1rem;
		box-shadow: 0 0 5px rgba(37, 99, 235, 0.3);
	}

	/* Responsive Design */
	@media (max-width: 1200px) {
		.game-layout {
			flex-direction: column;
			align-items: center;
		}

		.left-panel {
			order: 1;
			width: 100%;
			max-width: 560px;
		}

		.game-area {
			order: 2;
		}

		.right-panel {
			order: 3;
			width: 100%;
			max-width: 560px;
		}
	}

	@media (max-width: 768px) {
		.pacman-game-container {
			padding: 1rem;
		}

		.game-title {
			font-size: 1.75rem;
		}

		.side-panel {
			min-width: auto;
		}

		.panel-section {
			margin-bottom: 1rem;
			padding-bottom: 1rem;
		}
	}
</style>
