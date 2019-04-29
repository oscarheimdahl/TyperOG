import React, { Component } from 'react';
import './Login.css';
import axios from 'axios';

export class Login extends Component {
	state = {};

	handleUsername = e => {
		this.setState({ username: e.target.value });
	};

	handlePassword = e => {
		this.setState({ password: e.target.value });
	};

	handleLogin = e => {
		let emptyfields = false;
		if (!this.state.username) {
			this.setState({ usernameerror: '*' });
			emptyfields = true;
		}
		if (!this.state.password) {
			this.setState({ passworderror: '*' });
			emptyfields = true;
		}
		if (!emptyfields) {
			axios
				.post('http://85.11.24.122:4000/api/users/login/', {
					username: this.state.username,
					password: this.state.password
				})
				.then(res => {
					if (res.status === '401') {
						this.setState({ errormsg: 'Wrong username or password.' });
					} else {
						this.props.setToken(res.data.token);
					}
				})
				.catch(err => {
					console.log(err);
				});
		}
	};

	render() {
		return (
			<div className="loginwallpaper">
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
