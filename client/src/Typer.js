import React, { Component } from 'react';
import Play from './Play/Play';
import Login from './Login/Login';
import Home from './Home/Home';
import SignIn from './SignIn/SignIn';
import Users from './Admin/Users/Users';
import Edit from './Admin/Users/Edit/Edit';
import User from './User/User';
import AdminLogin from './Admin/Login/Login';
import { BrowserRouter, Route } from 'react-router-dom';
import { withCookies, CookiesProvider } from 'react-cookie';
import triangle from './Resources/triangle3.svg';

localStorage.setItem('API', 'http://192.168.1.142:5000/');
localStorage.setItem('Server', 'http://192.168.1.142:4000/');

export class Typer extends Component {
	state = {
		loggedin: false,
		socket: null,
		editUser: ''
	};

	setSocket = socket => {
		this.setState({ socket });
	};

	setEditUser = user => {
		console.log(user);
		this.setState({ editUser: user });
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
							path="/signin"
							render={() => <SignIn cookies={this.props.cookies} />}
						/>
						<Route
							path="/login"
							render={() => <Login cookies={this.props.cookies} />}
						/>
						<Route
							path="/play"
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
						{/* Admin Routes */}
						<Route
							exact
							path="/admin/users"
							render={() => (
								<Users
									cookies={this.props.cookies}
									setUser={this.setEditUser}
								/>
							)}
						/>
						<Route
							path="/admin/users/edit"
							render={() => (
								<Edit cookies={this.props.cookies} user={this.state.editUser} />
							)}
						/>

						<Route
							path="/admin/login"
							render={() => <AdminLogin cookies={this.props.cookies} />}
						/>
					</BrowserRouter>
				</CookiesProvider>
			</div>
		);
	}
}

export default withCookies(Typer);
