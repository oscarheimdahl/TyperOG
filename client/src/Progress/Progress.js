import React, { Component } from 'react';
import './Progress.css';

export class Progress extends Component {
	render() {
		return (
			<div className="racetrack">
				<div
					className="playerProgress"
					style={{ width: this.props.playerProgress * 95 + '%' }}
				>
					You
				</div>
			</div>
		);
	}
}

export default Progress;
