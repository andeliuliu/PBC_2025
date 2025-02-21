import Image from "next/image";
import { Wallet, Edit, ExternalLink, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Profile() {
  const purchases = [
    {
      id: 1,
      image: "/1.png",
      name: "Vintage Charm Hobo",
      price: "0.85 ETH",
      openseaLink: "#",
    },
    {
      id: 2,
      image: "/2.png",
      name: "Green Geometric Clasp Bag",
      price: "0.95 ETH",
      openseaLink: "#",
    },
  ];

  return (
    <div className="pb-6">
      <div className="relative">
        <div className="h-40 w-full">
          <Image src="/bg.png" alt="Cover" fill className="object-cover" />
        </div>
        <Link
          href="/"
          className="absolute top-4 left-4 bg-white/50 rounded-full p-2"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </Link>
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
          <div className="rounded-full overflow-hidden border-4 border-[#F2EDE9] shadow-lg">
            <Image
              src="/pfp.png"
              alt="Profile"
              width={120}
              height={120}
              className="w-32 h-32 object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-20 px-4 text-center">
        <h1 className="text-2xl font-semibold text-gray-800">Vivian</h1>
        <p className="text-gray-600 mt-1">@vivian</p>
        <p className="text-sm mt-2 text-gray-700">
          A blockchain girl who loves to shop
        </p>

        <div className="flex gap-4 justify-center mt-4">

          <button className="flex items-center px-4 py-2 bg-[#A04545] hover:bg-[#8A3A3A] text-white rounded-md">
            <Edit className="mr-2 h-4 w-4" />
            Edit profile
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Purchases
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {purchases.map((item) => (
              <div key={item.id} className="flex flex-col">
                <div className="relative aspect-square mb-2">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="rounded-lg object-cover shadow-sm"
                  />
                </div>
                <div className="text-left mb-2">
                  <h3 className="font-medium text-sm text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-600">{item.price}</p>
                </div>
                <a
                  href={item.openseaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-3 py-1.5 bg-[#A04545] hover:bg-[#8A3A3A] text-white text-xs rounded-md"
                >
                  View on OpenSea
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
