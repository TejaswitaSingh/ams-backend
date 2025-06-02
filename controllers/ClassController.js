import ClassDatabaseRecord from "../models/Classes/MainDatabase/ClassDatabaseRecord.js";
import ClassCreateRequest from "../models/Classes/ClassCreateRequest.js";
import ClassUpdateRequest from "../models/Classes/ClassUpdateRequest.js";
import ClassDeleteRequest from "../models/Classes/ClassDeleteRequest.js";

class ClassController {
    // Create class
    createClass(classCreateRequest) {
        if (!(classCreateRequest instanceof ClassCreateRequest)) {
            throw new Error("Invalid input: Expected an instance of ClassCreateRequest");
        }

        if (!classCreateRequest.validate()) {
            return Promise.reject({
                msg: "All required fields are missing",
                status: 0
            });
        }

        return new Promise(async (resolve, reject) => {
            try {
                // Check if class with same name already exists
                const existingClass = await ClassDatabaseRecord.findOne({ name: classCreateRequest.name });
                if (existingClass) {
                    return reject({
                        msg: "Class with this name already exists",
                        status: 0
                    });
                }

                const newClass = new ClassDatabaseRecord({
                    name: classCreateRequest.name,
                    section: classCreateRequest.section,
                    subjects: classCreateRequest.subjects || [],
                    classTeacher: classCreateRequest.classTeacher,
                    status: classCreateRequest.status !== undefined ? classCreateRequest.status : true
                });

                await newClass.save();
                resolve({
                    msg: "Class created successfully",
                    status: 1,
                    data: newClass
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

    // Get all classes
    getClasses({ page = 1, limit = 10, sort, filters = {} } = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                const query = {};

                if (filters.status !== undefined) {
                    query.status = filters.status === 'active';
                }
                if (filters.search) {
                    query.name = { $regex: filters.search, $options: "i" };
                }

                const skip = (page - 1) * limit;

                let sortObj = {};
                if (sort) {
                    sort.split(',').forEach(sortItem => {
                        const [field, order] = sortItem.split(':');
                        sortObj[field] = order === 'desc' ? -1 : 1;
                    });
                } else {
                    sortObj = { createdAt: -1 };
                }

                const totalCount = await ClassDatabaseRecord.countDocuments(query);
                const classes = await ClassDatabaseRecord.find(query)
                    .sort(sortObj)
                    .skip(skip)
                    .limit(limit)
                    .lean();

                resolve({
                    msg: "Class list fetched successfully",
                    status: 1,
                    data: classes,
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

    // Get single class by ID
    getClassById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const foundClass = await ClassDatabaseRecord.findById(id).lean();
                if (!foundClass) {
                    return reject({
                        msg: "Class not found",
                        status: 0
                    });
                }
                resolve({
                    msg: "Class details fetched successfully",
                    status: 1,
                    data: foundClass
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

    // Update class
    updateClass(id, classUpdateRequest) {
        if (!(classUpdateRequest instanceof ClassUpdateRequest)) {
            return Promise.reject({
                msg: "Invalid input: Expected an instance of ClassUpdateRequest",
                status: 0
            });
        }

        const validation = classUpdateRequest.validate();
        if (validation.status === 0) {
            return Promise.reject(validation);
        }

        return new Promise(async (resolve, reject) => {
            try {
                const existingClass = await ClassDatabaseRecord.findById(id);
                if (!existingClass) {
                    return reject({
                        msg: "Class not found",
                        status: 0
                    });
                }

                const updateData = {
                    ...(classUpdateRequest.name && { name: classUpdateRequest.name }),
                    ...(classUpdateRequest.section && { section: classUpdateRequest.section }),
                    ...(classUpdateRequest.subjects && { subjects: classUpdateRequest.subjects }),
                    ...(classUpdateRequest.classTeacher && { classTeacher: classUpdateRequest.classTeacher }),
                    ...(classUpdateRequest.status !== undefined && { status: classUpdateRequest.status })
                };

                if (updateData.name && updateData.name !== existingClass.name) {
                    const nameCheck = await ClassDatabaseRecord.findOne({ name: updateData.name });
                    if (nameCheck) {
                        return reject({
                            msg: "Class with this name already exists",
                            status: 0
                        });
                    }
                }

                const updatedClass = await ClassDatabaseRecord.findByIdAndUpdate(id, updateData, { new: true });

                resolve({
                    msg: "Class updated successfully",
                    status: 1,
                    data: updatedClass
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

    // Delete class
    deleteClass(classDeleteRequest) {
        if (!(classDeleteRequest instanceof ClassDeleteRequest)) {
            return Promise.reject({
                msg: "Invalid input: Expected an instance of ClassDeleteRequest",
                status: 0
            });
        }

        const validation = classDeleteRequest.validate();
        if (validation.status === 0) {
            return Promise.reject(validation);
        }

        return new Promise(async (resolve, reject) => {
            try {
                const deleted = await ClassDatabaseRecord.findByIdAndDelete(classDeleteRequest.id);
                if (!deleted) {
                    return reject({
                        msg: "Class not found",
                        status: 0
                    });
                }
                resolve({
                    msg: "Class deleted successfully",
                    status: 1,
                    data: deleted
                });
            } catch (error) {
                console.error("Error deleting class:", error);
                reject({
                    msg: "Internal server error",
                    status: 0,
                    error: error.message
                });
            }
        });
    }
}

export default ClassController;
