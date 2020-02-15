const crypto = require('crypto');

const GENESIS_ADDRESS = '0x0000000000000000000000000000000000000000';
const TOTAL_SUPPLY = 10000;
const MINING_REWORD = 1;

class BlockChain {
  constructor(_address) {
    this.transactionPool = [];
    this.chain = [];
    this.createBlock(0, this.hash(GENESIS_ADDRESS));
    this.address = _address;
    this.continuousHeaderLength = 5;
  }

  createBlock(_nonce, _previousHash) {
    const block = {
      timestamp: new Date().getTime(),
      transactions: this.transactionPool,
      nonce: _nonce,
      previousHash: _previousHash
    };
    this.chain.push(block);
    this.transactionPool = [];
    return block;
  }

  hash(block){
    return crypto.createHash('sha256').update(JSON.stringify(block)).digest('hex');
  }

  addTransaction(_senderAddress,_recipientAddress, _amount) {
    const transaction = {
      senderAddress: _senderAddress,
      recipientAddress: _recipientAddress,
      amount: _amount
    }
    this.transactionPool.push(transaction);
    return transaction;
  }

  validTxs(txs) {
    this.wallets = {};
    this.wallets[GENESIS_ADDRESS] = TOTAL_SUPPLY;
    return txs.every((tx) => {
      if(!this.wallets[tx.senderAddress]) {
        return false;
      }
      const senderAmount = Number.isInteger(this.wallets[tx.senderAddress])? this.wallets[tx.senderAddress] : 0;
      const recipientAmount = Number.isInteger(this.wallets[tx.recipientAddress])? this.wallets[tx.recipientAmount] : 0;
      if((senderAmount - tx.amount < 0) {
        return false;
      }
      this.wallets[tx.senderAddress] = senderAmount - tx.amount;
      this.wallets[tx.recipientAddress] = recipientAmount + tx.amount;
      return true;
    });
  }

  validProof(_transactions, _previousHash, _nonce) {
    const guessBlock = {
        transactions: _transactions,
        nonce: _nonce,
        previousHash: _previousHash
    }
    const guessHash = this.hash(guessBlock);
    return guessHash.slice(0, this.continuousHeaderLength) === '0'.repeat(this.continuousHeaderLength);
  }

  validChain(chain) {
    let _previousHash = this.hash(GENESIS_ADDRESS);
    return chain.every((block) => {
      if(block.previousHash !== _previousHash) {
        return false;
      }
      if(!this.validProof(block.transactions, _previousHash, block.nonce)) {
        return false;
      }
      _previousHash = this.hash(block);
      return this.validTxs(block.transactions);
    });
  }

  proofOfWork() {
    const transactions = Array.from(this.transactionPool);
    const previousHash = this.hash(this.chain[this.chain.length-1]);
    let nonce = 0;
    while(!this.validProof(transactions, previousHash, nonce)) {
      nonce++;
    }
    return {nonce, previousHash};
  }

  mining() {
    console.log("mining start");
    this.addTransaction(GENESIS_ADDRESS, this.address, MINING_REWORD);
    console.log(`added mining transaction pool:${JSON.stringify(this.transactionPool)}`);
    const {nonce, previousHash} = this.proofOfWork();
    console.log(`success proofOfWork. nonce:${nonce}, previousHash: ${previousHash}`);
    this.createBlock(nonce, previousHash);
    console.log(`success create block. chain:${JSON.stringify(this.chain)}, transaction pool:${JSON.stringify(this.transactionPool)}`);
    this.validChain();
    console.log(`success valid chain. wallet:${JSON.stringify(this.wallets)}`);
    return true;
  }
}

const blockChain = new BlockChain("0x8F0325E1135cA2cC50906185D0Adf62E0274cb8D");
blockChain.mining();
