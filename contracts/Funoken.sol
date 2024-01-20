// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Funoken is ERC721URIStorage {
    // Errors
    error NotForSale();
    error NotOwner();
    error AuctionActive();
    error AuctionTimeExpired();
    error OwnerNotAllowed();
    error ContractNotAllowed();
    error BidTooLow();

    struct TokenBid{
        uint256 highestBid;
        uint256 auctionStart;
        uint256 bidsPlaced;
        uint256 activeTime;
        address highestBidder;
        bool forSale;
    }

    uint256 private _tokenId;
    
    mapping (uint256 => TokenBid) public idToBid;

    event Bid(address bidder, uint256 tokenId, uint256 amount);
    event Auction(uint256 tokenId, address currentOwner);
    event Transaction(uint256 tokenId, address from, address to, uint256 amount);

    modifier upForSale (uint256 _itemId) {
        if(!idToBid[_itemId].forSale) revert NotForSale();
        _;
    }

    modifier onlyOwner (uint256 _itemId){
        if(msg.sender != ownerOf(_itemId)) revert NotOwner();
        _;
    }
    
    constructor() ERC721("Funoken", "FTK") {}
    
    function mintToken(string memory tokenURI) external returns (uint256) {
        unchecked {
            ++_tokenId;
        }
        uint256 currentTokenId = _tokenId;

        _mint(msg.sender, currentTokenId);
        _setTokenURI(currentTokenId, tokenURI);

        return currentTokenId;
    }
    
    function auction(uint256 itemId, uint256 amount, uint256 activeTime) external onlyOwner(itemId) {
        if(idToBid[itemId].forSale) revert AuctionActive();

        idToBid[itemId] = TokenBid({
            highestBid: amount,
            auctionStart: block.timestamp,
            bidsPlaced: 0,
            activeTime: activeTime,
            highestBidder: address(0),
            forSale: true
        });

        emit Auction(itemId, msg.sender);
    }
    
    function bid(uint256 itemId) external payable upForSale(itemId){
        if(msg.sender == ownerOf(itemId)) revert OwnerNotAllowed();
        if(tx.origin != msg.sender) revert ContractNotAllowed();
    
        TokenBid storage bid = idToBid[itemId];
        if(block.timestamp > bid.auctionStart + bid.activeTime * 3600) revert AuctionTimeExpired();

        if(msg.value <= bid.highestBid + 0.001 ether) revert BidTooLow();
        
        if(bid.bidsPlaced > 0)
            bid.highestBidder.call{value: bid.highestBid}("");
        

        bid.highestBid = msg.value;
        bid.highestBidder = msg.sender;
        unchecked {
            bid.bidsPlaced++;
        }

        emit Bid(msg.sender, itemId, msg.value);
    }
    
    function endAuction(uint256 itemId) external upForSale(itemId) onlyOwner(itemId) {
        TokenBid memory bid = idToBid[itemId];
        if(block.timestamp < bid.auctionStart + bid.activeTime * 3600) revert AuctionActive();

        delete idToBid[itemId];

        if (bid.bidsPlaced > 0){
            address _owner = ownerOf(itemId);

            _owner.call{value: bid.highestBid}("");
            transferFrom(_owner, bid.highestBidder, itemId); 

            emit Transaction(itemId, _owner, bid.highestBidder, bid.highestBid);
        }
    }
}
