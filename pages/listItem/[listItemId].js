import { useAddress, useMarketplace, useMetamask } from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { useRouter } from "next/router";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Header from "../../components/Header";
import LoadingFullScreen from "../../components/LoadingFullScreen";

const style = {
  Wrapper: `flex flex-col justify-top items-center h-screen w-screen bg-[#3b3d42] `,
  button: `border border-[#282b2f] bg-[#2081e2] p-[0.8rem] text-xl font-semibold rounded-lg cursor-pointer text-black`,
  details: `text-lg text-center text=[#282b2f] font-semibold mt-4`,
  form: ` flex flex-col justify-center items-left py-[50px]`,
};

const listItem = () => {
  const connectUsingMetamask = useMetamask();
  const address = useAddress();
  const router = useRouter();
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const marketplace = useMarketplace(
    "0x606879c4a436594Bf66113993B8B65C19675a0C7"
  );
  // const contract = useContract(process.env.MARKETPLACE_ADDRESS);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const transaction = await marketplace?.direct.createListing({
        assetContractAddress: process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS, // Contract Address of the NFT
        buyoutPricePerToken: price, // Maximum price, the auction will end immediately if a user pays this price.
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Rinkeby ETH.
        listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
        quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
        startTimestamp: new Date(0), // When the listing will start
        tokenId: router.query.listItemId, // Token ID of the NFT.
      });

      console.log(transaction);
      confirmMint();
      setPrice("");
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  const confirmMint = (toastHandler = toast) =>
    toastHandler.success(`Listing successful!`, {
      style: {
        background: "#04111d",
        color: "#fff",
      },
    });
  return (
    <>
      <Header />
      <div className={style.Wrapper}>
        <Toaster position='top-center' reverseOrder={false} />
        {address ? (
          <>
            {loading ? (
              <LoadingFullScreen />
            ) : (
              <div>
                <form className={style.form} onSubmit={onSubmit}>
                  <div className='py-[15px] flex justify-between'>
                    Price:
                    <input
                      type='text'
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className='rounded-[5px]'
                    />
                  </div>
                  <div className='w-[100%] flex justify-center '>
                    <div className='rounded-[5px] w-[50%] flex justify-center py-[5px] bg-[#0062ff]'>
                      <button type='submit' disabled={loading}>
                        List NFT
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </>
        ) : (
          <button onClick={connectUsingMetamask}>Connect using Metamask</button>
        )}
      </div>
    </>
  );
};

export default listItem;
