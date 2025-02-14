// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ScoreStorage {
    mapping(address => uint256) public scores;
    
    function storeScore(uint256 score) public {
        scores[msg.sender] = score;
    }
}