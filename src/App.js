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
        guessCorrect: false,
        counter: 0
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

  getRandomBirdsong = function() {

      this.setState((prevState, props) => {
          return {
              ...props,
              loading: true
          }
      })
      this.callApi('birdsong').then(result => {
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
      });
  }
  toggleShowSpecies = () => {
      this.setState((prevState, props) => {
          return {
              ...props,
              showSpecies: !prevState.showSpecies
          }
      })
  }
  onSpeciesGuessMade = (guess) => {
      let guessCorrect = guess != null &&
      guess.ScientificName.toLowerCase() === this.state.scientificName.toLowerCase();
      if (guessCorrect) {
          this.getRandomBirdsong();
      }
      this.setState((prevState, props) => {
           return {
               ...props,
               guessCorrect: guessCorrect,
               selectedSpeciesGuess: guess
           }
        });
  };


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

                {!this.state.loading && this.state.noRecordingFound && <span>No recording found</span>}

                {!this.state.loading &&  this.state.birdsongId &&
                !this.state.noRecordingFound &&
                <div>
                    <audio autoPlay={true} controls src={`https://www.xeno-canto.org/${this.state.birdsongId}/download`}>
                    </audio>
                {this.state.showSpecies && <div>{this.state.species}</div>}
                </div>
                }
        </div>
          <div style={{width: '25%', marginLeft: '38%'}}>
              <Typeahead
                  labelKey="Species"
                  options={this.state.speciesList}
                  placeholder="Type your guess..."
                  minLength={1}
                  clearButton={true}
                  onChange={(options) => {
                      this.onSpeciesGuessMade(options[0]);
                  }}
              />
              {
                  this.state.selectedSpeciesGuess &&
                  <div>
                      Your guess: <span style={{color: this.state.guessCorrect ? 'green' : 'red'}}>{this.state.selectedSpeciesGuess.Species}</span>
                      {this.state.guessCorrect ? " Correct" : " Wrong"}
                   </div>
              }
          </div>
          <button onClick={() => this.toggleShowSpecies()}>{this.state.showSpecies ? "Hide species": "Give up?"}</button>
          <button onClick={() => this.getRandomBirdsong()}>Fetch new song</button>
      </div>
    );
  }
}

export default App;
