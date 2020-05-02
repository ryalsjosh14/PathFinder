import React from 'react';
import './node.css';

function Node({ col, row, isFinish, isStart, isWall, isPath, toBeReset, onMouseUp, onMouseEnter, onMouseDown, isVisited }){
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
    : isVisited ? 'node-visited'
    : toBeReset ? 'node-temp' : 'node-plain'

    //Render node
    return(
        <div id={`row-${row}col-${col}`}
        className={nodeView}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        data-row={row}
        data-col={col}>
        </div>
    );

}

function areEqual(prevProps, nextProps){
    //If no props have changed, prevent rendering of node

    if (prevProps.toBeReset === nextProps.toBeReset && prevProps.row === nextProps.row && prevProps.col === nextProps.col && prevProps.isFinish === nextProps.isFinish &&prevProps.isStart === nextProps.isStart &&prevProps.isWall === nextProps.isWall &&prevProps.isPath === nextProps.isPath && prevProps.onMouseUp===nextProps.onMouseUp && prevProps.onMouseEnter===nextProps.onMouseEnter && prevProps.onMouseDown===nextProps.onMouseDown){
        return true;
    }
    return false;
}

export default React.memo(Node, areEqual);
