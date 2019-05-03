import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function(props) {
	function logout() {
		props.cookies.remove('token');
		props.cookies.remove('username');
		props.cookies.set('loggedin', false);
	}

	function renderLoginout() {
		return props.cookies.get('loggedin') === 'true' ? (
			<NavLink to="/">
				<li onClick={logout}>
					Logout
					<span className="usernameprofile">
						{' ' + props.cookies.get('username')}
					</span>
				</li>
			</NavLink>
		) : (
			<NavLink to="/login">
				<li>Login</li>
			</NavLink>
		);
	}

	return (
		<header className="header">
			<div className="logo">
				<h2>TYPER</h2>
			</div>
			<nav>
				<ul>
					<NavLink to="/">
						<li>Home</li>
					</NavLink>
					<NavLink to="/play">
						<li>Play</li>
					</NavLink>
					{renderLoginout()}
				</ul>
			</nav>
		</header>
	);
}
