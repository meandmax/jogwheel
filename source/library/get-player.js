import getKeyframes from './get-keyframes';
import getAnimationProperties from './get-animation-properties';
import convertAnimationDuration from './convert-animation-duration';
import convertAnimationIterations from './convert-animation-iterations';
import initPlayer from './init-player';

/**
 * Gets a web animation player based on the currently assigned CSS animation
 * @param element {HTMLElement} DOM element to scan for an applied CSS animation
 * @param settings {object} Settings object passed to JogWheel instance
 * @param window {Window} [window=global.window] Global context to use
 * @param document {Document} [document=global.window] Document context to use
 * @return {Object} `player` and `duration` attached to element
 * @private
 */
export default function getPlayer(element, settings, window = global.window, document = global.document) {
	// Read all animation related styles from element, respect prefixes
	const {
		name,
		duration,
		iterationCount,
		timingFunction,
		fillMode,
		playState,
		delay
	} = getAnimationProperties(element, window, document);

	// Generate keyframes based on the assigned animationName
	const keyframes = getKeyframes(name, window, document);

	// Construct options for the webanimation player instance
	const options = {
		name,
		duration: convertAnimationDuration(duration),
		delay: convertAnimationDuration(delay),
		iterations: convertAnimationIterations(iterationCount),
		fill: fillMode,
		easing: timingFunction,
		playState,
		...settings
	};

	// Sort by offset
	keyframes.sort((a, b) => a.offset - b.offset);

	// Instantiate player instance
	const player = initPlayer(element, keyframes, options, options.render, window, document);

	return {
		player,
		duration: options.duration
	};
}
