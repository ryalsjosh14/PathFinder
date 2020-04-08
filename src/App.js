import React, { useState } from 'react';
import './App.css';
import PathViz from './visualizer/pathViz';

function App() {

  return (
    <div className="App">
      <h1>
        Path Finding Animation
      </h1>
      
      <PathViz></PathViz>
    </div>
  ); 
}
 
export default App;
