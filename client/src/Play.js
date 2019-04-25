import React from 'react';
import InputHandler from './InputHandler';

function App() {
	let text =
		'The Luger has a toggle-lock action which uses a jointed arm to lock, ' +
		'as opposed to the slide actions of many other semi-automatic pistols.' +
		' After a round is fired, the barrel and toggle assembly travel roughly ' +
		'13 mm (0.5 in) rearward due to recoil, both locked together at this point.';
	return (
		<div>
			<InputHandler text={text} />
		</div>
	);
}

export default App;
