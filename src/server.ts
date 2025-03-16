import express from "express";
import mongoose from "mongoose";
import databaseRoute from "./routes/database"
const app = express();
const port = 5000;



app.use(express.json());


app.use('/database' , databaseRoute);







app.listen(port, async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/TESTING");
    console.log("mongodb connected and server running");
  } catch (error) {
    console.log(error);
  }
});
