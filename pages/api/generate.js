// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(400).json({ message: "Invalid request method" });

  const {
    body: { name, description, image, address },
  } = req;

  console.log('req', req.body)
  const sdk = new ThirdwebSDK(
    new ethers.Wallet(
      process.env.WALLET_PRIVATE_KEY,
      ethers.getDefaultProvider(
        "https://eth-goerli.g.alchemy.com/v2/LhQKL4gpH1wZr011PH3sCrtKLggL-V7-"
      )
    )
  );

  const collection = await sdk.getContract(
    process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS, 'nft-collection'
  );

  const signature = await collection.signature.generate({
    metadata: {
      name,
      description,
      image,
    },
    to: address
  });
  console.log('sign', signature);
  res.json({ message: "Signature generated successfully", signature });
}
