import express from 'express';
import AdminController from '../controllers/adminController.js';
import AdminRegisterRequest from '../models/AdminRegisterRequest.js';
import AdminLoginRequest from '../models/AdminLoginRequest.js';
import adminAuth from '../middleware/adminAuth.js';
import AdminCreateRequest from '../models/AdminCreateRequest.js';
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

//create admin
AdminRouter.post("/create",(req,res)=>{
    const adminCreateRequest = new AdminCreateRequest(req.body)
    const adminCreated = new AdminController().createAdmin(adminCreateRequest);
    adminCreated.then(
        (success)=>{
            res.send(success)
        }
    ).catch(
        (error)=>{
            res.send(error)
        }
    )
})



export default AdminRouter;