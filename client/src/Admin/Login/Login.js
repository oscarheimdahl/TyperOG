import React, { Component } from 'react';

export class Login extends Component {
	render() {
		return (
			<div className="loginwallpaper">
				<div className="loginbox">
					<h1>Typer</h1>
					<div className="logininfo">
						<label>Username</label>
						<label className="errorlabel">
							{this.state.usernameerror}
						</label>
						<input
							onChange={this.handleUsername}
							className="username"
							type="text"
						/>
						<label>Password</label>
						<label className="errorlabel">
							{this.state.passworderror}
						</label>
						<input
							onChange={this.handlePassword}
							className="password"
							type="password"
						/>
						<label className="errormsg">
							{this.state.errormsg}
						</label>
					</div>
					<button onClick={this.handleLogin} className="button">
						Login
					</button>
					<p onClick={this.handleSignIn}>Sign in</p>
				</div>
			</div>
		);
	}
}

export default Login;
