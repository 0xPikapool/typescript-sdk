import { useState } from "react";
import { providers, Wallet } from "ethers";
import {
  PikapoolOptions,
  PikapoolOptionOverrides,
  BidReceipt,
} from "../../types";
import createTypedData from "../create-typed-data";
import submitBid from "../submit-bid";

const DEFAULT_PIKAPOOL_OPTIONS: PikapoolOptions = {
  settlementContract: "0xf2F1cb33141c931D2e81cD0572c97e5b2c63fD9c",
  rpcUrl: "https://api.pikapool.cool/v0/bids",
};

export interface UseBidParams {
  auctionName: string;
  auctionAddress: `0x${string}`;
  basePrice: number;
  amount: number;
  tip: number;
  signer: providers.JsonRpcSigner | Wallet | undefined;
  pikapoolOptionOverrides?: PikapoolOptionOverrides;
}

export default function useBid(params: UseBidParams) {
  const { auctionName, auctionAddress, basePrice, amount, tip, signer } =
    params;
  const pikapoolOptions: PikapoolOptions = {
    ...DEFAULT_PIKAPOOL_OPTIONS,
    ...(params.pikapoolOptionOverrides || {}),
  };
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [receipt, setReceipt] = useState<BidReceipt | null>(null);

  function reset() {
    setIsLoading(false);
    setError(null);
    setReceipt(null);
  }

  async function signAndSubmit() {
    if (!signer) return setError(new Error("No signer found"));
    try {
      setIsLoading(true);
      setError(null);
      setReceipt(null);
      const chainId = (await signer.provider.getNetwork()).chainId;
      const typedData = await createTypedData({
        auctionName,
        auctionAddress,
        basePrice,
        amount,
        tip,
        bidder: await signer.getAddress(),
        chainId,
        pikapoolOptionOverrides: pikapoolOptions,
      });

      const sig = await signer._signTypedData(
        typedData.domain,
        typedData.types,
        typedData.message
      );
      const { status, body } = await submitBid(typedData, sig);
      if (status !== 200) throw new Error(`[${status}] ${body.error}`);

      const { id, cid } = body;
      if (id && cid) {
        setReceipt({ id, cid });
      } else {
        throw new Error("Got a 200 response but no id or cid");
      }
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
        setReceipt(null);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return {
    signAndSubmit,
    isLoading,
    error,
    receipt,
    reset,
  };
}
