pragma solidity ^0.8.0;

contract AdrastiaRevertingOracle {
    function consultPrice(address token, uint256 maxAge) external view returns (uint112 price){
        revert();
    }
}
