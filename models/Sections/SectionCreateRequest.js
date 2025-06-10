class SectionCreateRequest {
  constructor({ sectionName, classId, studentCapacity, assignedTeacher }) {
    this.sectionName = sectionName?.trim() || "";
    this.classId = classId || null; // Expects a valid ObjectId
    this.studentCapacity = studentCapacity || 30; // Default from schema
    this.assignedTeacher = assignedTeacher || null; // Optional
  }

  validate() {
    // 1. Validate sectionName
    if (!this.sectionName || typeof this.sectionName !== "string") {
      return { status: 0, message: "Section name is required and must be a string." };
    }

    if (!/^[a-zA-Z0-9\s\-]+$/.test(this.sectionName)) {
      return { status: 0, message: "Section name can only contain letters, numbers, spaces, and hyphens." };
    }

    // 2. Validate classId (must be a valid MongoDB ObjectId)
    if (!this.classId || !mongoose.Types.ObjectId.isValid(this.classId)) {
      return { status: 0, message: "Valid classId (ObjectId) is required." };
    }

    // 3. Validate studentCapacity (must be a positive number)
    if (this.studentCapacity && (typeof this.studentCapacity !== "number" || this.studentCapacity < 1)) {
      return { status: 0, message: "Student capacity must be a number ≥ 1." };
    }

    // 4. Validate assignedTeacher (if provided)
    if (this.assignedTeacher && !mongoose.Types.ObjectId.isValid(this.assignedTeacher)) {
      return { status: 0, message: "Invalid teacherId (must be ObjectId)." };
    }

    return { status: 1, message: "Validation successful." };
  }

  toDatabaseFormat() {
    return {
      sectionName: this.sectionName,
      classId: this.classId,
      studentCapacity: this.studentCapacity,
      ...(this.assignedTeacher && { assignedTeacher: this.assignedTeacher }), // Conditionally include
      // isActive defaults to true in schema
      // sectionCode is auto-generated in pre-save hook
    };
  }
}

export default SectionCreateRequest;