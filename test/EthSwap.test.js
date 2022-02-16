const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");
require("chai").use(require("chai-as-promised")).should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("Deploy", ([deployer, investor]) => {
  let token, ethSwap;
  before(async () => {
    token = await Token.new();
    ethSwap = await EthSwap.new(token.address);

    await token.transfer(ethSwap.address, tokens("1000000"));
  });
  describe("Deploy EthSwap", async () => {
    it("contract has a name", async () => {
      const name = await ethSwap.name();
      assert.equal(name, "EthSwap Instant Exchange");
    });
    it("token has a name", async () => {
      const name = await token.name();
      assert.equal(name, "DApp Token");
    });
    it("token contract has token", async () => {
      const totalSupply = await token.balanceOf(ethSwap.address);
      assert.equal(totalSupply.toString(), tokens("1000000"));
    });
  });

  describe("buyTokens()", async () => {
    let result;
    before(async () => {
      // user buy token
      result = await ethSwap.buyTokens({
        from: investor,
        value: tokens("1"),
      });
    });
    it("allow user to instantly buy tokens for fixed ether", async () => {
      // check investor token balance
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens("100"));

      // check ethSwap token & ether balance
      let ethSwapBalance;
      //check token balance
      ethSwapBalance = await token.balanceOf(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens("999900"));
      // check ether balance
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens("1"));
      // check event
      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens("100"));
      assert.equal(event.rate.toString(), "100");
    });
  });

  describe("sellToken()", async () => {
    let result;
    before(async () => {
      // user sell token
      await token.approve(ethSwap.address, tokens("100"), { from: investor });
      result = await ethSwap.sellTokens(tokens("100"), { from: investor });
    });
    it("allow user to instantly sell tokens for fixed ether", async () => {
      // check investor token balance
      let investorBalance = await token.balanceOf(investor);
      assert.equal(investorBalance.toString(), tokens("0"));
      // check ethSwap token & ether balance;
      let ethSwapBalance;
      // check ethSwap token balance
      ethSwapBalance = await token.balanceOf(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens("1000000"));
      // check ethSwap ether balance;
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
      assert.equal(ethSwapBalance.toString(), tokens("0"));
      // check event
      const event = result.logs[0].args;
      assert.equal(event.account, investor);
      assert.equal(event.token, token.address);
      assert.equal(event.amount.toString(), tokens("100"));
      assert.equal(event.rate.toString(), "100");

      // FAILURE: investor can't sell more tokens than they have
      await ethSwap.sellTokens(tokens("500"), { from: investor }).should.be
        .rejected;
    });
  });
});
