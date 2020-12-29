import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { Logo } from './Logo';

class App extends Component {
    state = { walletInfo: {} };

    componentDidMount() {
        fetch('http://localhost:3000/api/wallet-info')
            .then(response => response.json())
            .then(json => this.setState({ walletInfo: json }));
    }

    render() {
        const { address, balance } = this.state.walletInfo;
        return (
            <div className='app'>
                {/* <img className='logo' src={logo} alt="" /> */}
                <Logo/>
                <hr />
                <div>
                    <Link to='/blocks'>Blocks</Link> <br />
                    <Link to='/conduct-transaction'>Conduct a transaction</Link> <br />
                    <Link to='/transaction-pool'>Transaction Pool</Link>
                </div>

                <h1> Welcome to cryptochain, Bhargab!</h1>
                <div className="wallet-info">
                    <h3>Address: {address}</h3>
                    <h3>Balance: {balance}</h3>
                </div>
            </div>
        )
    }
}

export default App;