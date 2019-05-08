import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import './SignIn.css';

export class Login extends Component {
	state = {
		username: ''
	};

	handleTextinput = e => {
		this.setState({
			[e.target.name]: [e.target.value]
		});
	};

	renderRedirectSignIn = () => {
		if (this.state.redirectSign) {
			return <Redirect to="/signin" />;
		}
	};

	renderRedirectCancel = () => {
		if (this.state.redirectCancel) {
			return <Redirect to="/login" />;
		}
	};

	handleCancel = e => {
		e.preventDefault();
		this.setState({ redirectCancel: true });
		console.log('cancel');
	};

	isPasswordsEqual = (password1, password2) => {
		console.log(password1);
		console.log(password2);
		if (password1[0] !== password2[0]) {
			this.setState({
				passworderror: 'The passwords are not equal'
			});
			return false;
		}
		return true;
	};

	handleSignin = e => {
		e.preventDefault();
		const { password1, password2, username, email } = this.state;
		if (this.isPasswordsEqual(password1, password2)) {
			axios
				.post(localStorage.getItem('API') + 'api/users/sign_in', {
					username: username[0],
					email: email[0],
					password: password1[0]
				})
				.then(res => {
					console.log(res);
					this.setState({ redirectSign: true });
				})
				.catch(err => {
					console.log(err);
				});
		}
	};

	render() {
		return (
			<div className="loginwallpaper">
				{this.renderRedirectCancel()}
				{this.renderRedirectSignIn()}
				<div className="signinbox">
					<h1>Sign In</h1>
					<form className="signininfo" onSubmit={this.handleSignin}>
						<div className="inputContainer">
							<label>E-mail</label>
							<input
								onChange={this.handleTextinput}
								className="email"
								name="email"
								type="text"
							/>
							<label className="errorlabel">
								{this.state.emailerror}
							</label>
						</div>
						<div className="inputContainer">
							<label>Username</label>
							<input
								onChange={this.handleTextinput}
								className="username"
								name="username"
								type="text"
							/>
							<label className="errorlabel">
								{this.state.usernameerror}
							</label>
						</div>
						<div className="inputContainer">
							<label>Password</label>
							<input
								onChange={this.handleTextinput}
								className="password"
								name="password1"
								type="password"
							/>
							<label className="errorlabel">
								{this.state.passworderror}
							</label>
						</div>
						<div className="inputContainer">
							<label>Password</label>
							<input
								onChange={this.handleTextinput}
								className="password"
								name="password2"
								type="password"
							/>
							<label className="errorlabel">
								{this.state.passworderror}
							</label>
						</div>
						<label className="errormsg">
							{this.state.errormsg}
						</label>
						<div className="signinButtonContainer">
							<button
								onClick={this.handleCancel}
								className="button"
								id="cancel"
							>
								Cancel
							</button>
							<button type="submit" className="button">
								Sign in
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default Login;
