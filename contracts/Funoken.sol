// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Funoken is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    struct TokenBid{
        bool forSale;
        uint256 highestBid;
        address highestBidder;
        uint256 auctionStart;
        uint8 bidsPlaced;
        uint8 activeTime;
    }
    
    mapping (uint256 => TokenBid) public idToBid;
    event Bid(address bidder, uint256 tokenId, uint256 amount);
    event Auction(uint256 tokenId, address currentOwner);
    event Transaction(uint256 tokenId, address from, address to, uint256 amount);

    modifier upForSale (uint256 _itemId) {
        require(idToBid[_itemId].forSale);
        _;
    }
    modifier onlyOwner (uint256 _itemId){
        require(msg.sender == ownerOf(_itemId));
        _;
    }
    
    constructor() ERC721("Funoken", "FTK") {}
    
    function mintToken(string memory tokenURI) external returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        idToBid[newItemId] = TokenBid(false, 0, address(0), 0, 0, 0);
        return newItemId;
    }
    
    function auction(uint256 itemId, uint256 amount, uint8 active) external onlyOwner(itemId) {
        require(idToBid[itemId].forSale == false);
        idToBid[itemId].forSale = true;
        idToBid[itemId].highestBid = amount;
        idToBid[itemId].auctionStart = block.timestamp;
        idToBid[itemId].activeTime = active;
        emit Auction(itemId, ownerOf(itemId));
    }
    
    function bid(uint256 itemId) external payable upForSale(itemId){
        require(block.timestamp<(idToBid[itemId].auctionStart + idToBid[itemId].activeTime*3600));
        require(msg.value> idToBid[itemId].highestBid + 0.001 ether, "Bid must be higher"); 
        require(msg.sender != ownerOf(itemId));
        
        if(idToBid[itemId].bidsPlaced>0){
            payable(idToBid[itemId].highestBidder).transfer(idToBid[itemId].highestBid);
        }
        idToBid[itemId].highestBid = msg.value;
        idToBid[itemId].highestBidder = msg.sender;
        idToBid[itemId].bidsPlaced++;
        emit Bid(msg.sender, itemId, msg.value);
    }
    
    function endAuction(uint256 itemId) external upForSale(itemId) onlyOwner(itemId) {
        require(block.timestamp > idToBid[itemId].auctionStart + idToBid[itemId].activeTime*3600, "Auction time has not ended yet");
        if (idToBid[itemId].bidsPlaced>0){
            payable(ownerOf(itemId)).transfer(idToBid[itemId].highestBid);
            emit Transaction(itemId, ownerOf(itemId), idToBid[itemId].highestBidder, idToBid[itemId].highestBid);
            transferFrom(ownerOf(itemId), idToBid[itemId].highestBidder, itemId); 
        }
        idToBid[itemId].forSale = false;
        idToBid[itemId].bidsPlaced = 0;
        idToBid[itemId].highestBid = 0;
        idToBid[itemId].highestBidder = address(0);    
        idToBid[itemId].auctionStart = 0;
        idToBid[itemId].activeTime = 0;
    }
}