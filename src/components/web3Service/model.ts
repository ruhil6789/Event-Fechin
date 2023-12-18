import * as bcrypt from 'bcrypt';
import { Document, Schema } from 'mongoose';
import { NextFunction } from 'express';
import * as connections from '../../config/connection/connection';

// export type AuthToken = {
//     accessToken: string,
//     kind: string,
// };

// /**
//  * @export
//  * @interface IUserModel
//  * @extends {Document}
//  */
// export interface IUserModel extends Document {
//     email: string;
//     password: string;
//     comparePassword: (password: string) => Promise<boolean>;
// }

export interface IUserModel extends Document {
    walletAddress: string,    //user wallet address
    ethAmount: {
        type: Number,
        require: true
    },
    usdtAmount: {
        type: Number,
        require: true
    },
}


/**
 * @swagger
 * components:
 *  schemas:
 *    userSchema:
 *      required:
 *        - walletAddress
 *        - link
 *        - nexaRank
 *        - countOfReferree
 *        - referrerAddress
 *        - totalStaked
 *        - claimableAmount
 * 
 *      properties:
 *        id:
 *          type: string
 *        walletAddress:
 *          type: string
 *        link:
 *          type: string
 *        nexaRank:
 *          type: number
 *        countOfReferree:
 *          type: number
 *        referrerAddress:
 *          type: string
 *        totalStaked:
 *          type: number
 *        claimableAmount:
 *          type: number
 *    Users:
 *      type: array
 *      items:
 *        $ref: '#/components/schemas/userSchema'
 */
const userSchema: Schema = new Schema({
    userAddress: {
        type: String,
        require: false,
        unique: true,
        // validate: {
        //     validator: (v: any) => v.length = 42,
        //     message: (props: any) => `${props?.value} is not a valid Wallet address`,
        // }
    },
    referrerAddress: {
        type: String,
        require: true
    },
    stage: {
        type: Number,
        // require: true
    },
    amount: {
        type: Number,
        // require: true
    },
    price: {
        type: Number,
        // require: true
    },
    timestamp: {
        type: Number,
        // require: true,
        default: null,
    },
    tokenCost: {
        type: Number,
        require: true
    },
    tokenCostDollarValue: {
        type: Number,
        require: true
    },
    withUSDT: {
        type: Boolean,
        require: true
    },
    event: {
        type: String,
        // require: true,
        enum: ["SlqqBought", "StageSet"],

    },
},
    { timestamps: true, versionKey: false }

)

export default connections.db.model<IUserModel>('user', userSchema);
