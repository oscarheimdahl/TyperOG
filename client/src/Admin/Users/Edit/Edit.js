import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../AdminNav/AdminNav';
import './Edit.css';

export class Edit extends Component {
	state = {
		user: '',
		redirect: false
	};

	componentDidMount() {
		const { cookies, user } = this.props;
		if (cookies.get('loggedin') === 'false') {
			this.setState({ redirect: true });
		}
		this.setState({ user });
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

	handleSubmit = (id, e) => {
		e.preventDefault();
		console.log('hellloa');
		axios.put(localStorage.getItem('API') + `api/users/update/${id}`, {
			user: this.state.user
		});
	};

	handleTextinput = e => {
		this.setState({
			user: {
				[e.target.name]: [e.target.value]
			}
		});
	};

	renderForm = () => {
		const { user } = this.state;
		return this.state.user ? (
			<form onSubmit={() => this.handleSubmit(user._id)}>
				<label>Username</label>
				<input
					type="text"
					name="username"
					onChange={this.handleTextinput}
					placeholder={user.username}
				/>
				<label>Password</label>
				<input
					type="password"
					name="password"
					onChange={this.handleTextinput}
					placeholder={user.password}
				/>
				<label>Email</label>
				<input
					type="email"
					name="email"
					onChange={this.handleTextinput}
					placeholder={user.email}
				/>
				<label>Average WPM</label>
				<input
					type="text"
					name="averageWPM"
					onChange={this.handleTextinput}
					placeholder={user.averageWPM}
				/>
				<label>Games Played</label>
				<input
					type="text"
					name="gamesPlayed"
					onChange={this.handleTextinput}
					placeholder={user.gamesPlayed}
				/>
				<label>Personal Best</label>
				<input
					type="text"
					name="highestWPM"
					onChange={this.handleTextinput}
					placeholder={user.highestWPM}
				/>
				<button onClick={() => this.handleSubmit(user._id)}>
					Save
				</button>
			</form>
		) : (
			<p>Loading....</p>
		);
	};

	renderRedirect = () => {
		if (this.state.redirect) return <Redirect to="../login" />;
	};

	render() {
		return (
			<div className="edit-user">
				{this.renderRedirect()}
				<Navbar cookies={this.props.cookies} />
				<h1>Hello EDIT</h1>
				{this.renderForm()}
			</div>
		);
	}
}

export default Edit;
