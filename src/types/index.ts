export interface PikapoolOptions {
  settlementContract: `0x${string}`;
  rpcUrl: string;
}

export interface PikapoolOptionOverrides {
  settlementContract?: `0x${string}`;
  rpcUrl?: string;
}

export interface BidReceipt {
  id: string;
  cid: string;
}

export interface SubmitBidResponse {
  status: number;
  body: {
    id?: string;
    cid?: string;
    error?: string;
  };
}

export interface TypedBidData {
  primaryType: string;
  domain: {
    name: string;
    version: string;
    chainId: string;
    verifyingContract: `0x${string}`;
  };
  types: {
    Bid: {
      name: string;
      type: string;
    }[];
  };
  message: {
    auctionName: string;
    auctionAddress: `0x${string}`;
    bidder: string | undefined;
    amount: string;
    basePrice: string;
    tip: string;
  };
}
