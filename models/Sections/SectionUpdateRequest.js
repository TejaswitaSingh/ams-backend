import mongoose from "mongoose";

class SectionUpdateRequest {
  constructor(data = {}) {
    this.sectionName = data.sectionName?.toString()?.trim() || "";
    this.studentCapacity = data.studentCapacity;
    this.assignedTeacher = data.assignedTeacher?.toString()?.trim() || "";
    this.isActive = typeof data.isActive === "boolean" ? data.isActive : undefined;
  }

  validate() {
    // At least one field must be provided to update
    if (
      !this.sectionName &&
      (this.studentCapacity === undefined || this.studentCapacity === null) &&
      !this.assignedTeacher &&
      this.isActive === undefined
    ) {
      return {
        status: 0,
        message: "At least one field is required to update.",
        errorCode: "MISSING_UPDATE_FIELDS",
      };
    }

    // Validate studentCapacity if provided
    if (this.studentCapacity !== undefined) {
      if (typeof this.studentCapacity !== "number" || this.studentCapacity < 1) {
        return {
          status: 0,
          message: "Student capacity must be a positive number.",
          errorCode: "INVALID_CAPACITY",
        };
      }
    }

    // Validate assignedTeacher if provided
    if (this.assignedTeacher) {
      if (!mongoose.Types.ObjectId.isValid(this.assignedTeacher)) {
        return {
          status: 0,
          message: "Invalid teacher ID format.",
          errorCode: "INVALID_TEACHER_ID",
        };
      }
    }

    return {
      status: 1,
      message: "Validation successful.",
    };
  }

  toUpdateObject() {
    const update = {};

    if (this.sectionName) update.sectionName = this.sectionName;
    if (this.studentCapacity !== undefined) update.studentCapacity = this.studentCapacity;
    if (this.assignedTeacher) update.assignedTeacher = this.assignedTeacher;
    if (this.isActive !== undefined) update.isActive = this.isActive;

    return update;
  }
}

export default SectionUpdateRequest;
