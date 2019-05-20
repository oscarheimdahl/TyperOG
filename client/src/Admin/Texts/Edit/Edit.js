import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import './Edit.css';

export class Edit extends Component {
	state = {
		title: '',
		author: '',
		content: '',
		_id: '',
		redirect: false,
		redirectToTexts: false
	};

	componentDidMount() {
		const { cookies, text } = this.props;
		if (cookies.get('loggedin') === 'false') {
			this.setState({ redirect: true });
		}
		this.setState({
			text,
			title: text.title,
			author: text.author,
			content: text.content,
			_id: text._id
		});
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
		const { title, author, content, _id } = this.state;
		axios
			.put(localStorage.getItem('API') + `api/texts/update/${_id}`, {
				title,
				author,
				content,
				token: this.props.cookies.get('token', { path: '/' })
			})
			.then(res => {
				if (res.status === 200)
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

	renderForm = () => {
		const { text } = this.state;
		return text ? (
			<form onSubmit={this.handleSubmit}>
				<h1>Editing: {text.title}</h1>
				<label>Title</label>
				<input
					type="text"
					name="title"
					onChange={this.handleTextinput}
					defaultValue={text.title}
				/>
				<label>Author</label>
				<input
					type="text"
					name="author"
					onChange={this.handleTextinput}
					defaultValue={text.author}
				/>
				<label>Content</label>
				<textarea
					name="content"
					onChange={this.handleTextinput}
					defaultValue={text.content}
				/>
				<button type="submit">Save</button>
			</form>
		) : (
			<p>Loading....</p>
		);
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
				{this.renderForm()}
			</div>
		);
	}
}

export default Edit;