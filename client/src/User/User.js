import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';
import './User.css';

export class User extends Component {
	state = {
		redirect: false
	};
	componentDidMount() {
		if (this.props.cookies.get('loggedin') !== 'true') {
			this.setState({ redirect: true });
		} else {
			this.getUserStats();
		}
	}

	renderRedirect() {
		if (this.state.redirect) return <Redirect to="/" />;
	}

	renderUserStats = () => {
		return (
			<div className="userstats">
				<h1>{this.props.cookies.get('username')}</h1>
				<div>
					Games played:
					<span className="user-stat">
						{this.state.gamesPlayed ? this.state.gamesPlayed : null}
					</span>
				</div>
				<div className="user-averageWPM userstat">
					Average WPM:{' '}
					<span className="user-stat">
						{this.state.averageWPM ? Math.round(this.state.averageWPM) : null}
					</span>
				</div>
				<div>
					Highest WPM:{' '}
					<span className="user-stat">
						{this.state.highestWPM ? Math.round(this.state.highestWPM) : null}
					</span>
				</div>
				<br />
				Latest 10 games:
				<table className="user-latestGames userstat">
					<tbody>
						{this.state.latestGames
							? this.state.latestGames.map((gameWPM, i) => {
									return (
										<tr key={i}>
											<td className="oldGame">{Math.round(gameWPM)}</td>
										</tr>
									);
							  })
							: null}
					</tbody>
				</table>
			</div>
		);
	};

	getUserStats = () => {
		Axios.get(
			localStorage.getItem('API') +
				'api/users/get/' +
				this.props.cookies.get('username'),
			{
				token: this.props.cookies.get('token')
			}
		)
			.then(res => {
				let data = res.data;
				this.setState({
					averageWPM: data.averageWPM,
					highestWPM: data.highestWPM,
					latestGames: data.latestGames.reverse(),
					gamesPlayed: data.gamesPlayed
				});
			})
			.catch(err => {
				console.log(err);
			});
	};

	render() {
		return (
			<div>
				{this.renderRedirect()}
				<Navbar cookies={this.props.cookies} />
				{this.renderUserStats()}
			</div>
		);
	}
}

export default User;
