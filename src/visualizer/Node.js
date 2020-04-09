import React from 'react';
import './node.css';

export default function Node({ col, row, isFinish, isStart, isWall, isPath, isVisited, onClick, onMouseDown, onMouseEnter, onMouseUp }){
    /*
    Returns node component with corresponding properties
    Args:
    col, row: int: coordinates of the node
    isFinish, isStart, isWall: bool: Indicates whether node is a start, finish or wall node
    onClick, const: function to be called when node is clicked
    */

    //Set styling (Color) of node based on node type
    const nodeView = isFinish ? 'node-finish' 
    : isStart ? 'node-start' 
    : isWall ? 'node-wall' 
    : isPath ? 'node-path' 
    : isVisited ? 'node-visited' : 'node'

    //Render node
    return(
        <div 
        className={nodeView} 
        onMouseDown={() => onMouseDown(row,col)}
        onMouseEnter={() => onMouseEnter(row,col)}
        onMouseUp={() => onMouseUp(row,col)}>
        </div>
    );

}

