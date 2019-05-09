import React, { Component } from 'react';
import Play from './Play/Play';
import Login from './Login/Login';
import Home from './Home/Home';
import SignIn from './SignIn/SignIn';
import Admin from './Admin/Admin';
import { BrowserRouter, Route } from 'react-router-dom';
import { withCookies, CookiesProvider } from 'react-cookie';
import triangle from './Resources/triangle3.svg';

localStorage.setItem('API', 'http://130.239.182.177:5000/');
localStorage.setItem('Server', 'http://192.168.1.155:4000/');

export class Typer extends Component {
	state = {
		loggedin: false,
		username: null,
		socket: null
	};

	setLoginAttributes = (token, username) => {
		this.setState({ token });
		this.setState({ username });
	};

	setSocket = socket => {
		this.setState({ socket });
	};

	render() {
		return (
			<div>
				<div className="overflower">
					<img src={triangle} className="stretch" alt="aa" />
				</div>
				<CookiesProvider>
					<BrowserRouter>
						<Route
							exact
							path="/"
							render={() => <Home cookies={this.props.cookies} />}
						/>
						<Route
							exact
							path="/admin"
							render={() => (
								<Admin
									cookies={this.props.cookies}
									setLoginAttributes={this.setLoginAttributes}
								/>
							)}
						/>
						<Route
							path="/signin"
							render={() => <SignIn cookies={this.props.cookies} />}
						/>
						<Route
							path="/login"
							render={() => (
								<Login
									setLoginAttributes={this.setLoginAttributes}
									cookies={this.props.cookies}
								/>
							)}
						/>
						<Route
							path="/play"
							render={() => (
								<Play
									// username={this.state.username}
									socket={this.state.socket}
									setSocket={this.setSocket}
									cookies={this.props.cookies}
								/>
							)}
						/>
					</BrowserRouter>
				</CookiesProvider>
			</div>
		);
	}
}

export default withCookies(Typer);
