export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11')
];

export const server_loads = [];

export const dictionary = {
		"/(main)": [6,[2]],
		"/(main)/appointment/[id]": [7,[2]],
		"/(main)/appointment/[id]/edit-medical-record": [8,[2]],
		"/(main)/appointment/[id]/new-medical-record": [9,[2]],
		"/(auth)/login": [3],
		"/(main)/notification": [10,[2]],
		"/(auth)/request": [4],
		"/(auth)/reset": [5],
		"/(main)/settings": [11,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';