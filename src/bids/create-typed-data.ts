import { BigNumber } from "ethers";
import {
  PikapoolOptions,
  PikapoolOptionOverrides,
  TypedBidData,
} from "../types";

const DEFAULT_PIKAPOOL_OPTIONS: PikapoolOptions = {
  settlementContract: "0xf2F1cb33141c931D2e81cD0572c97e5b2c63fD9c",
  rpcUrl: "https://api.pikapool.cool/v0/bids",
};

export interface CreateTypedDataParams {
  auctionName: string;
  auctionAddress: `0x${string}`;
  basePrice: BigNumber;
  amount: number;
  tip: BigNumber;
  bidder: string;
  chainId: number;
  pikapoolOptionOverrides?: PikapoolOptionOverrides;
}

export default async function createTypedData(
  params: CreateTypedDataParams
): Promise<TypedBidData> {
  const {
    auctionName,
    auctionAddress,
    basePrice,
    amount,
    tip,
    bidder,
    chainId,
  } = params;
  const pikapoolOptions: PikapoolOptions = {
    ...DEFAULT_PIKAPOOL_OPTIONS,
    ...(params.pikapoolOptionOverrides || {}),
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
      amount: amount.toString(),
      basePrice: basePrice.toString(),
      tip: tip.toString(),
    },
  };
}
