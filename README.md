### Blockchain and Cryptocurrency | Full-Stack MERN

A full stack MERN web app for blockchain and cryptcurrency. 

The overall functionality is like this:
 1. API around the Blockchain
 2. Real-time connected peer-to-peer server with a pub/sub implementation through Redis-server.
 3. Sign Transactions with cryptography and digital signature.
 4. Create a Transaction Pool for a real-time list of incoming data.
 5. Include transactions in core blocks of the chain



For running the app in your PC locally, you should have installed REDIS SERVER in your PC. As I've used it for the peer to peer(P2P) connection in the eniter network of blockchain. You can install redis from <a href="https://redis.io/download.">here</a>


Then, ypu simply run npm run dev in your terminal.

In case you get some error to run the app because of redis running in background, please head to <a href="https://stackoverflow.com/questions/14816892/how-to-keep-redis-server-running" > this. </a>
