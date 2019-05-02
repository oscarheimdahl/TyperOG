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
						<div>
							<div className="progressUsername">{o.username}</div>
							<div
								key={o.username}
								className="playerProgress"
								style={{
									width: o.progress * 99 + '%',
									background: 'lightcoral'
								}}
							/>
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
					return (
						<div key={o.username} className="wpm">
							{o.wpm === null ? 0 : Math.round(o.wpm)} WPM
						</div>
					);
				} else {
					return <div key={o.username} />;
				}
			});
		}
	};

	renderOpponentsGoalPosition = () => {
		if (this.props.opponents) {
			return this.props.opponents.map(o => {
				if (o.username !== this.props.username) {
					return (
						<div key={o.username} className="goalpos">
							{o.goalPosition}
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
					<div className="progressUsername">{this.props.username}</div>
					<div
						className="playerProgress"
						style={{
							width: this.props.playerProgress * 99 + '%'
						}}
					/>
					{this.renderOpponentsProgress()}
				</div>
				<div className="goalposcontainer">
					<div className="goalpos">{this.props.goalPosition}</div>
					{this.renderOpponentsGoalPosition()}
				</div>
			</div>
		);
	}
}

export default Progress;
