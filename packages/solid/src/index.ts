import {render} from './renderer'
export * from './renderer';

import {reaccord as base} from '@reaccord/core';

export const reaccord = base(render)

export {
	For,
	Show,
	Suspense,
	SuspenseList,
	Switch,
	Match,
	Index,
	ErrorBoundary,
} from 'solid-js';
