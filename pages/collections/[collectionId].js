import {
  useContract,
  useMarketplace,
  useNFTs,
  useActiveListings,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineInstagram, AiOutlineTwitter } from "react-icons/ai";
import { CgWebsite } from "react-icons/cg";
import { HiDotsVertical } from "react-icons/hi";
import Header from "../../components/Header";
import LoadingComponent from "../../components/LoadingComponent";
import LoadingFullScreen from "../../components/LoadingFullScreen";
import NFTCard from "../../components/NFTCard";
import { client } from "../../lib/sanityClient";

const style = {
  bannerImageContainer: `h-[20vh] w-screen overflow-hidden flex justify-center items-center`,
  bannerImage: `w-full object-cover`,
  infoContainer: `w-screen px-4`,
  midRow: `w-full flex justify-center text-white`,
  endRow: `w-full flex justify-end text-white`,
  profileImg: `w-40 h-40 object-cover rounded-full border-2 border-[#202225] mt-[-4rem]`,
  socialIconsContainer: `flex text-3xl mb-[-2rem]`,
  socialIconsWrapper: `w-44`,
  socialIconsContent: `flex container justify-between text-[1.4rem] border-2 rounded-lg px-2`,
  socialIcon: `my-2`,
  divider: `border-r-2`,
  title: `text-5xl font-bold mb-4`,
  createdBy: `text-lg mb-4`,
  statsContainer: `w-[44vw] flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
  collectionStat: `w-1/4`,
  statValue: `text-3xl font-bold w-full flex items-center justify-center`,
  ethLogo: `h-6 mr-2`,
  statName: `text-lg w-full text-center mt-1`,
  description: `text-[#8a939b] text-xl w-max-1/4 flex-wrap mt-4`,
};

const Collection = () => {
  const router = useRouter();
  // const { provider } = useWeb3();
  const { collectionId } = router.query;

  const [collection, setCollection] = useState({});
  const [listings, setListings] = useState([]);



  const { contract } = useContract(
    "0x63F80dA69eF8608A49D8E4883b4114F28DC5d47E"
  );
  const { data: nfts, isLoading: isReadingNfts } = useNFTs(contract);


  const marketplace = useMarketplace(
    "0x606879c4a436594Bf66113993B8B65C19675a0C7"
  );


  const { contract: marketplaceContract } = useContract(
    "0x606879c4a436594Bf66113993B8B65C19675a0C7"
  );
  const {
    data: marketplacelistings,
    isLoading,
    error,
  } = useActiveListings(marketplaceContract);


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
    console.log('collectionData', collectionData)
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
      <div className={style.bannerImageContainer}>
        <img
          className={style.bannerImage}
          src={
            collection?.bannerImageUrl
              ? collection.bannerImageUrl
              : "https://via.placeholder.com/200"
          }
          alt='banner'
        />
      </div>
      <div className={style.infoContainer}>
        <div className={style.midRow}>
          <img
            className={style.profileImg}
            src={
              collection?.imageUrl
                ? collection.imageUrl
                : "https://via.placeholder.com/200"
            }
            alt='profile image'
          />
        </div>
        <div className={style.endRow}>
          <div className={style.socialIconsContainer}>
            <div className={style.socialIconsWrapper}>
              <div className={style.socialIconsContent}>
                <div className={style.socialIcon}>
                  <CgWebsite />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineInstagram />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <AiOutlineTwitter />
                </div>
                <div className={style.divider} />
                <div className={style.socialIcon}>
                  <HiDotsVertical />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.title}>{collection?.title}</div>
        </div>
        {/* <div className={style.midRow}>
          <div className={style.createdBy}>
            Created by{" "}
            <span className='text-[#2081e2]'>{collection?.creator}</span>
          </div>
        </div> */}
        <div className={style.midRow}>
          <div className={style.statsContainer}>
            <div className={style.collectionStat}>
              <div className={style.statValue}>{listings?.length}</div>
              <div className={style.statName}>items</div>
            </div>
            {/* <div className={style.collectionStat}>
              <div className={style.statValue}>
                {collection?.allOwners ? collection.allOwners.length : ""}
              </div>
              <div className={style.statName}>owners</div>
            </div> */}
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  src='https://openseauserdata.com/files/6f8e2979d428180222796ff4a33ab929.svg'
                  alt='eth'
                  className={style.ethLogo}
                />
                {collection?.floorPrice}
              </div>
              <div className={style.statName}>floor price</div>
            </div>
            <div className={style.collectionStat}>
              <div className={style.statValue}>
                <img
                  src='https://openseauserdata.com/files/6f8e2979d428180222796ff4a33ab929.svg'
                  alt='eth'
                  className={style.ethLogo}
                />
                {collection?.volumeTraded}
              </div>
              <div className={style.statName}>volume traded</div>
            </div>
          </div>
        </div>
        <div className={style.midRow}>
          <div className={style.description}>{collection?.description}</div>
        </div>
      </div>
      <div className='flex flex-wrap '>
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <>
            {marketplacelistings.length == 0 ? (
              <div className='h-full w-screen text-white justify-center flex items-center'>
                No NFTs Present
              </div>
            ) : (
              <>
                {marketplacelistings.map((nftItem) => (
                  // <NFTCard
                  //   key={nftItem.metadata.id / 1e18}
                  //   nftItem={nftItem.metadata}
                  //   title={collection?.title}
                  //   listings={listings}
                  //   isLoading={isReadingNfts}
                  // />
                  <NFTCard
                    key={nftItem.id}
                    nftItem={nftItem.asset}
                    title={collection?.title}
                    listings={listings}
                    isLoading={isReadingNfts}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Collection;
