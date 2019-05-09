import React from 'react';
import './Home.css';
import Navbar from '../Navbar/Navbar';

export default function Home(props) {
	return (
		<div>
			<Navbar cookies={props.cookies} />
			<div className="homePage">
				<div className="welcome">
					<h1>Welcome to Typer</h1>
					<h4>The place to improve speed</h4>
				</div>
			</div>
		</div>
	);
}
