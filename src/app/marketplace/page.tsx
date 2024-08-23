"use client";
import { useState, useEffect } from "react";
import { useWallet } from "../components/UI/WalletContextProvider";
import { Token } from "../../../utils/interfaces";
import NFTCard from "../components/UI/NFTCard";
const MarketPlace = () => {
  const { contract, walletAddress } = useWallet();
  const [NFTs, setNFTs] = useState<Token[]>([]);
  useEffect(() => {
    fetchSaleNFTs();
  }, [walletAddress]);
  const fetchSaleNFTs = async () => {
    try {
      if (contract) {
        let nfts = await contract.methods.fetchNFTsForSale().call();
        if (nfts.length) {
          let nftsObj: Token[] = await Promise.all(
            nfts.map(async (nft: string) => {
              let [tokenURI, tokenPrice] = await Promise.all([
                contract.methods.tokenURI(Number(nft)).call(),
                contract.methods.getSalePrice(Number(nft)).call(),
              ]);
              return {
                tokenId: nft,
                tokenURI: tokenURI,
                isForSale: true,
                price: Number(tokenPrice),
              };
            })
          );
          setNFTs(nftsObj);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="h-screen w-full flex items-center justify-center mt-10 mb-10 p-10 bg-red-100">
      {NFTs.length ? (
        <div className="flex flex-wrap -m-4">
          {NFTs.map((nft: Token, index) => (
            <div key={index} className="m-3">
              <NFTCard nft={nft}></NFTCard>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              No NFTs in the Marketplace
            </h2>
            <p className="text-gray-600">
              It looks like there are no NFTs available for sale at the moment.
              Please check back later!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default MarketPlace;
