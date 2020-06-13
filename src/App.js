import React, { Component } from 'react';
import './App.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';
import ReactGA from 'react-ga'
import GameControls from "./GameControls";
import ModeSelector from "./ModeSelector";
import HeadToHeadSpeciesSelector from "./HeadToHeadSpeciesSelector";
import {faBackspace} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
class App extends Component {
    componentWillMount = function() {
        ReactGA.initialize('UA-117907312-1');
  }

  decodePresetSpecies = () => {
      try {
          const urlParams = new URLSearchParams(window.location.search)
          const presetSpeciesBase64 = urlParams.get('presetSpecies')
          if (!presetSpeciesBase64) {
              return null
          }
          const presetSpecies = JSON.parse(atob(presetSpeciesBase64))
          return presetSpecies
      } catch (e) {
          console.error("error decoding preset species", e)
          return null
      }
  }

  constructor(props) {
      super(props);
      const presetSpecies = this.decodePresetSpecies()
      this.state = {
          gameMode: presetSpecies != null ? "HeadToHead" : null,
          headToHeadSpeciesList: presetSpecies,
          modeOptions: [
              {
                  value: 'Beginner',
                  text: 'Beginner mode'
              },
              {
                  value: 'HeadToHead',
                  text: 'Head to Head'
              },
              {
                  value: 'Random',
                  text: 'Random, increasing difficulty'
              }
          ]
      }

  }
  onModeSelected = mode => {
      this.setState((prevState, props) => {
          return {
              ...props,
              gameMode: mode
          }
      })
  }

  onRestartClicked = () => {
        if (window.confirm("Are you sure you want to restart?")) {
            this.setState((prevState, props) => {
                return {
                    ...props,
                    gameMode: null,
                    headToHeadSpeciesList: null
                }
            })
        }
  }

  onHeadToHeadSpeciesSelected = headToHeadSpeciesList => {
        this.setState((prevState, props) => {
            return {
                ...props,
                headToHeadSpeciesList
            }
        })
  }

  headToHeadLabel = () =>
       `Head to head species: ${this.state.headToHeadSpeciesList.map(species => species.Species).join(", ")}`

    headToHeadSharingLink = () => `${window.location.origin}?presetSpecies=${btoa(JSON.stringify(this.state.headToHeadSpeciesList))}`
  render(){
    return (
        <div className="App">
            <header className="App-header">
                <h1 className="App-title">
                    {this.state.gameMode && <button className={'Icon-Button'} onClick={() => this.onRestartClicked()}><FontAwesomeIcon
                        style={{'color': 'white', 'fontSize': '30px', 'margin': '5px', 'vertical-align': 'middle'}} icon={faBackspace} title={'Restart game'} /></button>}
                    Birdsong quiz</h1>
                {this.state.gameMode === "HeadToHead" && this.state.headToHeadSpeciesList &&
                    this.headToHeadLabel()
                }
                {
                    this.state.gameMode === "HeadToHead" && this.state.headToHeadSpeciesList
                    && <a href={this.headToHeadSharingLink()} style={{'margin-left': '5px'}}>permalink</a>
                }
            </header>
            <div className={'Game-Area'}>
            {!this.state.gameMode && <ModeSelector options={this.state.modeOptions} onSelected={
                                                    selectedMode => this.onModeSelected(selectedMode)
            }
    />}
            { this.state.gameMode === "HeadToHead" && !this.state.headToHeadSpeciesList &&
                <HeadToHeadSpeciesSelector onSelectionComplete={headToHeadSpeciesList => this.onHeadToHeadSpeciesSelected(headToHeadSpeciesList)}/>
            }
            { this.state.gameMode && (this.state.gameMode !== "HeadToHead" || (this.state.gameMode === "HeadToHead" && this.state.headToHeadSpeciesList)) &&
                    <GameControls headToHeadSpecies={this.state.headToHeadSpeciesList} isBeginnerMode={this.state.gameMode === "Beginner"}/>}
            </div>
        </div>
    )
  }
}

export default App;
