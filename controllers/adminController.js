const AdminDatabaseRecord = require("../models/AdminDatabaseRecord")
const AdminLoginRequest = require("../models/AdminLoginRequest")

class AdminController{
    // register
    register(adminDetails){
        console.log(adminDetails,"register form wala")
        return new Promise(
            async (resolve,reject)=>{
                try{
                    if(!adminDetails.firstName || !adminDetails.lastName || !adminDetails.email || !adminDetails.password){
                        reject(
                            {
                                msg:"Provide all information",
                                status:0
                            }
                        )
                        return
                    }
                    const adminCheck = await AdminLoginRequest.findOne({
                        $or:[
                            {email:adminDetails.email},
                            {phoneNumber:adminDetails.phoneNumber}
                        ]
                    })
                    if(adminCheck){
                        reject(
                            {
                                msg:"This email or phoneNumber already exists",
                                status:0
                            }
                        )
                    }else{
                        const  admin = new AdminDatabaseRecord({
                            firstName:adminDetails.firstName,
                            lastName:adminDetails.lastName,
                            phoneNumber:adminDetails.phoneNumber,
                            email:adminDetails.email,
                            password:adminDetails.password
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
    login(adminDetails){ 
        return new Promise(
            async (resolve,reject)=>{
                try {
                    if(!adminDetails.email || !adminDetails.password){
                        reject(
                            {
                                msg:"Provide all information",
                                status:0
                            }
                        )
                        return
                    }
                    const checkAdmin = await AdminLoginRequest.findOne({email:adminDetails.email})
                    if(checkAdmin){
                        if(adminDetails.password==checkAdmin.password){
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