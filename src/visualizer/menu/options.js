import React from 'react';
import './options.css'

export default function Options({ onClick }){
    /* 
    Returns functional React component which includes all of the Algorithm options
    */

    return(
        <div className="options">
            <button className="algoButton">
                Dijkstra's Algorithm
            </button>
            <button className="algoButton">
                A * Search
            </button>
            <button className="algoButton">
                Algorithm #3
            </button>
            <button className="algoButton">
                Algorithm #4            
            </button>
        </div>
    )

}