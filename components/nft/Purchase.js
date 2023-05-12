import {
   useAddress,
   useMarketplace,
   useNFTCollection,
   useBurnNFT,
   useContract,
   useBuyNow,
} from '@thirdweb-dev/react';
import { ListingType } from '@thirdweb-dev/sdk';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { HiTag } from 'react-icons/hi';
import { IoMdWallet } from 'react-icons/io';
import { ImCross } from 'react-icons/im';
import LoadingComponent from '../LoadingComponent';

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
      console.log('1');
      if (!listings || isListed === 'false') return;
      console.log('2');
      (async () => {
         setSelectedMarketNft(
            listings.find(
               marketNft =>
                  Number(marketNft?.asset.id) ===
                  Number(selectedNft.metadata.id),
            ),
         );
      })();
   }, [selectedNft, listings, isListed]);

   useEffect(() => {
      console.log('res', selectedMarketNft, selectedNft);
      if (!selectedMarketNft || !selectedNft) return;

      setEnableButton(true);
   }, [selectedMarketNft, selectedNft]);
   const confirmPurchase = (toastHandler = toast) => {
      toastHandler.success(`Purchase successful!`, {
         style: {
            background: '#04111d',
            color: '#fff',
         },
      });
      setLoading(false);
      router.push('/myCoupons');
   };
   const errorPurchase = (toastHandler = toast) => {
      toastHandler.error(`Error purchasing asset`, {
         style: {
            background: '#04111d',
            color: '#fff',
         },
      });
      setLoading(false);
      router.reload();
   };
   const confirmCancelListing = (toastHandler = toast) => {
      toastHandler.success(`Listing Cancelled successful!`, {
         style: {
            background: '#04111d',
            color: '#fff',
         },
      });
      setLoading(false);
      router.push('/myCoupons');
   };
   const errorCancelListing = (toastHandler = toast) => {
      toastHandler.error(`Error in cancelling the listing`, {
         style: {
            background: '#04111d',
            color: '#fff',
         },
      });
      setLoading(false);
      router.reload();
   };
   const confirmBurnNft = (toastHandler = toast) => {
      toastHandler.success(`Nft Deleted successful!`, {
         style: {
            background: '#04111d',
            color: '#fff',
         },
      });
      setLoading(false);
      router.push('/myCoupons');
   };
   const errorBurnNft = (toastHandler = toast) => {
      toastHandler.error(`Error in deleting Nft  `, {
         style: {
            background: '#04111d',
            color: '#fff',
         },
      });
      setLoading(false);
      router.reload();
   };
   const marketplace = useContract(
      '0x7f85776167E650e08bfb4F5002aF9125E0993FC3',
      'marketplace',
   );
   const { contract } = useContract(
      '0x63F80dA69eF8608A49D8E4883b4114F28DC5d47E',
      'nft-collection',
   );
   const nftCollection = useNFTCollection(
      '0x63F80dA69eF8608A49D8E4883b4114F28DC5d47E',
   );
   const {
      mutateAsync: BuyNft,
      isLoading: buyLoading,
      error: BuyError,
   } = useBuyNow(marketplace.contract);
   const {
      mutate: burnNftNew,
      isSuccess,
      isLoading,
      error,
   } = useBurnNFT(contract);
   const cancelListing = async id => {
      try {
         setLoading(true);
         await marketplace.contract.direct.cancelListing(id);
         confirmCancelListing();
         router.back();
      } catch (err) {
         console.error(err);
         errorCancelListing();
      }
   };
   useEffect(() => {
      if (isSuccess) confirmBurnNft();
   }, [isSuccess]);

   const burnNft = async id => {
      try {
         setLoading(true);
         burnNftNew({ tokenId: id });
      } catch (err) {
         console.error(err);
         errorBurnNft();
      }
   };
   const buyItem = async id => {
      try {
         setLoading(true);
         console.log('id', id);
         await BuyNft({
            id: id,
            type: ListingType.Direct,
            buyForWallet: address,
            buyAmount: 1,
         });
         confirmPurchase();
      } catch (err) {
         console.log('err', id);
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
               {isListed === 'true' ? (
                  <>
                     {console.log(selectedMarketNft)}
                     <div
                        onClick={() => {
                           enableButton
                              ? cancelListing(selectedMarketNft.id)
                              : null;
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
                                 selectedNft.metadata.id,
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
                           burnNft(selectedNft.metadata.id);
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
               {isListed === 'true' ? (
                  <>
                     <div
                        onClick={() => {
                           enableButton
                              ? buyItem(selectedMarketNft.id, 1)
                              : null;
                        }}
                        className={`${style.button} ${
                           !enableButton ? 'opacity-50' : 'opacity-100'
                        } bg-[#2081e2] hover:bg-[#42a0ff]`}
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
