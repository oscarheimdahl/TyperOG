import React, { Component } from 'react';
import './Users.css';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';

export class Users extends Component {
	state = {
		redirect: false,
		users: []
	};

	componentDidMount() {
		const { cookies } = this.props;
		if (cookies.get('loggedin') === 'false') {
			this.setState({ redirect: true });
		}

		this.authenticateUser(this.getUsers);
	}

	authenticateUser = thenAction => {
		const { cookies } = this.props;
		axios
			.post(
				localStorage.getItem('API') + 'api/users/admin/authenticate',
				{
					token: cookies.get('token', { path: '/' })
				}
			)
			.then(thenAction)
			.catch(err => {
				console.log(err);
				cookies.set('loggedin', false);
				this.setState({ redirect: true });
			});
	};

	deleteUser = (thenAction, id) => {
		const { cookies } = this.props;
		axios
			.delete(localStorage.getItem('API') + `api/users/remove/${id}`, {
				data: {
					token: cookies.get('token', { path: '/' })
				}
			})
			.then(thenAction)
			.catch(err => {
				console.log(err);
			});
	};

	getUsers = () => {
		axios.get(localStorage.getItem('API') + 'api/users/get').then(res => {
			this.setState({
				users: res.data
			});
		});
	};

	renderRedirect = () => {
		if (this.state.redirect) return <Redirect to="/admin/login" />;
	};

	handleDelete = id => {
		this.deleteUser(this.getUsers, id);
	};

	renderAdmin = admin => {
		return admin ? <p>True</p> : <p>False</p>;
	};

	handleEdit = user => {
		this.props.setUser(user);
	};

	renderUsers = () => {
		return this.state.users ? (
			this.state.users.map(u => {
				return (
					<tr key={u._id} className="user">
						<td>{u.username}</td>
						<td>{u.email}</td>
						<td>{u.password}</td>
						<td>{Math.round(u.gamesPlayed * 100) / 100}</td>
						<td>{Math.round(u.averageWPM * 100) / 100}</td>
						<td>{Math.round(u.highestWPM * 100) / 100}</td>
						<td>{this.renderAdmin(u.admin)}</td>
						<td
							className="edit-button"
							onClick={() => this.handleEdit(u)}
						>
							<Link to="./users/edit">Edit</Link>
						</td>
						<td
							className="delete-button"
							onClick={() => this.handleDelete(u._id)}
						>
							Delete
						</td>
					</tr>
				);
			})
		) : (
			<p>Getting users...</p>
		);
	};

	render() {
		return (
			<div className="admin-users">
				{this.renderRedirect()}
				<div className="admin-users-container">
					<table>
						<tbody>
							<tr>
								<th>Username</th>
								<th>Email</th>
								<th>Password</th>
								<th>Games played</th>
								<th>Average WPM</th>
								<th>Highest WPM</th>
								<th>Admin</th>
							</tr>
							{this.renderUsers()}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
}

export default Users;
