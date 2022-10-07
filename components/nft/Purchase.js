import { useAddress, useMarketplace } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiTag } from "react-icons/hi";
import { IoMdWallet } from "react-icons/io";
import LoadingComponent from "../LoadingComponent";

const style = {
  button: `mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer`,
  buttonIcon: `text-xl`,
  buttonText: `ml-2 text-lg font-semibold`,
};

const MakeOffer = ({ isListed, selectedNft, listings }) => {
  const address = useAddress();
  const [selectedMarketNft, setSelectedMarketNft] = useState();
  const [enableButton, setEnableButton] = useState(false);
  const [loading, setLoading] = useState(false);
  // console.log(selectedNft);
  const router = useRouter();
  useEffect(() => {
    if (!listings || isListed === "false") return;
    (async () => {
      setSelectedMarketNft(
        listings.find(
          (marketNft) =>
            Number(marketNft?.asset.id._hex) ===
            Number(selectedNft.metadata.id._hex)
        )
      );
    })();
  }, [selectedNft, listings, isListed]);

  useEffect(() => {
    if (!selectedMarketNft || !selectedNft) return;

    setEnableButton(true);
  }, [selectedMarketNft, selectedNft]);
  const confirmPurchase = (toastHandler = toast) => {
    toastHandler.success(`Purchase successful!`, {
      style: {
        background: "#04111d",
        color: "#fff",
      },
    });
    setLoading(false);
  };
  const errorPurchase = (toastHandler = toast) => {
    toastHandler.error(`Error purchasing asset`, {
      style: {
        background: "#04111d",
        color: "#fff",
      },
    });
    setLoading(false);
  };
  const marketplace = useMarketplace(
    "0xE073aAbD1E166Aa23d9562b9D4aB62b57Da9dE9e"
  );

  const buyItem = async (id) => {
    try {
      setLoading(true);
      await marketplace.buyoutListing(id, 1);
      confirmPurchase();
    } catch (err) {
      console.error(err);
      errorPurchase();
    }
  };
  if (loading) return <LoadingComponent />;
  return (
    <div className='flex h-20 w-full items-center rounded-lg border border-[#151c22] bg-[#303339] px-12'>
      <Toaster position='top-center' reverseOrder={false} />
      {isListed === "true" ? (
        <>
          <div
            onClick={() => {
              enableButton ? buyItem(selectedMarketNft.id, 1) : null;
            }}
            className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
          >
            <IoMdWallet className={style.buttonIcon} />
            <div className={style.buttonText}>Buy Now</div>
          </div>
          <div
            className={`${style.button} border border-[#151c22]  bg-[#363840] hover:bg-[#4c505c]`}
          >
            <HiTag className={style.buttonIcon} />
            <div className={style.buttonText}>Make Offer</div>
          </div>
        </>
      ) : (
        <>
          {selectedNft?.owner == address ? (
            <div
              onClick={() => {
                router.push({
                  pathname: `/listItem/${Number(selectedNft.metadata.id._hex)}`,
                });
              }}
              className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
            >
              <IoMdWallet className={style.buttonIcon} />
              <div className={style.buttonText}>List Item</div>
            </div>
          ) : (
            <>Not Listed</>
          )}
        </>
      )}
    </div>
  );
};

export default MakeOffer;
