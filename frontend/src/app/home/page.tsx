"use client";

import Image from "next/image";
import { useState } from "react";
import WalletWrapper from "src/components/WalletWrapper";
import { useAccount } from "wagmi";
import {
  Transaction,
  TransactionButton,
} from "@coinbase/onchainkit/transaction";
import {
  BASE_SEPOLIA_CHAIN_ID,
  mintABI,
  mintContractAddress,
} from "src/constants";
import type { ContractFunctionParameters } from "viem";

interface Product {
  id: number;
  image: string;
  seller: string;
  price: number;
}

const products: Product[] = [
  {
    id: 1,
    image: "/1.png",
    seller: "@Nicole.liu",
    price: 80,
  },
  {
    id: 2,
    image: "/2.png",
    seller: "@Olivia.Rodrigo",
    price: 230,
  },
  {
    id: 3,
    image: "/3.png",
    seller: "@Taylor.Swift",
    price: 3400,
  },
  {
    id: 4,
    image: "/4.png",
    seller: "@Madison.Beer",
    price: 200,
  },
];

export default function Home() {
  const { address } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Bags");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [lastMintedTokenId, setLastMintedTokenId] = useState<string | null>(
    null
  );

  const getSelectedProducts = () => {
    return products.filter((product) => selectedItems.includes(product.id));
  };

  const toggleItemSelection = (productId: number) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handlePurchase = () => {
    if (!address) return null;

    const contracts = [
      {
        address: mintContractAddress,
        abi: mintABI,
        functionName: "mintNFT",
        args: [
          address,
          "ipfs://QmYourIPFSHash", // Replace with your NFT metadata URI
          "Orchid Marketplace",
          "20PERCENTOFF",
        ],
      },
    ] as unknown as ContractFunctionParameters[];

    return (
      <Transaction
        contracts={contracts}
        chainId={BASE_SEPOLIA_CHAIN_ID}
        onSuccess={(response) => {
          console.log("NFT minted successfully!", response);
          const txHash = response.transactionHash;
          const openseaLink = `https://testnets.opensea.io/assets/base-sepolia/${mintContractAddress}/${txHash}`;
          console.log("View on OpenSea:", openseaLink);
          setLastMintedTokenId(txHash);
        }}
        onError={(error) => {
          console.error("Error minting NFT:", error);
        }}
      >
        <TransactionButton className="w-full bg-[#A04545] text-white py-4 rounded-lg font-medium text-lg mt-2">
          Purchase ({selectedItems.length} items)
        </TransactionButton>
      </Transaction>
    );
  };

  return (
    <div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search for designer, item, color, etc."
          className="w-full p-2 pl-10 rounded-lg bg-white border-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <svg
          className="absolute left-3 top-3 w-4 h-4 text-gray-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="flex gap-6 mt-4 overflow-x-auto">
        {["Bags", "Shoes", "Tops", "Bottoms", "Jewlery", "Sunglasses"].map(
          (category) => (
            <button
              key={category}
              className={`whitespace-nowrap pb-2 ${
                selectedCategory === category
                  ? "border-b-2 border-[#A04545] text-[#A04545]"
                  : "text-gray-600"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          )
        )}
      </div>

      <main className="grid grid-cols-2 gap-4 p-4 mb-16">
        {products.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-lg overflow-hidden shadow-sm relative ${
              selectedItems.includes(product.id) ? "ring-2 ring-[#A04545]" : ""
            }`}
            onClick={() => toggleItemSelection(product.id)}
          >
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={`Product by ${product.seller}`}
                fill
                className="object-cover"
              />
              {selectedItems.includes(product.id) && (
                <div className="absolute top-2 left-2 z-10 bg-[#A04545] rounded-full p-1">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="text-sm text-gray-600 font-serif">
                {product.seller}
              </p>
              <p className="font-semibold">${product.price}</p>
            </div>
          </div>
        ))}
      </main>

      {selectedItems.length > 0 && (
        <div className="absolute bottom-20 left-0 right-0 px-4 mb-2">
          <div className="bg-[#F2EDE9]/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {getSelectedProducts().map((product) => (
                <div
                  key={product.id}
                  className="relative flex-shrink-0 w-[60px] h-[60px]"
                >
                  <Image
                    src={product.image}
                    alt={`Selected ${product.seller}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItemSelection(product.id);
                    }}
                    className="absolute -top-1 -right-1 bg-[#A04545] rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            {handlePurchase()}
            {lastMintedTokenId && (
              <div className="mt-2 text-sm text-center">
                <a
                  href={`https://testnets.opensea.io/assets/base-sepolia/${mintContractAddress}/${lastMintedTokenId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A04545] underline"
                >
                  View your NFT on OpenSea
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
