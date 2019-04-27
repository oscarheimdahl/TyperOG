import React, { Component } from 'react';
import InputHandler from './InputHandler';
import openSocket from 'socket.io-client';

class Play extends Component {
	state = {
		complete: false,
		wpm: 0
	};

	constructor() {
		super();
		this.initSocket();
	}

	emit = (type, progress) => {
		const socket = this.state.socket;
		socket.emit(type, progress);
	};

	setComplete = () => {
		this.setState({ complete: true });
	};

	setWPM = wpm => {
		this.setState({ wpm: wpm });
	};

	initSocket = () => {
		const socket = openSocket('http://localhost:4000');
		socket.on('connect', () => {
			console.log('inne');
			this.setState({ socket: socket });
		});
	};

	render() {
		let text =
			'The Luger has a toggle-lock action which uses a jointed arm to lock, ' +
			'as opposed to the slide actions of many other semi-automatic pistols.' +
			' After a round is fired, the barrel and toggle assembly travel roughly ' +
			'13 mm (0.5 in) rearward due to recoil, both locked together at this point.';
		let text2 = 'This text is intentionally kind of short.';

		return (
			<div>
				<InputHandler
					complete={this.state.complete}
					text={text2}
					emit={this.emit}
					setComplete={this.setComplete}
					setWPM={this.setWPM}
					wpm={this.state.wpm}
				/>
			</div>
		);
	}
}
export default Play;
