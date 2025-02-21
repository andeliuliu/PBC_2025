export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const mintContractAddress = "0xd685877182e0e77096ed9064a1a221359e2ffb01"; // Replace with your deployed address
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
] as const;
