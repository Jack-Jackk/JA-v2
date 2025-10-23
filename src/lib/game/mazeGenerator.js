/**
 * Generate a random maze using a modified Prim's algorithm
 * Ensures all cells are reachable from any starting point
 */

const MAZE_WIDTH = 28;
const MAZE_HEIGHT = 31;

// Cell types
const WALL = 1;
const PATH = 0;
const DOT = 2;

/**
 * Generate a random maze that guarantees all cells are reachable
 * @returns {number[][]} 2D array representing the maze
 */
export function generateRandomMaze() {
	// Initialize maze filled with walls
	const maze = Array(MAZE_HEIGHT).fill(null).map(() => 
		Array(MAZE_WIDTH).fill(WALL)
	);
	
	// Start from center
	const startX = Math.floor(MAZE_WIDTH / 2);
	const startY = Math.floor(MAZE_HEIGHT / 2);
	
	// Mark starting cell as path
	maze[startY][startX] = PATH;
	
	// List of walls to consider (frontier)
	const walls = [];
	
	// Add neighboring walls of starting cell
	addWalls(maze, walls, startX, startY);
	
	// Process walls until all reachable
	while (walls.length > 0) {
		// Pick a random wall
		const randomIndex = Math.floor(Math.random() * walls.length);
		const [wx, wy] = walls.splice(randomIndex, 1)[0];
		
		// Check if this wall separates a path from an unvisited cell
		const neighbors = getPathNeighbors(maze, wx, wy);
		
		if (neighbors.length === 1) {
			// This wall borders exactly one path cell
			// Make it a path to connect the unvisited side
			maze[wy][wx] = PATH;
			
			// Add new walls from this cell
			addWalls(maze, walls, wx, wy);
		}
	}
	
	// Ensure borders are walls
	for (let x = 0; x < MAZE_WIDTH; x++) {
		maze[0][x] = WALL;
		maze[MAZE_HEIGHT - 1][x] = WALL;
	}
	for (let y = 0; y < MAZE_HEIGHT; y++) {
		maze[y][0] = WALL;
		maze[y][MAZE_WIDTH - 1] = WALL;
	}
	
	// Add dots to all path cells
	for (let y = 1; y < MAZE_HEIGHT - 1; y++) {
		for (let x = 1; x < MAZE_WIDTH - 1; x++) {
			if (maze[y][x] === PATH) {
				maze[y][x] = DOT;
			}
		}
	}
	
	// Create teleport tunnels on left and right sides
	const teleportY = Math.floor(MAZE_HEIGHT / 2);
	maze[teleportY][0] = PATH;
	maze[teleportY][MAZE_WIDTH - 1] = PATH;
	
	// Ensure path connects to teleport
	maze[teleportY][1] = DOT;
	maze[teleportY][MAZE_WIDTH - 2] = DOT;
	
	// Add some open areas (remove random walls to create rooms)
	const numRooms = Math.floor(Math.random() * 3) + 2; // 2-4 rooms
	for (let i = 0; i < numRooms; i++) {
		createRoom(maze);
	}
	
	return maze;
}

/**
 * Add walls neighboring a cell to the frontier list
 */
function addWalls(maze, walls, x, y) {
	const directions = [
		[0, -2], // up
		[0, 2],  // down
		[-2, 0], // left
		[2, 0]   // right
	];
	
	for (const [dx, dy] of directions) {
		const nx = x + dx;
		const ny = y + dy;
		const wx = x + dx / 2; // wall between
		const wy = y + dy / 2;
		
		if (nx >= 0 && nx < MAZE_WIDTH && ny >= 0 && ny < MAZE_HEIGHT) {
			if (maze[ny][nx] === WALL && maze[wy][wx] === WALL) {
				// Add the wall between current and neighbor
				if (!walls.some(([wxx, wyy]) => wxx === wx && wyy === wy)) {
					walls.push([wx, wy]);
				}
			}
		}
	}
}

/**
 * Get path neighbors of a wall cell
 */
function getPathNeighbors(maze, x, y) {
	const neighbors = [];
	const directions = [
		[0, -1], [0, 1], [-1, 0], [1, 0]
	];
	
	for (const [dx, dy] of directions) {
		const nx = x + dx;
		const ny = y + dy;
		
		if (nx >= 0 && nx < MAZE_WIDTH && ny >= 0 && ny < MAZE_HEIGHT) {
			if (maze[ny][nx] !== WALL) {
				neighbors.push([nx, ny]);
			}
		}
	}
	
	return neighbors;
}

/**
 * Create an open room in the maze
 */
function createRoom(maze) {
	const roomWidth = Math.floor(Math.random() * 3) + 3; // 3-5 width
	const roomHeight = Math.floor(Math.random() * 3) + 3; // 3-5 height
	
	const startX = Math.floor(Math.random() * (MAZE_WIDTH - roomWidth - 2)) + 1;
	const startY = Math.floor(Math.random() * (MAZE_HEIGHT - roomHeight - 2)) + 1;
	
	for (let y = startY; y < startY + roomHeight && y < MAZE_HEIGHT - 1; y++) {
		for (let x = startX; x < startX + roomWidth && x < MAZE_WIDTH - 1; x++) {
			if (x > 0 && y > 0) {
				maze[y][x] = DOT;
			}
		}
	}
}

/**
 * Get all valid (non-wall) positions in the maze
 */
export function getAllValidPositionsFromMaze(maze) {
	const validPositions = [];
	for (let y = 0; y < maze.length; y++) {
		for (let x = 0; x < maze[y].length; x++) {
			if (maze[y][x] !== WALL) {
				validPositions.push({ x, y });
			}
		}
	}
	return validPositions;
}
