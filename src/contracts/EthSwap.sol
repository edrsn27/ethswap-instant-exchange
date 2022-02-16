pragma solidity ^0.5.0;
import "./Token.sol";

contract EthSwap {
    // declare contract name
    string public name = "EthSwap Instant Exchange";
    // declare rate
    uint256 public rate = 100;
    // declare token
    Token public token;

    event TokenPurchased(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    event TokenSold(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        // calculate the amount of token to purchased
        uint256 tokenAmount = rate * msg.value;
        // required that ethSwap has enough token
        require(token.balanceOf(address(this)) >= tokenAmount);
        // perform sell
        token.transfer(msg.sender, tokenAmount);
        // emit event TokenPurchased
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    function sellTokens(uint256 _amount) public {
        // calculate ether amount
        uint256 etherAmount = _amount / rate;
        // transfer token from sender to ethSwap
        token.transferFrom(msg.sender, address(this), _amount);
        // transfer ether from ethSwap to sender
        msg.sender.transfer(etherAmount);
         // emit event TokenSold
        emit TokenPurchased(msg.sender, address(token), _amount, rate);
    }
}
