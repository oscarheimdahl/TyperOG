import React, { Component } from 'react';
import Play from './Play/Play';
import Login from './Login/Login';
import Navbar from './Navbar/Navbar';
import Home from './Home/Home';
import { BrowserRouter, Route } from 'react-router-dom';
import { withCookies, CookiesProvider } from 'react-cookie';

<<<<<<< HEAD
localStorage.setItem('API', 'http://192.168.1.155:4000/');
=======
localStorage.setItem('API', 'http://130.239.183.198:4000/');
>>>>>>> 3ca8542709bcb36f9e5b263c65f9ce10981b2b64

export class Typer extends Component {
	state = {
		loggedin: false,
		username: null
	};

	setLoginAttributes = (token, username) => {
		this.setState({ token });
		this.setState({ username });
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
