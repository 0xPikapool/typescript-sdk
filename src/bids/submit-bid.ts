import { providers, utils, Wallet } from "ethers";
import {
  PikapoolOptions,
  PikapoolOptionOverrides,
  TypedBidData,
  SubmitBidResponse,
} from "../types";

const DEFAULT_PIKAPOOL_OPTIONS: PikapoolOptions = {
  settlementContract: "0xf2F1cb33141c931D2e81cD0572c97e5b2c63fD9c",
  rpcUrl: "https://api.pikapool.cool/v0/bids",
};

export default async function submitBid(
  typedBidData: TypedBidData,
  signature: string,
  pikapoolOptionOverrides: PikapoolOptionOverrides = DEFAULT_PIKAPOOL_OPTIONS
): Promise<SubmitBidResponse> {
  const pikapoolOptions: PikapoolOptions = {
    ...DEFAULT_PIKAPOOL_OPTIONS,
    ...pikapoolOptionOverrides,
  };
  // Add the Domain to the types before sending to the server
  const typedDataToSend = {
    ...typedBidData,
    types: {
      EIP712Domain: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "version",
          type: "string",
        },
        {
          name: "chainId",
          type: "uint256",
        },
        {
          name: "verifyingContract",
          type: "address",
        },
      ],
      ...typedBidData.types,
    },
  };
  const res = await fetch(pikapoolOptions.rpcUrl, {
    method: "PUT",
    body: JSON.stringify(
      {
        typed_data: typedDataToSend,
        signature,
        sender: typedBidData.message.bidder,
      },
      null,
      2
    ),
  });
  const body = await res.json();
  return {
    status: res.status,
    body,
  };
}
