import React, { Component } from 'react';
import './InputHandler.css';

export class InputHandler extends Component {
	state = {
		input: '',
		letterIndex: 0,
		wordIndex: 0,
		spelling: true,
		words: this.props.text.split(' '),
		inputText: '',
		completedText: [],
		remainingText: this.props.text.split(' '),
		complete: false
	};

	constructor(props) {
		super(props);
		this.inputField = React.createRef();
	}

	handleInput = input => {
		this.setState({ inputText: input });
		let currentWord = this.state.words[this.state.wordIndex];
		let correctString = currentWord.substring(0, input.length);
		let restString = currentWord.substring(input.length, currentWord.length);
		let onLastWord = this.state.wordIndex === this.state.words.length - 1;

		if (
			(input === currentWord && onLastWord) ||
			(input === currentWord + ' ' && !onLastWord)
		) {
			this.setState({
				inputText: '',
				wordIndex: this.state.wordIndex + 1
			});
			this.setTextWord(input);
			if (onLastWord) this.setState({ complete: true });
		} else if (correctString === input) {
			this.setState({
				spelling: true
			});
			this.setTextLetter(input, restString);
		} else {
			this.setState({ spelling: false });
		}
	};

	/**
	 * Adds to the completed typed text and removes that text from the remaining text to type.
	 * This so the completed text and the remaining text can be displayed differently.
	 */
	setTextLetter(input, restString) {
		this.state.completedText.pop();
		this.state.completedText.push(input);
		this.state.remainingText.shift();
		this.state.remainingText.unshift(restString);
	}

	/**
	 * Works similarly to 'setTextLetter' but a little different as a word is completed.
	 */
	setTextWord(input) {
		this.state.completedText.pop();
		this.state.completedText.push(input);
		this.state.completedText.push('');
		this.state.remainingText.shift();
	}

	render() {
		let temp = [...this.state.completedText];
		temp.pop();
		return (
			<div className="container">
				<input
					value={this.state.inputText}
					type="text"
					placeholder="..."
					className="inputfield"
					style={
						this.state.spelling === true
							? {
									background: '#DDFFDD'
							  }
							: {
									background: 'pink'
							  }
					}
					onChange={evt => {
						if (!this.state.complete) {
							this.handleInput(evt.target.value);
						}
					}}
				/>
				<br />
				<div
					className="text"
					style={this.state.complete ? { background: 'lightgreen' } : {}}
				>
					<span style={{ color: 'green' }}>{temp}</span>
					<span
						style={{
							color: 'green',
							textDecoration: 'underline'
						}}
					>
						{this.state.completedText[this.state.completedText.length - 1]}
					</span>
					<span>{this.state.remainingText.map(word => word + ' ')}</span>
				</div>
			</div>
		);
	}
}

export default InputHandler;
