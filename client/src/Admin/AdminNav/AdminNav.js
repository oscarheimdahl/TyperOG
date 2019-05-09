import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export class AdminNav extends Component {
	render() {
		return (
			<div>
				<h1>Navigation</h1>
				<NavLink to="admin/users">
					<p>Users</p>
				</NavLink>
			</div>
		);
	}
}

export default AdminNav;
