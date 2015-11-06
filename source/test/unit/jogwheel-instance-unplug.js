import tape from 'tape-catch';

import windowStub from '../stubs/window.js';
import documentStub from '../stubs/document.js';
import elementStub from '../stubs/element.js';

import JogWheel from '../../library/';

tape('instance.unplug', t => {
	const instance = JogWheel.create(elementStub, {}, windowStub, documentStub);
	t.ok(
		instance.unplug() === instance,
		'should return the JogWheel instance'
	);
	t.end();
});
