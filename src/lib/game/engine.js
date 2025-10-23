// Game engine utilities for snake movement and logic

import { DIRECTIONS, GRID_WIDTH, GRID_HEIGHT } from './constants.js';

/**
 * Get the next direction based on current direction and input
 * Prevents 180-degree turns (can't go directly opposite)
 */
export function getNextDirection(currentDirection, inputDirection) {
	// Prevent reversing direction
	const opposites = {
		UP: 'DOWN',
		DOWN: 'UP',
		LEFT: 'RIGHT',
		RIGHT: 'LEFT'
	};

	if (opposites[currentDirection] === inputDirection) {
		return currentDirection;
	}

	return inputDirection;
}

/**
 * Move the snake in the current direction
 * Returns new snake array with updated positions
 */
export function moveSnake(snake, direction) {
	const head = snake[0];
	const directionVector = DIRECTIONS[direction];

	// Calculate new head position
	const newHead = {
		x: head.x + directionVector.x,
		y: head.y + directionVector.y
	};

	// Create new snake with new head and remove tail
	const newSnake = [newHead, ...snake.slice(0, -1)];

	return newSnake;
}

/**
 * Grow the snake by one segment
 * Used when collecting items or entering portals
 */
export function growSnake(snake, direction) {
	const head = snake[0];
	const directionVector = DIRECTIONS[direction];

	// Calculate new head position
	const newHead = {
		x: head.x + directionVector.x,
		y: head.y + directionVector.y
	};

	// Create new snake with new head, keeping the tail
	const newSnake = [newHead, ...snake];

	return newSnake;
}

/**
 * Wrap coordinates around the grid (optional - for no-wall mode)
 */
export function wrapPosition(x, y) {
	return {
		x: ((x % GRID_WIDTH) + GRID_WIDTH) % GRID_WIDTH,
		y: ((y % GRID_HEIGHT) + GRID_HEIGHT) % GRID_HEIGHT
	};
}

/**
 * Check if a position is within grid bounds
 */
export function isInBounds(x, y) {
	return x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT;
}

/**
 * Check if two positions are equal
 */
export function positionsEqual(pos1, pos2) {
	return pos1.x === pos2.x && pos1.y === pos2.y;
}
