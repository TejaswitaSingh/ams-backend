const express = require("express");
const AdminController = require("../controllers/adminController");
const AdminRegisterRequest = require("../models/AdminRegisterRequest");
const AdminLoginRequest = require("../models/AdminLoginRequest");
const AdminRouter = express.Router();



//register
AdminRouter.post("/register",(req,res)=>{
    const adminRegisterRequest = new AdminRegisterRequest(req.body)
    const adminRegistered = new AdminController().register(adminRegisterRequest);
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

// login
AdminRouter.post("/login",(req,res)=>{
    const adminLoginRequest = new AdminLoginRequest(req.body)
    const adminLoggedIn=new AdminController().login(adminLoginRequest);
    adminLoggedIn.then(
        (success)=>{
            res.send(success)
        }
    ).catch(
        (error)=>{
            res.send(error)
        }
    )
})
// login

module.exports = AdminRouter;