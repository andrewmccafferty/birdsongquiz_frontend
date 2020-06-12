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

  constructor(props) {
      super(props);
      this.state = {
          gameMode: null,
          headToHeadSpeciesList: null,
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
  render(){
    return (
        <div className="App">
            <header className="App-header">
                <h1 className="App-title">
                    {this.state.gameMode && <a href="#" onClick={() => this.onRestartClicked()}><FontAwesomeIcon style={{'fontSize': '30px', 'margin': '5px', 'vertical-align': 'middle'}} icon={faBackspace} /></a>}
                    Birdsong quiz</h1>
                {this.state.gameMode === "HeadToHead" && this.state.headToHeadSpeciesList &&
                    this.headToHeadLabel()
                }
            </header>
            {!this.state.gameMode && <ModeSelector options={this.state.modeOptions} onSelected={
                selectedMode => this.onModeSelected(selectedMode)
            }
            >
            </ModeSelector>}
            { this.state.gameMode === "HeadToHead" && !this.state.headToHeadSpeciesList &&
                <HeadToHeadSpeciesSelector onSelectionComplete={headToHeadSpeciesList => this.onHeadToHeadSpeciesSelected(headToHeadSpeciesList)}/>
            }
            { this.state.gameMode && (this.state.gameMode !== "HeadToHead" || (this.state.gameMode === "HeadToHead" && this.state.headToHeadSpeciesList)) &&
                    <GameControls headToHeadSpecies={this.state.headToHeadSpeciesList} isBeginnerMode={this.state.gameMode === "Beginner"}/>}
        </div>
    )
  }
}

export default App;
