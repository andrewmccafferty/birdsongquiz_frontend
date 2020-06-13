import React, { PureComponent } from 'react';

class SelectionButton extends PureComponent {
	render() {
		return (<div className={'Selection-Button'} onClick={() => this.props.onClick()}>
			{this.props.text}
		</div>)
	}
}

export default SelectionButton