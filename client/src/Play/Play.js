import React, { Component } from 'react';
import InputHandler from './InputHandler/InputHandler';
import Progress from './Progress/Progress';
import axios from 'axios';
import openSocket from 'socket.io-client';
import Navbar from '../Navbar/Navbar';
import { Redirect } from 'react-router-dom';
import './Play.css';
class Play extends Component {
	_reloadTimer = null;

	state = {
		complete: false,
		wpm: 0,
		playerProgress: 0,
		opponents: null,
		redirect: false,
		goalPosition: null,
		startTime: null,
		text: '',
		hide: false
	};

	componentDidMount() {
		const { cookies } = this.props;
		axios
			.post(localStorage.getItem('API') + 'api/users/authenticate', {
				token: cookies.get('token')
			})
			.catch(err => {
				console.log(err);
				cookies.set('loggedin', false);
			});

		this.initSocket();
	}

	componentWillUnmount() {
		if (this.props.socket) {
			this.props.socket.disconnect();
		}
		clearTimeout(this._reloadTimer);
	}

	emit = (type, data) => {
		const { cookies } = this.props;
		let msg = { username: cookies.get('username') };
		msg['data'] = data;
		if (this.props.socket) this.props.socket.emit(type, msg);
	};

	postStats = () => {
		console.log('POSTING STATS');
		axios
			.post(localStorage.getItem('API') + 'api/users/updatewpm', {
				token: this.props.cookies.get('token'),
				username: this.props.cookies.get('username'),
				wpm: this.state.wpm
			})
			.catch(err => {
				console.log(err);
			});
	};

	setComplete = () => {
		this.setState({ complete: true });
	};

	newRace = () => {
		this.setState({ hide: true });
		this.props.socket.disconnect();
		this.initSocket();
		this.setState({
			complete: false,
			wpm: 0,
			playerProgress: 0,
			opponents: null,
			redirect: false,
			goalPosition: null,
			startTime: null,
			text: ''
		});
		setTimeout(() => {
			this.setState({ hide: false });
		});
	};

	setProgress = playerProgress => {
		this.setState({ playerProgress });
	};

	setWPM = wpm => {
		this.setState({ wpm: wpm });
	};

	initSocket = async () => {
		let socket = openSocket(localStorage.getItem('Server'));
		if (socket) {
			const { cookies } = this.props;
			socket.emit('join', cookies.get('username'), cookies.get('loggedin'));
			socket.on('connect', () => {
				this.setState({ socket });
			});

			socket.on('progress', data => {
				this.handleProgress(data);
			});

			socket.on('gamestart', time => {
				if (!this.state.startTime) {
					this.setState({ startTime: Date.now() + time });
				}
			});

			socket.on('guest', guestname => {
				cookies.set('username', guestname);
				cookies.set('guest', true);
			});

			socket.on('gametext', gameText => {
				if (gameText) this.setState({ text: gameText.content });
			});
		}
		this.props.setSocket(socket);
	};

	seeGames = () => {
		if (this.props.socket) this.props.socket.emit('printGames');
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

	renderNewRaceButton = () => {
		return this.state.complete ? (
			<button className="newrace-button" onClick={this.newRace}>
				NEXT RACE
			</button>
		) : null;
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
				postStats={this.postStats}
			/>
		);
	};

	renderProgress = () => {
		return (
			<Progress
				startTime={this.state.startTime}
				opponents={this.state.opponents}
				playerProgress={this.state.playerProgress}
				goalPosition={this.state.goalPosition}
				username={this.props.cookies.get('username')}
				wpm={this.state.wpm}
			/>
		);
	};

	render() {
		return (
			<div>
				<Navbar cookies={this.props.cookies} />
				<div className="play-wrapper">
					<div className="playcontent">
						{this.renderRedirect()}
						{this.state.hide ? null : this.renderProgress()}
						{this.state.hide ? null : this.renderInputHandler()}
						{/* <button onClick={this.seeGames}>Log games on server</button> */}
						{/* <button onClick={this.setComplete}>Insta win</button> */}
						{this.renderNewRaceButton()}
					</div>
				</div>
			</div>
		);
	}
}
export default Play;
