import { download, upload } from "thirdweb/storage";
import { createThirdwebClient } from "thirdweb";
import Web3 from "web3";
import { CONTRACT_ADDRESS, CONTRACT_ABI, THIRD_WEB_CLIENT } from "./constants";


const client = createThirdwebClient({
  clientId: THIRD_WEB_CLIENT,
});

const uploadFile = async (name: string, description: string, file: Buffer) => {
  try {
    const imageURL = await upload({
      client,
      files: [file],
    });
    const metaData = {
      name: name,
      description: description,
      image: imageURL,
    };
    const metaDataURL = await upload({
      client,
      files: [
        new File([JSON.stringify(metaData, null, 2)], "metaData.json", {
          type: "application/json",
        }),
      ],
    });
    return metaDataURL;
  } catch (err) {
    return err;
  }
};
const downloadFile = async (uri: string) => {
  try {
    const downloadURL = await download({
      client,
      uri,
    });
    return downloadURL.url;
  } catch (err) {
    return err;
  }
};

const fetchWeb3 = () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    return web3;
  }
};

const fetchContract = () => {
  const web3: any = fetchWeb3();
  const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  return contract;
};

export { uploadFile, downloadFile, fetchContract, fetchWeb3 };
