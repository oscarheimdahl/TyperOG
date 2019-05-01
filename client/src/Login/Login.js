import React, { Component } from 'react';
import './Login.css';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

export class Login extends Component {
	state = {};

	handleUsername = e => {
		this.setState({ username: e.target.value });
	};

	handlePassword = e => {
		this.setState({ password: e.target.value });
	};

	handleLogin = e => {
		this.setState({
			errormsg: ''
		});
		let emptyfields = false;
		if (!this.state.username) {
			this.setState({ usernameerror: ' *' });
			emptyfields = true;
		}
		if (!this.state.password) {
			this.setState({ passworderror: ' *' });
			emptyfields = true;
		}
		if (!emptyfields) {
			console.log(localStorage.getItem('API') + 'api/users/login');
			axios
				.post(localStorage.getItem('API') + 'api/users/login', {
					//http://130.239.236.226:4000/api/users/login/', {
					username: this.state.username,
					password: this.state.password
				})
				.then(res => {
					this.props.setLoginAttributes(res.data.token, this.state.username);
					const { cookies } = this.props;
					cookies.set('token', res.data.token, { path: '/' });
					cookies.set('username', this.state.username, { path: '/' });
					console.log('hej');
					this.setState({ redirect: true });
				})
				.catch(err => {
					if (!err.response) {
						this.setState({
							errormsg: 'Oh oh. Something bad happened.'
						});
						console.log(err);
					} else if (err.response.status === 401) {
						this.setState({
							errormsg: 'Wrong username or password.'
						});
					}
				});
		}
	};

	renderRedirect = () => {
		if (this.state.redirect) {
			return <Redirect to="/play" />;
		}
	};

	render() {
		return (
			<div className="loginwallpaper">
				{this.renderRedirect()}
				<div className="loginbox">
					<h1>Typer</h1>
					<div className="logininfo">
						<label>Username</label>
						<label className="errorlabel">{this.state.usernameerror}</label>
						<input
							onChange={this.handleUsername}
							className="username"
							type="text"
						/>
						<label>Password</label>
						<label className="errorlabel">{this.state.passworderror}</label>
						<input
							onChange={this.handlePassword}
							className="password"
							type="password"
						/>
						<label className="errormsg">{this.state.errormsg}</label>
					</div>
					<div onClick={this.handleLogin} className="button">
						Login
					</div>
				</div>
			</div>
		);
	}
}

export default Login;
