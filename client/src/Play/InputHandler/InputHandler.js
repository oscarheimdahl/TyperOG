import React, { Component } from 'react';
import './InputHandler.css';

export class InputHandler extends Component {
	state = {
		wordIndex: 0,
		spelling: true,
		words: this.props.text.split(' '),
		inputText: '',
		completedText: [],
		remainingText: this.props.text.split(' '),
		startTime: null,
		endTime: null,
		progress: 0
	};

	tick = () => {
		setTimeout(_ => {
			this.setWPM();
			const { progress } = this.state;
			const { wpm, emit, complete } = this.props;
			let data = { progress: progress, wpm: wpm };
			// this.props.emit('progress', progress);
			emit('progress', data);
			if (complete) {
				emit('progress', data);
				// this.props.emit('time', endTime - startTime);
				// this.props.emit('wpm', wpm);
			} else {
				this.tick();
			}
		}, 1000);
	};

	setWPM = () => {
		this.props.setWPM(
			(this.state.wordIndex / (Date.now() - this.state.startTime)) * 60 * 1000
		);
	};

	handleInput = input => {
		if (!this.state.startTime) {
			this.tick();
			this.setState({ startTime: Date.now() });
		}
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
			this.setTextWord(input, onLastWord);
			if (onLastWord) {
				this.setState({ endTime: Date.now() });
				this.props.setComplete();
			}
		} else if (correctString === input) {
			this.setState({
				spelling: true
			});
			this.setTextLetter(input, restString);
		} else {
			this.setState({ spelling: false });
		}
		this.setProgress();
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
	setTextWord(input, onLastWord) {
		this.state.completedText.pop();
		this.state.completedText.push(input);
		if (!onLastWord) this.state.completedText.push('');
		this.state.remainingText.shift();
	}

	setProgress = () => {
		let prog = (this.state.completedText.length - 1) / this.state.words.length;
		if (
			this.state.completedText[this.state.wordIndex] ===
				this.state.words[this.state.words.length - 1] &&
			this.state.wordIndex === this.state.words.length - 1
		) {
			prog = 1;
		}
		this.setState({ progress: prog }); //TODO works?
		this.props.setProgress(prog);
	};

	setCurrentWordStyle = () => {
		return this.state.spelling
			? {
					color: 'green',
					textDecoration: 'underline'
			  }
			: {
					color: 'lightcoral',
					textDecoration: 'underline'
			  };
	};

	setInputStyle = () => {
		return this.state.spelling === true
			? {
					background: '#DDFFDD'
			  }
			: {
					background: 'pink'
			  };
	};

	setTextStyle = () => {
		return this.state.complete ? { background: '#DDFFDD' } : {};
	};
	setCompletedTextStyle = () => {
		return this.props.complete ? { color: 'lightgreen' } : { color: 'green' };
	};

	render() {
		let completedText;
		let currentWord;
		if (!this.props.complete) {
			completedText = [...this.state.completedText];
			completedText.pop();
			currentWord = this.state.completedText[
				this.state.completedText.length - 1
			];
		} else {
			completedText = this.state.completedText;
			currentWord = '';
		}

		let currentWordStyle = this.setCurrentWordStyle();
		let inputStyle = this.setInputStyle();
		let textStyle = this.setTextStyle();
		let completedTextStyle = this.setCompletedTextStyle();

		let time = 0;
		if (this.state.startTime) {
			time = this.props.complete
				? (this.state.endTime - this.state.startTime) / 1000
				: (Date.now() - this.state.startTime) / 1000;
			time = Math.round(time);
		}

		return (
			<div>
				<div className="container">
					<div className="text" style={textStyle}>
						<span style={completedTextStyle}>{completedText}</span>
						<span style={currentWordStyle}>{currentWord}</span>
						<span>{this.state.remainingText.map(word => word + ' ')}</span>
					</div>
					<input
						value={this.state.inputText}
						type="text"
						placeholder="..."
						className="inputfield"
						style={inputStyle}
						onChange={evt => {
							if (!this.props.complete) {
								this.handleInput(evt.target.value);
							}
						}}
					/>
					Time: {time}
					<br />
					WPM: {Math.round(this.props.wpm)}
				</div>
			</div>
		);
	}
}

export default InputHandler;
