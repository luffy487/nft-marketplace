"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { fetchContract } from "../../../../utils/helper";

import { WalletContextProps } from "../../../../utils/interfaces";

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [contract, setContract] = useState<any>();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        await checkIsOwner(accounts[0]);
      } catch (error) {
        console.error("Failed to connect to MetaMask:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };
  const checkIsOwner = async (address: string) => {
    let contract = fetchContract();
    setContract(contract);
    let owner = await contract.methods.owner().call();
    if (owner.toString().toLowerCase() == address.toString().toLowerCase()) {
      setIsOwner(true);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setWalletAddress(accounts[0] || "");
        checkIsOwner(accounts[0]);
      });
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{ walletAddress, connectWallet, isOwner, contract }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextProps => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
