import * as mongoose from "mongoose";
import * as connections from '../../config/connection/connection';

interface IBlockModel {
    chain: string,
    address: string,
    contractName: string,
    eventName: [],
    blockNumber: number,
    count: number

}
const BlockInfo = new mongoose.Schema(
    {
        userAddress: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: false,
        },
        // block: {
        //     type: Number,
        //     required: false,
        // },
        chain: { type: String, require: true },
        contractName: { type: String, require: true },
        eventName: { type: Array, require: true },
        blockNumber: { type: Number },
        count: { type: Number, default: 0 },
        amount: {
            type: Number,
            require: true
        },
        tokenCost: {
            type: Number,
            require: true
        },
        timestamp: {
            type: Number,
            require: true,
            default: null,
        },
        transactionHash: {
            type: String,
            require: false,
        },

    },
    { timestamps: true, versionKey: false }
);


export default connections.db.model<IBlockModel>('eventBlocks', BlockInfo);
