import React, { Component } from "react";
import "./App.css";
import recognizeMic from "watson-speech/speech-to-text/recognize-microphone";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: ""
        };
    }

    onListenClick() {
        fetch("http://localhost:3002/api/speech-to-text/token")
            .then( response => {
                return response.text();
            })
            .then( token => {
                var stream = recognizeMic({
                    token: token,
                    objectMode: true, // send objects instead of text
                    format: false // optional - performs basic formatting on the results such as capitals an periods
                });
                stream.on("data", data => {
                    console.log(data);
                    this.setState({
                      text: data.results[0].alternatives[0].transcript
                    })
                });
                stream.on("error", function(err) {
                    console.log(err);
                });
                document.querySelector("#stop").onclick = stream.stop.bind(
                    stream
                );
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div className="App">
                <button className="btn btn-xl btn-success" onClick={this.onListenClick.bind(this)}>
                    Listen to microphone
                </button>
            <button className="btn btn-xl btn-warning" id="stop">Stop</button>
            <div className="text">{this.state.text}</div>
            </div>
        );
    }
}

export default App;
