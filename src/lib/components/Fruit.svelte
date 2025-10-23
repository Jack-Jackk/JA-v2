<script>
	// Fruit component - displays collectible fruits with portfolio section letters
	let { fruit, cellSize, collected = false } = $props();
</script>

<div
	class="fruit"
	class:collected
	style="
    position: absolute;
    left: {fruit.position.x * cellSize}px;
    top: {fruit.position.y * cellSize}px;
    width: {cellSize}px;
    height: {cellSize}px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  "
>
	{#if !collected}
		<div
			class="fruit-container"
			style="
        width: {cellSize * 0.8}px;
        height: {cellSize * 0.8}px;
        background: radial-gradient(circle, {fruit.color} 0%, {fruit.color}cc 70%, {fruit.color}88 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 {cellSize / 2}px {fruit.color}, 0 0 {cellSize}px {fruit.color}88;
        animation: fruit-pulse 1.5s ease-in-out infinite;
      "
		>
			<span
				class="fruit-emoji"
				style="
          font-size: {cellSize * 0.5}px;
          filter: drop-shadow(0 0 2px rgba(0,0,0,0.5));
        "
			>
				{fruit.emoji}
			</span>
		</div>
		<div
			class="fruit-label"
			style="
        position: absolute;
        bottom: -{cellSize * 0.3}px;
        font-size: {cellSize * 0.4}px;
        font-weight: bold;
        color: white;
        text-shadow: 0 0 4px {fruit.color}, 0 0 8px {fruit.color};
        animation: float 2s ease-in-out infinite;
      "
		>
			{fruit.label}
		</div>
	{/if}
</div>

<style>
	.fruit {
		pointer-events: none;
		z-index: 10;
	}

	.fruit.collected {
		opacity: 0;
		transform: scale(0);
	}

	.fruit-container {
		animation: fruit-pulse 1.5s ease-in-out infinite;
	}

	@keyframes fruit-pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.1);
			opacity: 0.9;
		}
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-3px);
		}
	}
</style>
