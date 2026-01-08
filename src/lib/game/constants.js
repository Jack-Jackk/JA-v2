// Jac-Man Game Configuration
// A playful portfolio navigation game inspired by classic arcade mechanics
// Not affiliated with or endorsed by Pac-Man™ or Bandai Namco Entertainment

// Grid dimensions
export const GRID_WIDTH = 28;
export const GRID_HEIGHT = 22;

// Game speed (milliseconds between moves)
export const GAME_SPEED = 150; // Player speed (slightly faster than bugs)

// Cell size for rendering (in pixels)
export const CELL_SIZE = 23;

// Points
export const DOT_POINTS = 10; // Points for collecting a code bit

// Teleport positions
export const TELEPORT_RIGHT = { x: 27, y: 10 }; // Right side teleport
export const TELEPORT_LEFT = { x: 0, y: 10 }; // Left side teleport

// Lives system
export const INITIAL_LIVES = 3;
export const RESPAWN_POSITION = { x: 14, y: 14 }; // Center of maze
export const INVINCIBILITY_DURATION = 5000; // 5 seconds in milliseconds

// Debug mode system (power-up)
export const POWER_PELLET_DURATION = 10000; // 10 seconds
export const POWER_PELLET_RESPAWN_TIME = 30000; // 30 seconds
export const GHOST_EAT_POINTS = 200; // Points for catching bugs
export const POWER_PELLET_POSITIONS = [
	{ x: 1, y: 1 },
	{ x: 26, y: 1 },
	{ x: 1, y: 20 },
	{ x: 26, y: 20 }
];

// Directions
export const DIRECTIONS = {
	UP: { x: 0, y: -1 },
	DOWN: { x: 0, y: 1 },
	LEFT: { x: -1, y: 0 },
	RIGHT: { x: 1, y: 0 }
};

// Key mappings
export const KEY_MAPPINGS = {
	ArrowUp: 'UP',
	ArrowDown: 'DOWN',
	ArrowLeft: 'LEFT',
	ArrowRight: 'RIGHT',
	w: 'UP',
	W: 'UP',
	s: 'DOWN',
	S: 'DOWN',
	a: 'LEFT',
	A: 'LEFT',
	d: 'RIGHT',
	D: 'RIGHT'
};

// Colors - Differentiated tech/portfolio theme
export const COLORS = {
	PACMAN: '#00FF41', // Matrix green instead of yellow
	WALL: '#6366f1', // indigo-500 (different from classic blue)
	BACKGROUND: '#0a0a0f', // Very dark blue-gray instead of pure black
	DOT: '#FFB8AE', // Keep pink dots (different from classic)
	GHOST_RED: '#a855f7', // purple-500 - "bugs" not ghosts
	GHOST_PINK: '#ec4899', // pink-500 - different shade
	GHOST_CYAN: '#06b6d4', // cyan-500 - different cyan
	GHOST_ORANGE: '#f97316' // orange-500 - different orange
};

// Fruit definitions (portfolio sections)
export const FRUITS = {
	EXPERIENCE: {
		id: 'experience',
		label: 'E',
		emoji: '💼',
		color: '#3b82f6', // blue-500
		route: '/experience',
		position: { x: 5, y: 10 },
		points: 100
	},
	PROJECTS: {
		id: 'projects',
		label: 'P',
		emoji: '🚀',
		color: '#10b981', // emerald-500
		route: '/projects',
		position: { x: 22, y: 10 },
		points: 100
	},
	ACHIEVEMENTS: {
		id: 'achievements',
		label: 'A',
		emoji: '🏆',
		color: '#f59e0b', // amber-500
		route: '/achievements',
		position: { x: 14, y: 20 },
		points: 100
	}
};

// Initial player position (center bottom area)
export const INITIAL_PLAYER_POSITION = { x: 14, y: 20 };

// Initial direction
export const INITIAL_DIRECTION = 'RIGHT';

// Ghost settings
export const GHOST_COUNT = 4;
export const GHOST_SPEED = 250; // Slower than player for balanced gameplay
export const GHOST_CHASE_RANGE = 3; // Chase player when within this many cells
export const GHOST_START_POSITIONS = [
	{ x: 11, y: 10 },
	{ x: 13, y: 10 },
	{ x: 14, y: 10 },
	{ x: 16, y: 10 }
];

// Maze layout (1 = wall, 0 = path, 2 = dot)
// Classic Pacman-inspired layout
export const MAZE_LAYOUT = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
	[1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
	[1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
	[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
	[1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
	[1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
	[1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
	[0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
	[1,1,1,1,1,1,2,1,1,0,1,1,1,0,0,1,1,1,0,1,1,2,1,1,1,1,1,1],
	[0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0],
	[1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
	[0,0,0,0,0,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,0,0,0,0,0],
	[1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
	[1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
	[1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
	[1,2,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,2,1],
	[1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
	[1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
	[1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
	[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];
