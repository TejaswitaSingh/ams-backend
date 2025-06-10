import SectionDatabaseRecord from "../models/Sections/MainDatabase/SectionDatabaseRecord.js";
import SectionCreateRequest from "../models/Sections/SectionCreateRequest.js";
import SectionDeleteRequest from "../models/Sections/SectionDeleteRequest.js";
import SectionUpdateRequest from "../models/Sections/SectionUpdateRequest.js";

class SectionController {
  // Create section
  async createSection(sectionCreateRequest) {
    if (!(sectionCreateRequest instanceof SectionCreateRequest)) {
      throw new Error("Invalid input: Expected an instance of SectionCreateRequest");
    }

    const validation = sectionCreateRequest.validate();
    if (validation.status === 0) {
      return Promise.reject({
        msg: validation.message,
        status: 0,
      });
    }

    return new Promise(async (resolve, reject) => {
      try {
        // Check for duplicate section in the same class
        const existingSection = await SectionDatabaseRecord.findOne({
          sectionName: sectionCreateRequest.sectionName,
          classId: sectionCreateRequest.classId,
        });

        if (existingSection) {
          return reject({
            msg: "Section with this name already exists in this class",
            status: 0,
          });
        }

        const newSection = new SectionDatabaseRecord(sectionCreateRequest.toDatabaseFormat());
        await newSection.save();

        resolve({
          msg: "Section created successfully",
          status: 1,
          data: newSection,
        });
      } catch (error) {
        console.error("Error creating section:", error);
        reject({
          msg: "Internal server error",
          status: 0,
          error: error.message,
        });
      }
    });
  }

  // Get all sections for a specific class
  async getSections({ classId, page = 1, limit = 10 }) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!classId) {
          return reject({
            msg: "Class ID is required to fetch sections.",
            status: 0,
          });
        }

        const skip = (page - 1) * limit;

        const query = { classId };

        const totalCount = await SectionDatabaseRecord.countDocuments(query);
        const sections = await SectionDatabaseRecord.find(query)
          .populate("assignedTeacher", "name email") // populate teacher details (optional)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean();

        resolve({
          msg: "Sections fetched successfully",
          status: 1,
          data: sections,
          pagination: {
            total: totalCount,
            page,
            pageSize: limit,
            totalPages: Math.ceil(totalCount / limit),
          },
        });
      } catch (error) {
        console.error("Error fetching sections:", error);
        reject({
          msg: "Internal server error",
          status: 0,
          error: error.message,
        });
      }
    });
  }

  // Update section
  updateSection(id, sectionUpdateRequest) {
    if (!(sectionUpdateRequest instanceof SectionUpdateRequest)) {
      return Promise.reject({
        msg: "Invalid input: Expected an instance of SectionUpdateRequest",
        status: 0,
      });
    }

    const validation = sectionUpdateRequest.validate();
    if (validation.status === 0) {
      return Promise.reject(validation);
    }

    return new Promise(async (resolve, reject) => {
      try {
        const existingSection = await SectionDatabaseRecord.findById(id);
        if (!existingSection) {
          return reject({
            msg: "Section not found",
            status: 0,
          });
        }

        const updateData = sectionUpdateRequest.toUpdateObject();

        // Check for duplicate section name if sectionName is being updated
        if (
          updateData.sectionName &&
          updateData.sectionName !== existingSection.sectionName
        ) {
          const duplicate = await SectionDatabaseRecord.findOne({
            sectionName: updateData.sectionName,
            classId: existingSection.classId,
            _id: { $ne: id },
          });

          if (duplicate) {
            return reject({
              msg: "Another section with this name already exists in this class",
              status: 0,
            });
          }
        }

        const updatedSection = await SectionDatabaseRecord.findByIdAndUpdate(id, updateData, {
          new: true,
        });

        resolve({
          msg: "Section updated successfully",
          status: 1,
          data: updatedSection,
        });
      } catch (error) {
        console.error("Error updating section:", error);
        reject({
          msg: "Internal server error",
          status: 0,
          error: error.message,
        });
      }
    });
  }

  // Delete section
  deleteSection(sectionDeleteRequest) {
    if (!(sectionDeleteRequest instanceof SectionDeleteRequest)) {
      return Promise.reject({
        msg: "Invalid input: Expected an instance of SectionDeleteRequest",
        status: 0,
      });
    }

    const validation = sectionDeleteRequest.validate();
    if (validation.status === 0) {
      return Promise.reject(validation);
    }

    return new Promise(async (resolve, reject) => {
      try {
        const deleted = await SectionDatabaseRecord.findByIdAndDelete(
          sectionDeleteRequest.getId()
        );

        if (!deleted) {
          return reject({
            msg: "Section not found",
            status: 0,
          });
        }

        resolve({
          msg: "Section deleted successfully",
          status: 1,
          data: deleted,
        });
      } catch (error) {
        console.error("Error deleting section:", error);
        reject({
          msg: "Internal server error",
          status: 0,
          error: error.message,
        });
      }
    });
  }

  // Helper to update student count in a section
  updateStudentCount(sectionId, change) {
    return new Promise(async (resolve, reject) => {
      try {
        if (typeof change !== "number" || !Number.isInteger(change)) {
          return reject({
            msg: "Change value must be an integer",
            status: 0,
          });
        }

        const updatedSection = await SectionDatabaseRecord.findByIdAndUpdate(
          sectionId,
          { $inc: { currentStudentCount: change } },
          { new: true }
        );

        if (!updatedSection) {
          return reject({
            msg: "Section not found",
            status: 0,
          });
        }

        resolve({
          msg: "Student count updated successfully",
          status: 1,
          data: updatedSection,
        });
      } catch (error) {
        console.error("Error updating student count:", error);
        reject({
          msg: "Internal server error",
          status: 0,
          error: error.message,
        });
      }
    });
  }
}

export default SectionController;
