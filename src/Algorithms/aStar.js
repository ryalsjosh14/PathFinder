import MinHeap from './minHeap'

export default function aStar(grid, startCoords, finishCoords){

    //Get row and column of the start node and finish node
    const startRow = startCoords[0];
    const startCol = startCoords[1];
    const finishRow = finishCoords[0];
    const finishCol = finishCoords[1];

    //Get the start and finish node objects from grid
    let startNode = grid[startRow][startCol];

    //Initialize open list and closed list, 
    //open list is minheap of nodes to be visited, closed list is nodes that have already been visited
    let openList = new MinHeap();

    //open list is list of nodes to be visited, closed list is nodes that have alreadt been visited
    let closedList = [];

    //Create new heap Node for starting node(see attributes in minHeap class), and add this node to heap array with distance of 0
    const startHeapNode = openList.newHeapNode(startNode, 0);
    openList.addHeapNode(startHeapNode);

    //Initialize Minheap
    for(const curr_row of grid){
        for(const node of curr_row){
            //Start node has already been added to heap, so skip this iteration
            if(node.row === startRow && node.col === startCol){
                continue;
            }
            //Add node to the heap array
            let heapNode = openList.newHeapNode(node, Infinity);
            openList.addHeapNode(heapNode);     
        }
    }

    //Continually search until openList is empty or finish point is found
    while (openList.size !== 0){

        //Set the current node to the first node in open list, and mark this node as visited
        let closestNode = openList.extractMin(); //Returns [node, f] 
        let currNode = closestNode[0];
        currNode.isVisited = true;

        //Add current node to closed list
        closedList.push(currNode)

        //If the finish node has been found, break out of loop
        if (currNode.row === finishRow && currNode.col === finishCol){
            break;
        }

        //Get neighbors of the current node
        let neighbors = getNeighbors(grid, currNode);
        
        //for each neighbor, calculate its value and add to open list
        for(const neighbor of neighbors){
            
            // assign the current node as the previous node of the neighbor node
            neighbor.prevNode = currNode;
            const neighborCoords = [neighbor.row, neighbor.col];

            //Calculate the Manhattan heuristic of the neighbor 
            const h = hueristic(neighborCoords, finishCoords);
            const f = 1 + h;

            //Change f value for neighbor in openList(minHeap)
            openList.decreaseKey(neighbor, f)
        }
    }

    //Once loop has finished, find the shortest path with backtrack
    const lastNode = closedList.pop();
    const shortestPath = backTrack(lastNode, startRow, startCol);

    //Return the list of visited nodes in order (closed list) and the shortest path
    return ([closedList, shortestPath])   


}

function hueristic(currCoords, finishCoords){
    //Implement Manhattan hueristic

    const h = Math.abs(currCoords[0] - finishCoords[0]) + Math.abs(currCoords[1] - finishCoords[1]);
    return h;

}

function getNeighbors(grid, currNode){
    //Return all eligbile neighbors of given node
    let neighbors = [];
    const [row, col] = [currNode.row, currNode.col];

    //If neighbor is on board, append to neighbors array
    if (row<24){neighbors.push(grid[row+1][col])};
    if (row>0){neighbors.push(grid[row-1][col])};
    if (col<59){neighbors.push(grid[row][col+1])};
    if (col>0) {neighbors.push(grid[row][col-1])};

    console.log(neighbors)

    //Add filter for nodes already visited? Or is this solved by closed list??

    //Remove neighbors which are walls
    let filteredNeighbors = neighbors.filter(neighbor => !neighbor.isWall)

    //Return all neighbors that haven't already been visited
    //console.log(neighbors)
    return filteredNeighbors.filter(neighbor => (!neighbor.isVisited && !neighbor.isStart))

}

export function backTrack(lastNode, startRow, startCol){
    //Initialize shortest path as empty array
    const shortestPath = [];

    //Current node starts as the finish node
    let currNode = lastNode

    //Get coordinates of finish node
    let currentRow = lastNode.row;
    let currentCol = lastNode.col;

    //Append finish node to shortest path
    shortestPath.push(currNode);

    //Append each node to shortest path until start node is reached
    while(currentRow !== startRow || currentCol !== startCol){
        //Get previous node
        currNode = currNode.prevNode
        //Reset current coordinates to those of previous node
        currentRow = currNode.row;
        currentCol = currNode.col;
        //Append previoud node to shortest path
        shortestPath.push(currNode);
    }
    //Return shortest path form finish to start
    return shortestPath;
}