import dotenv from "dotenv";
import express from "express";
const server = express();
import cors from "cors";
import mongoose from "mongoose";
import AdminRouter from './routers/adminRouter.js'
import TeacherRouter from "./routers/TeacherRouter.js";
import StudentRouter from "./routers/StudentRouter.js";
import ClassRouter from "./routers/ClassRouter.js";
import SectionRouter from "./routers/SectionRouter.js";


dotenv.config();

server.use(cors(
    {
        origin:"http://localhost:5173"
    }
));

server.use(express.json());
server.use("/admin",AdminRouter)
server.use("/teacher",TeacherRouter)
server.use("/student",StudentRouter)
server.use("/class",ClassRouter)
server.use("/section",SectionRouter)

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