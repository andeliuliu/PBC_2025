"use client";

import Image from "next/image";
import { ChevronLeft, Crown, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { mintABI, mintContractAddress } from "src/constants";

// Create public client
const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

// Available brands
const BRANDS = ["Nicole.liu", "Olivia.Rodrigo", "Taylor.Swift", "Madison.Beer"];

interface LeaderboardEntry {
  address: string;
  nftCount: number;
  name: string;
  image: string;
}

export default function Leaderboard() {
  const [selectedBrand, setSelectedBrand] = useState(BRANDS[0]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const fetchLeaderboardData = async () => {
    try {
      // Get topNft to know the range
      const topNftId = await publicClient.readContract({
        address: mintContractAddress,
        abi: mintABI,
        functionName: "topNft",
      });

      // Fetch all NFTs
      const nftData = await publicClient.readContract({
        address: mintContractAddress,
        abi: mintABI,
        functionName: "getAllNFTDetails",
        args: [1n, topNftId],
      });

      // Create ownership tally for selected brand
      const tally = new Map<string, number>();

      for (let i = 0; i < nftData[0].length; i++) {
        if (nftData[1][i] === selectedBrand) {
          const owner = nftData[3][i];
          tally.set(owner, (tally.get(owner) || 0) + 1);
        }
      }

      // Convert to array and sort
      const sortedLeaderboard = Array.from(tally.entries())
        .map(([address, count]) => ({
          address,
          nftCount: count,
          name: `${address.slice(0, 6)}...${address.slice(-4)}`,
          image: "/placeholder.svg",
        }))
        .sort((a, b) => b.nftCount - a.nftCount)
        .slice(0, 10);

      setLeaderboardData(sortedLeaderboard);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, [selectedBrand]);

  const switchBrand = (direction: "next" | "prev") => {
    const currentIndex = BRANDS.indexOf(selectedBrand);
    if (direction === "next") {
      setSelectedBrand(BRANDS[(currentIndex + 1) % BRANDS.length]);
    } else {
      setSelectedBrand(
        BRANDS[(currentIndex - 1 + BRANDS.length) % BRANDS.length]
      );
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F2EDE9] pb-20">
      <div className="relative pt-6 px-4">
        <Link href="/" className="absolute left-4 top-1/2 -translate-y-1/2">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-center text-2xl font-serif">
          Leaderboard
          <div className="flex items-center justify-center gap-4 mt-2">
            <button onClick={() => switchBrand("prev")}>
              <ArrowLeft className="h-5 w-5" />
            </button>
            <span className="text-xl">@{selectedBrand}</span>
            <button onClick={() => switchBrand("next")}>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </h1>
      </div>

      <div className="px-4 mt-8">
        {/* Top 3 Users */}
        <div className="flex justify-center items-end gap-4 mb-12">
          {leaderboardData.slice(0, 3).map((user, index) => (
            <div
              key={user.address}
              className={`flex flex-col items-center ${index === 0 ? "mt-[-20px]" : ""}`}
            >
              <div className="relative mt-6">
                {index === 0 && (
                  <Crown className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-[#A04545] h-8 w-8" />
                )}
                <div className="relative">
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={index === 0 ? 100 : 80}
                    height={index === 0 ? 100 : 80}
                    className="rounded-full border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-3 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white bg-[#A04545]">
                    {index + 1}
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.nftCount} NFTs</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Other Users */}
        <div className="space-y-2">
          {leaderboardData.slice(3).map((user, index) => (
            <div
              key={user.address}
              className="flex items-center p-4 rounded-lg bg-[#A04545]"
            >
              <span className="w-6 text-white">{index + 4}</span>
              <div className="relative w-10 h-10 mx-3">
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <span className="flex-grow text-white">{user.name}</span>
              <span className="text-white">{user.nftCount} NFTs</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
