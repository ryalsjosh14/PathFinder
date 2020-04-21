
export default class MinHeap{
    /*
    Defines object minHeap to be implemented in Djikstra's algorithm
    */

    //Initialize size of heap and corresponding array
    constructor(){
        this.heapArray = []; // hold nodes in list, each node is an object with props {vertex, distance}
        this.size = 0; //tracks the size of minheap (number of unvistied nodes remaining)
    }

    newHeapNode(node, dist){
        /*
        Create a new node array with vertex and distance properties
        Args:
        node, node: A node object
        dist, int: The distance from this node to the start node
        This will be initialized as infinity for all nodes other than start
        
        Returns:
        heapNode: a node object to be placed in the minheap
        */
        let heapNode = [node, dist];
        return heapNode
    }

    addHeapNode(heapNode){
        //Adds given heapNode to the heap array
        this.heapArray.push(heapNode);
        this.size += 1;
    }

    swapHeapNode(A, B){
        /*
        Swaps the location of two nodes in the heap array
        Args:
        nodeA, nodeB: int: Array location of first and second node to be swapped
        Returns: Node
        */
        //Store first node in temporary variable
        const temp = this.heapArray[A];

        //Swap nodes in heap array
        this.heapArray[A] = this.heapArray[B];
        this.heapArray[B] = temp;
    }

    heapify(index){
        /*
        Manipulates heap until it meets the heap-order property of a minheap. Continually swaps
        parent and child values until condition is satisfied
        Args:
        index, int: The index to start the comparisons, usually 0
        */

        //Initially assume that the smallest distance is at the given index (0 unless being called recursively)
        let smallestDistLeft = index;
        let smallestDistRight = index;

        //Calculate value of left and right child nodes
        let leftVal = 2*index + 1;
        let rightVal = 2*index + 2;

        //If the left child is defined, and the distance at the left child is less than the parent
        if (leftVal < this.size && this.heapArray[leftVal][1] < this.heapArray[smallestDistLeft][1]){
            //Set smallest distance value to the distance at the left child
            smallestDistLeft = leftVal;
        }

        //If smallest distance value was changed above^ (If child node values were less than parent)
        if(smallestDistLeft !== index){
            
            //swap distance values of child and parent with swapHeapNode() method
            this.swapHeapNode(smallestDistLeft, index)

            //Recursively execute until heap meets heap-order property of min-heap
            this.heapify(smallestDistLeft)
        }

        //Repeat with right child
        if (rightVal < this.size && this.heapArray[rightVal][1] < this.heapArray[smallestDistRight][1]){
            smallestDistRight = rightVal;
        }

        //If smallest distance value was changed above^ (If child node values were less than parent)
        if(smallestDistRight !== index){
            
            //swap distance values of child and parent with swapHeapNode() method
            this.swapHeapNode(smallestDistRight, index)

            //Recursively execute until heap meets heap-order property of min-heap
            this.heapify(smallestDistRight)
        }
    }

    extractMin(){
        /*
        Extracts the node of minumum distance from heap
        */           
     
        //if min heap is empty, return null
        if(this.size === 0){
            return null;
        }
        //get root node from heap array
        let root = this.heapArray[0];

        //Get last node in heap array and place it at the start of the array
        const lastNode = this.heapArray[this.size -1];
        this.heapArray[0] = lastNode;

     

        //Decrease size of heap by 1
        this.size -= 1;
        //Call heapify() to re-organize array to fit minheap requirements
        this.heapify(0);
        
        //Return the new root value
        return root;
    }

    decreaseKey(node, dist){

        //Find location of given node in heap array
        console.log(node)
        let index = this.heapArray.findIndex((key) => (key[0].row === node.row && key[0].col === node.col));  

        //Find index of parent using minheap property
        let parentIndex = Math.floor((index-1)/2);

        //Update distance value of given node
        this.heapArray[index][1] = dist;

        //If the new value is less than its parent, continually swap with parent until heap-order consition is met
        while(index > 0 && this.heapArray[index][1] < this.heapArray[parentIndex][1]){

            //Swap both nodes in heap array
            this.swapHeapNode(index, parentIndex)

            //Set the index to the parent index to check for failed condition again at top of loop
            index = parentIndex;
            parentIndex = Math.floor((index-1)/2);
        }    
    }

/*
    isInHeap(vertex){
        
        //If the given vertex is in the heap, return true. False otherwise
        
        if(this.pos(vertex) < this.size){
            return true;
        }
        return false;
    }


    
    addNode(newNode){

    }
    */



}