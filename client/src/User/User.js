import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';

export class User extends Component {
	state = {
		redirect: false
	};
	componentDidMount() {
		if (this.props.cookies.get('loggedin') !== 'true') {
			this.setState({ redirect: true });
		}
	}

	renderRedirect() {
		if (this.state.redirect) return <Redirect to="/" />;
	}

	renderUserStats = () => {
		Axios.get(
			localStorage.getItem('API') +
				'api/users/get/' +
				this.props.cookies.get('username'),
			{
				token: this.props.cookies.get('token')
			}
		)
			.then(res => {
				console.log(res);
			})
			.catch(err => {
				console.log(err);
			});
	};

	render() {
		return (
			<div>
				{this.renderRedirect()}
				<Navbar cookies={this.props.cookies} />
				{this.renderUserStats()}
			</div>
		);
	}
}

export default User;
