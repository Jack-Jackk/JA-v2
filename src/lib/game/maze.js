// Maze utilities for Pacman game

import { MAZE_LAYOUT, GRID_WIDTH, GRID_HEIGHT, DIRECTIONS } from './constants.js';

/**
 * Check if a position is a wall
 */
export function isWall(x, y, maze = MAZE_LAYOUT) {
	if (y < 0 || y >= maze.length || x < 0 || x >= maze[0].length) {
		return true;
	}
	return maze[y][x] === 1;
}

/**
 * Check if a position is a valid path (not a wall)
 */
export function isValidPath(x, y, maze = MAZE_LAYOUT) {
	return !isWall(x, y, maze);
}

/**
 * Get all valid neighbors for a position
 */
export function getValidNeighbors(x, y, maze = MAZE_LAYOUT) {
	const neighbors = [];
	const directions = Object.values(DIRECTIONS);

	for (const dir of directions) {
		const newX = x + dir.x;
		const newY = y + dir.y;
		if (isValidPath(newX, newY, maze)) {
			neighbors.push({ x: newX, y: newY });
		}
	}

	return neighbors;
}

/**
 * Simple pathfinding for ghosts (random valid move biased toward target)
 */
export function getNextMoveToward(fromX, fromY, targetX, targetY, maze = MAZE_LAYOUT) {
	const neighbors = getValidNeighbors(fromX, fromY, maze);
	
	if (neighbors.length === 0) {
		return { x: fromX, y: fromY };
	}

	// Calculate distance for each neighbor
	const neighborsWithDistance = neighbors.map(pos => ({
		...pos,
		distance: Math.abs(pos.x - targetX) + Math.abs(pos.y - targetY)
	}));

	// Sort by distance (closest first)
	neighborsWithDistance.sort((a, b) => a.distance - b.distance);

	// 70% of time go toward target, 30% random (makes ghosts less predictable)
	if (Math.random() < 0.7) {
		return neighborsWithDistance[0];
	} else {
		return neighbors[Math.floor(Math.random() * neighbors.length)];
	}
}

/**
 * Get random valid position in maze
 */
export function getRandomValidPosition(maze = MAZE_LAYOUT) {
	let x, y;
	do {
		x = Math.floor(Math.random() * GRID_WIDTH);
		y = Math.floor(Math.random() * GRID_HEIGHT);
	} while (!isValidPath(x, y, maze));
	
	return { x, y };
}

/**
 * Check if two positions are adjacent
 */
export function areAdjacent(pos1, pos2) {
	const dx = Math.abs(pos1.x - pos2.x);
	const dy = Math.abs(pos1.y - pos2.y);
	return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}

/**
 * Calculate Manhattan distance between two points
 */
export function manhattanDistance(x1, y1, x2, y2) {
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

/**
 * Check if current position is an intersection (more than 2 possible directions)
 */
export function isIntersection(x, y, maze = MAZE_LAYOUT) {
	const neighbors = getValidNeighbors(x, y, maze);
	return neighbors.length > 2;
}

/**
 * Check if ghost can continue in current direction
 */
export function canContinueDirection(x, y, currentDirection, maze = MAZE_LAYOUT) {
	if (!currentDirection) return false;
	
	const dir = DIRECTIONS[currentDirection];
	const newX = x + dir.x;
	const newY = y + dir.y;
	
	return !isWall(newX, newY, maze);
}

/**
 * Get a random valid direction at an intersection (excluding reverse direction)
 */
export function getRandomDirection(x, y, currentDirection, maze = MAZE_LAYOUT) {
	const neighbors = getValidNeighbors(x, y, maze);
	
	if (neighbors.length === 0) {
		return currentDirection || 'UP'; // Fallback
	}
	
	// Filter out the reverse direction to prevent backtracking
	const reverseMap = {
		'UP': 'DOWN',
		'DOWN': 'UP',
		'LEFT': 'RIGHT',
		'RIGHT': 'LEFT'
	};
	
	// Convert neighbors to directions
	const directions = [];
	for (const neighbor of neighbors) {
		const dx = neighbor.x - x;
		const dy = neighbor.y - y;
		
		if (dy === -1) directions.push('UP');
		else if (dy === 1) directions.push('DOWN');
		else if (dx === -1) directions.push('LEFT');
		else if (dx === 1) directions.push('RIGHT');
	}
	
	// Filter out reverse direction
	const validDirections = currentDirection
		? directions.filter(d => d !== reverseMap[currentDirection])
		: directions;
	
	if (validDirections.length === 0) {
		return directions[0] || currentDirection; // Fallback
	}
	
	const randomIndex = Math.floor(Math.random() * validDirections.length);
	return validDirections[randomIndex];
}

/**
 * Get direction toward target (for chase mode)
 */
export function getDirectionToward(fromX, fromY, targetX, targetY, currentDirection, maze = MAZE_LAYOUT) {
	const neighbors = getValidNeighbors(fromX, fromY, maze);
	
	if (neighbors.length === 0) {
		return currentDirection || 'UP';
	}
	
	// Calculate distance for each neighbor
	const neighborsWithDistance = neighbors.map(pos => {
		const dx = pos.x - fromX;
		const dy = pos.y - fromY;
		let direction = 'UP';
		
		if (dy === -1) direction = 'UP';
		else if (dy === 1) direction = 'DOWN';
		else if (dx === -1) direction = 'LEFT';
		else if (dx === 1) direction = 'RIGHT';
		
		return {
			direction,
			distance: Math.abs(pos.x - targetX) + Math.abs(pos.y - targetY)
		};
	});
	
	// Sort by distance (closest first)
	neighborsWithDistance.sort((a, b) => a.distance - b.distance);
	
	return neighborsWithDistance[0].direction;
}
