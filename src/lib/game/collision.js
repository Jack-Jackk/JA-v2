// Collision detection utilities for Pacman game

import { isWall } from './maze.js';

/**
 * Check if player collides with a wall
 */
export function checkWallCollision(x, y, maze) {
	return isWall(x, y, maze);
}

/**
 * Check if player collides with a fruit
 * Returns the fruit object if collision detected, null otherwise
 */
export function checkFruitCollision(playerX, playerY, fruits) {
	for (const fruit of Object.values(fruits)) {
		if (!fruit.collected && playerX === fruit.position.x && playerY === fruit.position.y) {
			return fruit;
		}
	}
	return null;
}

/**
 * Check if player collides with any ghost
 * Returns true if collision detected
 */
export function checkGhostCollision(playerX, playerY, ghosts) {
	for (const ghost of ghosts) {
		if (playerX === ghost.x && playerY === ghost.y) {
			return true;
		}
	}
	return false;
}

/**
 * Check if two positions are equal
 */
export function positionsEqual(pos1, pos2) {
	return pos1.x === pos2.x && pos1.y === pos2.y;
}
