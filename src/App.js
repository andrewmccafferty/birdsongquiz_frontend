import React, { Component } from 'react';
import './App.css';

import { API_ROOT } from './api-config';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        birdsongId: "",
        species: "",
        noRecordingFound: false,
        loading: false,
        showSpecies: false
        };
  }

  getRandomBirdsong = function() {
      const callApi = async () => {
          const response = await fetch(`${API_ROOT}/birdsong`);
          const body = await response.json();

          if (response.status !== 200) throw Error(body.message);

          return body;
      };
      this.setState((prevState, props) => {
          return {
              ...props,
              loading: true
          }
      })
      callApi().then(result => {
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
                  loading: false,
                  showSpecies: false
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
          <button onClick={() => this.toggleShowSpecies()}>{this.state.showSpecies ? "Hide species": "Show species"}</button>
        <button onClick={() => this.getRandomBirdsong()}>Fetch new song</button>
      </div>
    );
  }
}

export default App;
