import React, { Component } from 'react';
import './App.css';
import { API_ROOT } from './api-config';

import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        birdsongId: "",
        species: "",
        noRecordingFound: false,
        loading: false,
        showSpecies: false,
        speciesList: [],
        selectedSpeciesGuess: null,
        counter: 0,
        correctCount: 0,
        errorLoading: false,
        expertMode: false,
        guessCorrect: false
        };
    this.callApi('species').then((result) => {
        this.setState((prevState, props) => {
            return {
                ...props,
                speciesList: result.species
            }
        })
    });
  }

    callApi = async (path) => {
        const response = await fetch(`${API_ROOT}/${path}`);
        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

  clearGuess = () => {
      if (this._typeahead) {
          this._typeahead.getInstance().clear();
      }
      if (this.state.selectedSpeciesGuess) {
          this.setState((prevState, props) => {
             return {
                 ...props,
                 selectedSpeciesGuess: null
             }
          });
      }
  }
  getRandomBirdsong = function() {
      this.clearGuess();
      this.setState((prevState, props) => {
          return {
              ...props,
              errorLoading: false,
              loading: true,
              guessCorrect: false
          }
      });
      var randomRecordingApiUrl = 'birdsong';
      if (!this.state.expertMode) {
          randomRecordingApiUrl += "?level=1";
      }
      this.callApi(randomRecordingApiUrl).then(result => {
          this.setState((prevState, props) => {
              if (result.noRecordings) {
                  return {
                      ...props,
                      noRecordingFound: true,
                      loading: false,
                      showSpecies: false
                  }
              }
              const recording = result.recordingResult.recording
              return {
                  ...props,
                  birdsongId: recording.id,
                  species: recording.en,
                  scientificName: recording.gen + ' ' + recording.sp,
                  loading: false,
                  showSpecies: false,
                  multipleChoiceOptions: result.multipleChoiceOptions,
                  counter: prevState.counter + 1
              }
          });
      }).catch(() => {
            this.setState((prevState, props) => {
                return {
                    ...props,
                    loading: false,
                    errorLoading: true
                }
            })
      });
  }
  showSpecies = () => {
      this.setState((prevState, props) => {
          return {
              ...props,
              showSpecies: !prevState.showSpecies
          }
      })
  }
  onSpeciesGuessMade = (guess) => {
      if (this.state.selectedSpeciesGuess) {
          return
      }
      const guessCorrect = guess != null && guess.ScientificName.toLowerCase() === this.state.scientificName.toLowerCase();

      this.setState((prevState, props) => {
          let correctCount = guessCorrect ? prevState.correctCount + 1 : prevState.correctCount;
          return {
              ...props,
              selectedSpeciesGuess: guess,
              guessCorrect: guessCorrect,
              correctCount: correctCount
          }
      });
  };

  onChangeExpertMode = (expertMode) => {
      this.setState((prevState, props) => {
         return {
             ...props,
             expertMode: expertMode
         }
      });
  }


    componentWillMount = function() {
    this.getRandomBirdsong();
  }
  
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Birdsong quiz</h1>
        </header>
        <div className="App-intro">
            {this.state.loading && <div>Loading...</div>}
            {this.state.errorLoading && <div>Error loading data. Please <a href="#" onClick={() => { this.getRandomBirdsong();}}>try again</a></div>}
                {!this.state.loading && this.state.noRecordingFound && <span>No recording found</span>}

                {!this.state.loading &&  !this.state.errorLoading && this.state.birdsongId &&
                !this.state.noRecordingFound &&
                <div>
                    <audio autoPlay={true} controls src={`https://www.xeno-canto.org/${this.state.birdsongId}/download`}>
                    </audio>
                </div>
                }
        </div>
          <input id="expertmode" type="checkbox" onClick={(e) => {
               this.onChangeExpertMode(e.target.checked);
          }} style={{marginRight : '3px'}}/><label htmlFor="expertmode">Expert mode</label>
          {
              this.state.multipleChoiceOptions &&
              <div>
                  {this.state.multipleChoiceOptions.map(option => {
                      let backgroundColour = 'gray'
                      if (option === this.state.selectedSpeciesGuess) {
                          backgroundColour = this.state.guessCorrect ? 'green': 'red'
                      }
                      if (this.state.selectedSpeciesGuess && !this.state.guessCorrect &&
                          option.ScientificName.toLowerCase() === this.state.scientificName.toLowerCase()) {
                          backgroundColour = 'green'
                      }
                      return <div id={option.Species} style={{
                          'background-color': backgroundColour,
                          'color': 'white',
                          'border': 'solid 1px',
                          'width': '50%',
                          'margin-left': '25%',
                          'margin-bottom': '5px',
                          'cursor': 'pointer'
                      }} onClick={() => this.onSpeciesGuessMade(option)}>{option.Species}</div>
                  })
                  }
              </div>
          }
          {
              this.state.selectedSpeciesGuess &&
              <div>
                  <a href="#" onClick={() => this.getRandomBirdsong()}>Load next question</a>
              </div>
          }
          {!this.state.guessCorrect && !this.state.showSpecies && <button onClick={() => this.showSpecies()}>Give up?</button>}
          <div>
          Score so far {this.state.correctCount}/{this.state.counter -1 }
          </div>
      </div>
    );
  }
}

export default App;
