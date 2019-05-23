import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import './Edit.css';

export class Edit extends Component {
	state = {
		username: '',
		password: '',
		email: '',
		averageWPM: '',
		gamesPlayed: '',
		highestWPM: '',
		_id: '',
		redirect: false,
		redirectToUsers: false
	};

	componentDidMount() {
		const { cookies, user } = this.props;
		console.log(user);
		if (cookies.get('loggedin') === 'false') {
			this.setState({ redirect: true });
		}
		this.setState({
			user,
			username: user.username,
			password: user.password,
			email: user.email,
			averageWPM: user.averageWPM,
			gamesPlayed: user.gamesPlayed,
			highestWPM: user.highestWPM,
			_id: user._id
		});
		this.authenticateUser(this.getUsers);
	}

	authenticateUser = thenAction => {
		const { cookies } = this.props;
		axios
			.post(
				localStorage.getItem('API') + 'api/users/admin/authenticate',
				{
					token: cookies.get('token', { path: '/' })
				}
			)
			.then(thenAction)
			.catch(err => {
				console.log(err);
				cookies.set('loggedin', false);
				this.setState({ redirect: true });
			});
	};

	latestGamesToArray = latestGames => {
		if (latestGames) {
			return latestGames.split(',');
		}
	};

	handleSubmit = e => {
		e.preventDefault();
		const {
			username,
			password,
			email,
			admin,
			averageWPM,
			gamesPlayed,
			highestWPM,
			latestGames,
			_id
		} = this.state;

		axios
			.put(localStorage.getItem('API') + `api/users/update/${_id}`, {
				username,
				password,
				email,
				admin,
				latestGames: this.latestGamesToArray(latestGames),
				averageWPM: parseFloat(averageWPM),
				gamesPlayed: parseFloat(gamesPlayed),
				highestWPM: parseFloat(highestWPM),
				token: this.props.cookies.get('token', { path: '/' })
			})
			.then(res => {
				if (res.status === 200)
					this.setState({ redirectToUsers: true });
			})
			.catch(err => {
				console.log(err);
			});
	};

	handleTextinput = e => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	renderForm = () => {
		const { user } = this.state;
		return this.state.user ? (
			<form onSubmit={this.handleSubmit}>
				<div className="username">
					<label>Username</label>
					<input
						type="text"
						name="username"
						onChange={this.handleTextinput}
						defaultValue={user.username}
					/>
				</div>
				<div className="password">
					<label>Password</label>
					<input
						type="password"
						name="password"
						onChange={this.handleTextinput}
						defaultValue={user.password}
					/>
				</div>
				<div className="email">
					<label>Email</label>
					<input
						type="email"
						name="email"
						onChange={this.handleTextinput}
						defaultValue={user.email}
					/>
				</div>
				<div className="aWPM">
					<label>Average WPM</label>
					<input
						type="number"
						step="any"
						name="averageWPM"
						onChange={this.handleTextinput}
						defaultValue={user.averageWPM}
					/>
				</div>
				<div className="gp">
					<label>Games Played</label>
					<input
						type="number"
						step="any"
						name="gamesPlayed"
						onChange={this.handleTextinput}
						defaultValue={user.gamesPlayed}
					/>
				</div>
				<div className="pb">
					<label>Personal Best</label>
					<input
						type="number"
						step="any"
						name="highestWPM"
						onChange={this.handleTextinput}
						defaultValue={user.highestWPM}
					/>
				</div>
				<div className="admin">
					<label>Admin</label>
					<input
						type="text"
						step="any"
						name="admin"
						onChange={this.handleTextinput}
						defaultValue={user.admin}
					/>
				</div>
				<div className="latestGames">
					<label>Latest Games</label>
					<textarea
						type="text"
						step="any"
						name="latestGames"
						onChange={this.handleTextinput}
						defaultValue={user.latestGames.map(game => {
							return game + '\n';
						})}
					/>
				</div>
				<button type="submit">Save</button>
			</form>
		) : (
			<p>Loading....</p>
		);
	};

	renderRedirect = () => {
		if (this.state.redirect) return <Redirect to="/admin/login" />;
	};
	renderRedirectToUsers = () => {
		if (this.state.redirectToUsers) return <Redirect to="/admin/users" />;
	};
	render() {
		return (
			<div className="edit-user">
				{this.renderRedirect()}
				{this.renderRedirectToUsers()}
				{this.renderForm()}
			</div>
		);
	}
}

export default Edit;
