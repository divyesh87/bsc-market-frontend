pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract NFTMarketplace {
    struct Listing {
        uint256 listingId;
        uint256 tokenId;
        uint256 price;
        address seller;
        address tokenContract;
        bool isActive;
    }

    uint256 public listingIdCounter;

    mapping(uint256 => Listing) public listings;

    event TokenListed(uint256 listingId, uint256 tokenId, uint256 price, address seller, address tokenContract);
    event TokenSold(uint256 listingId, uint256 tokenId, uint256 price, address seller, address buyer, address tokenContract);

    // List a token for sale
    function listToken(address tokenContractAddress, uint256 tokenId, uint256 price) public {
    require(IERC721(tokenContractAddress).ownerOf(tokenId) == msg.sender, "Sender is not the owner of the token");
    require(price > 0, "Price must be greater than zero");

    require(IERC721(tokenContractAddress).getApproved(tokenId) == address(this), "Marketplace is not approved to transfer the token");

    for (uint i = 0; i < listingIdCounter; i++) {
        Listing memory listing = listings[i];
        if (listing.tokenContract == tokenContractAddress && listing.tokenId == tokenId && listing.isActive) {
            revert("Token is already listed for sale");
        }
    }

    uint256 listingId = listingIdCounter;
    Listing memory newListing = Listing(listingId, tokenId, price, msg.sender, tokenContractAddress, true);
    listings[listingId] = newListing;

    emit TokenListed(listingId, tokenId, price, msg.sender, tokenContractAddress);

    listingIdCounter++;
}


    function buyToken(uint256 listingId) public payable {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Token is not listed for sale");
        require(msg.value == listing.price, "Incorrect payment amount");

        uint256 tokenId = listing.tokenId;
        address seller = listing.seller;
        address buyer = msg.sender;
        uint256 salePrice = listing.price;
        address tokenContractAddress = listing.tokenContract;

        IERC721(tokenContractAddress).safeTransferFrom(seller, buyer, tokenId);

        (bool success, ) = seller.call{value: salePrice}("");
        require(success, "Transfer to seller failed");

        listings[listingId].isActive = false;

        emit TokenSold(listingId, tokenId, salePrice, seller, buyer, tokenContractAddress);
    }}