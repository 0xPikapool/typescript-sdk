import { BigNumber } from "ethers";
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
  // Add the Domain to the types and convert units to hex before sending to
  // the mempool
  const typedDataToSend = {
    ...typedBidData,
    domain: {
      ...typedBidData.domain,
      chainId: BigNumber.from(typedBidData.domain.chainId).toHexString(),
    },
    message: {
      ...typedBidData.message,
      amount: BigNumber.from(typedBidData.message.amount).toHexString(),
      tip: BigNumber.from(typedBidData.message.tip).toHexString(),
      basePrice: BigNumber.from(typedBidData.message.basePrice).toHexString(),
    },
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
