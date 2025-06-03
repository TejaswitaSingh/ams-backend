class ClassDeleteRequest {
  constructor({ classId }) {
    console.log(classId,"id for request")
    this.classId = classId?.trim() || "";
  }

  validate() {
    // Validate if classId is a valid MongoDB ObjectId
    if (!this.classId || !/^[0-9a-fA-F]{24}$/.test(this.classId)) {
      return { status: 0, message: "Invalid or missing class ID." };
    }

    return { status: 1, message: "Validation successful." };
  }

  getId() {
    return this.classId;
  }
}

export default ClassDeleteRequest;
