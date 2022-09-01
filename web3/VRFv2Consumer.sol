// SPDX-License-Identifier: MIT
// An example of a consumer contract that relies on a subscription for funding.
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

// This example is derived from the VRF example on docs.chain.link
// It has been connected to a testnet and simplified for brevity

contract FairRaffle is VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface COORDINATOR;

    // FUJI Testnet Connection
    address vrfCoordinator = 0x2eD832Ba664535e5886b75D64C46EB9a228C2610;
    bytes32 keyHash =
        0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61;

    // Store the Request and Response
    uint256[] public s_randomWords;
    uint256 public s_requestId;
    address s_owner;

    constructor() VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        s_owner = msg.sender;
    }

    function requestRandomWords() external onlyOwner {
        s_requestId = COORDINATOR.requestRandomWords(
            keyHash,
            376,
            3,
            100000,
            1
        );
    }

    function fulfillRandomWords(
        uint256, /* requestId */
        uint256[] memory randomWords
    ) internal override {
        s_randomWords = randomWords;
    }

    modifier onlyOwner() {
        require(msg.sender == s_owner);
        _;
    }
}
