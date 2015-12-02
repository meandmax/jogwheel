import {prefix} from './get-vendor-prefix';
import ElementStub from './element-stub';

/**
 * Initialize a WebAnimationsPlayer instance
 * @param  {HTMLElement} element   HTMLElement to instantiate on
 * @param  {array} keyframes   keyframes passed to render
 * @param  {object} options    options passed to render
 * @param  {function} [render] render function used to apply interpolated inline styles
 * @param window {Window} [window=global.window] Global context to use
 * @param document {Document} [document=global.window] Document context to use
 * @return {object}         WebAnimationsPlayer instance
 */
export default function initPlayer(element, keyframes, options, render, window = global.window, document = global.document) {
	// Create an element stub for the web animation polyfill to write on if options.render is defined
	const playerElement = render ? ElementStub.create(element, window) : element;

	// Assign user-provided render callback if supplied
	playerElement.render = render || playerElement.render;

	// Allow usage of element.animate pony- and polyfills
	const animate = options.animate ?
		(...args) => options.animate(element, ...args) :
		element.animate;

	let player;

	// here be dragons, possibly this should move to ElementStub
	if (playerElement instanceof ElementStub) {
		try {
			// Try to bind stub to animate function
			player = animate.bind(playerElement)(keyframes, options); // eslint-disable-line prefer-reflect
		} catch (err) {
			// If binding fails with Illegal invocation...
			if (err.message === 'Illegal invocation') {
				// ...browser has native implemenation, fall back to it
				player = animate.bind(element)(keyframes, options);
				// destroy the stub element if it isn't needed
				playerElement.destroy();
			} else {
				// Throw other errors
				throw err;
			}
		}
	} else {
		// shortcut - not stubbed, just animate
		player = playerElement.animate(keyframes, options);
	}

	// Detach the former animation to prevent problems with polyfill
	playerElement.style[prefix('animationName', window, document)] = `__jogwheelName-${options.name}`;
	player.__jogwheelName = options.name;

	// Pause or play the webanimation player instance based on CSS animationPlayState
	if (options.playState === 'paused') {
		player.pause();
	} else {
		player.play();
	}

	return player;
}
