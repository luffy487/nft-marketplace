"use client";
import { useState, useEffect } from "react";
import NFTCard from "../components/UI/NFTCard";
import { useWallet } from "../components/UI/WalletContextProvider";
import { Token } from "../../../utils/interfaces";

const MyNFTsPage = () => {
  const { walletAddress, contract } = useWallet();
  const [NFTs, setNFTs] = useState<Token[]>([]);
  useEffect(() => {
    fetchMyNFTs();
  }, [walletAddress]);
  const fetchMyNFTs = async () => {
    try {
      if (walletAddress && contract) {
        setNFTs([]);
        let [nfts, nftsForSale] = await Promise.all([
          contract.methods.fetchUserNFTs(walletAddress).call(),
          contract.methods.fetchNFTsForSale().call(),
        ]);
        if (nfts.length) {
          let nftsObj: Token[] = await Promise.all(
            nfts.map(async (nft: number) => {
              let isForSale = false,
                price = 0;
              if (
                nftsForSale.length &&
                nftsForSale
                  .map((nft: number) => Number(nft))
                  .includes(Number(nft))
              ) {
                isForSale = true;
                price = await contract.methods.getSalePrice(Number(nft)).call();
              }
              let tokenURI = await contract.methods
                .tokenURI(Number(nft))
                .call();
              return {
                tokenId: nft,
                tokenURI: tokenURI,
                isForSale: isForSale,
                price: price,
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
      <div className="flex flex-wrap -m-4">
        {NFTs.length ? (
          NFTs.map((nft: Token, index) => (
            <div key={index} className="m-3">
              <NFTCard nft={nft} />
            </div>
          ))
        ) : (
          <div className="w-full text-center py-12">
            <span className="text-xl font-semibold text-gray-700">
              You have No NFTs in your account
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNFTsPage;
