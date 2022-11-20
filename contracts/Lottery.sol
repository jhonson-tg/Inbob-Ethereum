// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    function random() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(block.difficulty, block.timestamp, players)
                )
            );
    }

    function pickWinner() public restricted {
        uint256 index = random() % players.length;
        payable(players[index]).transfer(address(this).balance);
        // Create array with initial size of '0'
        players = new address[](0);
    }

    // function modifier: used to place some common codes in one place and utilize it other functions where needed.
    modifier restricted() {
        require(msg.sender == manager);
        // This indicates as placeholder for function code where this modifier is called.
        _;
    }

    function getPlayers() public view returns (address[] memory) {
        return players;
    }
}
