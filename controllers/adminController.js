const adminPrimaryModel = require("../models/adminPrimaryModel")
const adminLoginModel = require("../models/adminLoginModel")

class adminController{
    // register
    register(adminDetails){
        return new Promise(
            async (resolve,reject)=>{
                try{
                    if(!adminDetails.firstName || !adminDetails.lastName || !adminDetails.phoneNumber || !adminDetails.email || !adminDetails.password){
                        reject(
                            {
                                msg:"Provide all information",
                                status:0
                            }
                        )
                        return
                    }
                    const adminCheck = await adminPrimaryModel.findOne({
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
                        const  admin = new adminPrimaryModel({
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
                                        status:1
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
}
//register