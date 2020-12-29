import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

import Transaction from './Transaction';

class Block extends Component {
    state = { displayTransaction: false }

    toggleTransaction = () => {
        this.setState({ displayTransaction: !this.state.displayTransaction });
    }

    get displayTransaction() {
        const { data } = this.props.block;

        const strigifiedData = JSON.stringify(data);
        const dataDisplay = strigifiedData.length > 35 ? `${strigifiedData.substring(0, 35)}.....`
            : strigifiedData;

        if (this.state.displayTransaction) {
            return (
                <div>
                    <div>
                        {
                            data.map(transaction => (
                                <div key={transaction.id}> <hr />
                                    <Transaction key={transaction.id} transaction={transaction} />
                                </div>
                            ))
                        }
                    </div>
                    <Button
                        bsStyle="info"
                        bsSize="small"
                        onClick={this.toggleTransaction}

                    >
                        Show Less
                    </Button>
                </div>
            )
        }

        return (
            <div>
                <div>Data: {dataDisplay}</div>
                <Button
                    bsSize="small"
                    bsStyle="info"
                    onClick={this.toggleTransaction}
                >Show more</Button>
            </div>
        )
    }

    render() {

        const { timestamp, hash, lastHash, data } = this.props.block;

        const hashDisplay = `${hash.substring(0, 15)}.....`;

        return (
            <div className="block">
                <div>Hash: {hashDisplay}</div>
                <div>Timestamp: {new Date(timestamp).toLocaleDateString()}</div>
                <div>LastHash: {lastHash}</div>

                {this.displayTransaction}
            </div>
        )
    }
}

export default Block;