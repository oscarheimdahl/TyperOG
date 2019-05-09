import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Users from './Users/Users';
import Login from './Login/Login';
import AdminNav from './AdminNav/AdminNav';

export class Admin extends Component {
	render() {
		return (
			<div className="admin-home">
				<AdminNav />
				<Route path="admin/users" Component={Users} />
			</div>
		);
	}
}

export default Admin;
