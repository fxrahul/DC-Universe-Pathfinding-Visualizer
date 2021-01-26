import React from 'react';
import '../css/Node.css';

export default class Node extends React.Component{
    constructor(props){
        super(props);
        this.state = { //props are updated when component is re render not state unless you do setState.....
        };

    }
    render(){
        const isStart = this.props.isStart;
        const isFinish = this.props.isFinish;
        const isVisited = this.props.isVisited;
        const row = this.props.row;
        const col = this.props.col;
        const onMouseDown = this.props.onMouseDown;
        const onMouseEnter = this.props.onMouseEnter;
        // const onKeyDown = this.props.onKeyDown;
        // const onKeyUp = this.props.onKeyUp;
        const onMouseUp = this.props.onMouseUp;
        const isWall = this.props.isWall;
        const isWeight = this.props.isWeight;
        const extraClassName = isFinish ? "isFinishNode" : isStart ? "isStartNode" : isVisited ? "isVisitedNode" : isWall ? "isWallNode" : isWeight ? "isWeightNode" : "";
        return(
            <>
                <div 
                    id = {`node-${row}-${col}`}
                    className = {`node ${extraClassName}`}
                    onMouseDown = {() => onMouseDown(row, col)}
                    onMouseEnter = {() => onMouseEnter(row, col)}
                    onMouseUp = {() => onMouseUp()}
                    > 
                </div>
            </>
        );
    }
}