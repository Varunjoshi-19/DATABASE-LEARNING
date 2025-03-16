import { Request, Response   } from "express";
import { userModel, personDoc, postDoc } from "../model/schema"

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

    public static async aggreatedData(req: Request, res: Response) {
        try {

             const result = await postDoc.aggregate([

              { 
                $group : {
                     _id : "$userId",
                     totalPosts : {$sum : 1},
                     avgContentLength : {$avg : {$strLenCP : "$content"}}
                }
              },
               
              {
                 $lookup :{
                     from : "peoples",
                     localField : "_id",
                     foreignField : "_id",
                     as : "userInfo"
                 }
              },

              { $unwind : "$userInfo"},

              {
                 $project : { 
                    _id : 0,
                    userName : "$userInfo.name",
                    totalPosts : 1,
                    avgContentLength : 1
                 }
              }

             ])
             console.log(result);
            res.json(result);

        }
        catch (error: any) {
            res.status(505).json({ error: `validation error ${error.message}` });
        }
    }


    public static async getPeoples(req: Request, res: Response)  {
         
    }
};

export default DatabaseService