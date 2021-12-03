const { assert } = require("console");

const Funoken = artifacts.require("Funoken");

contract("Funoken", () => {
    let accounts, instance;

    it("...should mint a new token and send to recipient", async () => {
        accounts = await web3.eth.getAccounts();
        instance = await Funoken.new();
        await instance.mintToken("", { from: accounts[1] });
        const tokenBalance = await instance.balanceOf(accounts[1]);
        assert(tokenBalance.toString() == "1");
    });
    const delay = (ms) => {
        const startPoint = new Date().getTime();
        while (new Date().getTime() - startPoint <= ms) {}
    };

    /*
    it("...should reset auction after alloted time if no bids are placed", async () => {
        await instance.auction("1", "1000", { from: accounts[1] });
        delay(10000);
        await instance.endAuction("1", { from: accounts[1] });
        const bid = await instance.idToBid(1);
        assert(bid.forSale == false);
        assert(bid.highestBid == 0);
    });
    */

    it("...should start an auction", async () => {
        await instance.auction("1", "1000", { from: accounts[1] });
        const bid = await instance.idToBid(1);
        assert(bid.forSale == true);
    });

    it("...should be able to place bid", async () => {
        await instance.bid("1", {
            from: accounts[2],
            value: web3.utils.toWei("1", "ether"),
        });
        const bid = await instance.idToBid(1);
        assert(bid.highestBidder == accounts[2]);
        assert(bid.beenBid == true);
        assert(bid.highestBid == web3.utils.toWei("1", "ether"));
    });

    it("...should refund previous highest bidder if he gets outbid and should update with new bidder info", async () => {
        const prevBid = await instance.idToBid(1);
        const prevBidder = prevBid.highestBidder;
        const prevBalance = await web3.eth.getBalance(prevBidder);

        await instance.bid("1", {
            from: accounts[3],
            value: web3.utils.toWei("2", "ether"),
        });
        const newBalance = await web3.eth.getBalance(prevBidder);
        assert(
            web3.utils.fromWei(newBalance).valueOf() -
                web3.utils.fromWei(prevBalance).valueOf() ==
                1
        );
        const newBid = await instance.idToBid(1);
        assert(newBid.highestBidder == accounts[3]);
        assert(newBid.highestBid == web3.utils.toWei("2", "ether"));
    });

    //Tested with the auction being active for 8 seconds
    it("...should transfer token to highestBidder and ether to previous owner on auction end", async () => {
        const initialOwnerBalance = await web3.eth.getBalance(accounts[1]);
        await instance.bid("1", {
            from: accounts[4],
            value: web3.utils.toWei("5", "ether"),
        });
        delay(10000);
        await instance.endAuction("1", { from: accounts[1] });
        const newOwner = await instance.ownerOf("1");
        assert(newOwner == accounts[4]);
        const updatedOwnerBalance = await web3.eth.getBalance(accounts[1]);
        assert(
            web3.utils.fromWei(updatedOwnerBalance).valueOf() -
                web3.utils.fromWei(initialOwnerBalance).valueOf() >
                4.8
        );
        const bid = await instance.idToBid(1);
        assert(bid.highestBid == 0);
        assert(bid.forSale == false);
    });
});
