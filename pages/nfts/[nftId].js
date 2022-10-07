import Header from "../../components/Header";
import { useEffect, useMemo, useState } from "react";
import {
  useAddress,
  useMarketplace,
  useNFTs,
  useContract,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import NFTImage from "../../components/nft/NFTImage.js";
import GeneralDetails from "../../components/nft/GeneralDetails";
import ItemActivity from "../../components/nft/ItemActivity";
import Purchase from "../../components/nft/Purchase";

const style = {
  wrapper: `flex flex-col items-center container-lg text-[#e5e8eb]`,
  container: `container p-6`,
  topContent: `flex`,
  nftImgContainer: `flex-1 mr-4`,
  detailsContainer: `flex-[2] ml-4`,
};

const Nft = () => {
  // const { address, connectWallet, provider } = useWeb3();
  const [selectedNft, setSelectedNft] = useState();
  const [listings, setListings] = useState([]);
  const router = useRouter();

  // const nftModule = useMemo(() => {
  //   if (!provider) return;

  //   const sdk = new ThirdwebSDK(provider.getSigner());
  //   return sdk.getNFTModule("0x63F80dA69eF8608A49D8E4883b4114F28DC5d47E");
  // }, [provider]);
  // get all NFTs in the collection
  const { contract } = useContract(
    "0x63F80dA69eF8608A49D8E4883b4114F28DC5d47E"
  );
  const { data: nfts, isLoading: isReadingNfts } = useNFTs(contract);

  useEffect(() => {
    if (!nfts) return;
    (async () => {
      const selectedNftItem = nfts.find(
        (nft) => Number(nft.metadata.id._hex) === Number(router.query.nftId)
      );
      setSelectedNft(selectedNftItem);
    })();
  }, [nfts]);

  const marketplace = useMarketplace(
    "0xE073aAbD1E166Aa23d9562b9D4aB62b57Da9dE9e"
  );

  useEffect(() => {
    if (!marketplace) return;
    (async () => {
      setListings(await marketplace.getAllListings());
    })();
  }, [marketplace]);

  return (
    <div>
      <Header />
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.topContent}>
            <div className={style.nftImgContainer}>
              <NFTImage selectedNft={selectedNft} />
            </div>
            <div className={style.detailsContainer}>
              <GeneralDetails selectedNft={selectedNft} />
              <Purchase
                isListed={router.query.isListed}
                selectedNft={selectedNft}
                listings={listings}
              />
            </div>
          </div>
          <ItemActivity />
        </div>
      </div>
    </div>
  );
};

export default Nft;
