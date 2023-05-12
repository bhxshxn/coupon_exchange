import {
   useContract,
   useMarketplace,
   useNFTs,
   useAddress,
   useOwnedNFTs,
} from '@thirdweb-dev/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import LoadingFullScreen from '../components/LoadingFullScreen';
import NFTCard from '../components/NFTCard';
import { client } from '../lib/sanityClient';

const Coupons = () => {
   const router = useRouter();
   const address = useAddress();

   const { collectionId } = router.query;
   const [collection, setCollection] = useState({});
   const [listings, setListings] = useState([]);

   const { contract } = useContract(
      '0x63F80dA69eF8608A49D8E4883b4114F28DC5d47E',
   );
   const {
      data: ownedNFTs,
      isLoading,
      error,
   } = useOwnedNFTs(contract, address);

   console.log('ownedNFTs', ownedNFTs, error);

   const marketplace = useMarketplace(
      '0x7f85776167E650e08bfb4F5002aF9125E0993FC3',
   );

   useEffect(() => {
      if (!marketplace) return;
      (async () => {
         setListings(await marketplace.getActiveListings());
      })();
   }, [marketplace]);

   const fetchCollectionData = async (sanityClient = client) => {
      const query = `*[_type == "marketItems" && contractAddress == "${collectionId}" ] {
      "imageUrl": profileImage.asset->url,
      "bannerImageUrl": bannerImage.asset->url,
      volumeTraded,
      createdBy,
      contractAddress,
      "creator": createdBy->userName,
      title, floorPrice,
      "allOwners": owners[]->,
      description
    }`;

      const collectionData = await sanityClient.fetch(query);

      // console.log(collectionData, "🔥");

      if (collectionData.length !== 0) setCollection(collectionData[0]);
   };
   useEffect(() => {
      fetchCollectionData();
   }, [collectionId]);
   if (isLoading)
      return (
         <>
            <Header />
            <LoadingFullScreen />;
         </>
      );
   return (
      <div className='overflow-hidden'>
         <Header />
         <div className='flex flex-wrap '>
            {ownedNFTs?.length == 0 ? (
               <div className='h-screen w-screen text-white justify-center flex items-center'>
                  No Coupons Present
               </div>
            ) : (
               <>
                  {ownedNFTs?.map(nftItem => (
                     <NFTCard
                        key={nftItem.metadata.id / 1e18}
                        nftItem={nftItem.metadata}
                        title={collection?.title}
                        listings={listings}
                        isLoading={isLoading}
                     />

                     // <NFTCard
                     //   key={nftItem.id}
                     //   nftItem={nftItem.asset}
                     //   title={collection?.title}
                     //   listings={listings}
                     //   isLoading={isReadingNfts}
                     // />
                  ))}
               </>
            )}
         </div>
      </div>
   );
};

export default Coupons;
