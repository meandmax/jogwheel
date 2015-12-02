import getPlayer from './get-player.js';

class JogWheel {
	/**
	 * Creates a new JogWheel instance
	 * @name JogWheel.create
	 * @constructor
	 * @param  {Node|NodeList} nodes  Node or NodeList to instantiate on
	 * @param  {object} options Options object
	 * @param.name {string} [name=computedStyle.animationName] animation-name to read keyframes for
	 * @param.duration {number} [duration=computedStyle.animationDuration] duration in milliseconds, positive
	 * @param.delay {number} [delay=computedStyle.animationDelay] delay in milliseconds, positive or negative
	 * @param.iterationCount {number} [iterationCount=computedStyle.animationIterationCount] positive number of times the animation runs
	 * @param.timingFunction {string} [timingFunction=computedStyle.animationTimingFunction] CSS timing function string
	 * @param.playState {string} [playState=computedStyle.playState] CSS playstate string. Either 'paused' or 'running'
	 * @param  {Window} [window=global.window] Global context to use
	 * @param  {Document} [document=global.window] Document context to use
	 * @return {JogWheel} JogWheel instance
	 * @example
	 * import JogWheel from 'jogwheel';
	 * const element = document.querySelector('[data-animated]');
	 *
	 * // Instantiate a JogWheel instance on element
	 * const wheel = new JogWheel(element);
	 */
	static create(...args) {
		return new JogWheel(...args);
	}

	/**
	 * Creates a new JogWheel instance
	 * @name JogWheel.constructor
	 * @constructor
	 * @param  {Node|NodeList} nodes  Node or NodeList to instantiate on
	 * @param  {object} options Options object
	 * @param.name {string} [name=computedStyle.animationName] animation-name to read keyframes for
	 * @param.duration {number} [duration=computedStyle.animationDuration] duration in milliseconds, positive
	 * @param.delay {number} [delay=computedStyle.animationDelay] delay in milliseconds, positive or negative
	 * @param.iterationCount {number} [iterationCount=computedStyle.animationIterationCount] positive number of times the animation runs
	 * @param.timingFunction {string} [timingFunction=computedStyle.animationTimingFunction] CSS timing function string
	 * @param.playState {string} [playState=computedStyle.playState] CSS playstate string. Either 'paused' or 'running'
	 * @param  {Window} [window=global.window] Global context to use
	 * @param  {Document} [document=global.window] Document context to use
	 * @return {JogWheel} JogWheel instance
	 * @example
	 * import JogWheel from 'jogwheel';
	 * const element = document.querySelector('[data-animated]');
	 *
	 * // Instantiate a JogWheel instance on element
	 * const wheel = new JogWheel(element);
	 */
	constructor(nodes, options, window = global.window, document = global.document) {
		if (!nodes) {
			throw new Error(`Could not construct JogWheel, missing element`);
		}

		const settings = {...options};
		const elements = nodes instanceof window.NodeList ? [].slice.call(nodes) : [nodes]; // eslint-disable-line prefer-reflect
		const configurations = elements.map(element => getPlayer(element, settings, window, document));
		const players = configurations.map(configuration => configuration.player);
		const durations = configurations.map(configuration => configuration.duration);

		this.__instance = {
			elements, players, durations, settings
		};
	}

	/**
	 * @name JogWheel.prototype.playState
	 * @readonly
	 * @return {string} playState, either `running` or `paused`
	 */
	get playState() {
		// JogWheel does not support asynchronously running animations
		// in one instance, thus fetching the first player is enough
		const player = this.players[0];
		return player.playState;
	}

	/**
	 * @name JogWheel.prototype.progress
	 * @readonly
	 * @return {float} progress in fraction of 1 [0..1]
	 */
	get progress() {
		// JogWheel does not support asynchronously running animations
		// in one instance, thus fetching the first player is enough
		const player = this.players[0];
		const duration = this.durations[0];
		return player.currentTime / duration;
	}

	/**
	 * @name JogWheel.prototype.players
	 * @readonly
	 * @return {array} WebAnimationPlayer instances by JogWheel instance
	 */
	get players() {
		return this.__instance.players;
	}

	/**
	 * @name JogWheel.prototype.durations
	 * @readonly
	 * @return {array} durations used by JogWheel instance
	 */
	get durations() {
		return this.__instance.durations;
	}

	/**
	 * Plays the animation
	 * @name JogWheel.prototype.play()
	 * @return {JogWheel} JogWheel instance
	 * @example
	 * import JogWheel from 'jogwheel';
	 * const element = document.querySelector('[data-animated]');
	 *
	 * // Instantiate a paused JogWheel instance on element
	 * const wheel = JogWheel.create(element, {
	 * 	paused: true
	 * });
	 *
	 * // Seek to middle of animation sequence and play
	 * wheel.seek(0.5).play();
	 */
	play() {
		this.players.forEach(player => player.play());
		return this;
	}

	/**
	 * Pauses the animation
	 * @name JogWheel.prototype.pause()
	 * @return {JogWheel} JogWheel instance
	 * @example
	 * import JogWheel from 'jogwheel';
	 * const element = document.querySelector('[data-animated]');
	 *
	 * // Instantiate a paused JogWheel instance on element
	 * const wheel = JogWheel.create(element, {
	 * 	paused: false
	 * });
	 *
	 * // Pause the animation and reset it to animation start
	 * wheel.pause().seek(0);
	 */
	pause() {
		this.players.forEach(player => player.pause());
		return this;
	}

	/**
	 * Seeks the timeline of the animation
	 * @name JogWheel.prototype.seek()
	 * @param  {float} progress fraction of the animation timeline [0..1]
	 * @return {JogWheel} JogWheel instance
	 * @example
	 * import JogWheel from 'jogwheel';
	 * const element = document.querySelector('[data-animated]');
	 *
	 * // Instantiate a paused JogWheel instance on element
	 * const wheel = JogWheel.create(element, {
	 * 	paused: true
	 * });
	 *
	 * // Keep track of scroll position
	 * let scrollTop = document.scrollTop;
	 * document.addEventListener('scroll', () => scrollTop = document.scrollTop);
	 *
	 * // Seek the animation [0..1] for scroll position of [0..300]
	 * function loop() {
	 * 	const fraction = Math.max((300 / scrollTop) - 1, 0);
	 * 	wheel.seek(fraction);
	 * 	window.requestAnimationFrame(loop);
	 * }
	 *
	 * // Start the render loop
	 * loop();
	 */
	seek(progress) {
		this.__instance.players.forEach((player, index) => {
			player.currentTime = this.durations[index] * progress;
		});
		return this;
	}

	/**
	 * Reregister all eventListeners and cache entries for this JogWheel instance
	 * @return {JogWheel} JogWheel instance
	 * @private
 	 * @example
 	 * import JogWheel from 'jogwheel';
 	 * const element = document.querySelector('[data-animated]');
 	 *
 	 * // Instantiate a paused JogWheel instance on element
 	 * const wheel = JogWheel.create(element);
 	 *
 	 * // Attach new styling on the page
 	 * const link = document.createElement('link');
 	 * link.rel = 'stylesheet';
 	 * link.src = 'http://google.com/'
 	 *
 	 * // Unplug and plug again to read new styling information
 	 * wheel.unplug().plug();
 	 */
	plug() {
		// TODO: implement this
		// TODO: test this
		return this;
	}

	/**
	 * Unregisters all eventListeners and cache entries for this JogWheel instance
	 * @return {JogWheel} JogWheel instance
	 * @private
	 * @example
	 * import JogWheel from 'jogwheel';
	 * const element = document.querySelector('[data-animated]');
	 *
	 * // Instantiate a paused JogWheel instance on element
	 * const wheel = JogWheel.create(element);
	 *
	 * // Attach new styling on the page
	 * const link = document.createElement('link');
	 * link.rel = 'stylesheet';
	 * link.src = 'http://google.com/'
	 *
	 * // Unplug and plug again to read new styling information
	 * wheel.unplug().plug();
	 */
	unplug() {
		// TODO: implement this
		// TODO: test this
		return this;
	}
}

export default JogWheel;
