import React, { PureComponent } from 'react';

class SelectionButton extends PureComponent {
	render() {
		return (<div style={{
			'backgroundColor': 'gray',
			'color': 'white',
			'border': 'solid 1px',
			'height': '40px',
			'verticalAlign': 'middle',
			'fontSize': '20px',
			'width': '50%',
			'marginLeft': '25%',
			'marginBottom': '5px',
			'cursor': 'pointer',
			'paddingTop': '5px'
		}} onClick={() => this.props.onClick()}>
			{this.props.text}
		</div>)
	}
}

export default SelectionButton