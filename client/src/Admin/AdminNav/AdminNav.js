import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export class AdminNav extends Component {
	logout = () => {
		this.props.cookies.set('loggedin', false);
	};

	renderLoginout = () => {
		return this.props.cookies.get('loggedin') === 'true' ? (
			<NavLink to="/admin/login">
				<li onClick={this.logout}>
					Logout
					<span className="usernameprofile">
						{' ' + this.props.cookies.get('username')}
					</span>
				</li>
			</NavLink>
		) : (
			<NavLink to="/admin/login">
				<li>Login</li>
			</NavLink>
		);
	};
	render() {
		return (
			<div>
				<h1>Navigation</h1>
				<ul>
					<li>
						<NavLink to="../admin/users">Users</NavLink>
					</li>

					<li>
						<NavLink to="../admin/">Admin</NavLink>
					</li>
					{this.renderLoginout()}
				</ul>
			</div>
		);
	}
}

export default AdminNav;
