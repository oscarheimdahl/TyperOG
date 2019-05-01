import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function(props) {
	function logout() {
		props.cookies.remove('token');
		props.cookies.remove('username');
	}

	function renderLoginout() {
		return props.cookies.get('username') ? (
			<NavLink to="/">
				<li onClick={logout}>Logout</li>
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
				<h2>{props.cookies.get('username')}</h2>
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
