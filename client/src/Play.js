import React, { Component } from 'react';
import InputHandler from './InputHandler/InputHandler';
import openSocket from 'socket.io-client';
import Progress from './Progress/Progress';

class Play extends Component {
	state = {
		complete: false,
		progress: 0,
		wpm: 0,
		username: 'oscar',
		players: []
	};

	async componentDidMount() {
		this.initSocket();
	}

	emit = (type, data) => {
		let msg = { username: this.state.username };
		msg['data'] = data;
		this.state.socket.emit(type, msg);
	};

	setComplete = () => {
		this.setState({ complete: true });
	};

	setProgress = progress => {
		this.setState({ progress: progress });
	};

	setWPM = wpm => {
		this.setState({ wpm: wpm });
	};

	initSocket = async () => {
		const socket = openSocket('http://localhost:4000');
		socket.emit('join', this.state.username);
		await socket.on('connect', () => {
			this.setState({ socket });
		});

		await socket.on('progress', msg => {
			this.handleProgress(msg);
		});
	};

	handleProgress = msg => {
		console.log(msg);
		this.setState({ players: msg });
	};

	render() {
		let text =
			'The Luger has a toggle-lock action which uses a jointed arm to lock, ' +
			'as opposed to the slide actions of many other semi-automatic pistols.' +
			' After a round is fired, the barrel and toggle assembly travel roughly ' +
			'13 mm (0.5 in) rearward due to recoil, both locked together at this point.';
		let text2 = 'This text is intentionally kind of short.';

		let text3 = '';

		for (let i = 0; i < 10; i++) {
			text3 += 'a ';
		}
		text3 += 'a';

		return (
			<div>
				<Progress players={this.state.players} />
				<InputHandler
					complete={this.state.complete}
					text={text3}
					emit={this.emit}
					setComplete={this.setComplete}
					setWPM={this.setWPM}
					wpm={this.state.wpm}
					setProgress={this.setProgress}
				/>
			</div>
		);
	}
}
export default Play;
