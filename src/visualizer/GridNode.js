import React from 'react';
import './node.css';

function Node({ col, row, isFinish, isStart, isWall, isPath, isVisited, onMouseUp, onMouseEnter, onMouseDown }){
    /*
    Returns node component with corresponding properties
    Args:
    col, row: int: coordinates of the node
    isFinish, isStart, isWall: bool: Indicates whether node is a start, finish or wall node
    onClick, const: function to be called when node is clicked
    */




    console.log("node rendered")

    //Set styling (Color) of node based on node type
    const nodeView = isFinish ? 'node-finish' 
    : isStart ? 'node-start' 
    : isWall ? 'node-wall' 
    : isPath ? 'node-path' 
    : isVisited ? 'node-visited' : 'node'

    //Render node
    return(
        <div className={nodeView}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        data-row={row}
        data-col={col}>
        </div>
    );

}

function areEqual(prevProps, nextProps){

    if (prevProps.row === nextProps.row && prevProps.col === nextProps.col && prevProps.isFinish === nextProps.isFinish &&prevProps.isStart === nextProps.isStart &&prevProps.isWall === nextProps.isWall &&prevProps.isPath === nextProps.isPath &&prevProps.isVisited === nextProps.isVisited && prevProps.onMouseUp===nextProps.onMouseUp && prevProps.onMouseEnter===nextProps.onMouseEnter && prevProps.onMouseDown===nextProps.onMouseDown){
        return true;
    }
    return false;
    
   /*
    if (prevProps.row === nextProps.row && prevProps.col === nextProps.col && prevProps.isFinish.equals(nextProps.isFinish) && prevProps.isStart.equals(nextProps.isStart) &&prevProps.isWall.equals(nextProps.isWall) &&prevProps.isPath.equals(nextProps.isPath) &&prevProps.isVisited.equals(nextProps.isVisited)){
        return true;
    }
    return false;
    */

}

export default React.memo(Node, areEqual);
//export default Node;