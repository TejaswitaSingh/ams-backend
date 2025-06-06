import ClassDatabaseRecord from "../models/Class/MainDatabase/ClassDatabaseRecord.js";
import ClassCreateRequest from "../models/Class/ClassCreateRequest.js";
import ClassUpdateRequest from "../models/Class/ClassUpdateRequest.js";
import ClassDeleteRequest from "../models/Class/ClassDeleteRequest.js";

class ClassController {
  // Create class
  async createClass(classCreateRequest) {
    if (!(classCreateRequest instanceof ClassCreateRequest)) {
      throw new Error("Invalid input: Expected an instance of ClassCreateRequest");
    }

    const validation = classCreateRequest.validate();
    if (validation.status === 0) {
      return Promise.reject({
        msg: validation.message,
        status: 0,
      });
    }

    return new Promise(async (resolve, reject) => {
      try {
        // Check if class with same name already exists
        const existingClass = await ClassDatabaseRecord.findOne({
          className: classCreateRequest.className
        });

        if (existingClass) {
          return reject({
            msg: "Class with this name already exists",
            status: 0,
          });
        }

        // Create and save new class
        const newClass = new ClassDatabaseRecord(classCreateRequest.toDatabaseFormat());
        await newClass.save();

        resolve({
          msg: "Class created successfully",
          status: 1,
          data: newClass,
        });
      } catch (error) {
        console.error("Error creating class:", error);
        reject({
          msg: "Internal server error",
          status: 0,
          error: error.message
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
          query.$or = [
            { className: { $regex: filters.search, $options: "i" } },
            { classCode: { $regex: filters.search, $options: "i" } }
          ];
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
          status: 0,
          error: error.message
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
          status: 0,
          error: error.message
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

        const updateData = classUpdateRequest.toDatabaseFormat();

        // Check for duplicate class name
        if (updateData.className && updateData.className !== existingClass.className) {
          const duplicate = await ClassDatabaseRecord.findOne({
            className: updateData.className,
            _id: { $ne: id }
          });

          if (duplicate) {
            return reject({
              msg: "Another class with this name already exists",
              status: 0
            });
          }
        }

        const updatedClass = await ClassDatabaseRecord.findByIdAndUpdate(
          id, 
          updateData, 
          { new: true }
        );

        resolve({
          msg: "Class updated successfully",
          status: 1,
          data: updatedClass
        });
      } catch (error) {
        console.error(error);
        reject({
          msg: "Internal server error",
          status: 0,
          error: error.message
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
        const deleted = await ClassDatabaseRecord.findByIdAndDelete(classDeleteRequest.getId());
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

  // Additional method to update student count
  async updateStudentCount(classId, change) {
    return this.updateCount(classId, 'studentCount', change);
  }

  // Additional method to update teacher count
  async updateTeacherCount(classId, change) {
    return this.updateCount(classId, 'teacherCount', change);
  }

  // Helper method for count updates
  async updateCount(classId, field, change) {
    return new Promise(async (resolve, reject) => {
      try {
        if (typeof change !== 'number' || !Number.isInteger(change)) {
          return reject({
            msg: "Change value must be an integer",
            status: 0
          });
        }

        const updatedClass = await ClassDatabaseRecord.findByIdAndUpdate(
          classId,
          { $inc: { [field]: change } },
          { new: true }
        );

        if (!updatedClass) {
          return reject({
            msg: "Class not found",
            status: 0
          });
        }

        resolve({
          msg: `${field} updated successfully`,
          status: 1,
          data: updatedClass
        });
      } catch (error) {
        console.error(`Error updating ${field}:`, error);
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