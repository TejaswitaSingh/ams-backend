import dotenv from "dotenv";
import express from "express";
const server = express();
import cors from "cors";
import mongoose from "mongoose";
import AdminRouter from './routers/adminRouter.js'
dotenv.config();

server.use(cors(
    {
        origin:"http://localhost:5173"
    }
));

server.use(express.json());
server.use("/admin",AdminRouter)

mongoose.connect(process.env.MONGODB_URL,{
    dbName:"AMS"
}).then(
    ()=>{
        server.listen(
            5000,
            ()=>{
                console.log("server is running")
            }
        )
    }
).catch(
    (error)=>{
        console.log("unable to connect db", error)
    }
);