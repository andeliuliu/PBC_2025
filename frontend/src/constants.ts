export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const mintContractAddress = "0x3c2218Dc5F46A8A0d459989C160309A460Ce5208"; // Replace with your deployed address
export const mintABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "string",
        name: "tokenURI",
        type: "string",
      },
      {
        internalType: "string",
        name: "brandName",
        type: "string",
      },
      {
        internalType: "string",
        name: "discountCode",
        type: "string",
      },
    ],
    name: "mintNFT",
    outputs: [],
    stateMutability: "public",
    type: "function",
  },
  {
    inputs: [],
    name: "topNft",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "nftDetails",
    outputs: [
      { internalType: "address", name: "brandCreator", type: "address" },
      { internalType: "string", name: "brandName", type: "string" },
      { internalType: "string", name: "discountCode", type: "string" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
