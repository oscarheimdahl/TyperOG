import React, { Component } from 'react';

export class Edit extends Component {
	render() {
		return (
			<div className="edit-user">
				<form onSubmit={this.handleSubmit}>
					<input type="text" />
				</form>
			</div>
		);
	}
}

export default Edit;
