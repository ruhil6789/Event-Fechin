import web3Service from "./eventService";
import * as abi from "../abis/abi.json";
import { log } from "console";
import userSchema from "../web3Service/model";
import blockInfo from "./blockInfo";

// 0xf2250d188bf874d139b63Bf628aece4A0a805a54
class stakeEvents {

    public removeNFromBigInt = async (exponential: any) => {
        // if (typeof bigIntValue !== 'bigint') {
        //     throw new Error('Input must be a BigInt');
        // }

        // const stringValue: any = bigIntValue.toString();
        // const stringWithoutN = stringValue.replace('n', '');

        // return stringWithoutN;
        if (exponential) {
            let decimal = exponential.toString().toLowerCase();
            if (decimal.includes('e+')) {
                const exponentialSplitted = decimal.split('e+');
                let postfix = '';
                for (
                    let i = 0;
                    i <
                    +exponentialSplitted[1] -
                    (exponentialSplitted[0].includes('.') ? exponentialSplitted[0].split('.')[1].length : 0);
                    i++
                ) {
                    postfix += '0';
                }
                decimal = exponentialSplitted[0].replace('.', '') + postfix;
            }
            if (decimal.toLowerCase().includes('e-')) {
                const exponentialSplitted = decimal.split('e-');
                let prefix = '0.';
                for (let i = 0; i < +exponentialSplitted[1] - 1; i++) {
                    prefix += '0';
                }
                decimal = prefix + exponentialSplitted[0].replace('.', '');
            }

            return decimal;
        }
    }
    public getStakeEvents = async (eventName: any, address: any, chain: any) => {
        try {

            const contractName = "SellSlqqEthereum";
            const web3_service = new web3Service();
            log("web3_service ", eventName, address, chain)

            // log(contractName, abi, eventName, chain, "chainchainchain")
            const result: any = await web3_service.getWeb3Events(process.env.CONTRACT_ADDRESS, abi, eventName, chain, contractName)

            console.log(result, "fetched===========>>>>>>>>>>>>>>");


            // return result
            await result?.map(async (eventData: any) => {
                // console.log(eventData, "eventData");
                // console.log(eventData?.returnValues?.stage, "eventData?.returnValues?.admin ")
                console.log("event@@@@@@++++++++++++++", eventData?.returnValues)
                // const staked: any = await userSchema.findOne({ stage: eventData?.returnValues?.stage })
                // console.log("STAKED@@", staked)

                // if (staked != null) {

                //     const updateStakeInfo = await userSchema.findByIdAndUpdate(staked?.id, {
                //         $set: {

                //             stage: eventData?.returnValues?.stage,

                //             amount: await this.removeNFromBigInt(eventData?.returnValues?.amount),
                //             price: Number(await this.removeNFromBigInt(eventData?.returnValues?.price)),
                //         }
                //     })

                //     // const create = userSchema.insertMany(updateStakeInfo)

                //     log("updateStakeInfo", updateStakeInfo)
                //     // log("create", create)
                // } else {
                console.log("HEREEEEEEE", eventData?.returnValues)
                console.log(await this.removeNFromBigInt(eventData?.returnValues?.tokenCost), eventData?.returnValues?.user, "await eventData?.returnValues?.tokenCost")


                const create = await userSchema.create({
                    userAddress: eventData?.returnValues?.user.toLowerCase(),
                    referrerAddress: eventData?.returnValues?.referrer.toLowerCase(),
                    tokenCost: await this.removeNFromBigInt(eventData?.returnValues?.tokenCost),
                    tokenCostDollarValue: await this.removeNFromBigInt(eventData?.returnValues?.tokenCostDollarValue),
                    withUSDT: eventData?.returnValues.withUSDT,
                    stage: await this.removeNFromBigInt(eventData?.returnValues?.stage),
                    amount: await this.removeNFromBigInt(eventData?.returnValues?.maxAmount,),
                    price: await this.removeNFromBigInt(eventData?.returnValues?.price),
                })
                log({ create })
                console.log(eventData?.event, "eventData?.eventeventData?.event")

                const txHistory: any = await blockInfo.create({
                    userAddress: eventData.returnValues?.user.toLowerCase(),
                    amount: await this.removeNFromBigInt(eventData.returnValues?.maxAmount),
                    event: eventData?.event,
                    timestamp: await this.removeNFromBigInt(eventData.returnValues?.maxDuration),
                    transactionHash: eventData?.transactionHash
                })

                console.log(txHistory, "txHistory")

                // const create = await userSchema.create({
                //     stage: Number(await this.removeNFromBigInt(eventData?.returnValues?.stage)),
                //     amount: Number(await this.removeNFromBigInt(eventData.returnValues?.maxAmount)),
                //     price: Number(await this.removeNFromBigInt(eventData?.returnValues?.price)),
                // })
                log({ create })
                // }
            })
        } catch (error) {
            log(error)
        }

    }



    public getEvents = async (eventName: any, address: any, chain: any) => {

        try {
            const contractName = "SellSlqqEthereum";
            const web3_service = new web3Service();
            log("web3_service ", eventName, address, chain)

            // log(contractName, abi, eventName, chain, "chainchainchain"  )
            // "StageSet", "SlqqBought"
            const result: any = await web3_service.getWeb3Events(process.env.CONTRACT_ADDRESS, abi, eventName, chain, contractName)

            // console.log(result, "fetched===========>>>>>>>>>>>>>>");

            const Staked: any = result.filter((data: any) => {
                return data.event == "SlqqBought" || data.event == "StageSet"
            })
            console.log(Staked.length, "=======>>>>>>>>>>>1111111111111111111111111")
            if (Staked.length) {
                console.log("here staked.length...", Staked.length);

                for (const i of Staked) {
                    // console.log(i, "here is for of loop....");
                    console.log(i.returnValues?.user?.toLowerCase(), "return value");


                    const userExist: any = await userSchema.find({ userAddress: i.returnValues?.user?.toLowerCase() })

                    console.log(userExist.length, "....")

                    if (userExist.length > 0) {
                        const updateUserInfo: any =
                            await userSchema.findOneAndUpdate({ userAddress: i.returnValues?.user?.toLowerCase() }, {
                                $set: {
                                    walletAddress: i.returnValues?.user.toLowerCase(),
                                    referrerAddress: i.returnValues?.referrer.toLowerCase(),
                                    tokenCost: await this.removeNFromBigInt(i?.returnValues?.tokenCost),
                                    tokenCostDollarValue: await this.removeNFromBigInt(i?.returnValues?.tokenCostDollarValue),
                                    withUSDT: i?.returnValues.withUSDT,
                                    stage: await this.removeNFromBigInt(i?.returnValues?.stage),
                                    amount: await this.removeNFromBigInt(i?.returnValues?.maxAmount,),
                                    price: await this.removeNFromBigInt(i?.returnValues?.price),
                                }
                            })
                        // console.log(updateUserInfo, "updateUserInfo");
                    } else {

                        const create = await userSchema.create({
                            userAddress: i?.returnValues?.user.toLowerCase(),
                            referrerAddress: i?.returnValues?.referrer.toLowerCase(),
                            tokenCost: await this.removeNFromBigInt(i?.returnValues?.tokenCost),
                            tokenCostDollarValue: await this.removeNFromBigInt(i?.returnValues?.tokenCostDollarValue),
                            withUSDT: i?.returnValues.withUSDT,
                            stage: await this.removeNFromBigInt(i?.returnValues?.stage),
                            amount: await this.removeNFromBigInt(i?.returnValues?.maxAmount,),
                            price: await this.removeNFromBigInt(i?.returnValues?.price)

                        });
                        await create.save();
                        console.log("createdddd....");
                    }

                    const txHistory: any = await blockInfo.create({
                        userAddress: i?.returnValues?.user.toLowerCase(),
                        amount: await this.removeNFromBigInt(i?.returnValues?.maxAmount),
                        event: i?.event,
                        // timestamp: await this.removeNFromBigInt(i?.returnValues?.maxDuration),
                        timestamp: new Date().toISOString().slice(0, -1),
                        transactionHash: i?.transactionHash
                    })
                    // console.log(txHistory, "txHistory.....");
                }

            }
        } catch (error) {
            console.log(error);

        }
    }

}

export default new stakeEvents();
