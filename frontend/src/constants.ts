export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const mintContractAddress = "0x40fc9203ed0152b23b4a3bcd386c450400113cdf"; // Replace with your deployed address
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
] as const;
