"use client";
import React from "react";
import { useRouter } from "next/navigation";
import WalletButton from "../UI/WalletButton";
import Link from "next/link";
import { useWallet } from "../UI/WalletContextProvider";
import Image from "next/image";

const Topbar: React.FC = () => {
  const router = useRouter();
  const { isOwner } = useWallet();

  return (
    <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white py-4 px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center fixed top-0 left-0 w-full z-50 shadow-md">
      <div
        className="flex items-center space-x-2 cursor-pointer mb-2 sm:mb-0"
        onClick={() => router.push("/")}
      >
        <Image
          src="/jollyroger.png"
          alt="Jolly Roger"
          width={48}
          height={48}
          className="w-10 h-10 sm:w-12 sm:h-12"
        />
        <span className="text-xl sm:text-2xl font-semibold">
          One Piece NFTs
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
        <Link
          href="/marketplace"
          className="font-semibold hover:underline text-center"
        >
          Marketplace
        </Link>
        <Link
          href="/my-nfts"
          className="font-semibold hover:underline text-center"
        >
          My NFTs
        </Link>
        {isOwner && (
          <Link
            href="/mint"
            className="font-semibold hover:underline text-center"
          >
            Mint NFTs
          </Link>
        )}
        <WalletButton />
      </div>
    </div>
  );
};

export default Topbar;
