// import {cloneDeep} from 'lodash.clonedeep';
const cloneDeep = require('lodash.clonedeep');
export const dijkstra = (grid, startNodeRow, startNodeCol, endNodeRow, endNodeCol) => {
    const gridCopy = cloneDeep(grid);
    const startNode = gridCopy[startNodeRow][startNodeCol];
    const finishNode = gridCopy[endNodeRow][endNodeCol];
    const visitedNodes = [];
    startNode.distance = 0; 
    const getAllUnivisited = getAllGridNodes(gridCopy);
    while(!!getAllUnivisited.length){
        //property of const can be changed..
        sortNodes(getAllUnivisited);
        const getClosestNode = getAllUnivisited.shift();
        // console.log("Closest Node : ", getClosestNode.row , getClosestNode.col);
        if(getClosestNode.isWall){
            continue;
        }
        if(getClosestNode.distance === Infinity){
            // console.log("start distance infinity");
            return visitedNodes;
        }
        getClosestNode.isVisited = true;
        visitedNodes.push(getClosestNode);
        if(getClosestNode === finishNode){
            return visitedNodes;
        }
        updateNeighborsClosestNode(getClosestNode, gridCopy);
    }
}

const getAllGridNodes = (gridCopy) => {
    const nodes = [];
    for (const row of gridCopy) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
}

const sortNodes = (getAllUnivisited) => {
    return getAllUnivisited.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

const updateNeighborsClosestNode = (getClosestNode, gridCopy) => {
    const getNeighbors = getAllNeighbors(getClosestNode, gridCopy);
    for(let neigh of getNeighbors){
        let newDistance = 0;
        newDistance = getClosestNode.distance + neigh.weights;
        if(newDistance < neigh.distance){
            neigh.distance = newDistance;
            neigh.previousNode = getClosestNode;
        }
    }
}

const getAllNeighbors= (getClosestNode, gridCopy) => {
    const neighbors= [];
    const row = getClosestNode.row;
    const col = getClosestNode.col;
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
    return neighbors.filter(neighbor => !neighbor.isVisited);
}

export const getShortestPath = (finishNode) => {
    const shortestNode = [];
    let currentNode = finishNode;
    while(currentNode !== null){
        currentNode.shortestNode = true;
        shortestNode.unshift(currentNode);  
        currentNode = currentNode.previousNode;
    }
    return shortestNode;
}