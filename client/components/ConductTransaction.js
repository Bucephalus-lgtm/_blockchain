import React, { Component } from 'react';
import { Button, FormControl, FormGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import history from './history';

class ConductTransaction extends Component {
    state = { recipient: '', amount: 0 };

    updateRecipient = event => {
        this.setState({ recipient: event.target.value });
    }

    updateAmount = event => {
        this.setState({ amount: event.target.value });
    }

    conductTransaction = () => {
        const { recipient, amount } = this.state;

        fetch('http://localhost:3000/api/transact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ recipient, amount })
        })
            .then(response => response.json())
            .then(json => {
                alert(json.message || json.type);
                history.push('/transaction-pool');
            });
    }

    render() {
        return (
            <div className='conduct-transaction container'>
                <Link to='/'>Home</Link>
                <h3>Conduct a transaction</h3>
                <FormGroup>
                    <FormControl
                        inputMode='text'
                        value={this.state.recipient}
                        onChange={this.updateRecipient}
                        placeholder='Recipient'
                    >
                    </FormControl>

                    <FormControl
                        inputMode='numeric'
                        value={this.state.amount}
                        placeholder='Amount'
                        onChange={this.updateAmount}
                    >
                    </FormControl>

                    <div>
                        <Button
                            bsStyle="primary"
                            onClick={this.conductTransaction}
                        >
                            Submit
                    </Button>
                    </div>
                </FormGroup>
            </div>
        )
    }
}

export default ConductTransaction;