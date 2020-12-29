const express = require('express');
const request = require('request');
const path = require('path');

const PubSub = require('./app/pubsub');
const Blockchain = require('./blockchain/index');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const TransactionMiner = require('./app/transaction-miner');

const blockchain = new Blockchain();

const transactionPool = new TransactionPool();
const wallet = new Wallet();

const pubsub = new PubSub({ blockchain, transactionPool });

const transactionMiner = new TransactionMiner({
    blockchain,
    transactionPool,
    wallet,
    pubsub
});

const DEFAULT_PORT = 3000;

const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

const syncWithRouteState = () => {
    request({ url: `http://localhost:3000/api/blocks` }, (error, response, body) => {
        if (!error || response.statusCode === 200) {
            const rootChain = JSON.parse(body);
            console.log('Replacing the chain on a sync with ', rootChain);
            blockchain.replaceChain(rootChain);
        }
    });

    request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, (error, response, body) => {
        if (!error || response.statusCode === 200) {
            const rootTransactionPoolMap = JSON.parse(body);
            console.log('Replacing the transaction pool on a sync with ', rootTransactionPoolMap);
            transactionPool.setMap(rootTransactionPoolMap);
        }
    });
}

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
    const { data } = req.body;

    blockchain.addBlock({ data });

    res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
    const { recipient, amount } = req.body;
    let transaction = transactionPool.existingTransaction({
        inputAddress: wallet.publicKey
    });

    try {
        if (transaction) {
            transaction.update({ senderWallet: wallet, recipient, amount });
        }
        else {
            transaction = wallet.createTransaction({ recipient, amount, chain: blockchain.chain });
        }

    } catch (err) {
        return res.status(400).json({ type: 'error', message: err.message });
    }

    transactionPool.setTransaction(transaction);

    pubsub.broadcastTransaction(transaction);

    res.json({
        type: 'success',
        transactionPool
    });
});

app.get('/api/transaction-pool-map', (req, res) => {
    res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req, res) => {
    transactionMiner.mineTransactions();
    res.redirect('/api/blocks');
});

app.get('/api/wallet-info', (req, res) => {
    const address = wallet.publicKey;

    res.json({
        address,
        balance: Wallet.calculateBalance({
            address,
            chain: blockchain.chain
        })
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/dist/index.html'));
})

let PEER_PORT;

    const walletBhargab = new Wallet();
    const walletPadmini = new Wallet();

    const generateTransaction = ({ wallet, recipient, amount }) => {
        const transaction = wallet.createTransaction({
            recipient, amount, chain: blockchain.chain
        });

        transactionPool.setTransaction(transaction);
    }

    const walletAction = () => generateTransaction({
        wallet, recipient: walletBhargab.publicKey, amount: 10
    });

    const walletBhargabAction = () => generateTransaction({
        wallet: walletBhargab, recipient: walletPadmini.publicKey, amount: 15
    });

    const walletPadminiAction = () => generateTransaction({
        wallet: walletPadmini, recipient: wallet.publicKey, amount: 30
    });

    for (let i = 0; i < 10; i++) {
        if (i % 3 === 0) {
            walletAction();
            walletBhargabAction();
        } else if (i % 3 === 1) {
            walletBhargabAction();
            walletPadminiAction();
        } else {
            walletAction();
            walletPadminiAction();
        }

        transactionMiner.mineTransactions();
    }

if (process.env.GENERATE_PEER_PORT === 'true') {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = process.env.PORT || PEER_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);

    if (PORT !== DEFAULT_PORT) {
        syncWithRouteState();
    }
});

setTimeout(() => pubsub.broadcastChain(), 1000);