"use client";

import Image from "next/image";
import { useState } from "react";
import WalletWrapper from "src/components/WalletWrapper";
import { useAccount } from "wagmi";

interface Product {
  id: number;
  image: string;
  seller: string;
  price: number;
  verified?: boolean;
}

const products: Product[] = [
  {
    id: 1,
    image: "/1.png",
    seller: "@Nicole.liu",
    price: 80,
    verified: true,
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

export default function Page() {
  const { address } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Bags");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col items-center">
            <Image src="/logo.png" alt="Orchid" width={40} height={40} />
            <h1 className="mt-2 text-xl font-serif">Orchid</h1>
          </div>
          <WalletWrapper className="min-w-[120px]" text="Connect" />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search for designer, item, color, etc."
            className="w-full p-2 pl-10 border rounded-lg"
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

        {/* Categories */}
        <div className="flex gap-6 mt-4 overflow-x-auto">
          {["Bags", "Shoes", "Tops", "Bottoms", "Jewlery", "Sunglasses"].map(
            (category) => (
              <button
                key={category}
                className={`whitespace-nowrap ${
                  selectedCategory === category ? "border-b-2 border-black" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            )
          )}
        </div>
      </header>

      {/* Product Grid */}
      <main className="grid grid-cols-2 gap-4 p-4">
        {products.map((product) => (
          <div key={product.id} className="rounded-lg overflow-hidden">
            <div className="relative aspect-square">
              <Image
                src={product.image}
                alt={`Product by ${product.seller}`}
                fill
                className="object-cover"
              />
              {product.verified && (
                <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="text-sm text-gray-600">{product.seller}</p>
              <p className="font-semibold">${product.price}</p>
            </div>
          </div>
        ))}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full border-t bg-white">
        <div className="flex justify-around p-4">
          <button>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>
          <button>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </button>
          <button>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
        </div>
      </nav>
    </div>
  );
}
