"use client";
import { useEffect, useState } from "react";
import { useWallet } from "./WalletContextProvider";
import { uploadFile } from "../../../../utils/helper";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const MintNFT = () => {
  const router = useRouter();
  const { walletAddress, isOwner, contract } = useWallet();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<Buffer | null>(null);

  const handleFileInput = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const arrayBuffer = await selectedFile.arrayBuffer();
      setFile(Buffer.from(arrayBuffer));
    }
  };

  const mintNFT = async () => {
    if (!name) {
      toast.error("Please enter the name of the NFT");
      return;
    }
    if (!description) {
      toast.error("Please enter the description of the NFT");
      return;
    }
    if (!file) {
      toast.error("Please upload an image for the NFT");
      return;
    }
    try {
      let tokenURL = await uploadFile(name, description, file);
      await contract.methods.mintNFT(tokenURL).send({ from: walletAddress });
      toast.success("NFT successfully minted!");
      router.push("/my-nfts");
    } catch (err: any) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100 p-6 mt-5 bg-red-100">
      {isOwner ? (
        <div className="w-full max-w-7xl bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-semibold text-gray-900 mb-8">
            Mint a New NFT
          </h1>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Enter Name of the NFT
            </label>
            <input
              className="w-full p-3 bg-gray-100 text-gray-900 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setName(event.target.value)
              }
              placeholder="My Unique NFT"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Enter Description of the NFT
            </label>
            <input
              className="w-full p-3 bg-gray-100 text-gray-900 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              value={description}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setDescription(event.target.value)
              }
              placeholder="A beautiful piece of digital art"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Upload NFT Image
            </label>
            <input
              className="w-full p-3 bg-gray-100 text-gray-900 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="file"
              onChange={handleFileInput}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              className="py-3 px-4 bg-gray-500 text-white font-medium rounded-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50"
              onClick={() => router.push("/")}
            >
              Cancel
            </button>
            <button
              className="py-3 px-4 bg-red-700 text-white font-medium rounded-full shadow-sm hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50"
              onClick={mintNFT}
            >
              Store & Mint
            </button>
          </div>
        </div>
      ) : (
        <div className="text-red-500 font-semibold">
          You do not have permission to mint NFTs
        </div>
      )}
    </div>
  );
};

export default MintNFT;
