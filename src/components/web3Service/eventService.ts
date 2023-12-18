import Web3 from "web3";
import { getPastEvents, updateBlockInfo, web3Instance } from "./web3Helper";
import { number } from "joi";
import blockInfo from "./blockInfo";
import { log } from "console";
import config from "../../config/server/config";
import stakeEvents from "./contractEvent"

// 0xf2250d188bf874d139b63Bf628aece4A0a805a54
export default class web3Service {
    //  declaring variables 
    contractInstance: any;
    web3Instance: any;
    dynamicInstance: any;

    //fetching events from the smart contract
    public getWeb3Events = async (contractAddress: string,
        abi: any,
        eventName: any,
        chain: string,
        contractName: string
    ): Promise<void> => {

        try {
            // console.log("addressssssssssss", contractAddress, eventName, chain);

            // creating instance using contract abi and address
            const instance = await web3Instance(chain, abi, contractAddress);
            // console.log(instance, "instanceeeee");

            let webInstance: any;
            let startBlock: any
            if (chain == "Polygon") {
                // console.log(process.env.NODE_POLYGON_URL, "process.env.NODE_POLYGON_URL")
                webInstance = new Web3(process.env.NODE_POLYGON_URL as string);
                startBlock = config.polygonFromBlock;

                // console.log(webInstance, startBlock, "startBlock");
            }

            //Block batch size  & start and end block calculation begins
            const eventBatchSize = Number(process.env.eventBatchSize);
            const currentBlock = await webInstance?.eth.getBlockNumber()

            log(currentBlock, eventBatchSize, "currentBlockkkkkkk")
            //getting block info from database
            const block_info = await blockInfo.findOne({
                address: contractAddress,
                contractName: contractName,
                chain: chain,
            });


            // // if block info exist then assigning start block to block number from database
            if (block_info) {
                startBlock = block_info.blockNumber;
            }
            let endBlock: any;

            // if start block plus batch size is greater than current block then it will set end block to current block
            if (Number(startBlock) + Number(eventBatchSize) > Number(currentBlock)) {
                endBlock = await stakeEvents.removeNFromBigInt(currentBlock)
            } else {
                endBlock = Number(startBlock) + Number(eventBatchSize);
            }
            console.log("currentBlock", currentBlock, startBlock, endBlock);

            // get events
            const event = await getPastEvents(
                instance,
                eventName,
                startBlock,
                endBlock
            );
            console.log("events@@@@@@@@@@@@2", event)
            // update block number in database
            await updateBlockInfo(
                contractAddress,
                contractName,
                [eventName],
                endBlock,
                chain
            );
            return event
        } catch (error) {
            console.log("getWeb3Events error", error);
        }
    }

}