# SampleBlockChain
<img width="1176" alt="スクリーンショット 2021-08-12 17 04 10" src="https://user-images.githubusercontent.com/18362018/129160974-f8ff181a-6014-4c57-ac34-bdc0eff5cda6.png">

## 概要
Block chainにおけるProofのchainの生成、検証の部分だけを切り出したNode.jsベースのサンプルです。  
実際に動かすとマイニングが始まり、自身にtokenが増えていく挙動を確認出来ます。  
電子署名やコンセンサスアルゴリズムが入っていませんが、Block chainにおけるマイニングがどのような仕組みで動いているかソースコードから読み取る事が出来ます  
Rewardは1、簡易にするために、発行量は10000であり、とても少なくしてあります

#### run
```
$ node blockchain.js
> mining start
> added mining transaction pool:> [{"senderAddress":"0x0000000000000000000000000000000000000000","recipientAddress":"0x8F0325E1135cA2cC50906185D0Adf62E0274cb8D","amount":1}]
> success proofOfWork. nonce: xxxx
```
