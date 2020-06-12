import React, {Component} from "react";
import {API_ROOT} from "./api-config";
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

class HeadToHeadSpeciesSelector extends Component {
	callApi = async (path) => {
		const response = await fetch(`${API_ROOT}/${path}`);
		const body = await response.json();

		if (response.status !== 200) throw Error(body.message);

		return body;
	};

	constructor(props) {
		super(props)
		this.state = {
			selectedSpeciesList: [],
			speciesList: [],
			typeaheadRef: null
		}
		this.callApi('species').then((result) => {
			this.setState((prevState, props) => {
				return {
					...props,
					speciesList: result.species
				}
			})
		})
	}

	onSpeciesSelected = species => {
		const speciesAlreadySelected = selectedSpecies => this.state.selectedSpeciesList.some(item => item.Species === selectedSpecies.Species)
		if (!species || speciesAlreadySelected(species)) {
			return
		}
		this.setState((prevState, props) => {
			const newList = prevState.selectedSpeciesList.concat(species)
			return {
				...props,
				selectedSpeciesList: newList
			}
		})
	}

	onSpeciesRemoved = species => {
		this.setState((prevState, props) => {
			const newList = prevState.selectedSpeciesList.filter(element => element !== species)
			return {
				...props,
				selectedSpeciesList: newList
			}
		})
	}

	onSelectionComplete =() => {
		this.props.onSelectionComplete(this.state.selectedSpeciesList)
	}

	render() {
		return (
			<div>
				<h2>Select some species to go head to head</h2>
				<div>
					<button disabled={!this.state.selectedSpeciesList || this.state.selectedSpeciesList.length < 2} onClick={() => this.onSelectionComplete()}>Finish selection</button>
				</div>
				<Typeahead
				className={'Species-Selection'}
				labelKey="Species"
				options={this.state.speciesList}
				placeholder="Choose a species"
				minLength={1}
				clearButton={true}
				onChange={(options) => {
					this.onSpeciesSelected(options[0]);
				}}
			/>
				{this.state.selectedSpeciesList && this.state.selectedSpeciesList.map(species =>
					<div className={'Selected-Species'} key={species.Species}>
						{species.Species}
						<button onClick={() => this.onSpeciesRemoved(species)} className={'Close-Button'}>
							<FontAwesomeIcon  style={{'fontSize': '20px', 'margin': '5px', 'vertical-align': 'middle'}} icon={faTimes} />
						</button>
					</div>
				)
				}
			</div>
		)
	}
}

export default HeadToHeadSpeciesSelector