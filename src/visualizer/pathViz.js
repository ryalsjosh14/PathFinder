import React, { useState, useEffect } from 'react';
import Node from './Node';
import './pathViz.css';
import Options from './menu/options'
import { Dijkstra } from '../Algorithms/dijkstra';

export default function PathViz(){
/*
Functional component which displays the entire Path visualizer
*/

//Initialize various state variables to be updated
    const [grid, setGrid] = useState([]); //Grid to be displayed

    //Signifies if the start and finish nodes have been assigned
    const [isStartSet, setisStartSet] = useState(false); 
    const [isFinishSet, setisFinishSet] = useState(false);

    //Tracks which instruction the next mouse click will perform
    const [instr, setInstr] = useState("Start Point")

    //Tracks start and finish coordinates
    const [startCoords, setStartCoords] = useState([]);
    const [finishCoords, setFinishCoords] = useState([]);

    //Track if mouse is currently pressed
    const [isClicked, setisClicked] = useState(false);


    const createNode = (col, row) => {
        /*
        Returns an object with the properties for a blank node
        */
        return(
            {
            col, 
            row, 
            isStart: false, 
            isFinish: false, 
            isWall: false,
            isVisited: false
            }
        )
    }

    const gridInit = (row_dim, col_dim) => {
        /*
        Creates a blank grid with the given dimensions
        Args:
        row_dim, int: Specifies number of rows to be created on grid
        col_dim, int: Specifies number of columns to be created on grid

        Returns:
        init_grid, array: An r x c array with plain nodes in each element
        */

        //Initialize grid as empty array
        const init_grid = [];

        //Create the grid one row at a time
        for (let row = 0; row < row_dim; row++){

            //Initialize current row as empty array
            const curr_row = [];

            //Append new nodes to the current row
            for ( let col = 0; col < col_dim; col++){
                const newNode = createNode(col,row);
                curr_row.push(newNode);
            }
            //Append current row to grid
            init_grid.push(curr_row); 
        }
        return init_grid;
    };

    const updateStart = (row,col) => {
        /*
        Updates the grid by activating the start node
        Args:
        row, col: ints: Dimensions of the start node
        Returns:
        updated_grid: The new grid with start node signified
        */

        //Get copy of the current grid array
        const updated_grid = grid.slice();

        //Get the current node at the given location
        const curr_node = updated_grid[row][col];

        //Toggle isStartset for the current node
        const new_node = {...curr_node, isStart:!isStartSet};

        //Assign this new node to the correct location
        updated_grid[row][col] = new_node;
        return updated_grid;
    }

    const updateFinish = (row, col) => {
        /*
        Updates the grid by activating the finish node
        Args:
        row, col: ints: Dimensions of the finish node
        Returns:
        updated_grid: The new grid with finish node signified
        */
       //Procedure very similar to updateStart() above
       //TODO: Refactor to combine with updateStart()
        //const updated_grid = grid.slice();
        const curr_node = grid[row][col];
        const new_node = {...curr_node, isFinish:!isFinishSet};
        //updated_grid[row][col] = new_node;
        //return updated_grid;
        grid[row][col] = new_node;
        setGrid(grid)
        //return grid;
    }

    const updatePath = (path) => {

        const new_grid = grid.slice();
        for(let i = 0; i < path.length;i++){
            const pathNode = path[i];
            const row = pathNode.row;
            const col = pathNode.col;
            pathNode.isPath = true
            new_grid[row][col] = pathNode;
        }
        //console.log(new_grid)
        return(new_grid)
    }


    const handleClick = (row, col) => {
        /*
        Updates the grid when a node is clicked based on the current state
        Args:
        row,col: int: coordinates of node which was clicked
        Returns: None
        */
       //If start is not set, set start
        if (!isStartSet) {
            //Create new grid with updateStart() method
            let newGrid = updateStart(row,col);

            //Update state of grid, isStartSet and instruction
            setGrid(newGrid);
            setisStartSet(true);
            setInstr("Finish Point");
            setStartCoords([row,col]);

        } 
        //If start is set but finish isn't, set finish
        else if (!isFinishSet){
            //Create new grid with updateFinish() method
            updateFinish(row, col);
            //let newGrid = updateFinish(row,col);
            
            //Update state of grid, isFinishSet and instruction
            //setGrid(newGrid)
            setisFinishSet(true);
            setInstr("Walls");
            setFinishCoords([row,col]);
        }
        setisClicked(false)
    }

    const handleReset = () => {
        /*
        Resets the grid 
        */ 

       //Create new blank grid with gridInit() method.
        const reset_grid = gridInit(25,60);

        //Update states accordingly
        setGrid(reset_grid);
        setInstr("Start Point")
        setisFinishSet(false);
        setisStartSet(false);
        
    }

    const handleAlgoStart = () => {
        const path = Dijkstra(grid, startCoords, finishCoords);
        let pathGrid = updatePath(path)
        setGrid(pathGrid);

    }

    const handleWallSet = (row, col) => {
        setisClicked(true);
        handleWallDrag(true,row,col)
        
    }

    const handleWallDrag = (isClick, row, col) => {
        //console.log(isClicked);
        //console.log(instr);

        if(isClick && instr === "Walls"){
            console.log("if conditions mets")
            const wallGrid = grid.slice();
            const curr_node = wallGrid[row][col];
            const new_node = {...curr_node, isWall:!curr_node.isWall};
            //const new_node = {...curr_node, isWall:true};

            wallGrid[row][col] = new_node;
            setGrid(wallGrid);
        }
    }
/*
    const handleWallFinish = () => {
        setisClicked(false);
    }
    */
    
    
    useEffect(() => {
        /*
        Updates the grid at the initial DOM render
        Similar to componentdidMount() with React class component
        */
        const initial_grid = gridInit(25,60);
        setGrid(initial_grid);
    },[]); //rendered on only initial render because of empty array dependency

    //Component rendering
    return(
        <div className="menu">
            <Options/>
            <button className="reset" onClick={() => handleReset()}>
                Reset
            </button>
            <button onClick={() => handleAlgoStart()}>
                Start Dijkstra
            </button>
            <text className="instructions">Set {instr}</text>
            <div className="grid">
                {grid.map( (row, rowIndex) => {
                    return(
                        <div className="row" key={rowIndex}>
                            {row.map( (node, nodeIndex) => {
                                const {col, row, isFinish, isStart, isWall, isPath, isVisited} = node;
                                return(
                                    <div key={nodeIndex}>
                                        <Node 
                                            col = {col}
                                            row = {row}
                                            isFinish = {isFinish}
                                            isStart = {isStart}
                                            isWall = {isWall}
                                            isPath = {isPath}
                                            isVisited = {isVisited}
                                            onMouseDown = {() => handleWallSet(row,col)}
                                            onMouseEnter = {() => handleWallDrag(isClicked,row,col)}
                                            onMouseUp = {(row,col) => handleClick(row,col)}
                                        ></Node>
                                    </div>
                                );
                            })}
                        </div>
                    );
                }
            )}

            </div>
        </div>
    )
}