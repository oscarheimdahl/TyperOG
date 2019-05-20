import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export class Add extends Component {
	state = {
		title: '',
		author: '',
		content: '',
		redirect: false,
		redirectToTexts: false
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

	handleSubmit = e => {
		e.preventDefault();
		const { title, author, content } = this.state;
		axios
			.post(localStorage.getItem('API') + 'api/texts/add', {
				title,
				author,
				content,
				token: this.props.cookies.get('token', { path: '/' })
			})
			.then(res => {
				this.setState({ redirectToTexts: true });
			})
			.catch(err => {
				console.log(err);
			});
	};

	handleTextinput = e => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	renderRedirect = () => {
		if (this.state.redirect) return <Redirect to="/admin/login" />;
	};
	renderRedirectToTexts = () => {
		if (this.state.redirectToTexts) return <Redirect to="/admin/texts" />;
	};
	render() {
		return (
			<div className="edit-text">
				{this.renderRedirect()}
				{this.renderRedirectToTexts()}
				<form onSubmit={this.handleSubmit}>
					<label>Title</label>
					<input
						type="text"
						name="title"
						onChange={this.handleTextinput}
					/>
					<label>Author</label>
					<input
						type="text"
						name="author"
						onChange={this.handleTextinput}
					/>
					<label>Content</label>
					<textarea name="content" onChange={this.handleTextinput} />
					<button type="submit">Add</button>
				</form>
			</div>
		);
	}
}

export default Add;
