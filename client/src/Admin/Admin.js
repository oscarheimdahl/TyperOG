import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Users from './Users/Users';
import Texts from './Texts/Texts';
import UserEdit from './Users/Edit/Edit';
import TextEdit from './Texts/Edit/Edit';
import AdminLogin from './Login/Login';
import Add from './Texts/Add/Add';
import Navbar from './AdminNav/AdminNav';

export class Admin extends Component {
	state = {
		editUser: '',
		editText: ''
	};

	setEditUser = user => {
		this.setState({ editUser: user });
	};

	setEditText = text => {
		console.log(text);
		this.setState({ editText: text });
	};

	render() {
		return (
			<div>
				<Navbar cookies={this.props.cookies} />
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
						<UserEdit
							cookies={this.props.cookies}
							user={this.state.editUser}
						/>
					)}
				/>

				<Route
					exact
					path="/admin/texts"
					render={() => (
						<Texts
							cookies={this.props.cookies}
							setText={this.setEditText}
						/>
					)}
				/>
				<Route
					path="/admin/texts/edit"
					render={() => (
						<TextEdit
							cookies={this.props.cookies}
							text={this.state.editText}
						/>
					)}
				/>
				<Route
					path="/admin/texts/add"
					render={() => <Add cookies={this.props.cookies} />}
				/>

				<Route
					path="/admin/login"
					render={() => <AdminLogin cookies={this.props.cookies} />}
				/>
			</div>
		);
	}
}

export default Admin;
