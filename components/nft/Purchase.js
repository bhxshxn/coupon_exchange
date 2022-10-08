import {
  useAddress,
  useMarketplace,
  useNFTCollection,
  useBurnNFT,
  useContract,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiTag } from "react-icons/hi";
import { IoMdWallet } from "react-icons/io";
import { ImCross } from "react-icons/im";
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
    router.reload();
  };
  const errorPurchase = (toastHandler = toast) => {
    toastHandler.error(`Error purchasing asset`, {
      style: {
        background: "#04111d",
        color: "#fff",
      },
    });
    setLoading(false);
    router.reload();
  };
  const confirmCancelListing = (toastHandler = toast) => {
    toastHandler.success(`Listing Cancelled successful!`, {
      style: {
        background: "#04111d",
        color: "#fff",
      },
    });
    setLoading(false);
    router.reload();
  };
  const errorCancelListing = (toastHandler = toast) => {
    toastHandler.error(`Error in cancelling the listing`, {
      style: {
        background: "#04111d",
        color: "#fff",
      },
    });
    setLoading(false);
    router.reload();
  };
  const confirmBurnNft = (toastHandler = toast) => {
    toastHandler.success(`Nft Deleted successful!`, {
      style: {
        background: "#04111d",
        color: "#fff",
      },
    });
    setLoading(false);
    router.push("/myCoupons");
  };
  const errorBurnNft = (toastHandler = toast) => {
    toastHandler.error(`Error in deleting Nft  `, {
      style: {
        background: "#04111d",
        color: "#fff",
      },
    });
    setLoading(false);
  };
  const marketplace = useMarketplace(
    "0x606879c4a436594Bf66113993B8B65C19675a0C7"
  );
  const { contract } = useContract(
    "0x63F80dA69eF8608A49D8E4883b4114F28DC5d47E"
  );
  const nftCollection = useNFTCollection(
    "0x63F80dA69eF8608A49D8E4883b4114F28DC5d47E"
  );
  const { mutate: burnNftNew, isLoading, error } = useBurnNFT(contract);
  const cancelListing = async (id) => {
    try {
      setLoading(true);
      await marketplace.direct.cancelListing(id);
      confirmCancelListing();
    } catch (err) {
      console.error(err);
      errorCancelListing();
    }
  };
  const burnNft = async (id) => {
    try {
      // setLoading(true);
      // console.log(id);
      burnNftNew({ tokenId: id });
      // await nftCollection.burnToken(id);
      confirmBurnNft();
    } catch (err) {
      console.error(err);
      errorBurnNft();
    }
  };
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
      {selectedNft?.owner == address ? (
        <>
          {isListed === "true" ? (
            <>
              {console.log(selectedMarketNft)}
              <div
                onClick={() => {
                  enableButton ? cancelListing(selectedMarketNft.id) : null;
                }}
                className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
              >
                <ImCross className={style.buttonIcon} />
                <div className={style.buttonText}>Cancel Listing</div>
              </div>
            </>
          ) : (
            <>
              <div
                onClick={() => {
                  router.push({
                    pathname: `/listItem/${Number(
                      selectedNft.metadata.id._hex
                    )}`,
                  });
                }}
                className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
              >
                <IoMdWallet className={style.buttonIcon} />
                <div className={style.buttonText}>List Coupon</div>
              </div>
              <div
                onClick={() => {
                  burnNft(selectedNft.metadata.id._hex);
                }}
                className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
              >
                <IoMdWallet className={style.buttonIcon} />
                <div className={style.buttonText}>Burn Coupon</div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
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
            </>
          ) : (
            <>
              <div
                className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
              >
                <IoMdWallet className={style.buttonIcon} />
                <div className={style.buttonText}>Not Listed </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MakeOffer;
