import Image from "next/image";
import { ChevronLeft, Crown } from "lucide-react";
import Link from "next/link";

const topUsers = [
  {
    rank: 2,
    name: "Nicole Liu",
    nfts: 40,
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    rank: 1,
    name: "Bryan Wolf",
    nfts: 43,
    image: "/placeholder.svg?height=120&width=120",
  },
  {
    rank: 3,
    name: "Alex Turner",
    nfts: 38,
    image: "/placeholder.svg?height=120&width=120",
  },
];

const otherUsers = [
  {
    rank: 4,
    name: "Marsha Fisher",
    nfts: 36,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    rank: 5,
    name: "Juanita Cormier",
    nfts: 35,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    rank: 6,
    name: "You",
    nfts: 34,
    image: "/placeholder.svg?height=40&width=40",
    isYou: true,
  },
  {
    rank: 7,
    name: "Tamara Schmidt",
    nfts: 33,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    rank: 8,
    name: "Ricardo Veum",
    nfts: 32,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    rank: 9,
    name: "Gary Sanford",
    nfts: 31,
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    rank: 10,
    name: "Becky Bartell",
    nfts: 30,
    image: "/placeholder.svg?height=40&width=40",
  },
];

export default function Leaderboard() {
  console.log("Leaderboard component is rendering");
  return (
    <div className="min-h-screen bg-[#F2EDE9] pb-20">
      <div className="relative pt-6 px-4">
        <Link href="/" className="absolute left-4 top-1/2 -translate-y-1/2">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-center text-2xl font-serif">
          Leaderboard
          <span className="block text-xl mb-8">Aritzia</span>
        </h1>
      </div>

      <div className="px-4 mt-8">
        {/* Top 3 Users */}
        <div className="flex justify-center items-end gap-4 mb-12">
          {topUsers.map((user) => (
            <div
              key={user.rank}
              className={`flex flex-col items-center ${user.rank === 1 ? "mt-[-20px]" : ""}`}
            >
              <div className="relative mt-6">
                {user.rank === 1 && (
                  <Crown className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-[#A04545] h-8 w-8" />
                )}
                <div className="relative">
                  <Image
                    src={user.image || "/placeholder.svg"}
                    alt={user.name}
                    width={user.rank === 1 ? 100 : 80}
                    height={user.rank === 1 ? 100 : 80}
                    className="rounded-full border-4 border-white shadow-lg"
                  />
                  <div
                    className={`absolute -bottom-3 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white bg-[#A04545]`}
                  >
                    {user.rank}
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.nfts} NFTs</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Other Users */}
        <div className="space-y-2">
          {otherUsers.map((user) => (
            <div
              key={user.rank}
              className={`flex items-center p-4 rounded-lg ${user.isYou ? "bg-[#606C38]" : "bg-[#A04545]"}`}
            >
              <span className="w-6 text-white">{user.rank}</span>
              <div className="relative w-10 h-10 mx-3">
                <Image
                  src={user.image || "/placeholder.svg"}
                  alt={user.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <span className="flex-grow text-white">{user.name}</span>
              <span className="text-white">{user.nfts} NFTs</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
