import { providers, utils, Wallet } from "ethers";
import {
  PikapoolOptions,
  PikapoolOptionOverrides,
  TypedBidData,
} from "../types";

const DEFAULT_PIKAPOOL_OPTIONS: PikapoolOptions = {
  settlementContract: "0xf2F1cb33141c931D2e81cD0572c97e5b2c63fD9c",
  rpcUrl: "https://api.pikapool.cool/v0/bids",
};

export default async function createTypedData(
  auctionName: string,
  auctionAddress: `0x${string}`,
  basePrice: number,
  amount: number,
  tip: number,
  bidder: string,
  chainId: number = 1,
  pikapoolOptionOverrides: PikapoolOptionOverrides = DEFAULT_PIKAPOOL_OPTIONS
): Promise<TypedBidData> {
  const basePriceBn = utils.parseEther(basePrice.toString());
  const tipBn = utils.parseEther(tip.toString());
  const pikapoolOptions: PikapoolOptions = {
    ...DEFAULT_PIKAPOOL_OPTIONS,
    ...pikapoolOptionOverrides,
  };
  return {
    primaryType: "Bid",
    domain: {
      name: "Pikapool Auction",
      version: "1",
      chainId: "0x" + chainId.toString(16),
      verifyingContract: pikapoolOptions.settlementContract,
    },
    types: {
      Bid: [
        { name: "auctionName", type: "string" },
        { name: "auctionAddress", type: "address" },
        { name: "bidder", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "basePrice", type: "uint256" },
        { name: "tip", type: "uint256" },
      ],
    },
    message: {
      auctionName,
      auctionAddress,
      bidder,
      amount: amount.toString(16),
      basePrice: basePriceBn.toString(),
      tip: tipBn.toString(),
    },
  };
}
