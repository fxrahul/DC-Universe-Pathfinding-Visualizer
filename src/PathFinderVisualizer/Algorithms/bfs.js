const cloneDeep = require('lodash.clonedeep');

export const bfs = (grid, startNodeRow, startNodeCol, endNodeRow, endNodeCol) => {
    const gridCopy = cloneDeep(grid);
    const startNode = gridCopy[startNodeRow][startNodeCol];
    const finishNode = gridCopy[endNodeRow][endNodeCol];
    let visitedNodes = [];
    let nodes = [];
    nodes.push(startNode);
    while(!!nodes.length){
        const currentNode = nodes.shift();
        if(currentNode.isWall){
            continue;
        }
        visitedNodes.push(currentNode);
        currentNode.isVisited = true;
        if(currentNode === finishNode){
            return visitedNodes;
        }
        updateNeighborsClosestNode(currentNode, gridCopy, nodes);
    }
    return visitedNodes;
}

const updateNeighborsClosestNode = (currentNode, gridCopy, nodes) => {
    const getNeighbors = getAllNeighbors(currentNode, gridCopy);
    for(let neigh of getNeighbors){ 
        neigh.isVisited = true;
        nodes.push(neigh);
        neigh.previousNode = currentNode;
    }
}


const getAllNeighbors= (currentNode, gridCopy) => {
    const neighbors= [];
    const row = currentNode.row;
    const col = currentNode.col;
    if(row > 0){
        neighbors.push(gridCopy[row - 1][col]); //top
    }
    if(row < gridCopy.length - 1){
        neighbors.push(gridCopy[row + 1][col]); //bottom
    }
    if(col > 0){
        neighbors.push(gridCopy[row][col - 1]); //left
    }
    if(col < gridCopy[0].length - 1){
        neighbors.push(gridCopy[row][col + 1]); //right
    }
    return neighbors.filter(neighbors => !neighbors.isVisited);
}