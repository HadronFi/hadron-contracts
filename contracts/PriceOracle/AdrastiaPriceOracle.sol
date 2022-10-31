pragma solidity ^0.6.0;

import "./PriceOracle.sol";
import "../CErc20.sol";


/**
 * @title IOracle
 * @notice An interface that defines a price and liquidity oracle.
 */
interface IOracle {
    /**
     * @notice Gets the price of a token in terms of the quote token along with the liquidity levels of the token and
     *  quote token in the underlying pool, reverting if the quotation is older than the maximum allowable age.
     * @dev Using maxAge of 0 can be gas costly and the returned data is easier to manipulate.
     * @param token The token to get the price of.
     * @param maxAge The maximum age of the quotation, in seconds. If 0, the function gets the instant rates as of the
     *   latest block, straight from the source.
     * @return price The quote token denominated price for a whole token.
     * @return tokenLiquidity The amount of the token that is liquid in the underlying pool, in wei.
     * @return quoteTokenLiquidity The amount of the quote token that is liquid in the underlying pool, in wei.
     */
    function consult(address token, uint256 maxAge)
        public
        view
        virtual
        returns (
            uint112 price,
            uint112 tokenLiquidity,
            uint112 quoteTokenLiquidity
        );
}


contract AdrastiaPriceOracle is PriceOracle {
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

    function getPrice(address token) public view returns (uint256){
        uint112 price;
        // Gets the price of `token` with the requirement that the price is 2 hours old or less
        try oracle.consultPrice(token, 2 hours) returns (uint112 adrastiaPrice) {
            price = adrastiaPrice;
        } catch Error(string memory) {
            // High-level error - maybe the price is older than 2 hours... use fallback oracle
            emit ExpiredPrice(underlyingAsset, address(oracle));
            price = backupPrices[underlyingAsset];
        } catch (bytes memory) {
            // Low-level error... use fallback oracle
            price = backupPrices[underlyingAsset];
        }
        require(price != 0, "MISSING_PRICE");
        emit Price(price);
        // We have our price, now let's use it
        return uint256(price);
    }

    function getUnderlyingPrice(CToken cToken) public view returns (uint256) {
        address underlyingAsset = address(CErc20(address(cToken)).underlying());
        uint112 price;
        // Gets the price of `token` with the requirement that the price is 2 hours old or less
        try oracle.consultPrice(underlyingAsset, 2 hours) returns (uint112 adrastiaPrice) {
            price = adrastiaPrice;
        } catch Error(string memory) {
            // High-level error - maybe the price is older than 2 hours... use fallback oracle
            emit ExpiredPrice(underlyingAsset, address(oracle));
            price = backupPrices[underlyingAsset];
        } catch (bytes memory) {
            // Low-level error... use fallback oracle
            price = backupPrices[underlyingAsset];
        }

        require(price != 0, "MISSING_PRICE");
        // We have our price, now let's use it
        return uint256(price);
    }

    function setUnderlyingPrice(CToken cToken, uint256 underlyingPriceMantissa) public {
        address asset = address(CErc20(address(cToken)).underlying());
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
