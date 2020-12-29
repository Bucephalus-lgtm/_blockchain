const Blockchain = require('../blockchain/index');

const blockchain = new Blockchain();

blockchain.addBlock({ data: 'INITIAL BLOCK ADDED BY BHARGAB' });

// console.log('FIRST BLOCK', blockchain.chain[blockchain.chain.length - 1]);

let previousTimestamp, nextTimestamp, nextBlock, timeDifference, avaerage;

const times = [];

for (let i = 0; i < 10000; i++) {
    previousTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;
    blockchain.addBlock({ data: `Block ${i}` });
    nextBlock = blockchain.chain[blockchain.chain.length - 1];
    nextTimestamp = nextBlock.timestamp;
    timeDifference = nextTimestamp - previousTimestamp;
    times.push(timeDifference);

    avaerage = times.reduce((total, num) => (total + num / times.length));

    console.log(`Time to mine block ${timeDifference}ms. Difficulty: ${nextBlock.difficulty}. Average Time: ${avaerage}ms.`);
}