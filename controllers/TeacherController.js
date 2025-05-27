import TeacherDatabaseRecord from "../models/TeacherDatabaseRecord.js";
import TeacherCreateRequest from "../models/TeacherCreateRequest.js";
import TeacherUpdateRequest from "../models/TeacherUpdateRequest.js";
import TeacherDeleteRequest from "../models/TeacherDeleteRequest.js";

class TeacherController {
    // Create Teacher
    createTeacher(teacherCreateRequest) {
        if (!(teacherCreateRequest instanceof TeacherCreateRequest)) {
            throw new Error("Invalid input: Expected an instance of TeacherCreateRequest");
        }

        if (!teacherCreateRequest.validate()) {
            return Promise.reject({
                msg: "All fields are required",
                status: 0
            });
        }

        return new Promise(async (resolve, reject) => {
            try {
                const teacher = new TeacherDatabaseRecord({
                    firstName: teacherCreateRequest.firstName,
                    lastName: teacherCreateRequest.lastName,
                    password:teacherCreateRequest.password,
                    email: teacherCreateRequest.email,
                    phoneNumber: teacherCreateRequest.phoneNumber,
                    status: teacherCreateRequest.status !== undefined ? teacherCreateRequest.status : true
                });

                await teacher.save();
                resolve({
                    msg: "Teacher created successfully",
                    status: 1,
                    data: teacher
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

    // Read Teachers with Pagination and Filtering
    getTeachers({ page = 1, limit = 10, sort, filters = {} } = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = {};

                if (filters.status) {
                    query.status = filters.status === "active";
                }
                if (filters.subject) {
                    query.subject = filters.subject;
                }
                if (filters.search) {
                    query.$or = [
                        { firstName: { $regex: filters.search, $options: "i" } },
                        { lastName: { $regex: filters.search, $options: "i" } },
                        { email: { $regex: filters.search, $options: "i" } }
                    ];
                }

                const skip = (page - 1) * limit;
                const totalCount = await TeacherDatabaseRecord.countDocuments(query);

                let sortObj = {};
                if (sort) {
                    sort.split(",").forEach(sortItem => {
                        const [field, order] = sortItem.split(":");
                        sortObj[field] = order === "desc" ? -1 : 1;
                    });
                } else {
                    sortObj = { createdAt: -1 };
                }

                const teachers = await TeacherDatabaseRecord.find(query)
                    .sort(sortObj)
                    .skip(skip)
                    .limit(limit)
                    .lean();

                resolve({
                    msg: "Teacher list fetched successfully",
                    status: 1,
                    data: teachers,
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

    // Update Teacher
    updateTeacher(id, teacherUpdateRequest) {
        if (!(teacherUpdateRequest instanceof TeacherUpdateRequest)) {
            return Promise.reject({
                msg: "Invalid input: Expected an instance of TeacherUpdateRequest",
                status: 0
            });
        }

        const validation = teacherUpdateRequest.validate();
        if (validation.status === 0) {
            return Promise.reject(validation);
        }

        return new Promise(async (resolve, reject) => {
            try {
                const teacherCheck = await TeacherDatabaseRecord.findById(id);
                if (!teacherCheck) {
                    return reject({
                        msg: "Teacher not found",
                        status: 0
                    });
                }

                const updateData = {
                    ...(teacherUpdateRequest.firstName && { firstName: teacherUpdateRequest.firstName }),
                    ...(teacherUpdateRequest.lastName && { lastName: teacherUpdateRequest.lastName }),
                    ...(teacherUpdateRequest.email && { email: teacherUpdateRequest.email }),
                    ...(teacherUpdateRequest.phoneNumber && { phoneNumber: teacherUpdateRequest.phoneNumber }),
                    ...(teacherUpdateRequest.subject && { subject: teacherUpdateRequest.subject }),
                    ...(teacherUpdateRequest.status !== undefined && { status: teacherUpdateRequest.status })
                };

                const updatedTeacher = await TeacherDatabaseRecord.findByIdAndUpdate(id, updateData, { new: true });

                resolve({
                    msg: "Teacher updated successfully",
                    status: 1,
                    data: updatedTeacher
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

    // Delete Teacher
    deleteTeacher(teacherDeleteRequest) {
        if (!(teacherDeleteRequest instanceof TeacherDeleteRequest)) {
            return Promise.reject({
                msg: "Invalid input: Expected an instance of TeacherDeleteRequest",
                status: 0
            });
        }

        const validation = teacherDeleteRequest.validate();
        if (validation.status === 0) {
            return Promise.reject(validation);
        }

        return new Promise(async (resolve, reject) => {
            try {
                const id = teacherDeleteRequest.id;

                const deletedTeacher = await TeacherDatabaseRecord.findByIdAndDelete(id);
                if (!deletedTeacher) {
                    return reject({
                        msg: "Teacher not found",
                        status: 0
                    });
                }

                resolve({
                    msg: "Teacher deleted successfully",
                    status: 1,
                    data: deletedTeacher
                });
            } catch (error) {
                console.error("Error deleting teacher:", error);
                reject({
                    msg: "Internal server error",
                    status: 0,
                    error: error.message
                });
            }
        });
    }
}

export default TeacherController;
