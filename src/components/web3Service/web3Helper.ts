import Web3 from "web3";
import blockInfo from "./blockInfo";
import { log } from "console";
import config from "../../config/server/config";

export const web3Instance = async (chain: string, abi: any, address: any) => {
  try {

    let rpc;
    if (chain == "Polygon") {

      rpc = config.NODE_POLYGON_URL
    }

    const web3Instance: any = new Web3(rpc as string)
    // console.log(web3Instance, "web3Instance");
    // console.log(abi, address,"abi address")
    let contractInstance = new web3Instance.eth.Contract(abi, address)

    // log(contractInstance, "contractInstance")
    return contractInstance

  } catch (error) {
    console.log("error under web3 instance", error);
  }
}

//get events  helper function
export const getPastEvents = async (contractInstance: any,
  eventName: any,
  fromBlock: any,
  toBlock: any

) => {
  // console.log("events Function", eventName, fromBlock, toBlock);
  const event = await contractInstance.getPastEvents(eventName, {
    fromBlock: fromBlock,
    toBlock: toBlock

  })
  if (event?.length > 0) {
    return event;
  } else {
    return []
  }

}

// update blocknumber
export const updateBlockInfo = async (
  address: string,
  contractName: string,
  eventName: Array<string>,
  blockNumber: number,
  chain: string
) => {
  // console.log(address, eventName, blockNumber, chain, contractName, "addressaddressaddressaddress")
  await blockInfo.updateOne(
    {
      address: address,
      contractName: contractName,
      eventName: eventName,
      chain: chain,
    },
    { $set: { blockNumber: Number(blockNumber) + 1 } },
    { upsert: true }
  );
};
