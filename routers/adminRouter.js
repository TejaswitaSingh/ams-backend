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
//create admin

//read admin
AdminRouter.get("/all",(req,res)=>{
    const adminRead = new AdminController().getAdmins();
    adminRead.then(
        (success)=>{
            res.send(success)
        }
    ).catch(
        (error)=>{
            res.send(error)
        }
    )
})
//read admin

// update admin
AdminRouter.put("/:id",(req,res)=>{
    const adminUpdate = new AdminController().updateAdmin(req.params.id,req.body);
    adminUpdate.then(
        (success)=>{
            res.send(success)
        }
    ).catch(
        (error)=>{
            res.send(error)
        }
    )
})
// update admin

// delete admin
AdminRouter.delete("/:id",(req,res)=>{
    const adminDelete = new AdminController().deleteAdmin(req.params.id);
    adminDelete.then(
        (success)=>{
            res.send(success)
        }
    ).catch(
        (error)=>{
            res.send(error)
        }
    )
})
// delete admin

export default AdminRouter;