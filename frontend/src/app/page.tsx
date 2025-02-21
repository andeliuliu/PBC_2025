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

export default function Page() {
  const { address } = useAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Bags");
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const getSelectedProducts = () => {
    return products.filter(product => selectedItems.includes(product.id));
  };

  const toggleItemSelection = (productId: number) => {
    setSelectedItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F2EDE9]">
      {/* Header */}
      <header className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col items-center">
            <Image src="/logo.png" alt="Orchid" width={40} height={40} />
            <h1 className="mt-2 text-xl font-serif">Orchid</h1>
          </div>
          <WalletWrapper
            className="min-w-[120px] bg-[#A04545] text-white rounded-lg"
            text="Connect"
          />
        </div>

        {/* Search Bar */}
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

        {/* Categories */}
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
      </header>

      {/* Product Grid */}
      <main className="grid grid-cols-2 gap-4 p-4 mb-16">
        {products.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-lg overflow-hidden shadow-sm relative ${
              selectedItems.includes(product.id) ? 'ring-2 ring-[#A04545]' : ''
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
              <p className="text-sm text-gray-600">{product.seller}</p>
              <p className="font-semibold">${product.price}</p>
            </div>
          </div>
        ))}
      </main>

      {/* Cart Popup */}
      {selectedItems.length > 0 && (
        <>
          <div className="fixed bottom-20 left-4 right-4 mb-2">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {getSelectedProducts().map((product) => (
                <div key={product.id} className="relative flex-shrink-0 w-[60px] h-[60px]">
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
            <button
              className="w-full bg-[#A04545] text-white py-4 rounded-lg font-medium text-lg mt-2"
              onClick={() => console.log('Purchase clicked')}
            >
              Purchase ({selectedItems.length} items)
            </button>
          </div>
        </>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 p-4 bg-[#F2EDE9]">
        <div className="max-w-md mx-auto">
          <div className="flex justify-around items-center p-4">
            <button
              className={`flex flex-col items-center relative ${currentPage === "home" ? "text-[#A04545]" : "text-gray-500"}`}
              onClick={() => setCurrentPage("home")}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
           
              {currentPage === "home" && (
                <div className="absolute -bottom-2 w-full h-0.5 bg-[#A04545] rounded-full" />
              )}
            </button>
            <button
              className={`flex flex-col items-center relative ${currentPage === "ranking" ? "text-[#A04545]" : "text-gray-500"}`}
              onClick={() => setCurrentPage("ranking")}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
          
              {currentPage === "ranking" && (
                <div className="absolute -bottom-2 w-full h-0.5 bg-[#A04545] rounded-full" />
              )}
            </button>
            <button
              className={`flex flex-col items-center relative ${currentPage === "profile" ? "text-[#A04545]" : "text-gray-500"}`}
              onClick={() => setCurrentPage("profile")}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>

              {currentPage === "profile" && (
                <div className="absolute -bottom-2 w-full h-0.5 bg-[#A04545] rounded-full" />
              )}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
