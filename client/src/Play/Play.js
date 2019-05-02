import React, { Component } from 'react';
import InputHandler from './InputHandler/InputHandler';
import openSocket from 'socket.io-client';
import Progress from './Progress/Progress';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class Play extends Component {
	state = {
		complete: false,
		wpm: 0,
		playerProgress: 0,
		opponents: null,
		redirect: false,
		goalPosition: null,
		startTime: null
	};

	componentDidMount() {
		const { cookies } = this.props;
		axios
			.post(localStorage.getItem('API') + 'api/users/authenticate', {
				token: cookies.get('token')
			})
			.then(res => {
				this.initSocket();
			})
			.catch(err => {
				console.log(err);
				this.setState({ redirect: true });
			});
	}

	emit = (type, data) => {
		if (this.state.socket) {
			const { cookies } = this.props;
			let msg = { username: cookies.get('username') };
			msg['data'] = data;
			this.state.socket.emit(type, msg);
		}
	};

	setComplete = () => {
		this.setState({ complete: true });
	};

	setProgress = playerProgress => {
		this.setState({ playerProgress });
	};

	setWPM = wpm => {
		this.setState({ wpm: wpm });
	};

	initSocket = async () => {
		const socket = openSocket(localStorage.getItem('API'));
		if (socket) {
			const { cookies } = this.props;
			socket.emit('join', cookies.get('username'));
			socket.on('connect', () => {
				this.setState({ socket });
			});
			//
			socket.on('progress', msg => {
				this.handleProgress(msg);
			});

			socket.on('gamestart', msg => {
				console.log('gamestart received: ' + msg);
				this.setState({ startTime: msg });
			});
		}
	};

	handleProgress = opponents => {
		this.setState({ opponents });
		this.setGoalPosition();
	};

	renderRedirect = () => {
		if (this.state.redirect) {
			return <Redirect to="/login" />;
		}
	};

	setGoalPosition = () => {
		if (this.state.opponents && Array.isArray(this.state.opponents)) {
			this.state.opponents.forEach(o => {
				if (o.username === this.props.cookies.get('username')) {
					this.setState({ goalPosition: o.goalPosition });
				}
			});
		}
	};

	render() {
		let text =
			'The Luger has a toggle-lock action which uses a jointed arm to lock, ' +
			'as opposed to the slide actions of many other semi-automatic pistols.' +
			' After a round is fired, the barrel and toggle assembly travel roughly ' +
			'13 mm (0.5 in) rearward due to recoil, both locked together at this point.';
		let text2 = 'a a a';

		let text3 =
			'En text är en skriven eller muntlig utsaga som i sin kontext är meningsfull' +
			' och där de språkliga enheterna har ett inbördes sammanhang. Exempel på skrivna ' +
			' texter är romaner, tidningsartiklar och kontaktannonser.';

		return (
			<div>
				{this.renderRedirect()}
				<Progress
					opponents={this.state.opponents}
					playerProgress={this.state.playerProgress}
					goalPosition={this.state.goalPosition}
					//getGoalPosition={this.getGoalPosition}
					username={this.props.cookies.get('username')}
					wpm={this.state.wpm}
				/>
				<InputHandler
					complete={this.state.complete}
					text={text}
					emit={this.emit}
					setComplete={this.setComplete}
					setWPM={this.setWPM}
					wpm={this.state.wpm}
					setProgress={this.setProgress}
					startTime={this.state.startTime}
				/>
			</div>
		);
	}
}
export default Play;
