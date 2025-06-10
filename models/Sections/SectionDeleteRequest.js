import mongoose from "mongoose";

class SectionDeleteRequest {
  constructor({ sectionId }) {
    this.sectionId = sectionId?.toString()?.trim() || ""; // Ensure string conversion
  }

  validate() {
    // Check if sectionId exists
    if (!this.sectionId) {
      return {
        status: 0,
        message: "Section ID is required.",
        errorCode: "MISSING_SECTION_ID",
      };
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(this.sectionId)) {
      return {
        status: 0,
        message: "Invalid section ID format.",
        errorCode: "INVALID_ID_FORMAT",
      };
    }

    return {
      status: 1,
      message: "Validation successful.",
    };
  }

  getId() {
    return this.sectionId;
  }

  toRequestFormat() {
    return {
      sectionId: this.sectionId,
    };
  }
}

export default SectionDeleteRequest;
