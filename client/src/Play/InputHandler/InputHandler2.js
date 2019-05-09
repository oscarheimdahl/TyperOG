import React, { Component } from 'react';
import './InputHandler.css';
let placeholder = 'Type here...';
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
		progress: 0,
		overflow: '',
		lastCorrectString: ''
	};

	componentDidMount() {
		this.tick();
		this.resetRemainingTextOverflow();
	}

	resetRemainingTextOverflow = () => {
		let remainingTextOverflow = this.props.text.split(' ');
		let rto = [];
		remainingTextOverflow.map((w, i) => {
			if (i < remainingTextOverflow.length - 1) w = w + ' ';
			rto.push(w);
		});
		this.setState({ remainingTextOverflow: rto });
	};

	componentDidUpdate(prevProps) {
		if (this.props.text !== prevProps.text) {
			this.setState({
				words: this.props.text.split(' '),
				remainingText: this.props.text.split(' ')
			});
		}
	}
	componentWillUnmount() {
		placeholder = 'Type here...';
	}

	tick = () => {
		setTimeout(() => {
			this.emitProgress();
			if (!this.props.complete) {
				this.tick();
			}
		}, 1000);
	};

	emitProgress = () => {
		this.setWPM();
		const { progress } = this.state;
		const { wpm, emit } = this.props;
		let data = { progress: progress, wpm: wpm };
		emit('progress', data);
	};

	setWPM = () => {
		let completedCharacters = this.state.completedText.slice().join('').length;
		let time = (Date.now() - this.props.startTime) / 1000;
		if (this.state.endTime)
			time = (this.state.endTime - this.props.startTime) / 1000;
		let wpm = 0;
		if (time > 0) wpm = (completedCharacters / 5 / time) * 60;
		this.props.setWPM(wpm);
	};

	handleInput = input => {
		// if (this.props.startTime && Date.now() > this.props.startTime) {
		this.setState({ inputText: input, overflow: '' });
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
			this.resetRemainingTextOverflow();
			this.setState({
				spelling: true,
				lastCorrectString: correctString
			});
			this.setTextLetter(input, restString);
		} else {
			let overflow = this.setOverFlowText(
				input.length - this.state.lastCorrectString.length + 1
			);
			this.setRemainingText(overflow.length);
			this.setState({
				spelling: false,
				overflow: overflow
			});
		}
		this.setProgress();
		// }
	};

	setOverFlowText = length => {
		let overflow = '';
		let i = 0;
		while (overflow.length + i < length) {
			overflow += this.state.remainingText[i] + ' ';
			i++;
		}
		return overflow.substring(0, length - 1);
	};

	setRemainingText = overflow => {
		console.log(overflow);
		let remainingTextOverflow = [...this.state.remainingTextOverflow];
		while (overflow > remainingTextOverflow[0].length) {
			overflow -= remainingTextOverflow[0].length;
			remainingTextOverflow.shift();
		}
		remainingTextOverflow[0] = remainingTextOverflow[0].substring(
			overflow - 1,
			remainingTextOverflow[0].length
		);

		this.setState({ remainingTextOverflow: remainingTextOverflow });
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
					color: '#FFF',
					textDecoration: 'underline'
			  }
			: {
					// color: '#FF5964',
					textDecoration: 'underline'
			  };
	};

	setInputStyle = () => {
		return this.state.spelling === true
			? { background: 'transparent' }
			: {
					background: 'rgba(255,100,100,0.2)'
			  };
	};

	setTextStyle = () => {
		return this.state.complete ? { background: '#33EEaa' } : {};
	};

	setCompletedTextStyle = () => {
		return { color: '#AAA' };
	};

	setRemainingTextStyle = () => {
		return { color: '#DDD' };
	};

	renderStartTime = () => {
		let startTime = '';
		let hide;

		if (this.props.startTime && Date.now() - this.props.startTime < 0) {
			startTime = Math.round(-((Date.now() - this.props.startTime) / 1000));
			if (startTime === 0) startTime = 1;
		} else if (this.props.startTime) {
			placeholder = '';
			hide = { display: 'none' };
			if (this.textInput && this.props.startTime) this.textInput.focus();
		}

		return (
			<div className="startTime" style={hide}>
				{startTime}
			</div>
		);
	};

	renderTextbox = () => {
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
		let completedTextStyle = this.setCompletedTextStyle();
		let remainingTextStyle = this.setRemainingTextStyle();
		return (
			<div className="text">
				<span style={completedTextStyle}>{completedText}</span>
				<span style={currentWordStyle}>{currentWord}</span>
				<span style={{ color: 'blue' }}>{this.state.overflow}</span>
				{this.state.spelling ? (
					<span style={remainingTextStyle}>
						{this.state.remainingText.map(word => word + ' ')}
					</span>
				) : (
					<span>
						{this.state.remainingTextOverflow.map(word => word + ' ')}
					</span>
				)}
			</div>
		);
	};

	renderInputfield = () => {
		let inputStyle = this.setInputStyle();
		return (
			<input
				autoComplete="off"
				autoCorrect="off"
				autoCapitalize="off"
				spellCheck="false"
				placeholder={placeholder}
				value={this.state.inputText}
				type="text"
				ref={input => {
					this.textInput = input;
				}}
				className="inputfield"
				style={inputStyle}
				onChange={evt => {
					if (!this.props.complete) {
						this.handleInput(evt.target.value);
					}
				}}
			/>
		);
	};

	render() {
		return (
			<div>
				<div className="container">
					{this.renderStartTime()}
					{this.renderTextbox()}
					{this.renderInputfield()}
				</div>
			</div>
		);
	}
}

export default InputHandler;
