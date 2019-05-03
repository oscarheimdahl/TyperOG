import React, { Component } from 'react';
import InputHandler from './InputHandler/InputHandler';
import Progress from './Progress/Progress';
import axios from 'axios';
import openSocket from 'socket.io-client';
import { Redirect } from 'react-router-dom';

class Play extends Component {
	state = {
		complete: false,
		wpm: 0,
		playerProgress: 0,
		opponents: null,
		redirect: false,
		goalPosition: null,
		startTime: null,
		text: ''
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
	componentWillUnmount() {
		if (this.props.socket) {
			this.props.socket.disconnect();
		}
	}

	emit = (type, data) => {
		const { cookies } = this.props;
		let msg = { username: cookies.get('username') };
		msg['data'] = data;
		this.props.socket.emit(type, msg);
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
		let socket = openSocket(localStorage.getItem('API'));
		if (socket) {
			const { cookies } = this.props;
			socket.emit('join', cookies.get('username'));
			socket.on('connect', () => {
				this.setState({ socket });
			});
			//
			socket.on('progress', data => {
				this.handleProgress(data);
			});

			socket.on('gamestart', time => {
				console.log(time);
				this.setState({ startTime: time });
			});

			socket.on('gametext', gameText => {
				this.setState({ text: gameText });
			});
		}
		this.props.setSocket(socket);
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

	renderInputHandler = () => {
		return (
			<InputHandler
				complete={this.state.complete}
				text={this.state.text}
				emit={this.emit}
				setComplete={this.setComplete}
				setWPM={this.setWPM}
				wpm={this.state.wpm}
				setProgress={this.setProgress}
				startTime={this.state.startTime}
			/>
		);
	};

	render() {
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
				{this.renderInputHandler()}
			</div>
		);
	}
}
export default Play;
