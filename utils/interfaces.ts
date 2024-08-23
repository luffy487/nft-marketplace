export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
}
export interface Token {
  tokenId: number;
  tokenURI: string;
  isForSale: boolean;
  price: number;
}
export interface NFTsProps {
  nft: Token;
}
export interface WalletContextProps {
    walletAddress: string;
    connectWallet: () => void;
    isOwner: boolean;
    contract: any;
  }
