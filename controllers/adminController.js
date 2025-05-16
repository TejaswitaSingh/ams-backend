import AdminDatabaseRecord from "../models/AdminDatabaseRecord.js"
import AdminLoginRequest from "../models/AdminLoginRequest.js";
import AdminRegisterRequest from "../models/AdminRegisterRequest.js";
import { generateToken, verifyToken } from "../utils/Token.js";
import AdminCreateRequest from "../models/AdminCreateRequest.js";

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
    console.log(adminRegisterRequest)
    
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
                            const token = generateToken(checkAdmin.toJSON());
                            console.log(token)
                            resolve(
                                {
                                    msg:"Login successfull",
                                    status:1,
                                    checkAdmin:{...checkAdmin.toJSON()},
                                    token
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

    // create
    createAdmin(adminCreateRequest){
        if (!(adminCreateRequest instanceof AdminCreateRequest)) {
        throw new Error("Invalid input: Expected an instance of AdminCreateRequest");
    }

    if (!adminCreateRequest.validate()) {
        return Promise.reject({
            msg: "All fields are required",
            status: 0
        });
    }
        return new Promise(
        async (resolve,reject)=>{
            try {
                const adminCheck = await AdminDatabaseRecord.findOne({ email: adminCreateRequest.email });
            if (adminCheck) {
                return reject({
                    msg: "This email already exists",
                    status: 0
                });
            }

            // Create a new admin
            const admin = new AdminDatabaseRecord({
                firstName: adminCreateRequest.firstName,
                lastName: adminCreateRequest.lastName,
                email: adminCreateRequest.email,
                password: adminCreateRequest.password, 
                phoneNumber: adminCreateRequest.phoneNumber,
                role: adminCreateRequest.role // Assign the role, e.g., "admin"
            });

            // Save the admin to the database
            await admin.save();
            resolve({
                msg: "Admin created successfully",
                status: 1,
            });
            } catch (error) {
                console.log(error)
                reject(
                    {
                        msg:"Internal server error",
                        status:0
                    }
                )
            }
        })
    }
    // create

}


export default AdminController