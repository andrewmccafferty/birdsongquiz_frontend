import React, { Component } from 'react';
import SelectionButton from './SelectionButton'
class ModeSelector extends Component {
	render() {
		return (
			<div>
				<h2>Choose a game mode</h2>
				{this.props.options.map(option =>
				<SelectionButton key={option.value}
								 text={option.text}
								 onClick={() => this.props.onSelected(option.value)}/>
			)}
			</div>
		)
	}
}

export default ModeSelector