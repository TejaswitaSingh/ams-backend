require('dotenv').config()
const express = require("express");
const server = express();
const cors = require("cors");
const mongoose= require("mongoose");
const AdminRouter = require('./routers/adminRouter');


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