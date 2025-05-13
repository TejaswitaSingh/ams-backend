const AdminDatabaseRecord = require("../models/AdminDatabaseRecord");
const AdminRegisterRequest = require("../models/AdminRegisterRequest");
const AdminLoginRequest = require("../models/AdminLoginRequest");

class AdminController{
    // register
    register(adminRegisterRequest){
        if (!(adminRegisterRequest instanceof AdminRegisterRequest)) {
        throw new Error("Invalid input: Expected an instance of AdminRegisterRequest");
    }
    if(!adminRegisterRequest.validate()){
        return Promise.reject({
            msg:"All fields are required",
            status:0
        })
    }
    
    return new Promise(
            async (resolve,reject)=>{
                try{
                    const adminCheck = await AdminDatabaseRecord.findOne({
                            email:adminRegisterRequest.email,  
                    })
                    if(adminCheck){
                        reject(
                            {
                                msg:"This email already exists",
                                status:0
                            }
                        )
                    }else{
                        const  admin = new AdminDatabaseRecord({
                            firstName:adminRegisterRequest.firstName,
                            lastName:adminRegisterRequest.lastName,
                            email:adminRegisterRequest.email,
                            password:adminRegisterRequest.password
                        })
                        admin.save().then(
                            ()=>{
                                resolve(
                                    {
                                        msg:"Admin created",
                                        status:1,
                                    }
                                )
                            }
                        ).catch(
                            ()=>{
                                reject(
                                    {
                                        msg:"Unable to create admin",
                                        status:0
                                    }
                                )
                            }
                        )
                    }
                }catch(error){
                    reject(
                        {
                            msg:"Internal server error",
                            status:0
                        }
                    )
                }
            }
        )
    }
    
    //register

    // login
    login(adminLoginRequest){ 
        if (!(adminLoginRequest instanceof AdminLoginRequest)) {
        throw new Error("Invalid input: Expected an instance of AdminLoginRequest");
    } 
        if (!adminLoginRequest.validate()) {
        return Promise.reject({
        msg: "Email and password are required",
        status: 0,
            });
        }

        return new Promise(
            async (resolve,reject)=>{
                try {
                    const checkAdmin = await AdminDatabaseRecord.findOne({email:adminLoginRequest.email})
                    if(checkAdmin){
                        if(adminLoginRequest.password==checkAdmin.password){
                            resolve(
                                {
                                    msg:"Login successfull",
                                    status:1,
                                    checkAdmin:{...checkAdmin.toJSON()}
                                }
                            )
                        }else{
                            reject(
                                {
                                    msg:"Password is incorrect",
                                    status:0
                                }
                            )
                        }
                    }else{
                        reject(
                            {
                                msg:"Account does not exist",
                                status:0
                            }
                        )
                    }
                } catch (error) {
                    reject(
                        {
                            msg:"Internal server error",
                            status:0
                        }
                    )
                }
            }
        )
    }
    // login
}

module.exports = AdminController