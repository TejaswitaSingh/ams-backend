import AdminDatabaseRecord from "../models/Admins/MainDatabase/AdminDatabaseRecord.js"
import AdminLoginRequest from "../models/Admins/AdminLoginRequest.js";
import AdminRegisterRequest from "../models/Admins/AdminRegisterRequest.js";
import { generateToken, verifyToken } from "../utils/Token.js";
import AdminCreateRequest from "../models/Admins/AdminCreateRequest.js";
import AdminUpdateRequest from "../models/Admins/AdminUpdateRequest.js";
import AdminDeleteRequest from "../models/Admins/AdminDeleteRequest.js";

class AdminController {
    // register
    register(adminRegisterRequest) {
        if (!(adminRegisterRequest instanceof AdminRegisterRequest)) {
            throw new Error("Invalid input: Expected an instance of AdminRegisterRequest");
        }
        if (!adminRegisterRequest.validate()) {
            return Promise.reject({
                msg: "All fields are required",
                status: 0
            });
        }

        return new Promise(async (resolve, reject) => {
            try {
                const adminCheck = await AdminDatabaseRecord.findOne({
                    email: adminRegisterRequest.email,
                });
                if (adminCheck) {
                    reject({
                        msg: "This email already exists",
                        status: 0
                    });
                } else {
                    const admin = new AdminDatabaseRecord({
                        firstName: adminRegisterRequest.firstName,
                        lastName: adminRegisterRequest.lastName,
                        email: adminRegisterRequest.email,
                        password: adminRegisterRequest.password,
                        phoneNumber: adminRegisterRequest.phoneNumber,
                        username: adminRegisterRequest.username,
                        profilePicture: adminRegisterRequest.profilePicture,
                        userType: adminRegisterRequest.userType || "admin",
                        isEmailVerified: adminRegisterRequest.isEmailVerified || false,
                        status: adminRegisterRequest.status !== undefined ? adminRegisterRequest.status : true
                    });

                    await admin.save();
                    resolve({
                        msg: "Admin created successfully",
                        status: 1,
                        data: admin
                    });
                }
            } catch (error) {
                console.error(error);
                reject({
                    msg: "Internal server error",
                    status: 0
                });
            }
        });
    }

    // login
    login(adminLoginRequest) {
        if (!(adminLoginRequest instanceof AdminLoginRequest)) {
            throw new Error("Invalid input: Expected an instance of AdminLoginRequest");
        }
        if (!adminLoginRequest.validate()) {
            return Promise.reject({
                msg: "Email and password are required",
                status: 0,
            });
        }

        return new Promise(async (resolve, reject) => {
            try {
                const checkAdmin = await AdminDatabaseRecord.findOne({ email: adminLoginRequest.email });
                if (checkAdmin) {
                    if (adminLoginRequest.password === checkAdmin.password) {
                        const token = generateToken(checkAdmin.toJSON());
                        resolve({
                            msg: "Login successful",
                            status: 1,
                            data: { ...checkAdmin.toJSON() },
                            token
                        });
                    } else {
                        reject({
                            msg: "Password is incorrect",
                            status: 0
                        });
                    }
                } else {
                    reject({
                        msg: "Account does not exist",
                        status: 0
                    });
                }
            } catch (error) {
                console.error(error);
                reject({
                    msg: "Internal server error",
                    status: 0
                });
            }
        });
    }

    // create
    createAdmin(adminCreateRequest) {
        if (!(adminCreateRequest instanceof AdminCreateRequest)) {
            throw new Error("Invalid input: Expected an instance of AdminCreateRequest");
        }

        if (!adminCreateRequest.validate()) {
            return Promise.reject({
                msg: "All fields are required",
                status: 0
            });
        }

        return new Promise(async (resolve, reject) => {
            try {
                const adminCheck = await AdminDatabaseRecord.findOne({ email: adminCreateRequest.email });
                if (adminCheck) {
                    return reject({
                        msg: "This email already exists",
                        status: 0
                    });
                }

                const admin = new AdminDatabaseRecord({
                    firstName: adminCreateRequest.firstName,
                    lastName: adminCreateRequest.lastName,
                    email: adminCreateRequest.email,
                    password: adminCreateRequest.password,
                    phoneNumber: adminCreateRequest.phoneNumber,
                    username: adminCreateRequest.username,
                    profilePicture: adminCreateRequest.profilePicture,
                    userType: adminCreateRequest.userType || "admin",
                    isEmailVerified: adminCreateRequest.isEmailVerified || false,
                    status: adminCreateRequest.status !== undefined ? adminCreateRequest.status : true
                });

                await admin.save();
                resolve({
                    msg: "Admin created successfully",
                    status: 1,
                    data: admin
                });
            } catch (error) {
                console.error(error);
                reject({
                    msg: "Internal server error",
                    status: 0
                });
            }
        });
    }

    // read with pagination and filtering
    getAdmins({ page = 1, limit = 10, sort, filters = {} } = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                // Build query based on filters
                const query = {};
                
                if (filters.status) {
                    query.status = filters.status === 'active';
                }
                if (filters.userType) {
                    query.userType = filters.userType;
                }
                if (filters.search) {
                    query.$or = [
                        { firstName: { $regex: filters.search, $options: 'i' } },
                        { lastName: { $regex: filters.search, $options: 'i' } },
                        { email: { $regex: filters.search, $options: 'i' } }
                    ];
                }

                // Calculate skip value for pagination
                const skip = (page - 1) * limit;

                // Get total count for pagination
                const totalCount = await AdminDatabaseRecord.countDocuments(query);

                // Build sort object
                let sortObj = {};
                if (sort) {
                    sort.split(',').forEach(sortItem => {
                        const [field, order] = sortItem.split(':');
                        sortObj[field] = order === 'desc' ? -1 : 1;
                    });
                } else {
                    sortObj = { createdAt: -1 }; // Default sort by newest first
                }

                const admins = await AdminDatabaseRecord.find(query)
                    .sort(sortObj)
                    .skip(skip)
                    .limit(limit)
                    .lean();

                resolve({
                    msg: "Admin list fetched successfully",
                    status: 1,
                    data: admins,
                    pagination: {
                        total: totalCount,
                        page,
                        pageSize: limit,
                        totalPages: Math.ceil(totalCount / limit)
                    }
                });
            } catch (error) {
                console.error(error);
                reject({
                    msg: "Internal server error",
                    status: 0
                });
            }
        });
    }

    // update
    updateAdmin(id, adminUpdateRequest) {
        if (!(adminUpdateRequest instanceof AdminUpdateRequest)) {
            return Promise.reject({
                msg: "Invalid input: Expected an instance of AdminUpdateRequest",
                status: 0
            });
        }

        const validation = adminUpdateRequest.validate();
        if (validation.status === 0) {
            return Promise.reject(validation);
        }

        return new Promise(async (resolve, reject) => {
            try {
                // Check if admin exists
                const adminCheck = await AdminDatabaseRecord.findById(id);
                if (!adminCheck) {
                    return reject({
                        msg: "Admin not found",
                        status: 0
                    });
                }

                // Prepare update data from the request object
                const updateData = {
                    ...(adminUpdateRequest.firstName && { firstName: adminUpdateRequest.firstName }),
                    ...(adminUpdateRequest.lastName && { lastName: adminUpdateRequest.lastName }),
                    ...(adminUpdateRequest.email && { email: adminUpdateRequest.email }),
                    ...(adminUpdateRequest.password && { password: adminUpdateRequest.password }),
                    ...(adminUpdateRequest.phoneNumber && { phoneNumber: adminUpdateRequest.phoneNumber }),
                    ...(adminUpdateRequest.role && { role: adminUpdateRequest.role }),
                    ...(adminUpdateRequest.status !== undefined && { status: adminUpdateRequest.status })
                };

                // Prevent updating email if it's being changed to an existing one
                if (updateData.email && updateData.email !== adminCheck.email) {
                    const emailCheck = await AdminDatabaseRecord.findOne({ email: updateData.email });
                    if (emailCheck) {
                        return reject({
                            msg: "This email already exists",
                            status: 0
                        });
                    }
                }

                const updatedAdmin = await AdminDatabaseRecord.findByIdAndUpdate(
                    id,
                    updateData,
                    { new: true }
                );

                if (!updatedAdmin) {
                    return reject({
                        msg: "Unable to update admin",
                        status: 0
                    });
                }

                resolve({
                    msg: "Admin updated successfully",
                    status: 1,
                    data: updatedAdmin
                });
            } catch (error) {
                console.error(error);
                reject({
                    msg: "Internal server error",
                    status: 0
                });
            }
        });
    }

    // delete
    deleteAdmin(adminDeleteRequest) {
        if (!(adminDeleteRequest instanceof AdminDeleteRequest)) {
            return Promise.reject({
                msg: "Invalid input: Expected an instance of AdminDeleteRequest",
                status: 0
            });
        }

        const validation = adminDeleteRequest.validate();
        if (validation.status === 0) {
            return Promise.reject(validation);
        }

        return new Promise(async (resolve, reject) => {
            try {
                // Use the ID from the request object
                const id = adminDeleteRequest.id;
                
                const deletedAdmin = await AdminDatabaseRecord.findByIdAndDelete(id);
                if (!deletedAdmin) {
                    return reject({
                        msg: "Admin not found",
                        status: 0
                    });
                }
                resolve({
                    msg: "Admin deleted successfully",
                    status: 1,
                    data: deletedAdmin
                });
            } catch (error) {
                console.error("Error deleting admin:", error);
                reject({
                    msg: "Internal server error",
                    status: 0,
                    error: error.message
                });
            }
        });
    }
}
export default AdminController;