import React, { Component } from 'react';
import './Progress.css';

export class Progress extends Component {
	state = {
		goalPosition: ''
	};

	renderOpponentsProgress = () => {
		if (this.props.opponents) {
			return this.props.opponents.map(o => {
				if (o.username !== this.props.username) {
					return (
						<div
							key={o.username}
							className="playerProgress"
							style={{
								width: o.progress * 95 + '%',
								background: 'lightcoral'
							}}
						>
							{o.goalPosition}
						</div>
					);
				} else {
					return <div key={o.username} />;
				}
			});
		}
	};

	renderOpponentsWPM = () => {
		if (this.props.opponents) {
			return this.props.opponents.map(o => {
				if (o.username !== this.props.username) {
					return <div className="wpm">{Math.round(o.wpm)}</div>;
				} else {
					return <div key={o.username} />;
				}
			});
		}
	};

	render() {
		return (
			<div>
				<div className="racetrack">
					<div
						className="playerProgress"
						style={{ width: this.props.playerProgress * 95 + '%' }}
					>
						{this.props.goalPosition}
					</div>
					{this.renderOpponentsProgress()}
				</div>
				<div className="wpmcontainer">{this.renderOpponentsWPM()}</div>
			</div>
		);
	}
}

export default Progress;
