import { json } from 'body-parser';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Block from './Block';
import Logo from './Logo';

class Blocks extends Component {
    state = { blocks: [] };

    componentDidMount() {
        fetch('http://localhost:3000/api/blocks')
            .then(response => response.json())
            .then(json =>
                this.setState({ blocks: json })
            );
    }

    render() {
        return (
            <div>
                <h3>Blocks</h3>
                <div>
                    <Link to='/'>Home</Link>
                </div>
                {this.state.blocks.map(block => {
                    return (
                        <Block key={block.hash} block={block} />
                    )
                })}
            </div>
        )
    }
}

export default Blocks;