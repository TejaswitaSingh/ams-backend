class ClassCreateRequest {
  constructor({ className, section, classTeacher, students }) {
    this.className = className?.trim() || "";
    this.section = section?.trim() || "";
    this.classTeacher = classTeacher?.trim() || null;

    // Make sure students is an array of trimmed strings or an empty array
    this.students = Array.isArray(students)
      ? students.map((s) => (typeof s === "string" ? s.trim() : "")).filter(Boolean)
      : [];
  }

  validate() {
    // Validate className
    if (!this.className || typeof this.className !== "string") {
      return { status: 0, message: "Class name is required and must be a string." };
    }

    // Validate section
    if (!this.section || typeof this.section !== "string") {
      return { status: 0, message: "Section is required and must be a string." };
    }

    // Validate classTeacher (optional but should be a string if provided)
    if (this.classTeacher && typeof this.classTeacher !== "string") {
      return { status: 0, message: "Class teacher must be a string." };
    }

    // Validate students array
    if (!Array.isArray(this.students)) {
      return { status: 0, message: "Students must be an array of strings." };
    }

    for (let student of this.students) {
      if (typeof student !== "string") {
        return { status: 0, message: "Each student must be a string." };
      }
    }

    return { status: 1, message: "Validation successful." };
  }

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
