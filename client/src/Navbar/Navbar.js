import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function(props) {
	function logout() {
		props.cookies.remove('token');
		props.cookies.remove('username');
	}
	return (
		<header className="header">
			<div className="logo">
				<p>Logo</p>
			</div>
			<nav>
				<ul>
					<NavLink to="/login">
						<li>login</li>
					</NavLink>
					<NavLink to="/play">
						<li>play</li>
					</NavLink>
					<NavLink to="/">
						<li>home</li>
					</NavLink>
					<NavLink to="/">
						<li onClick={logout}>logout</li>
					</NavLink>
				</ul>
			</nav>
		</header>
	);
}
