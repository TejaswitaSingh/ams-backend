const express = require("express");
const adminRouter = express.Router();
const adminController = require("../controllers/adminController");

//register
adminRouter.post("/register",(req,res)=>{
    const adminRegistered = new adminController().regsiter(req.body);
    adminRegistered.then(
        (success)=>{
            res.send(success)
        }
    ).catch(
        (error)=>{
            res.send(error)
        }
    )
})
//register