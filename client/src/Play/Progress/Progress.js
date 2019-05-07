import React, { Component } from 'react';
import './Progress.css';

export class Progress extends Component {
	state = {
		goalPosition: ''
	};

	renderOpponentsProgress = () => {
		if (this.props.opponents) {
			if (this.props.opponents.length > 1) {
				return this.props.opponents.map(o => {
					if (o.username !== this.props.username) {
						return (
							<div key={o.username}>
								<div className="progressUsername">{o.username}</div>
								<div
									className="playerProgress"
									style={{
										width: o.progress * 99 + '%',
										background: o.color
									}}
								/>
							</div>
						);
					} else {
						if (!this.state.playerColor)
							this.setState({ playerColor: o.color });
						return <div key={o.username} />;
					}
				});
			}
		}
	};

	renderWaitingForOpponents = () => {
		if (!this.props.startTime) {
			return <div className="opponentspending">-Waiting for players-</div>;
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
							width: this.props.playerProgress * 99 + '%',
							background: this.state.playerColor
						}}
					/>
					{this.renderWaitingForOpponents()}
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
