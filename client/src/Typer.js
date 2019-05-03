import React, { Component } from 'react';
import Play from './Play/Play';
import Login from './Login/Login';
import Navbar from './Navbar/Navbar';
import Home from './Home/Home';
import openSocket from 'socket.io-client';
import { BrowserRouter, Route } from 'react-router-dom';
import { withCookies, CookiesProvider } from 'react-cookie';

localStorage.setItem('API', 'http://192.168.1.155:4000/');

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
				<CookiesProvider>
					<BrowserRouter>
						<Navbar cookies={this.props.cookies} />
						<Route exact path="/" component={Home} />
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
					</BrowserRouter>{' '}
				</CookiesProvider>
			</div>
		);
	}
}

export default withCookies(Typer);
