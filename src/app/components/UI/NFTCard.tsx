"use client";
import React, { useEffect, useState } from "react";
import { downloadFile } from "../../../../utils/helper";
import { Token, NFTMetadata, NFTsProps } from "../../../../utils/interfaces";
import { useWallet } from "./WalletContextProvider";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


const NFTCard: React.FC<NFTsProps> = ({ nft }) => {
  const router = useRouter();
  const { walletAddress, contract } = useWallet();
  const [nftData, setNftData] = useState<NFTMetadata>();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(0);
  const [list, setList] = useState<boolean>(false);

  useEffect(() => {
    if (nft) {
      setNFTsObj();
    }
  }, [nft]);

  const setNFTsObj = async () => {
    try {
      if (walletAddress && contract) {
        let tokenOwner = await contract.methods
          .ownerOf(Number(nft.tokenId))
          .call();
        if (
          tokenOwner.toString().toLowerCase() ===
          walletAddress.toString().toLowerCase()
        ) {
          setIsOwner(true);
        }
        let metaDataURL: any = await downloadFile(nft.tokenURI);
        let response = await fetch(metaDataURL);
        let metaData: NFTMetadata = await response.json();
        let imageURL: any = await downloadFile(metaData.image);
        setNftData({
          name: metaData.name,
          description: metaData.description,
          image: imageURL,
        });
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };
  const buyNFT = async () => {
    try {
      await contract.methods
        .buyToken(Number(nft.tokenId))
        .send({ from: walletAddress, value: Number(nft.price) });
      router.push("/my-nfts");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };
  const listForSale = async () => {
    try {
      if (!price) {
        toast.error("Please enter the price for the NFT");
        return;
      }
      await contract.methods
        .listTokenForSale(Number(nft.tokenId), Number(price))
        .send({ from: walletAddress });
      toast.success("Successfully listed for sale");
      router.push("/marketplace");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };
  const removeFromSale = async () => {
    try {
      await contract.methods
        .cancelSale(Number(nft.tokenId))
        .send({ from: walletAddress });
      toast.success("Successfully removed from sale");
      router.push("/my-nfts");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-lg w-44">
      {nftData && (
        <>
          <div
            className="relative bg-cover bg-center rounded-lg overflow-hidden w-32 h-48 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            style={{ backgroundImage: `url(${nftData.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-2 transition-opacity duration-300 hover:bg-gradient-to-t hover:from-black hover:via-black/70 hover:to-transparent">
              <div className="text-white">
                <h2 className="text-sm font-bold mb-1">{nftData.name}</h2>
                <p className="text-xs">{nftData.description}</p>
                {nft.isForSale && (
                  <h3 className="text-sm font-bold mb-1 text-red-700">
                    {Number(nft.price) + " wei"}
                  </h3>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            {isOwner && !nft.isForSale && (
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded-full shadow-md hover:bg-blue-700 transition-colors duration-300"
                onClick={() => setList(true)}
              >
                List for Sale
              </button>
            )}
            {isOwner && nft.isForSale && (
              <button
                className="bg-red-600 text-white px-3 py-1 rounded-full shadow-md hover:bg-red-700 transition-colors duration-300"
                onClick={removeFromSale}
              >
                Take Down
              </button>
            )}
            {!isOwner && nft.isForSale && (
              <button
                className="bg-green-600 text-white px-3 py-1 rounded-full shadow-md hover:bg-green-700 transition-colors duration-300"
                onClick={buyNFT}
              >
                Buy NFT
              </button>
            )}
          </div>
        </>
      )}
      {list && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-72">
            <h2 className="text-lg font-bold mb-4">List NFT for Sale</h2>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price in wei
            </label>
            <input
              type="number"
              value={price}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setPrice(Number(event.target.value))
              }
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            <div className="mt-4 flex space-x-2">
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300"
                onClick={() => setList(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300"
                onClick={listForSale}
              >
                List NFT for Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTCard;
