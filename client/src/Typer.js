import React, { Component } from 'react';
import Play from './Play/Play';
import Login from './Login/Login';
import SignIn from './SignIn/SignIn';
import Admin from './Admin/Admin';
import User from './User/User';
import { BrowserRouter, Route } from 'react-router-dom';
import { withCookies, CookiesProvider } from 'react-cookie';
import triangle from './Resources/triangle3.svg';

localStorage.setItem('API', 'http://130.239.236.86:5000/');
localStorage.setItem('Server', 'http://130.239.236.86:4000/');

export class Typer extends Component {
	state = {
		loggedin: false,
		socket: null,
		editUser: ''
	};

	setSocket = socket => {
		this.setState({ socket });
	};

	render() {
		return (
			<div>
				<div className="overflower">
					<img src={triangle} className="stretch" alt="background" />
				</div>
				<CookiesProvider>
					<BrowserRouter>
						<Route
							path="/signin"
							render={() => (
								<SignIn cookies={this.props.cookies} />
							)}
						/>
						<Route
							path="/login"
							render={() => (
								<Login cookies={this.props.cookies} />
							)}
						/>
						<Route
							exact
							path="/"
							render={() => (
								<Play
									socket={this.state.socket}
									setSocket={this.setSocket}
									cookies={this.props.cookies}
								/>
							)}
						/>
						<Route
							path="/user"
							render={() => <User cookies={this.props.cookies} />}
						/>
						<Route
							path="/admin"
							render={() => (
								<Admin cookies={this.props.cookies} />
							)}
						/>
					</BrowserRouter>
				</CookiesProvider>
			</div>
		);
	}
}

export default withCookies(Typer);
