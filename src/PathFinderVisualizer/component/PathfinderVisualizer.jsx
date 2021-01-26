import React from 'react';
import Node from './Node';
import '../css/PathFinderVisualizer.css';
import {dijkstra, getShortestPath} from '../Algorithms/dijkstra.js';
import {bfs} from '../Algorithms/bfs.js';
import {dfs} from '../Algorithms/dfs.js';
import {Button, Navbar, Nav, NavDropdown} from 'react-bootstrap';
import Flash from '../images/flash.svg';
import Batman from '../images/batman.svg';
import Wonderwoman from '../images/wonderWoman.svg';
import FlashVillian from '../images/flashVillian.svg';
import Superman from '../images/flashIcon.svg';
import JusticeLeague from '../images/justiceLeague.svg';
import addWeights from '../images/addWeights.gif';
import addWalls from '../images/addWalls.gif';
import movingNodes from '../images/movingNodes.gif';
import algorithms from '../images/algorithms.gif';
import github from '../images/github.svg';
import shortestNodePath from '../images/shortestPath.jpg';


let algorithmName = "";
let wKeyPressed = false;
let algorithmStart = false;
let dragStart = false;
let dragEnd = false;
let slideIndex = 1;
let shortestPath = [];


export default class PathfinderVisualizer extends React.Component{
    constructor(props){
        super(props);
        this.state = { 
            grid : [],
            isMousePressed : false,
            startNodeRow : 9,
            startNodeCol : 4,
            endNodeRow : 9,
            endNodeCol : 38,
        };
    }

    componentDidMount(){
        const grid = getInitialGrid(this.state.startNodeRow, this.state.startNodeCol, this.state.endNodeRow,this.state.endNodeCol);
        this.setState({grid});
        document.getElementById('mainDiv').focus();
        this.showSlides(slideIndex);
    }
    plusSlides (n) {
        this.showSlides(slideIndex += n);
    }

    showSlides(n){
        let slides = document.getElementsByClassName("introductionPage");
        if (n < 1) {
            slideIndex = 1;
            return;
        }
        if(n === 1){
            document.getElementById('jlLogo').style.display = "block";
            document.getElementById('prevBtn').style.display = "none";
        }else{
            document.getElementById('prevBtn').style.display = "block";
        }
        if(n !== 1){
            document.getElementById('jlLogo').style.display = "none";
        }
        if(n === slides.length){
            document.getElementById('nextBtn').innerText = "Finish";
            document.getElementById('skip').style.display = "none";
        }else{
            document.getElementById('nextBtn').innerText = "Next";
            document.getElementById('skip').style.display = "block";
        }
        if (n > slides.length) {
            slideIndex = 1;
            this.closeOverlay();
            return;
        }    
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
        }
        slides[slideIndex-1].style.display = "block";  
    }

    closeOverlay(){
        document.getElementById('overlayTutorialId').style.display = "none";
        setTimeout(() => {
            document.querySelector('#mainDiv').focus();
        }, 500);
    }


    onMouseDown(row, col){
        if(!algorithmStart){
            this.setState({isMousePressed : true});
            if((row === this.state.startNodeRow && col === this.state.startNodeCol)){
                dragStart = true;
                return;
            }
            if(row === this.state.endNodeRow && col === this.state.endNodeCol){
                dragEnd = true;
                return;
            }
            if(wKeyPressed){
                const newGrid = setWeights(this.state.grid, row, col);
                this.setState({grid : newGrid});
            }
            else{
                const newGrid = setWalls(this.state.grid, row, col);
                this.setState({grid : newGrid});
            } 
        }
    }

    onMouseEnter(row, col){
        if(!algorithmStart){
            if(!this.state.isMousePressed){
                return;
            }
            if(dragStart){
                const newGrid = this.state.grid.slice();
                const node = newGrid[this.state.startNodeRow][this.state.startNodeCol];
                const newNode = {
                    ...node,
                    isStart: false,
                }
                newGrid[this.state.startNodeRow][this.state.startNodeCol] = newNode;
                this.setState({grid : newGrid});
                const updatedGrid = setNew(this.state.grid, row, col, "start");
                this.setState({startNodeRow : row, startNodeCol : col});
                this.setState({grid : updatedGrid});
                return;
            }
            if(dragEnd){
                const newGrid = this.state.grid.slice();
                const node = newGrid[this.state.endNodeRow][this.state.endNodeCol];
                const newNode = {
                    ...node,
                    isFinish: false,
                }
                newGrid[this.state.endNodeRow][this.state.endNodeCol] = newNode;
                this.setState({grid : newGrid});
                const updatedGrid = setNew(this.state.grid, row, col, "end");
                this.setState({grid : updatedGrid});
                this.setState({endNodeRow : row, endNodeCol : col});
                return;
            }
            if(wKeyPressed){
                const newGrid = setWeights(this.state.grid, row, col);
                this.setState({grid : newGrid});
            }else{
                const newGrid = setWalls(this.state.grid, row, col);
                this.setState({grid : newGrid});
            }
        }
    }

    onMouseUp(){
        dragStart = false;
        dragEnd = false;
        this.setState({isMousePressed : false});
    }

    onKeyDown(event){
        if(!algorithmStart){
            if(event.key === 'w'){
                wKeyPressed = true;
            }
        }
    }   

    onKeyUp(event){
            if(event.key === 'w'){
                wKeyPressed = false;
            }
    }

    resetState(){
        document.getElementById('visualizeButton').disabled = false;
        document.getElementById('visualizeButton').innerText = "Visualize";
        const grid = getInitialGrid(9, 4 , 9, 38);
        this.setState({
            grid : grid,
            isMousePressed : false,
            startNodeRow : 9,
            startNodeCol : 4,
            endNodeRow : 9,
            endNodeCol : 38,
        });
        algorithmName = "";
        wKeyPressed = false;
        algorithmStart = false;
        dragStart = false;
        dragEnd = false;
        slideIndex = 1;
        shortestPath = [];
        document.getElementById('mainDiv').focus();
        if(document.getElementsByClassName('dropdown-item active')[0]){
            document.getElementsByClassName('dropdown-item active')[0].className = "dropdown-item";
        }
    }
  
    /**
     * 
     * @param {*} visitedNodes
     * 
     * Animate visited Nodes. 
     */
    animateDijkstra(visitedNodes, shortestPath, doVisualizeShortestPath){
        const startNodeRow = this.state.startNodeRow;
        const startNodeCol = this.state.startNodeCol;
        const endNodeRow = this.state.endNodeRow;
        const endNodeCol = this.state.endNodeCol;
        for(let i = 0 ; i < visitedNodes.length ; i++){
            if(i > 0){
                setTimeout(() => {
                    const node = visitedNodes[i];
                    let previousNode = visitedNodes[i - 1];
                    let previousNodeReference = document.getElementById(`node-${previousNode.row}-${previousNode.col}`);
                    const extraClassName = (previousNode.row === startNodeRow && previousNode.col === startNodeCol) ? "isStartNode" : (previousNode.isWeight) ? "isWeightNode" : "";
                    previousNodeReference.className = `node ${extraClassName}`;
                    let nodeReference = document.getElementById(`node-${node.row}-${node.col}`);
                    const isWeight = node.isWeight;
                    const extraClassNameCurrent = (node.row === startNodeRow && node.col === startNodeCol) ? "isStartNode" : (node.row === endNodeRow && node.col === endNodeCol) ? "isFinishNode" : isWeight ? "isWeightedandVisited" : "isVisitedNode";
                    nodeReference.className = `node ${extraClassNameCurrent}`;
                    if( (i === visitedNodes.length - 1) && doVisualizeShortestPath){
                        this.animateShortest(shortestPath);
                    }
                }, 50 * i);
            }
        }
    }

    handleAlgorithm(e){
        algorithmName = e;
        document.getElementById('visualizeButton').innerText = "Visualize " + algorithmName + "!";
    }

    visualizeDijkstra(){
        const startNodeRow = this.state.startNodeRow;
        const startNodeCol = this.state.startNodeCol;
        const endNodeRow = this.state.endNodeRow;
        const endNodeCol = this.state.endNodeCol;
        if(algorithmName === ""){
            document.getElementById('visualizeButton').innerText = "Pick an algorithm!";
            setTimeout(() => {
                document.getElementById('visualizeButton').innerText = "Visualize";
            }, 2000);
            return;
        }
        algorithmStart = true;
        document.getElementById('visualizeButton').disabled = true;
        const grid = this.state.grid;
        let visitedNodes = [];
        if(algorithmName === "Dijkstra"){
            visitedNodes = dijkstra(grid,startNodeRow, startNodeCol, endNodeRow, endNodeCol);
        }else if(algorithmName === "BFS"){
            visitedNodes = bfs(grid,startNodeRow, startNodeCol, endNodeRow, endNodeCol);
        }else if(algorithmName === "DFS"){
            visitedNodes = dfs(grid,startNodeRow, startNodeCol, endNodeRow, endNodeCol);
        }
        const finishNode = visitedNodes[visitedNodes.length - 1];
        let doVisualizeShortestPath = false;
        if(finishNode.length !== 0 && finishNode.row === endNodeRow && finishNode.col === endNodeCol){
            doVisualizeShortestPath = true;
        }
        shortestPath = getShortestPath(finishNode);
        this.animateDijkstra(visitedNodes, shortestPath, doVisualizeShortestPath);
    }

    animateShortest(shortestPath){
        const startNodeRow = this.state.startNodeRow;
        const startNodeCol = this.state.startNodeCol;
        const endNodeRow = this.state.endNodeRow;
        const endNodeCol = this.state.endNodeCol;
        for(let i = 0 ; i < shortestPath.length ; i++){
            if(i > 0){
                setTimeout(() => {
                    const node = shortestPath[i];
                    let previousNode = shortestPath[i - 1];
                    let previousNodeReference = document.getElementById(`node-${previousNode.row}-${previousNode.col}`);
                    const extraClassName = (previousNode.row === startNodeRow && previousNode.col === startNodeCol) ? "isStartNode" :  "";
                    previousNodeReference.className = `node ${extraClassName}`;
                    let nodeReference = document.getElementById(`node-${node.row}-${node.col}`);
                    const extraClassNameCurrent = (node.row === startNodeRow && node.col === startNodeCol) ? "isStartNode" : (node.row === endNodeRow && node.col === endNodeCol) ? "isFinishNode" : "isShortNode";
                    nodeReference.className = `node ${extraClassNameCurrent}`;
                    if(i === shortestPath.length - 1){
                        nodeReference.className = 'node finalTarget';
                    }
                }, 100 * i);
            }
        }
    }

    render(){
        const grid = this.state.grid;
        const isMousePressed = this.state.isMousePressed;
        return(
            <div id = "mainDiv" tabIndex = {0} onKeyDown = {(event) => this.onKeyDown(event)} onKeyUp = {(event) => this.onKeyUp(event)}>
                
                <Navbar fixed = "top" collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Navbar.Brand href="#home">Pathfinding Visualizer</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav>
                            <Nav.Item>
                                <NavDropdown className = "algorithm" title="Algorithm" id="collasible-nav-dropdown" onSelect={this.handleAlgorithm}>
                                    <NavDropdown.Item href="#" eventKey="Dijkstra">Dijkstra's</NavDropdown.Item>
                                    <NavDropdown.Item href="#" eventKey="BFS">Breadth First Search (BFS)</NavDropdown.Item>
                                    <NavDropdown.Item href="#" eventKey="DFS">Depth First Search (DFS)</NavDropdown.Item>
                                </NavDropdown>
                            </Nav.Item>
                            <Nav.Item >
    
                                <Button id = "visualizeButton" onClick = {() => this.visualizeDijkstra()}>Visualize</Button>
                            </Nav.Item>
                            <Nav.Item >
                                <span id = "resetButton" onClick = {() => this.resetState()}>Reset Grid</span>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <div>
                    <div className = "description">
                        <div className = "descriptionDetails">
                            <img src = {Batman} alt = "startNode" width = "25px" height = "25px"/>Start Node (Batman)
                        </div>
                        <div className = "descriptionDetails">
                        <img src = {Wonderwoman} alt = "targetNode" width = "25px" height = "25px"/>Target Node (Wonder Woman)
                        </div>
                        <div className = "descriptionDetails">
                            <img src = {Flash} alt = "visitedNode" width = "25px" height = "25px"/>Visited Node (Flash)
                        </div>
                        <div className = "descriptionDetails">
                            <img src = {Superman} alt = "weightNode" width = "25px" height = "25px"/>&nbsp;Weight Node(Superman)
                        </div>
                        <div className = "descriptionDetails">
                            <img src = {FlashVillian} alt = "wallNode" width = "25px" height = "25px"/>Wall Node(Zoom)
                        </div>
                    </div> 
                    <div className = "overlayTutorial" id = "overlayTutorialId">
                        <div className = "introductionPage">
                            <div className = "introductionTitle">
                                <h1>Welcome to DC Universe Pathfinding Visualizer!</h1>
                            </div>
                            <div className = "introductionSummary">
                                <h5 className = "introductionSummaryTop">
                                    In DC Universe, Batman have to meet Wonder woman as soon as possible.But, the problem is batman have 
                                     number of paths to reach wonderwoman.<br/> Also, he has to deal with supermanin between these paths. Batman is asking flash to
                                     find him a shortest path to reach Wonder woman. But, one more problem is flash has to deal with Zoom in between 
                                     these paths. With all these above conditions, Flash have to find a shortest path for batman.
                                </h5>
                                <h6 className = "introductionSummaryBottom">
                                    Press "Skip" to skip this tutorial or else press "Next" to take a deep dive into this amazing tutorial.
                                </h6>
                            </div>
                        </div>
                        <div className = "introductionPage">
                            <div className = "introductionTitle">
                                <h1>Shortest Path Algorithm!</h1>
                            </div>
                            <div className = "introductionSummary">
                                <h5 className = "introductionSummaryTop">
                                Shortest path algorithms are a family of algorithms designed to solve the shortest path problem.
                                 The shortest path problem is something most people have some intuitive familiarity with: given two points, A and B, 
                                 what is the shortest path between them? In computer science, however, the shortest path problem can take different
                                  forms and so different algorithms are needed to be able to solve them all.
                                </h5>
                                <img className = "gifImage" id = "shortestPath" src = {shortestNodePath} alt = "shortestPath"/>
                            </div>
                        </div>
                        <div className = "introductionPage">
                                <div className = "introductionTitle">
                                    <h1>Walls</h1>
                                </div>
                                <div>
                                    <div>
                                        <h5 className = "introductionSummaryTop">
                                            Walls : Click and drag mouse to add walls
                                        </h5>
                                        <img className = "gifImage" id = "walls" src = {addWalls} alt = "addWalls"/>
                                    </div>
                                </div>
                        </div>
                        <div className = "introductionPage">
                                <div className = "introductionTitle">
                                    <h1>Weights</h1>
                                </div>
                                <div>
                                    <div>
                                        <h5 className = "introductionSummaryTop">
                                            Weights : Press W and then click-drag to add weights.
                                        </h5>
                                        <img className = "gifImage" id = "weights" src = {addWeights} alt = "addWeights"/>
                                    </div>        
                                </div>
                        </div>
                        <div className = "introductionPage">
                                <div className = "introductionTitle">
                                    <h1>Nodes</h1>
                                </div>
                                <div>
                                    <div>
                                        <h5 className = "introductionSummaryTop">
                                            Click and drag to set start and target node.
                                        </h5>
                                        <img className = "gifImage" id = "nodes" src = {movingNodes} alt = "movingNodes"/>
                                    </div>        
                                </div>
                        </div>
                        <div className = "introductionPage">
                                <div className = "introductionTitle">
                                    <h1>Algorithms</h1>
                                </div>
                                <div>
                                    <div>
                                        <h5 className = "introductionSummaryTop">
                                            Click on Algorithms to select from different algorithms and then visualize it!.
                                        </h5>
                                        <h6><b>Dijkstra's : </b>It is weigted algorithm and guarantees shortest path.</h6>
                                        <h6><b>Breadth First Search : </b>It is unweigted algorithm and guarantees shortest path.</h6>
                                        <h6><b>Depth First Search : </b>It is unweigted algorithm but does not guarantees shortest path.</h6>
                                        <img className = "gifImage" id = "algorithms" src = {algorithms} alt = "algorithms"/>
                                    </div>        
                                </div>
                        </div>
                        <div className = "introductionPage">
                                <div className = "introductionTitle">
                                    <h1>Enjoy the Project!</h1>
                                </div>
                                <div>
                                    <h5 className = "introductionSummaryTop">
                                        I hope you enjoy my work. Feel free to check out my github repository for this project.
                                    </h5>
                                    <a href = "https://github.com/fxrahul" ><img id = "github" src = {github} alt = "github" /></a>
                                    <div className = "iconCredit">
                                        <h6>
                                            <b>Icon Credits: </b>
                                            <a href = "https://www.iconfinder.com/">Icon Finder</a>
                                            &nbsp;
                                            <a href = "https://iconmonstr.com/">iconmonstr</a>
                                        </h6>
                                    </div>
                                </div>
                        </div>
                        <div className = "introductionBottom">
                                <Button className = "introButton" id ="skip" onClick = {() => this.closeOverlay()}>
                                    Skip
                                </Button>
                            
                                <img id = "jlLogo" src = {JusticeLeague} alt = "batman" height = "160px" width = "160px"/>
                                <Button className = "introButton nextPrev" id = "nextBtn" onClick = {() => this.plusSlides(1)}>
                                    Next
                                </Button>
                                <Button className = "introButton nextPrev" id = "prevBtn" onClick = {() => this.plusSlides(-1)}>
                                    Previous
                                </Button>
                        </div>
                    </div>
                    <div className = "grid">          
                        {grid.map((row, rowIndex) => {
                            return (
                            <div key = {rowIndex}>
                                {row.map((node, nodeIndex) => {
                                    const isStart = node.isStart;
                                    const isFinish = node.isFinish;
                                    const isVisited = node.isVisited;
                                    const distance = node.distance;
                                    const isWeight = node.isWeight;
                                    const row = node.row;
                                    const col = node.col;
                                    const isWall = node.isWall;
                                    const previousNode = node.previosuNode;
                                    const weights = node.weights;
                                    return (
                                    <Node 
                                        key = {nodeIndex}
                                        isStart = {isStart}
                                        isFinish = {isFinish}
                                        isVisited = {isVisited}
                                        isWeight = {isWeight}
                                        distance = {distance}
                                        row = {row}
                                        col = {col}
                                        weights = {weights}
                                        isMousePressed={isMousePressed}
                                        onMouseDown={(row, col) => this.onMouseDown(row, col)}
                                        onMouseEnter={(row, col) =>
                                        this.onMouseEnter(row, col)
                                        }
                                        onMouseUp={() => this.onMouseUp()}
                                        isWall = {isWall}
                                        previousNode = {previousNode}>
                                    </Node>
                                    );
                                })}
                            </div>
                            );
                        })}
                    </div>
            </div>
            </div>
        );
    }
}
const getInitialGrid = (startNodeRow, startNodeCol, endNodeRow, endNodeCol) => {
    const grid = [];
    for(let i = 0 ; i < 16 ; i++){
        const currentRow = [];
        for(let j = 0 ; j < 42 ; j++){
            currentRow.push(createCurrentNode(i, j, startNodeRow, startNodeCol, endNodeRow, endNodeCol));
        }
        grid.push(currentRow);
    }
    return grid;
}

const createCurrentNode = (i, j, startNodeRow, startNodeCol, endNodeRow, endNodeCol) => {
    const currentNode = {
        isStart : i === startNodeRow && j === startNodeCol,
        isFinish : i === endNodeRow && j === endNodeCol,
        isVisited : false,
        isWall : false,
        isWeight : false,
        distance : Infinity,
        row : i,
        col : j,
        previousNode : null,
        weights : 1,
    };
    return currentNode;
}

const setWalls = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node, // copy all property of node object..
        isWall : !node.isWall,
        isWeight : false,
    };
    newGrid[row][col] = newNode;
    return newGrid;
}

const setWeights = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    if(node.isWeight){
        const newNode = {
            ...node, // copy all property of node object..
            isWeight : false,
            isWall : false,
            weights : 1,
        };
        newGrid[row][col] = newNode;
    }else{
        const newNode = {
            ...node, // copy all property of node object..
            isWeight : true,
            isWall : false,
            weights : Math.floor(Math.random() * 10),
        };
        newGrid[row][col] = newNode;
    }
    return newGrid;
}


const setNew = (grid, row, col, name) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
        ...node,
    }
    if(name === "start"){
        newNode.isStart = true;
    }else if(name === "end"){
        newNode.isFinish = true;
    }

    newGrid[row][col] = newNode;
    return newGrid;
}

// const getInitialState = () => {
//     return {
//         grid : [],
//         isMousePressed : false,
//         startNodeRow : 9,
//         startNodeCol : 4,
//         endNodeRow : 9,
//         endNodeCol : 38,
//     };
// }