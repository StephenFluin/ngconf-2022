# AngularOperator
This is a sample repo and tool created for [ng-conf 2022](https://ng-conf.org/).

It contains a normal angular app designed to interact with the blockchain.

It also includes sample Solidity code for a fair Raffle using Chainlink VRF.

Check out the [Chainlink Getting Started documentation](https://docs.chain.link/docs/deploy-your-first-contract/) for more context and background help.

## How to use this demo
Simply run the Angular app and make sure you have a wallet and you should be able to connect to and play with the ng-conf example code.

## How to use this demo with your own contracts
Copy the finished `FairRaffle.sol` into an IDE like [Remix](remix.ethereum.org). You could also start from the unfinished `VRFv2Consumer.sol` and build your own Raffle.

Visit [vrf.chain.link](https://vrf.chain.link) and create and fund a subscription on Fuji. Remember your subscription ID.

Replace `376` with your subscription ID in the solidity contract.

Deploy your contract to the Fuji Testnet using Remix, and then copy the contract address.

Allow your contract access to your subscription by creating a consumer with your contract address.

Launch the Angular Blockchain Operator app with `ng serve` or `yarn start`, then paste in your ABI from Remix into the ABI Manager, and paste the contract address of your new ABI on the home page.

When you click `connect`, you'll be able to interact with your smart contract based on the ABI of the contract you built.