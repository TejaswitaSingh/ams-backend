const express = require("express");
const AdminController = require("../controllers/adminController");
const AdminRouter = express.Router();

//register
AdminRouter.post("/register",(req,res)=>{
    const adminRegistered = new AdminController().register(req.body);
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
    const adminLoggedIn=new AdminController().login(req.body);
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