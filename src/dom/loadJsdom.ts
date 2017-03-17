import * as jsdom from 'jsdom';
import global from '@dojo/core/global';

/* In order to have the tests work under Node.js, we need to load JSDom and polyfill
 * requestAnimationFrame */

declare global {
	interface Window {
		CustomEvent: typeof CustomEvent;
	}
}

/* Create a basic document */
const doc = jsdom.jsdom(`
		<!DOCTYPE html>
		<html>
		<head></head>
		<body></body>
		<html>
	`, {
		/* direct the console of the document to the NodeJS console */
		virtualConsole: jsdom.createVirtualConsole().sendTo(console)
	});

/* Assign it to the global namespace */
global.document = doc;

/* Assign a global window as well */
global.window = doc.defaultView;

/* Needed for Pointer Event Polyfill's incorrect Element detection */
global.Element = function() {};

/* Patch feature detection of CSS Animations */
Object.defineProperty(
	(<any> window).CSSStyleDeclaration.prototype,
	'transition',
	Object.getOwnPropertyDescriptor((<any> window).CSSStyleDeclaration.prototype, 'webkitTransition')
);

/* Polyfill requestAnimationFrame - this can never be called an *actual* polyfill */
global.requestAnimationFrame = (cb: (...args: any[]) => {}) => {
	setImmediate(cb);
	// return something at least!
	return true;
};

global.cancelAnimationFrame = () => {};

export default doc;

console.log('Loaded jsdom.');