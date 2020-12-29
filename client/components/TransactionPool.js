import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Transaction from './Transaction';
import history from '../components/history';

const INTERVAL_FOR_POLL = 10000;

class TransactionPool extends Component {
    state = { transactionPoolMap: {} };

    fetchTransactionPoolMap = () => {
        fetch('http://localhost:3000/api/transaction-pool-map')
            .then(response => response.json())
            .then(json => this.setState({ transactionPoolMap: json }));
    }

    fetchMineTransaction = () => {
        fetch('http://localhost:3000/api/mine-transactions')
            .then(response => {
                if (response.status === 200) {
                    alert('Success!');
                    history.push('/blocks');
                } else {
                    alert('Sorry! Your mine transaction request was bad one!');
                }
            })
    }

    componentDidMount() {
        this.fetchTransactionPoolMap();

        this.pollIntervalForFetchTransactionPool = setInterval(
            () => this.fetchTransactionPoolMap(),
            INTERVAL_FOR_POLL
        );
    }

    componentWillUnmount() {
        clearInterval(this.pollIntervalForFetchTransactionPool);
    }

    render() {
        return (
            <div className='container transaction-pool'>
                <Link to='/'>Home</Link>
                <h3>Transaction Pool</h3>
                {
                    Object.values(this.state.transactionPoolMap).map(transaction => {
                        return (
                            <div key={transaction.id}>
                                <hr />
                                <Transaction transaction={transaction} />
                            </div>
                        )
                    })
                }

                <hr />

                <Button bsStyle="danger" onClick={this.fetchMineTransaction}>
                    Mine the transactions
                </Button>
            </div>
        )
    }
}

export default TransactionPool;