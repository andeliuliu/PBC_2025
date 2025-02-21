"use client";

import Image from "next/image";
import { ChevronLeft, Crown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getBrandLeaderboard, LeaderboardEntry } from "src/utils/nftUtils";

const BRANDS = [
  { name: "Nicole.liu", display: "Nicole Liu" },
  { name: "Olivia.Rodrigo", display: "Olivia Rodrigo" },
  { name: "Taylor.Swift", display: "Taylor Swift" },
  { name: "Madison.Beer", display: "Madison Beer" },
];

export default function Leaderboard() {
  const [currentBrandIndex, setCurrentBrandIndex] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const currentBrand = BRANDS[currentBrandIndex];

  const nextBrand = () => {
    setCurrentBrandIndex((prev) => (prev + 1) % BRANDS.length);
  };

  const prevBrand = () => {
    setCurrentBrandIndex((prev) => (prev - 1 + BRANDS.length) % BRANDS.length);
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      const data = await getBrandLeaderboard(currentBrand.name);
      setLeaderboard(data);
      setLoading(false);
    };

    fetchLeaderboard();
  }, [currentBrand.name]);

  const topUsers = leaderboard.slice(0, 3).map((entry, index) => ({
    rank: index + 1,
    name: entry.name,
    nfts: entry.nftCount,
    image: entry.image,
    walletAddress: entry.walletAddress,
  }));

  const otherUsers = leaderboard.slice(3).map((entry, index) => ({
    rank: index + 4,
    name: entry.name,
    nfts: entry.nftCount,
    image: entry.image,
    walletAddress: entry.walletAddress,
  }));

  return (
    <div className="min-h-screen bg-[#F2EDE9] pb-20">
      <div className="relative pt-6 px-4">
        <Link href="/" className="absolute left-4 top-1/2 -translate-y-1/2">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-center text-2xl font-serif">
          Leaderboard
          <div className="flex items-center justify-center gap-4 mt-2">
            <button onClick={prevBrand}>
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-xl">{currentBrand.display}</span>
            <button onClick={nextBrand}>
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A04545]"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-center items-end gap-4 mt-8">
            {/* Second Place */}
            {topUsers[1] && (
              <div className="text-center mb-4">
                <div className="relative">
                  <a 
                    href={`https://testnets.opensea.io/${topUsers[1].walletAddress}?chain=base_sepolia`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    <Image
                      src={topUsers[1].image}
                      alt={topUsers[1].name}
                      width={120}
                      height={120}
                      className="rounded-full border-4 border-[#A04545] hover:opacity-80 transition-opacity"
                    />
                  </a>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#A04545] text-white rounded-full w-8 h-8 flex items-center justify-center">
                    2
                  </div>
                </div>
                <p className="mt-4 font-medium">{topUsers[1].name}</p>
                <p className="text-sm text-gray-600">{topUsers[1].nfts} NFTs</p>
              </div>
            )}

            {/* First Place */}
            {topUsers[0] && (
              <div className="text-center">
                <Crown className="h-8 w-8 text-[#A04545] mx-auto mb-2" />
                <div className="relative">
                  <a 
                    href={`https://testnets.opensea.io/${topUsers[0].walletAddress}?chain=base_sepolia`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    <Image
                      src={topUsers[0].image}
                      alt={topUsers[0].name}
                      width={120}
                      height={120}
                      className="rounded-full border-4 border-[#A04545] hover:opacity-80 transition-opacity"
                    />
                  </a>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#A04545] text-white rounded-full w-8 h-8 flex items-center justify-center">
                    1
                  </div>
                </div>
                <p className="mt-4 font-medium">{topUsers[0].name}</p>
                <p className="text-sm text-gray-600">{topUsers[0].nfts} NFTs</p>
              </div>
            )}

            {/* Third Place */}
            {topUsers[2] && (
              <div className="text-center mb-8">
                <div className="relative">
                  <a 
                    href={`https://testnets.opensea.io/${topUsers[2].walletAddress}?chain=base_sepolia`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer"
                  >
                    <Image
                      src={topUsers[2].image}
                      alt={topUsers[2].name}
                      width={120}
                      height={120}
                      className="rounded-full border-4 border-[#A04545] hover:opacity-80 transition-opacity"
                    />
                  </a>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#A04545] text-white rounded-full w-8 h-8 flex items-center justify-center">
                    3
                  </div>
                </div>
                <p className="mt-4 font-medium">{topUsers[2].name}</p>
                <p className="text-sm text-gray-600">{topUsers[2].nfts} NFTs</p>
              </div>
            )}
          </div>

          {/* Other Rankings */}
          <div className="mt-8 px-4">
            {otherUsers.map((user) => (
              <div
                key={user.rank}
                className="flex items-center gap-4 bg-white rounded-lg p-4 mb-4"
              >
                <div className="w-8 text-center font-medium text-gray-600">
                  {user.rank}
                </div>
                <a 
                  href={`https://testnets.opensea.io/${user.walletAddress}?chain=base_sepolia`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer"
                >
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full hover:opacity-80 transition-opacity"
                  />
                </a>
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.nfts} NFTs</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
