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
					<div>{this.renderOpponents()}</div>
				</div>
				{this.renderOpponents()}
			</div>
		);
	}

	renderOpponents = () => {
		if (this.props.opponents) {
			console.log(this.props.opponents);
			return this.props.opponents.map(o => {
				if (o.username != this.props.username) {
					return (
						<div
							key={o.username}
							className="playerProgress"
							style={{ width: o.progress * 95 + '%', background: 'lightcoral' }}
						/>
					);
				}
			});
		}
	};
}

export default Progress;
