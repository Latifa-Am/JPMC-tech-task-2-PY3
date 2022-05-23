import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';
import { clearInterval } from 'timers';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  //add the `showGraph` property, this property defines the initial state of the graph
  showGraph: boolean,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      //we set the property `showGraph` to false, which means the graph won't be showen until the use clicks ‘Start Streaming Data’
      showGraph: false,
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    // Render the graph only if the user clicks ‘Start Streaming Data’, in this case showGraph= true 
    if(this.state.showGraph){
      return (<Graph data={this.state.data}/>)
    }
    
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {

    let x = 0;
    const interval = setInterval(()=>{
      //get the data from the server whenever the user clicks on the button
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        this.setState({ 
          data: serverResponds,
          showGraph: true,
         });
      });
      x++;
      if (x > 1000){
        clearInterval(interval);
      }
    }, 100);
    
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
