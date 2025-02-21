import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { mintABI, mintContractAddress } from "src/constants";

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export async function getBrandDiscounts(userAddress: string) {
  const brandDiscounts = new Map<string, number>();

  try {
    // Get total NFTs
    const topNftId = await publicClient.readContract({
      address: mintContractAddress,
      abi: mintABI,
      functionName: "topNft",
    });

    if (!topNftId) return brandDiscounts;

    // Check each NFT starting from 0
    for (let i = 0; i <= Number(topNftId); i++) {
      try {
        const owner = await publicClient.readContract({
          address: mintContractAddress,
          abi: mintABI,
          functionName: "ownerOf",
          args: [BigInt(i)],
        });

        // If user owns this NFT, check its brand
        if (owner === userAddress) {
          const nftDetails = (await publicClient.readContract({
            address: mintContractAddress,
            abi: mintABI,
            functionName: "nftDetails",
            args: [BigInt(i)],
          })) as [number, string, number];

          if (nftDetails) {
            const brandName = nftDetails[1];
            // Increment discount multiplier for this brand
            brandDiscounts.set(
              brandName,
              (brandDiscounts.get(brandName) || 0) + 1
            );
          }
        }
      } catch (error) {
        console.error(`Error checking NFT #${i}:`, error);
      }
    }
  } catch (error) {
    console.error("Error getting brand discounts:", error);
  }

  return brandDiscounts;
}
