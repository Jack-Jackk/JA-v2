<script>
	// Bug component - AI-controlled code bug that chases the player
	let { ghost, cellSize, color, vulnerable = false, teleporting = false } = $props();
</script>

<div
	class="ghost"
	class:vulnerable
	class:teleporting
	style="
    position: absolute;
    left: {ghost.x * cellSize}px;
    top: {ghost.y * cellSize}px;
    width: {cellSize}px;
    height: {cellSize}px;
    transition: left 0.25s linear, top 0.25s linear;
    z-index: 8;
  "
>
	<div
		class="ghost-body"
		style="
      width: 100%;
      height: 100%;
      position: relative;
    "
	>
		<!-- Antennae -->
		<div class="antennae-left" style="
			position: absolute;
			top: -{cellSize * 0.15}px;
			left: {cellSize * 0.25}px;
			width: {cellSize * 0.08}px;
			height: {cellSize * 0.2}px;
			background: {vulnerable ? '#FF4444' : color};
			transform: rotate(-20deg);
		">
			<div style="
				position: absolute;
				top: -{cellSize * 0.08}px;
				left: 50%;
				transform: translateX(-50%);
				width: {cellSize * 0.15}px;
				height: {cellSize * 0.15}px;
				background: {vulnerable ? '#FF4444' : color};
				border-radius: 50%;
			"></div>
		</div>
		<div class="antennae-right" style="
			position: absolute;
			top: -{cellSize * 0.15}px;
			right: {cellSize * 0.25}px;
			width: {cellSize * 0.08}px;
			height: {cellSize * 0.2}px;
			background: {vulnerable ? '#FF4444' : color};
			transform: rotate(20deg);
		">
			<div style="
				position: absolute;
				top: -{cellSize * 0.08}px;
				left: 50%;
				transform: translateX(-50%);
				width: {cellSize * 0.15}px;
				height: {cellSize * 0.15}px;
				background: {vulnerable ? '#FF4444' : color};
				border-radius: 50%;
			"></div>
		</div>

		<!-- Bug body - more angular/square than rounded -->
		<div
			class="ghost-shape"
			style="
        width: 100%;
        height: {cellSize * 0.75}px;
        background: {vulnerable ? '#FF4444' : color};
        border-radius: {cellSize * 0.15}px;
        position: relative;
        box-shadow: 0 0 {cellSize / 4}px {vulnerable ? '#FF4444AA' : color + 'aa'}, inset 0 -{cellSize / 8}px {cellSize / 4}px rgba(255,255,255,0.2);
        animation: bug-wobble 1s ease-in-out infinite;
        clip-path: polygon(
          10% 0%,
          90% 0%,
          100% 10%,
          100% 90%,
          90% 100%,
          10% 100%,
          0% 90%,
          0% 10%
        );
      "
		>
			<!-- Bug face - angular eyes for bug look -->
			<div class="bug-face" style="display: flex; gap: {cellSize * 0.1}px; position: absolute; top: {cellSize * 0.15}px; left: 50%; transform: translateX(-50%);">
				<div
					class="eye"
					style="
            width: {cellSize * 0.15}px;
            height: {cellSize * 0.25}px;
            background: {vulnerable ? '#000' : 'rgba(0,0,0,0.8)'};
            border-radius: 30% 30% 50% 50%;
            position: relative;
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.3);
          "
				></div>
				<div
					class="eye"
					style="
            width: {cellSize * 0.15}px;
            height: {cellSize * 0.25}px;
            background: {vulnerable ? '#000' : 'rgba(0,0,0,0.8)'};
            border-radius: 30% 30% 50% 50%;
            position: relative;
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.3);
          "
				></div>
			</div>

			<!-- Bug symbol/pattern -->
			{#if vulnerable}
				<div style="
					position: absolute;
					bottom: {cellSize * 0.15}px;
					left: 50%;
					transform: translateX(-50%);
					font-size: {cellSize * 0.3}px;
					color: #000;
					font-weight: bold;
					font-family: monospace;
				">X</div>
			{:else}
				<div style="
					position: absolute;
					bottom: {cellSize * 0.15}px;
					left: 50%;
					transform: translateX(-50%);
					font-size: {cellSize * 0.25}px;
					color: rgba(255,255,255,0.6);
					font-weight: bold;
					font-family: monospace;
				">&lt;/&gt;</div>
			{/if}
		</div>

		<!-- Bug legs -->
		<div style="
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: {cellSize * 0.2}px;
			display: flex;
			justify-content: space-around;
			align-items: flex-end;
		">
			<div style="width: {cellSize * 0.08}px; height: {cellSize * 0.15}px; background: {vulnerable ? '#FF4444' : color};"></div>
			<div style="width: {cellSize * 0.08}px; height: {cellSize * 0.12}px; background: {vulnerable ? '#FF4444' : color};"></div>
			<div style="width: {cellSize * 0.08}px; height: {cellSize * 0.15}px; background: {vulnerable ? '#FF4444' : color};"></div>
		</div>
	</div>
</div>

<style>
	.ghost {
		pointer-events: none;
	}

	.ghost.vulnerable {
		animation: bug-error-flash 0.4s ease-in-out infinite;
	}

	.ghost.teleporting {
		opacity: 0;
	}

	@keyframes bug-wobble {
		0%,
		100% {
			transform: translateY(0px) rotate(0deg);
		}
		25% {
			transform: translateY(-1px) rotate(-1deg);
		}
		75% {
			transform: translateY(-1px) rotate(1deg);
		}
	}

	@keyframes bug-error-flash {
		0%, 100% {
			filter: brightness(1);
		}
		50% {
			filter: brightness(1.5) saturate(1.3);
		}
	}
</style>
