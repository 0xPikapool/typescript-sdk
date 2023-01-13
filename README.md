# Pikapool TypeScript SDK

<p align="center">
  <img src="https://raw.githubusercontent.com/0xPikapool/typescript-sdk/main/assets/pika_portal.jpg" />
  <p align="center">
    Your TypeScript gateway to The Pikapool universe ⚡
  </p>
</p>

![npm](https://img.shields.io/npm/v/@pikapool/sdk?style=plastic)

## Features

- [x] Craft EIP712-compliant Bid payloads
- [x] Submit Bid payloads to the Pikapool mempool
- [x] React hook simplifying the Bid creation and submission experience
- [ ] Query Bids
- [ ] Query Auctions
- [ ] Create and manage Auctions

## Install

```bash
yarn add @pikapool/sdk
# or
npm install @pikapool/sdk
```

## Usage

### Create & Submit Bid (React)

Check out our [React Demo](https://github.com/0xPikapool/react-demo).

```ts
import { bids } from "@pikapool/sdk";

function BidComponent() {
  // your logic...
  const { 
    signAndSubmit,  // () => Promise<void>;
    isLoading,      // boolean;
    error,          // Error | null;
    receipt,        // BidReceipt | null;
    reset,          // () => void;
  } = bids.hooks.useBid(
    auctionName,    // Auction name
    auctionAddress, // Auction address (aka nft address)
    basePrice,      // Auction base price (per-nft)
    amount,         // Number of NFTs the user wishes to purchase
    tip,            // Amount user wishes to tip (per-nft)
    signer,         // An ethers.js JsonRpcSigner or Wallet
    optionOverrides // PikapoolOptionOverrides
  );
  // your logic...
}

interface BidReceipt {
  id: string;
  cid: string;
}

interface PikapoolOptionOverrides {
  settlementContract?: `0x${string}`;
  rpcUrl?: string;
}
```

### Create & Submit Bid (Vanilla TypeScript)

```ts
import { bids } from "@pikapool/sdk";

function createAndSubmitBid() {
  // your logic...
  const typedData: TypedBidData = await createTypedData(
    auctionName,    // Auction name
    auctionAddress, // Auction address (aka nft address)
    basePrice,      // Auction base price (per-nft)
    amount,         // Number of NFTs the user wishes to purchase
    tip,            // Amount user wishes to tip (per-nft)
    bidder,         // Bidder address
    optionOverrides // PikapoolOptionOverrides
  );

  // Sign typedData in any EIP712-compliant way.
  // Example here using an ethers.js JsonRpcSigner.
  const sig: string = await signer._signTypedData(
    typedData.domain,
    typedData.types,
    typedData.message
  );

  const res: SubmitBidResponse = await submitBid(
  typedBidData,    // TypedBidData,
  signature,       // string
  optionOverrides, // PikapoolOptionOverrides
  );
  // your logic...
}

interface SubmitBidResponse {
  status: number;     // HTTP Response StatusCode
  body: {
    id?: string;      // New Bid ID
    cid?: string;     // New Bid Content ID (alpha - do not use)
    error?: string;   // Error message
  };
}

interface TypedBidData {
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

interface PikapoolOptionOverrides {
  settlementContract?: `0x${string}`;
  rpcUrl?: string;
}
```
