import mongoose from "mongoose";


class ClassDeleteRequest {
  constructor({ classId }) {
    this.classId = classId?.toString()?.trim() || ""; // Ensure string conversion
  }

  validate() {
    // Check if classId exists
    if (!this.classId) {
      return { 
        status: 0, 
        message: "Class ID is required.",
        errorCode: "MISSING_CLASS_ID"
      };
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(this.classId)) {
      return { 
        status: 0, 
        message: "Invalid class ID format.",
        errorCode: "INVALID_ID_FORMAT"
      };
    }

    return { 
      status: 1, 
      message: "Validation successful." 
    };
  }

  getId() {
    return this.classId;
  }

  // New method to get the request in a consistent format
  toRequestFormat() {
    return {
      classId: this.classId
    };
  }
}

export default ClassDeleteRequest;