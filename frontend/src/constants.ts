export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const mintContractAddress = "0xdc59b56a634cde9d56a418a29d70ea257886937b"; // Replace with your deployed address
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
    inputs: [
      {
        internalType: "uint256",
        name: "startId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endId",
        type: "uint256",
      },
    ],
    name: "getAllNFTDetails",
    outputs: [
      {
        internalType: "address[]",
        name: "creators",
        type: "address[]",
      },
      {
        internalType: "string[]",
        name: "brands",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "discounts",
        type: "string[]",
      },
      {
        internalType: "address[]",
        name: "owners",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
