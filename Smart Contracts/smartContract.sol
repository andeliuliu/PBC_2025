// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title BrandMembership
 * @dev An ERC721 contract that allows any brand/designer/influencer to mint
 *      a membership NFT for their customers. Each NFT can include brand info,
 *      discount codes, and a metadata URI referencing the product image.
 *      The NFT is freely transferable, allowing holders to trade their perks.
 */

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @notice No "Ownable" inheritance is used here because
 *         we want ANY caller (brand, influencer) to mint,
 *         not just the contract deployer.
 */
contract BrandMembership is ERC721URIStorage {
    using Counters for Counters.Counter;

    /**
     * @dev _tokenIds is a counter for assigning unique token IDs automatically.
     */
    Counters.Counter private _tokenIds;

    /**
     * @dev Data structure to store brand-specific info for each NFT.
     *      - brandCreator: the address of the brand/influencer that minted the NFT
     *      - brandName:    the name or identifier of the brand
     *      - discountCode: any special perk or code associated with this NFT
     */
    struct NFTData {
        address brandCreator;
        string brandName;
        string discountCode;
    }

    /**
     * @dev Mapping from tokenId => NFTData to store brand details
     *      and membership perks for each NFT.
     */
    mapping(uint256 => NFTData) public nftDetails;

    /**
     * @dev Add the topNft variable
     */
    uint256 public topNft;

    /**
     * @notice Contract constructor
     * @dev Sets the name and symbol of the NFT collection.
     */
    constructor() ERC721("BrandMembership", "BRND") {
        // No owner restriction. Anyone can mint.
    }

    /**
     * @notice Mint a new NFT for a given recipient.
     * @param recipient   The wallet address that will receive the newly minted NFT.
     * @param tokenURI    The URI pointing to the metadata (image, product details, etc.).
     * @param brandName   A string identifying the brand (e.g. "Nike", "IndieDesignCo").
     * @param discountCode Any special discount, passcode, or perk string.
     *
     * Requirements:
     * - Anyone can call this function (i.e. any brand, designer, or influencer).
     * - The NFT is given to `recipient` without requiring payment in this contract.
     * - Gas fees can be subsidized externally (e.g., via a Paymaster) to make it free for the user.
     */
    function mintNFT(
        address recipient,
        string memory tokenURI,
        string memory brandName,
        string memory discountCode
    ) public {
        // Increment the token ID counter to get a new unique ID
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        // Update topNft with the latest minted NFT ID
        topNft = newItemId;

        // Store brand-specific data for this NFT
        nftDetails[newItemId] = NFTData({
            brandCreator: msg.sender,
            brandName: brandName,
            discountCode: discountCode
        });

        // Mint the NFT to the recipient
        _safeMint(recipient, newItemId);

        // Assign the metadata URI (which should point to an image + JSON)
        _setTokenURI(newItemId, tokenURI);
    }

    /**
     * @notice Get brand details associated with a specific NFT.
     * @param tokenId The ID of the NFT you want info about.
     * @return brandCreator  The address that minted this NFT (the brand).
     * @return brandName     The brand name or identifier stored in the NFT data.
     * @return discountCode  The discount code or perk associated with this NFT.
     *
     * @dev This is purely a convenience function for external apps or UIs.
     */
    function getBrandDetails(uint256 tokenId)
        external
        view
        returns (
            address brandCreator,
            string memory brandName,
            string memory discountCode
        )
    {
        NFTData memory data = nftDetails[tokenId];
        return (data.brandCreator, data.brandName, data.discountCode);
    }
}