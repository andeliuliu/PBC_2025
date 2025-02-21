import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { mintABI, mintContractAddress } from "src/constants";

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

const PROFILE_IMAGES = [
  '/annHathaway.png',
  '/chrisrock.png',
  '/kendalljenner.png',
  '/leonardodecaporio.png',
  '/nataliePortman.png',
];

export interface LeaderboardEntry {
  address: string;
  name: string;
  nftCount: number;
  image: string;
  walletAddress: string;
}

export const getBrandLeaderboard = async (
  brandName: string
): Promise<LeaderboardEntry[]> => {
  try {
    console.log(`[getBrandLeaderboard] Starting fetch for brand: ${brandName}`);
    console.log(
      `[getBrandLeaderboard] Contract address: ${mintContractAddress}`
    );

    // Get total NFTs
    const topNftId = await publicClient.readContract({
      address: mintContractAddress,
      abi: mintABI,
      functionName: "topNft",
    });

    console.log(`[getBrandLeaderboard] Retrieved topNftId: ${topNftId}`);

    if (!topNftId) {
      console.log("[getBrandLeaderboard] No NFTs found, returning empty array");
      return [];
    }

    // Create a map to store address => nft count
    const addressCounts = new Map<string, number>();

    // Fetch all NFTs from 1 to topNftId
    console.log(`[getBrandLeaderboard] Fetching NFTs from 1 to ${topNftId}`);

    for (let i = 1; i <= Number(topNftId); i++) {
      try {
        console.log(`[getBrandLeaderboard] Processing NFT #${i}`);

        const nftDetails = await publicClient.readContract({
          address: mintContractAddress,
          abi: mintABI,
          functionName: "nftDetails",
          args: [BigInt(i)],
        });

        console.log(`[getBrandLeaderboard] NFT #${i} details:`, nftDetails);

        // Only count NFTs for the specified brand
        if (nftDetails && nftDetails[1] === brandName) {
          console.log(
            `[getBrandLeaderboard] Found matching NFT #${i} for brand ${brandName}`
          );

          try {
            const owner = await publicClient.readContract({
              address: mintContractAddress,
              abi: mintABI,
              functionName: "ownerOf",
              args: [BigInt(i)],
            });

            console.log(`[getBrandLeaderboard] NFT #${i} owner: ${owner}`);

            addressCounts.set(
              owner as string,
              (addressCounts.get(owner as string) || 0) + 1
            );
          } catch (ownerError) {
            console.error(
              `[getBrandLeaderboard] Error getting owner for NFT #${i}:`,
              ownerError
            );
          }
        } else {
          console.log(
            `[getBrandLeaderboard] NFT #${i} did not match brand ${brandName}`
          );
        }
      } catch (nftError) {
        console.error(
          `[getBrandLeaderboard] Error processing NFT #${i}:`,
          nftError
        );
      }
    }

    console.log(
      `[getBrandLeaderboard] Address counts:`,
      Object.fromEntries(addressCounts)
    );
    console.log(
      `[getBrandLeaderboard] Total unique addresses found: ${addressCounts.size}`
    );

    // Convert to array and sort
    const leaderboard: LeaderboardEntry[] = Array.from(addressCounts.entries())
      .map(([address, count], index) => ({  // Added index parameter here
        address,
        name: `${address.slice(0, 6)}...${address.slice(-4)}`,
        nftCount: count,
        image: PROFILE_IMAGES[index % PROFILE_IMAGES.length], // Use index instead of count
        walletAddress: address,
      }))
      .sort((a, b) => b.nftCount - a.nftCount);

    console.log(
      `[getBrandLeaderboard] Final leaderboard entries:`,
      leaderboard
    );
    return leaderboard;
  } catch (error) {
    console.error("[getBrandLeaderboard] Error fetching leaderboard:", error);
    console.error("[getBrandLeaderboard] Error details:", {
      contractAddress: mintContractAddress,
      chain: baseSepolia.id,
      brandName,
    });
    return [];
  }
};
