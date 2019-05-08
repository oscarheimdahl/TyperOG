import React, { Component } from 'react';
import Play from './Play/Play';
import Login from './Login/Login';
import Navbar from './Navbar/Navbar';
import Home from './Home/Home';
import SignIn from './SignIn/SignIn';
import { BrowserRouter, Route } from 'react-router-dom';
import { withCookies, CookiesProvider } from 'react-cookie';
import triangle from './Resources/triangle3.svg';

localStorage.setItem('API', 'http://130.239.236.80:5000/');
<<<<<<< HEAD
localStorage.setItem('Server', 'http://192.168.0.106:4000/');
=======
localStorage.setItem('Server', 'http://130.239.236.80:4000/');
>>>>>>> 12cdd8f5fd17988f24a114a65fb8b1ad4d823a5c

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
						<Navbar cookies={this.props.cookies} />
						<Route exact path="/" component={Home} />
						<Route path="/signin" component={SignIn} />
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
