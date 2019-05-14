import React, { Component } from 'react';
import './Users.css';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Navbar from '../AdminNav/AdminNav';

export class Users extends Component {
	state = {
		redirect: false
	};

	componentDidMount() {
		const { cookies } = this.props;
		console.log(cookies);
		if (cookies.get('loggedin') === 'false') {
			this.setState({ redirect: true });
		}
		/* axios
			.post(
				localStorage.getItem('API') + 'api/users/admin/authenticate',
				{
					token: cookies.get('token')
				}
			)
			.catch(err => {
				console.log(err);
				cookies.set('loggedin', false);
				this.setState({ redirect: true });
			}); */
	}

	renderRedirect = () => {
		if (this.state.redirect) return <Redirect to="/admin/login" />;
	};

	render() {
		return (
			<div>
				<Navbar cookies={this.props.cookies} />
				{this.renderRedirect()}
				<h1>Show Users here</h1>
				<p>With delete and edit</p>
			</div>
		);
	}
}

export default Users;
