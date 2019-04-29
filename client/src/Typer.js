import React, { Component } from 'react';
import Play from './Play/Play';
import Login from './Login/Login';
import { BrowserRouter, Route } from 'react-router-dom';

export class Typer extends Component {
	state = {
		loggedin: false
	};

	setToken = token => {
		this.setState({ token });
	};

	render() {
		return (
			<div>
				<BrowserRouter>
					<Route
						path="/login"
						render={() => <Login setToken={this.setToken} />}
					/>
					<Route path="/play" component={Play} loggedin={this.state.loggedin} />
				</BrowserRouter>
			</div>
		);
	}
}

export default Typer;
