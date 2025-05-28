import StudentDatabaseRecord from "../models/Students/MainDatabase/StudentDatabaseRecord.js";
import StudentCreateRequest from "../models/Students/StudentCreateRequest.js";
import StudentUpdateRequest from "../models/Students/StudentUpdateRequest.js";
import StudentDeleteRequest from "../models/Students/StudentDeleteRequest.js";
import { generateToken, verifyToken } from "../utils/Token.js";

class StudentController {
    // Create student
    createStudent(studentCreateRequest) {
        if (!(studentCreateRequest instanceof StudentCreateRequest)) {
            throw new Error("Invalid input: Expected an instance of StudentCreateRequest");
        }

        if (!studentCreateRequest.validate()) {
            return Promise.reject({
                msg: "All required fields are missing",
                status: 0
            });
        }

        return new Promise(async (resolve, reject) => {
            try {
                // Check if student already exists
                const studentCheck = await StudentDatabaseRecord.findOne({ 
                    email: studentCreateRequest.email 
                });
                
                if (studentCheck) {
                    return reject({
                        msg: "Student with this email already exists",
                        status: 0
                    });
                }

                const student = new StudentDatabaseRecord({
                    firstName: studentCreateRequest.firstName,
                    lastName: studentCreateRequest.lastName,
                    email: studentCreateRequest.email,
                    password: studentCreateRequest.password,
                    phoneNumber: studentCreateRequest.phoneNumber,
                    studentId: studentCreateRequest.studentId,
                    department: studentCreateRequest.department,
                    enrollmentDate: studentCreateRequest.enrollmentDate,
                    graduationDate: studentCreateRequest.graduationDate,
                    dateOfBirth: studentCreateRequest.dateOfBirth,
                    address: studentCreateRequest.address,
                    profilePicture: studentCreateRequest.profilePicture,
                    status: studentCreateRequest.status !== undefined ? studentCreateRequest.status : true
                });

                await student.save();
                resolve({
                    msg: "Student created successfully",
                    status: 1,
                    data: student
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

    // Get all students with pagination and filtering
    getStudents({ page = 1, limit = 10, sort, filters = {} } = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                // Build query based on filters
                const query = {};
                
                if (filters.status) {
                    query.status = filters.status === 'active';
                }
                if (filters.department) {
                    query.department = filters.department;
                }
                if (filters.search) {
                    query.$or = [
                        { firstName: { $regex: filters.search, $options: 'i' } },
                        { lastName: { $regex: filters.search, $options: 'i' } },
                        { email: { $regex: filters.search, $options: 'i' } },
                        { studentId: { $regex: filters.search, $options: 'i' } }
                    ];
                }

                // Calculate skip value for pagination
                const skip = (page - 1) * limit;

                // Get total count for pagination
                const totalCount = await StudentDatabaseRecord.countDocuments(query);

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

                const students = await StudentDatabaseRecord.find(query)
                    .sort(sortObj)
                    .skip(skip)
                    .limit(limit)
                    .lean();

                resolve({
                    msg: "Student list fetched successfully",
                    status: 1,
                    data: students,
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

    // Get single student by ID
    getStudentById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const student = await StudentDatabaseRecord.findById(id).lean();
                if (!student) {
                    return reject({
                        msg: "Student not found",
                        status: 0
                    });
                }
                resolve({
                    msg: "Student details fetched successfully",
                    status: 1,
                    data: student
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

    // Update student
    updateStudent(id, studentUpdateRequest) {
        if (!(studentUpdateRequest instanceof StudentUpdateRequest)) {
            return Promise.reject({
                msg: "Invalid input: Expected an instance of StudentUpdateRequest",
                status: 0
            });
        }

        const validation = studentUpdateRequest.validate();
        if (validation.status === 0) {
            return Promise.reject(validation);
        }

        return new Promise(async (resolve, reject) => {
            try {
                // Check if student exists
                const studentCheck = await StudentDatabaseRecord.findById(id);
                if (!studentCheck) {
                    return reject({
                        msg: "Student not found",
                        status: 0
                    });
                }

                // Prepare update data from the request object
                const updateData = {
                    ...(studentUpdateRequest.firstName && { firstName: studentUpdateRequest.firstName }),
                    ...(studentUpdateRequest.lastName && { lastName: studentUpdateRequest.lastName }),
                    ...(studentUpdateRequest.email && { email: studentUpdateRequest.email }),
                    ...(studentUpdateRequest.password && { password: studentUpdateRequest.password }),
                    ...(studentUpdateRequest.phoneNumber && { phoneNumber: studentUpdateRequest.phoneNumber }),
                    ...(studentUpdateRequest.studentId && { studentId: studentUpdateRequest.studentId }),
                    ...(studentUpdateRequest.department && { department: studentUpdateRequest.department }),
                    ...(studentUpdateRequest.enrollmentDate && { enrollmentDate: studentUpdateRequest.enrollmentDate }),
                    ...(studentUpdateRequest.graduationDate && { graduationDate: studentUpdateRequest.graduationDate }),
                    ...(studentUpdateRequest.dateOfBirth && { dateOfBirth: studentUpdateRequest.dateOfBirth }),
                    ...(studentUpdateRequest.address && { address: studentUpdateRequest.address }),
                    ...(studentUpdateRequest.status !== undefined && { status: studentUpdateRequest.status })
                };

                // Prevent updating email if it's being changed to an existing one
                if (updateData.email && updateData.email !== studentCheck.email) {
                    const emailCheck = await StudentDatabaseRecord.findOne({ email: updateData.email });
                    if (emailCheck) {
                        return reject({
                            msg: "This email already exists",
                            status: 0
                        });
                    }
                }

                // Prevent updating student ID if it's being changed to an existing one
                if (updateData.studentId && updateData.studentId !== studentCheck.studentId) {
                    const studentIdCheck = await StudentDatabaseRecord.findOne({ studentId: updateData.studentId });
                    if (studentIdCheck) {
                        return reject({
                            msg: "This student ID already exists",
                            status: 0
                        });
                    }
                }

                const updatedStudent = await StudentDatabaseRecord.findByIdAndUpdate(
                    id,
                    updateData,
                    { new: true }
                );

                if (!updatedStudent) {
                    return reject({
                        msg: "Unable to update student",
                        status: 0
                    });
                }

                resolve({
                    msg: "Student updated successfully",
                    status: 1,
                    data: updatedStudent
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

    // Delete student
    deleteStudent(studentDeleteRequest) {
        if (!(studentDeleteRequest instanceof StudentDeleteRequest)) {
            return Promise.reject({
                msg: "Invalid input: Expected an instance of StudentDeleteRequest",
                status: 0
            });
        }

        const validation = studentDeleteRequest.validate();
        if (validation.status === 0) {
            return Promise.reject(validation);
        }

        return new Promise(async (resolve, reject) => {
            try {
                const id = studentDeleteRequest.id;
                const deletedStudent = await StudentDatabaseRecord.findByIdAndDelete(id);
                
                if (!deletedStudent) {
                    return reject({
                        msg: "Student not found",
                        status: 0
                    });
                }
                
                resolve({
                    msg: "Student deleted successfully",
                    status: 1,
                    data: deletedStudent
                });
            } catch (error) {
                console.error("Error deleting student:", error);
                reject({
                    msg: "Internal server error",
                    status: 0,
                    error: error.message
                });
            }
        });
    }
}

export default StudentController;