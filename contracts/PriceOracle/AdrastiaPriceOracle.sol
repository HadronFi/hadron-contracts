pragma solidity ^0.6.0;

/**
 * @title IOracle
 * @notice An interface that defines a price and liquidity oracle.
 */
interface IOracle {
    function consultPrice(address token, uint256 maxAge)
        external
        view
        returns (
            uint112 price,
            uint112 tokenLiquidity,
            uint112 quoteTokenLiquidity
        );
}

interface ICErc20{
    function underlying() external view returns (address);
}

contract AdrastiaPriceOracle {
    mapping(address => uint256) backupPrices;
    event PricePosted(
        address asset,
        uint256 previousPriceMantissa,
        uint256 requestedPriceMantissa,
        uint256 newPriceMantissa
    );
    event ExpiredPrice(address asset, address oracle);
    event Price(uint112 price);
    IOracle oracle = IOracle(0x51d3d22965Bb2CB2749f896B82756eBaD7812b6d);

    function setOracleAddress(address addr) public {
        oracle = IOracle(addr);
    }

    function getPrice(address token) public returns (uint256){
        (uint112 adrastiaPrice,uint112 tokenLiquidity, uint112 quoteTokenLiquidity) = oracle.consultPrice(token, 0);
        return uint256(adrastiaPrice);
    }

    function getUnderlyingPrice(address cToken) public view returns (uint256) {
        address underlyingAsset = ICErc20(address(cToken)).underlying();
        uint256 price;
        // Gets the price of `token` with the requirement that the price is 2 hours old or less
        try oracle.consultPrice(underlyingAsset, 2 hours) returns (uint112 adrastiaPrice, uint112 tokenLiquidity, uint112 quoteTokenLiquidity) {
            price = uint256(adrastiaPrice);
        } catch (bytes memory) {
            price = backupPrices[underlyingAsset];
        }

        require(price != 0, "MISSING_PRICE");
        return uint256(price);
    }

    function setUnderlyingPrice(address cToken, uint256 underlyingPriceMantissa) public {
        address asset = address(ICErc20(address(cToken)).underlying());
        emit PricePosted(asset, backupPrices[asset], underlyingPriceMantissa, underlyingPriceMantissa);
        backupPrices[asset] = underlyingPriceMantissa;
    }

    function setDirectPrice(address asset, uint256 price) public {
        emit PricePosted(asset, backupPrices[asset], price, price);
        backupPrices[asset] = price;
    }

    // v1 price oracle interface for use as backing of proxy
    function assetPrices(address asset) external view returns (uint256) {
        return backupPrices[asset];
    }

    function compareStrings(string memory a, string memory b) internal pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }
}