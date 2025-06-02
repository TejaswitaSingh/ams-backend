class ClassCreateRequest {
  constructor({ className, section, classTeacher, students }) {
    this.className = className?.trim();
    this.section = section?.trim();
    this.classTeacher = classTeacher || null;
    this.students = Array.isArray(students) ? students : [];
  }

  validate() {
    // Validate className
    if (!this.className || typeof this.className !== "string" || this.className.length < 1) {
      return { status: 0, message: "Class name is required and must be a non-empty string." };
    }

    // Validate section
    if (!this.section || typeof this.section !== "string" || this.section.length < 1) {
      return { status: 0, message: "Section is required and must be a non-empty string." };
    }

    // Validate classTeacher (optional but must be a valid MongoDB ObjectId format if provided)
    if (this.classTeacher && !/^[0-9a-fA-F]{24}$/.test(this.classTeacher)) {
      return { status: 0, message: "Invalid class teacher ID format." };
    }

    // Validate students (each should be a valid MongoDB ObjectId)
    for (let studentId of this.students) {
      if (!/^[0-9a-fA-F]{24}$/.test(studentId)) {
        return { status: 0, message: "One or more student IDs are invalid." };
      }
    }

    return { status: 1, message: "Validation successful." };
  }

  // Optional: Method to format for database insertion
  toDatabaseFormat() {
    return {
      className: this.className,
      section: this.section,
      classTeacher: this.classTeacher,
      students: this.students,
    };
  }
}

export default ClassCreateRequest;
