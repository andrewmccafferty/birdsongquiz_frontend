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
              return {
                  ...props,
                  birdsongId: result.recording.id,
                  species: result.recording.en,
                  scientificName: result.recording.gen + ' ' + result.recording.sp,
                  loading: false,
                  showSpecies: false,
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
          <div style={{width: '25%', marginLeft: '38%'}}>
              {!this.state.showSpecies && !this.state.guessCorrect && <Typeahead
                  labelKey="Species"
                  options={this.state.speciesList}
                  placeholder="Type your guess..."
                  minLength={1}
                  clearButton={true}
                  onChange={(options) => {
                      this.onSpeciesGuessMade(options[0]);
                  }}
                  ref={(ref) => this._typeahead = ref}
              />}
              {
                  this.state.selectedSpeciesGuess &&
                  <div style={{}}>
                      Your guess: <span style={{color: this.state.guessCorrect ? 'green' : 'red'}}>{this.state.selectedSpeciesGuess.Species}</span>
                      {this.state.guessCorrect &&
                      <div>
                          <div>Correct! </div>
                          <div>
                              <a href="#" onClick={() => this.getRandomBirdsong()}>Load next question</a>
                          </div>
                      </div>}
                  </div>
              }
              {this.state.showSpecies && <div>Answer: {this.state.species} <a href="#" onClick={() => this.getRandomBirdsong()}>Load next question</a></div>}


          </div>
          {!this.state.guessCorrect && !this.state.showSpecies && <button onClick={() => this.showSpecies()}>Give up?</button>}
          <div>
          Score so far {this.state.correctCount}/{this.state.counter -1 }
          </div>
      </div>
    );
  }
}

export default App;
