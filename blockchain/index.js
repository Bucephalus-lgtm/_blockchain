const Block = require('./block');
const cryptoHash = require('../util/crypto-hash');
const { REWARD_INPUT, MINING_REWARD } = require('../config');
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        });
        this.chain.push(newBlock);
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for (let i = 1; i < chain.length; i++) {
            const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];

            const actualLastHash = chain[i - 1].hash;

            const lastDifficulty = chain[i - 1].difficulty;

            if (Math.abs(lastDifficulty - difficulty) > 1) return false;

            if (lastHash !== actualLastHash) return false;

            const validatedHash = cryptoHash(lastHash, timestamp, data, nonce, difficulty);

            if (hash !== validatedHash) return false;
        }
        return true;
    }

    replaceChain(chain, validTransactionFlag, onSuccess) {
        if (chain.length <= this.chain.length) {
            console.error('The incoming chain must be longer');
            return;
        }

        if (validTransactionFlag && !this.validTransactionData({ chain })) {
            console.error('The incoming chain has invalid data in it!!!');
            return;
        }

        if (!Blockchain.isValidChain(chain)) {
            console.error('The incoming chain must be valid');
            return;
        }

        if (onSuccess) onSuccess();

        console.log('Replacing the chain with', chain);
        this.chain = chain;
    }

    validTransactionData({ chain }) {

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            let rewardTransactionCount = 0;
            const transactionSet = new Set();

            for (let transaction of block.data) {

                if (transaction.input.address === REWARD_INPUT.address) {
                    rewardTransactionCount += 1;

                    if (rewardTransactionCount > 1) {
                        console.error('Miner rewards limit exceeded!!!');
                        return false;
                    }

                    if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
                        console.error('Miner reward amount invalid!!!');
                        return false;
                    }
                } else {
                    if (!Transaction.validTransaction(transaction)) {
                        console.error('Invalid transaction!!!');
                        return false;
                    }

                    const trueBalance = Wallet.calculateBalance({
                        chain: this.chain,
                        address: transaction.input.address
                    });

                    if (transaction.input.amount !== trueBalance) {
                        console.error('Invalid input amount!');
                        return false;
                    }

                    if (transactionSet.has(transaction)) {
                        console.error('Multiple occurance of one transaction in the blockchain');
                        return false;
                    } else {
                        transactionSet.add(transaction);
                    }
                }
            }

        }
        return true;
    }
}

module.exports = Blockchain;