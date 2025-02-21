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
] as const;
