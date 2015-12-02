export default class ElementStub {
	/**
	 * Creates a new ElementStub instance. See {@link ElementStub#constructor}
	 * @constructor
	 * @private
	 */
	static create(...args) {
		return new ElementStub(...args);
	}

	/**
	 * Style proxy object
	 * @type {Object}
	 * @private
	 */
	style = {};

	/**
	 * Reference to currently active animationFrame
	 * @type {Object}
	 * @private
	 */
	frame = null;

	/**
	 * Creates a new ElementStub instance
	 * @constructor
	 * @param  {Node} element Node to stub
	 * @param  {Window} [window=global.window] Global context to use
	 * @return {ElementStub}         ElementStub instance
	 * @private
	 */
	constructor(element, window = global.window) {
		this.element = element;

		const loop = () => {
			this.render(this.element, this.style._style || this.style);
			this.frame = window.requestAnimationFrame(loop);
		};

		loop();
	}

	/**
	 * Render callback applied to each element on each frame.
	 * @param {HTMLElement} el - element to apply the styles to
	 * @param {object} styles - style object to apply to el
	 * @return {ElementStub} JogWheel instance
	 * @private
	 */
	render(el, styles) {
		Object.keys(styles)
			.filter(propertyName => propertyName !== 'length')
			.forEach(propertyName => el.style[propertyName] = styles[propertyName]);
		return this;
	}

	/**
	 * Cleanup state of instance
	 * @param  {Window} window =             global.window window context to use
	 * @return {ElementStub}        ElementStub instance
	 */
	destroy(window = global.window) {
		window.cancelAnimationFrame(this.frame);
		return this;
	}
}
