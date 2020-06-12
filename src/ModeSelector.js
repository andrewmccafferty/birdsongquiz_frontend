import React, { Component } from 'react';
import SelectionButton from './SelectionButton'
class ModeSelector extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<div>
				<h2>Choose a game mode</h2>
				{this.props.options.map(option =>
				<SelectionButton key={option.value} text={option.text} onClick={() => {
					this.props.onSelected(option.value)
				}
				}></SelectionButton>
			)}
			</div>
		)
	}
}

export default ModeSelector