import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Texts.css';

export class Texts extends Component {
	state = {};
	componentDidMount() {
		const { cookies } = this.props;
		if (cookies.get('loggedin') === 'false') {
			this.setState({ redirect: true });
		}

		this.authenticateUser(this.getTexts);
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

	getTexts = () => {
		axios
			.get(localStorage.getItem('API') + 'api/texts/get')
			.then(res => {
				this.setState({ texts: res.data });
			})
			.catch(err => {
				console.log(err);
			});
	};

	handleEdit = t => {
		this.props.setText(t);
	};

	renderTexts = () => {
		return this.state.texts ? (
			this.state.texts.map(t => {
				return (
					<tr key={t._id}>
						<td>{t.title}</td>
						<td>{t.author}</td>
						<td>{t.content}</td>
						<td
							className="edit-button"
							onClick={() => this.handleEdit(t)}
						>
							<Link to="./texts/edit">Edit</Link>
						</td>
						<td
							className="delete-button"
							onClick={() => this.handleDelete(t._id)}
						>
							Delete
						</td>
					</tr>
				);
			})
		) : (
			<p>Getting texts....</p>
		);
	};

	render() {
		return (
			<div className="admin-texts">
				<table>
					<tbody>
						<tr>
							<th>Title</th>
							<th>Author</th>
							<th>Content</th>
						</tr>
						{this.renderTexts()}
					</tbody>
				</table>
			</div>
		);
	}
}

export default Texts;
