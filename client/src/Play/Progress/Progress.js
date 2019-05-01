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
					console.log(o.wpm);
					return (
						<div className="wpm">
							{o.wpm === null ? 0 : Math.round(o.wpm)} WPM
						</div>
					);
				} else {
					return <div key={o.username} />;
				}
			});
		}
	};

	render() {
		return (
			<div className="racecontainer">
				<div className="wpmcontainer">
					<div className="wpm">{Math.round(this.props.wpm)} WPM</div>
					{this.renderOpponentsWPM()}
				</div>
				<div className="racetrack">
					<div
						className="playerProgress"
						style={{ width: this.props.playerProgress * 95 + '%' }}
					>
						{this.props.goalPosition}
					</div>
					{this.renderOpponentsProgress()}
				</div>
			</div>
		);
	}
}

export default Progress;
