import React from "react";
import { useWallet } from "./WalletContextProvider";

const WalletButton: React.FC = () => {
  const { walletAddress, connectWallet } = useWallet();

  return (
    <div className="flex items-center space-x-2">
      {walletAddress ? (
        <div className="bg-white text-red-700 px-4 py-2 rounded-full shadow-md flex items-center space-x-2">
          <img
            src="/crypto.png"
            alt="Ethereum Icon"
            className="w-6 h-6"
          />
          <span>
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-white text-red-700 px-4 py-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 flex items-center space-x-2"
        >
          <span>Connect Wallet</span>
        </button>
      )}
    </div>
  );
};

export default WalletButton;
