import MinHeap from './minHeap'

//TODO: Deal with tracking rows and columns of nodes within minheap ( or outside)

export function Dijkstra(grid, startCoords, finishCoords){

    //Decompose start and finish coordinates
    console.log(startCoords)
    console.log(finishCoords)
    const startRow = startCoords[0];
    const startCol = startCoords[1];
    const finishRow = finishCoords[0];
    const finishCol = finishCoords[1];

    // Create instance of minheap 
    let heap = new MinHeap();

    //Create array to track visited nodes in order of visitation
    let orderedVisitedNodes = [];

    //Get the node objects for the start node and end node
    const startNode = grid[startRow][startCol];  


    //Create new heap Node for starting node(see attributes in minHeap class), and add this node to heap array with distance of 0
    const startHeapNode = heap.newHeapNode(startNode, 0);
    heap.addHeapNode(startHeapNode);

    //Initialize Minheap
    for(const curr_row of grid){
        for(const node of curr_row){
            //Start node has already been added to heap, so skip this iteration
            if(node.row === startRow && node.col === startCol){
                continue;
            }
            //Add node to the heap array
            let heapNode = heap.newHeapNode(node, Infinity);
            heap.addHeapNode(heapNode);     
        }
    }

    //run algorithm while minheap still has nodes 
    //(break when finsh node is found)
    while(heap.size !== 0){

        //Get nearest node and decompose into node part and distance value
        let closestNode = heap.extractMin(); //returns [node,distance]
        let nodePart = closestNode[0];
        const distance = closestNode[1];
        

        //Create isVisited property and set it to true
        nodePart.isVisited = true;

        //Add this node to array of visited nodes
        orderedVisitedNodes.push(nodePart);

        //If closest node is the finish node, stop algorithm
        if(nodePart.row === finishRow && nodePart.col === finishCol){
            break;
        } 
        
        //get the unvisited neighbors of current node (up, down, left, right)
        let neighbors = getNeighbors(grid, nodePart);


        //For each unvisited neighbor, set its distance to the current distance + 1
        for(const neighbor of neighbors){
            neighbor.prevNode = nodePart
            heap.decreaseKey(neighbor, distance + 1);
            
        }


    }
    //Get last node visited (finish node)
    const lastNode = orderedVisitedNodes.pop();
    console.log(orderedVisitedNodes)
    //Get shortest path from backTrack() function
    const shortestPath = backTrack(lastNode, startRow, startCol);
    //Once algorithm has finished, return shortest path from finish to start
    return ([orderedVisitedNodes, shortestPath])   
    

}

function getNeighbors(grid, node){
    /*
    Gets the four neighbors surrounding a node (up,down,left,right) which are unvisited
    Args:
    grid, Array: The grid of nodes
    node, Node: The node whose neighbors will be returned
    Returns:
    neighbors: Array of all unvisited neighbor nodes 
    */

    //Initialize neighbors as empty array
    let neighbors = [];
    //Get coordinates of node
    const [row, col] = [node.row, node.col];

    //If neighbor is on board, append to neighbors array
    if (row<24){neighbors.push(grid[row+1][col])};
    if (row>0){neighbors.push(grid[row-1][col])};
    if (col<59){neighbors.push(grid[row][col+1])};
    if (col>0) {neighbors.push(grid[row][col-1])};
    //console.log(neighbors)
    
    //Remove neighbors which are walls
    let filteredNeighbors = neighbors.filter(neighbor => !neighbor.isWall)

    //Return all neighbors that haven't already been visited
    return filteredNeighbors.filter(neighbor => !neighbor.isVisited)
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
