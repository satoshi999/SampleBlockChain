const crypto = require('crypto');

const GENESIS_ADDRESS = '0x0000000000000000000000000000000000000000';
const TOTAL_SUPPLY = 10000;
const MINING_REWORD = 1;

class BlockChain {
  constructor(_address) {
    this.wallets = {};
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
    return txs.every((tx) => {
      const senderAmount = (tx.senderAddress in this.wallets)? Number(this.wallets[tx.senderAddress]) : 0;
      const recipientAmount = (tx.recipientAddress in this.wallets)? Number(this.wallets[tx.recipientAddress]) : 0;
      const amount = Number(tx.amount)
      if(senderAmount - amount < 0) {
        return false;
      }
      this.wallets[tx.senderAddress] = senderAmount - amount;
      this.wallets[tx.recipientAddress] = recipientAmount + amount;
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

  validChain() {
    this.wallets = {};
    this.wallets[GENESIS_ADDRESS] = TOTAL_SUPPLY;

    const genesisHash = this.hash(GENESIS_ADDRESS);
    let _previousHash = genesisHash;

    return this.chain.every((block) => {
      if(block.previousHash === genesisHash) {
        _previousHash = this.hash(block);
        return true;
      }
      if(block.previousHash !== _previousHash) {
        return false;
      }
      if(!this.validProof(block.transactions, block.previousHash, block.nonce)) {
        return false;
      }
      if(!this.validTxs(block.transactions)) {
        return false;
      }
      _previousHash = this.hash(block);
      return true
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
    this.addTransaction(GENESIS_ADDRESS, this.address, MINING_REWORD);
    console.log(`added mining transaction pool:${JSON.stringify(this.transactionPool)}`);
    const {nonce, previousHash} = this.proofOfWork();
    console.log(`success proofOfWork. nonce:${nonce}, previousHash: ${previousHash}`);
    const block = this.createBlock(nonce, previousHash);
    console.log(`success create block. ${JSON.stringify(block)}`);
    if(this.validChain()) {
      console.log(`success valid chain. My wallet token:${JSON.stringify(this.wallets[this.address])}`);
    } else {
      console.log(`Invalid chain. My wallet token:${JSON.stringify(this.wallets[this.address])}`);
    }
    return true;
  }
}

const blockChain = new BlockChain("0x8F0325E1135cA2cC50906185D0Adf62E0274cb8D");

console.log("mining start");

while(true) {
  blockChain.mining();
}


