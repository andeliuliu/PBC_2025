"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
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
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { getBrandDiscounts } from "src/utils/discountUtils";

interface Product {
  id: number;
  image: string;
  seller: string;
  price: number;
}

interface DiscountedProduct extends Product {
  discountedPrice?: number;
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

// Create a public client
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

// Function to read topNft
const getTopNftId = async () => {
  try {
    // First verify the contract exists
    const code = await publicClient.getBytecode({
      address: mintContractAddress,
    });

    if (!code) {
      console.error("Contract not found at address:", mintContractAddress);
      return null;
    }

    const topNftId = await publicClient.readContract({
      address: mintContractAddress,
      abi: mintABI,
      functionName: "topNft",
    });

    console.log("Latest minted NFT ID:", topNftId);
    return topNftId;
  } catch (error) {
    console.error("Error reading topNft:", error);
    // Log more details about the contract
    console.log("Contract address:", mintContractAddress);
    console.log("Network:", baseSepolia.id);
    return null;
  }
};

console.log(getTopNftId());
export default function Home() {
  const { address } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Bags");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [lastMintedTokenId, setLastMintedTokenId] = useState<string | null>(
    null
  );
  const [brandDiscounts, setBrandDiscounts] = useState<Map<string, number>>(
    new Map()
  );

  useEffect(() => {
    async function fetchDiscounts() {
      if (address) {
        const discounts = await getBrandDiscounts(address);
        setBrandDiscounts(discounts);
      }
    }
    fetchDiscounts();
  }, [address]);

  const getDiscountedPrice = (product: Product) => {
    const brandName = product.seller.replace("@", "");
    const discountMultiplier = brandDiscounts.get(brandName) || 0;
    if (discountMultiplier > 0) {
      // 20% off for each NFT owned, up to 60% max
      const discountPercent = Math.min(discountMultiplier * 20, 60);
      const discountedPrice = product.price * (1 - discountPercent / 100);
      return {
        ...product,
        discountedPrice: Number(discountedPrice.toFixed(2)),
      };
    }
    return product;
  };

  const getSelectedProducts = () => {
    return products
      .filter((product) => selectedItems.includes(product.id))
      .map(getDiscountedPrice);
  };

  const toggleItemSelection = (productId: number) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handlePurchase = () => {
    if (!address) {
      return (
        <button
          disabled
          className="w-full bg-gray-400 text-white py-4 rounded-lg font-medium text-lg mt-2 cursor-not-allowed"
        >
          Connect Wallet to Purchase
        </button>
      );
    }

    // Get the first selected product's seller name
    const selectedProduct = getSelectedProducts()[0];
    const brandName = selectedProduct
      ? selectedProduct.seller.replace("@", "")
      : "Unknown Seller";

    const contracts = [
      {
        address: mintContractAddress,
        abi: mintABI,
        functionName: "mintNFT",
        args: [
          address,
          "ipfs://QmYourIPFSHash",
          brandName, // Use the seller's name as the brand name
          "20PERCENTOFF",
        ],
      },
    ] as unknown as ContractFunctionParameters[];

    return (
      <div className="flex flex-col gap-2">
        <Transaction
          contracts={contracts}
          chainId={BASE_SEPOLIA_CHAIN_ID}
          onSuccess={async () => {
            const topNftId = await getTopNftId();
            setLastMintedTokenId(topNftId?.toString());
          }}
          onError={(error) => {
            console.error("Error minting NFT:", error);
          }}
        >
          <TransactionButton className="w-full bg-[#A04545] text-white py-4 rounded-lg font-medium text-lg">
            Purchase ({selectedItems.length} items)
          </TransactionButton>
        </Transaction>

        {lastMintedTokenId && (
          <a
            href={`https://testnets.opensea.io/assets/base_sepolia/${mintContractAddress}/${lastMintedTokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-[#A04545] hover:text-[#8A3A3A] underline"
          >
            View on OpenSea
          </a>
        )}
      </div>
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
              {(() => {
                const discounted = getDiscountedPrice(product);
                return discounted.discountedPrice ? (
                  <div>
                    <p className="text-sm line-through text-gray-400">
                      ${product.price}
                    </p>
                    <p className="font-semibold text-[#A04545]">
                      ${discounted.discountedPrice}
                    </p>
                  </div>
                ) : (
                  <p className="font-semibold">${product.price}</p>
                );
              })()}
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
          </div>
        </div>
      )}
    </div>
  );
}
