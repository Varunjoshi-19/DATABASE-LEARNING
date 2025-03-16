import { Request, Response } from "express";
import { userModel, personDoc, postDoc, accountDoc } from "../model/schema"
import mongoose from "mongoose";

class DatabaseService {

    public static async createUser(req: Request, res: Response) {

        try {

            const user: any = new userModel({
                firstName: 'varun',
                lastName: "joshi",
                birthYear: 2005,
                email: 'varunjoshi1590@gmail.com',
                phoneNumber: "6283312114"
            });

            await user.save();

            console.log('this is age of user virtually calculated using birthyear ', user.age);
            console.log('this is the fullname of user using firstName and lastNmae ', user.fullName);

            res.json({ message: "User has been created", user: user, AGE: user.age, FULLNAME: user.fullName });


        }
        catch (error: any) {
            res.status(505).json({ error: `validation error ${error.message}` })
        }



    }

    public static async createPersonAndPost(req: Request, res: Response) {

        try {

            const person = new personDoc({
                username: "kyle",
                email: "user@gmail.com"
            });
            await person.save();

            await postDoc.create({
                title: "new post",
                content: "hey mongoose",
                userID: person._id
            });

            const post = await postDoc.find().populate("userID").exec();

            res.json({ message: `Post with populated user data`, data: post });

        }
        catch (error: any) {
            res.status(505).json({ error: `validation error ${error.message}` });
        }
    }

    public static async createPerson(req: Request, res: Response) {

        const { username, email } = req.body;


        try {

            const person = new personDoc({
                username: username,
                email: email
            })

            await person.save();
            res.status(202).json({ message: "person created succesfully", data: person });

        }
        catch (error: any) {
            res.status(505).json({ error: error.message })
        }

    }

    public static async createPost(req: Request, res: Response) {

        const { content, userId } = req.body;

        try {
            const post = new postDoc({
                content: content,
                userId: userId
            });
            await post.save();
            res.status(202).json({ message: "post created", data: post });
        }
        catch (error: any) {
            res.status(505).json({ error: error.message })
        }

    }

    public static async aggreatedData(req: Request, res: Response) {

        try {

            const result = await postDoc.aggregate([
                {
                    $group: {
                        _id: "$userId",
                        totalPosts: { $sum: 1 },
                        avgContentLength: { $avg: { $strLenCP: "$content" } }
                    }
                },
                {
                    $lookup: {
                        from: "peoples",
                        localField: "_id",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                { $unwind: "$user" },
                {
                    $project: {
                        _id: 0,
                        userName: "$user.username",
                        totalPosts: 1,
                        avgContentLength: 1
                    }
                }
            ]);

            res.json(result);

        }

        catch (error) {

        }



    }

    public static async createUserAccount(req: Request, res: Response) {

        const { username, amount } = req.body;

        let accountNumber: string | number = "";


        for (let i = 0; i < 11; i++) {
            const randNumber = String(Math.floor(Math.random() * 9 + 1));
            accountNumber = accountNumber.concat(randNumber);
        }

        accountNumber = Number(accountNumber);

        try {

            const newAccount = new accountDoc({
                accountNo: accountNumber,
                username: username,
                balance: amount
            })

            await newAccount.save();
            res.status(202).json({ message: "account created succesfully", account: newAccount });

        } catch (error: any) {
            res.status(505).json({ error: error.message })
        }

    }


    public static async transferMoney(req: Request, res: Response) {

        const { senderAcc, recieverAcc, transferAmount } = req.body;
        const session = await mongoose.startSession();
        session.startTransaction();
        console.log("TRANSICATION SESSION STARTED!")

        try {
            // deduct the money from the sender account 
            await accountDoc.updateOne(
                { accountNo: senderAcc },
                { $inc: { balance: -transferAmount } },
                { session }
            );

            // add the money into receivers  account 
            await accountDoc.updateOne(
                { accountNo: recieverAcc },
                { $inc: { balance: transferAmount } },
                { session }
            );

            // commit if both successed
            await session.commitTransaction();
            console.log("TRANSICATION SESSION COMMITTED!")
            res.status(202).json({ message: "Money Transfer Successful" });

        }
        catch (error: any) {
            await session.abortTransaction();
            res.status(505).json({ error: `Internal Problem Transaction Failed ${error.message}` });
        }
        finally {
            session.endSession();
            console.log("TRANSICATION SESSION ENDED!")
            return;
        }


    }


};

export default DatabaseService