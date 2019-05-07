import React, { Component } from 'react';
import Play from './Play/Play';
import Login from './Login/Login';
import Navbar from './Navbar/Navbar';
import Home from './Home/Home';
import SignIn from './SignIn/SignIn';
import { BrowserRouter, Route } from 'react-router-dom';
import { withCookies, CookiesProvider } from 'react-cookie';

<<<<<<< HEAD
localStorage.setItem('API', 'http://130.239.236.80:5000/');
localStorage.setItem('Server', 'http://130.239.236.80:4000/');
=======
localStorage.setItem('Server', 'http://130.239.219.49:4000/');
localStorage.setItem('API', 'http://130.239.236.80:5000/');
>>>>>>> 4c7d34cb940fe0d2fc58555981264f553929960f

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
