import React, { useState, useEffect, useCallback } from 'react';
import Node from './GridNode';
import './pathViz.css';
import Options from './menu/options'
import { Dijkstra } from '../Algorithms/dijkstra';
import aStar  from '../Algorithms/aStar';


//TODO: Add functionality for user to choose algorithm
//TODO: edit readme and correct comment typos

export default function PathViz(){
/*
Functional component which displays the entire Path visualizer
*/

//Initialize various state variables to be updated
    const [grid, setGrid] = useState([]); //Grid to be displayed

    //Tracks which instruction the next mouse click will perform
    const [instr, setInstr] = useState("Start Point")

    //Tracks start and finish coordinates
    const [startCoords, setStartCoords] = useState({});
    const [finishCoords, setFinishCoords] = useState([]);

    //Track if mouse is currently pressed
    const [isClicked, setisClicked] = useState(false);

    //Track algorithm to be used
    const [algo, setAlgo] = useState("Dijkstra")
    const [slow, setSlow] = useState(false)

    const [isFinding, setisFinding] = useState(false)
    const [isReset, setisReset] = useState(true)


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
            //isVisited: false,
            toBeReset: false
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

    const handleClick = useCallback(function handleClick(e){
        /*
        Updates the grid when a node is clicked based on the current state
        Args:
        row,col: int: coordinates of node which was clicked
        Returns: None
        */

        //Get coordinates of node clicked from event dataset
       const row = e.currentTarget.dataset["row"];
       const col = e.currentTarget.dataset["col"];
          
       //Execute code nested in setInstr in order to avoid handleClick updating and re-rendering all nodes
        setInstr((prevInstr) => {
            //If the previous instruction is start point
            if (prevInstr === "Start Point") {
                //Update grid with new start point
                setGrid( (prevGrid) => {
                    const updated_grid = prevGrid.slice();
    
                    //Get the current node at the given location
                    const curr_node = updated_grid[row][col];
    
                    //Toggle isStartset for the current node
                    const new_node = {...curr_node, isStart:true};
    
                    //Assign this new node to the correct location
                    updated_grid[row][col] = new_node;
                    return updated_grid
                })
                //Set start coords with position of current node
                setStartCoords(() => {
                    return [parseInt(row), parseInt(col)]
                });
                //Set state of mouse to not clicked
                setisClicked(false)
                //Update instruction to "finish point"
                return ("Finish Point")
            }
            //If the start was already set
            else if (prevInstr === "Finish Point"){
                   
                //Update state of grid, isClicked and finish coordinates
                setGrid( (prevGrid) => {
                    const updated_grid = prevGrid.slice();
    
                    //Get the current node at the given location
                    const curr_node = updated_grid[row][col];
    
                    //Toggle isStartset for the current node
                    const new_node = {...curr_node, isFinish:true};
    
                    //Assign this new node to the correct location
                    updated_grid[row][col] = new_node;
                    return updated_grid
                })
               //Set finish coords with coords of clicked node      
                setFinishCoords(() => {
                    return [parseInt(row), parseInt(col)]
                });
                //Set is clicked to false
                setisClicked(false)
                //Return new instruction as walls
                return ("Walls")
            }
            else{
                setisClicked(false)
                return prevInstr
            }
        })
    }, [])

    const handleReset = () => {
        /*
        Resets the grid 
        */ 

       //Create new blank grid with gridInit() method.
        const reset_grid = gridInit(25,60);

        //Update states accordingly
        setisReset(true)
        setGrid(reset_grid);
        setInstr("Start Point")
    }

    const handleAlgoStart = () => {
        /*
        Start the algorithm and update the grid with the new path
        */
        //const [visitedPath, path] = Dijkstra(grid, startCoords, finishCoords);

        setisFinding(true)
        setisReset(false)

        let [visitedPath, path] = [[], []];
        switch(algo){
            case "Dijkstra":
                [visitedPath, path] = Dijkstra(grid, startCoords, finishCoords);
                break;
            case "aStar":
                [visitedPath, path] = aStar(grid, startCoords, finishCoords);
                break;
            default: [visitedPath, path] = aStar(grid, startCoords, finishCoords);

        }

        let speed = 15;
        switch(slow){
            case true:
                speed = 100
                break;
            case false:
                speed = 15
                break;
            default:
                speed = 15;
        }

        let new_grid = grid.slice();
        //Update the each node visited by Djikstra's algorithm
        for(let i = 1; i < visitedPath.length; i++){
            const thisNode = visitedPath[i];
            //Update each node with an asyncronous call every 10 ms (See updateVisited())
            updateVisited(thisNode, i, speed)

            //Update new_grid, to be used to update state
            const row = thisNode.row;
            const col = thisNode.col;
            let curr_node = new_grid[row][col]
            const new_node = {...curr_node, toBeReset:!curr_node.toBeReset};
            new_grid[row][col] = new_node
        }


        // Update the path as soon as the animation has finished
        setTimeout( () => {
            updatePath(path)
            setisFinding(false)
        }, speed * visitedPath.length, path)

        //Update the grid, this takes place before most of the animations 
        setGrid(new_grid)
    }

    const updatePath = (path) => {
        //Update the path by creating a new grid and updating state
        let new_grid = grid.slice();
        for (let i = 0; i < path.length; i++){
            const thisNode = path[i];
            const row = thisNode.row;
            const col = thisNode.col;
            let curr_node = new_grid[row][col]
            const new_node = {...curr_node, isPath:!curr_node.isPath};
            new_grid[row][col] = new_node
        }
        setGrid(new_grid)
    }      


    const updateVisited = (pathNode, i, speed) => {
        //Animate visited nodes every 10 ms

        const row = pathNode.row;
        const col = pathNode.col;
        
        setTimeout( () => {
            document.getElementById(`row-${row}col-${col}`).className='node-visited'
        }, speed*i, row, col)  
    }

    const handleWallSet = useCallback( function handleWallSet(e){
        //Set status of mouse click to true
        setisClicked(() => {
            return true
        });
        //Call handleWallDrag to ensure the initial clicked node also is set as wall
        handleWallDrag(e)
    },[])

    const handleWallDrag = useCallback( function handleWallDrag(e){
        /*
        Set walls on grid given the current state of the grid and mouse click
        */

        //Get coordinates of node entered with synthetic event
        const row = e.currentTarget.dataset["row"];
        const col = e.currentTarget.dataset["col"];
        
        //Nest all operations within setisClicked and setInstr in order to check those states
        setisClicked( (prevClick) => {
            //If the mouse is pressed
            if (prevClick){
                //Check if instruction is set to walls
                setInstr( (prevInstr) => {
                    if (prevInstr==="Walls"){
                        //If walls are being set, set current node to a wall and update grid
                        setGrid((prevGrid) => {
                            const wallGrid = prevGrid.slice();
                            const curr_node = wallGrid[row][col];
                            const new_node = {...curr_node, isWall:true};
                            wallGrid[row][col] = new_node;
                            return wallGrid
                        });
                    }   
                    //Return the same instruction as before, should only be reset with reset button                 
                    return prevInstr
                })
                //Return mouse clicked as true
                return true
            }
            //If mouse isn't pressed down, return previous instruction
            else{
                setInstr(prevInstr => {
                    return prevInstr
                })
            }
            //Always return mouse clicked as same value as previous state
            return prevClick
        })
    }, []);

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
        <div>
        <div className="menu">
            <div className="options">
                <button className="algoButton" onClick = {() => setAlgo("Dijkstra")}>
                    Dijkstra's Algorithm
                </button>
                <button className="algoButton" onClick = {() => setAlgo("aStar")}>
                    A * Search
                </button>
            </div>
                
            
        </div>


        <div className="grid">
            <text className="instructions">Set {instr}</text>


            <div className="options">

                <button className="reset" onClick={() => handleReset()} disabled={isFinding}>
                        Reset
                    </button>
                <button className="start" onClick={() => handleAlgoStart()} disabled={(!isReset || instr ==="Start Point" || instr ==="Finish Point")}>
                        Start {algo}
                    </button>
                <button className="reset" onClick={ () => setSlow(!slow)} disabled={isFinding}>
                    Turn on {slow ? "fast" : "slow"} mode
                </button>
            </div>
            
            {grid.map( (row, rowIndex) => {
                return(
                    <div className="row" key={rowIndex}>
                        {row.map( (node, nodeIndex) => {
                            const {col, row, isFinish, isStart, isWall, isPath, isVisualized, toBeReset} = node;
                            return(
                                <div key={nodeIndex} >
                                    <Node 
                                        col = {col}
                                        row = {row}
                                        isFinish = {isFinish}
                                        isStart = {isStart}
                                        isWall = {isWall}
                                        isPath = {isPath}
                                        toBeReset = {toBeReset}
                                        isVisualized = {isVisualized}
                                        onMouseUp = {handleClick}
                                        onMouseDown = {handleWallSet}
                                        onMouseEnter = {handleWallDrag}
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