class ClassUpdateRequest {
  constructor({ className, section, classTeacher, students }) {
    this.className = className?.trim();
    this.section = section?.trim();
    this.classTeacher = classTeacher || null;
    this.students = Array.isArray(students) ? students : [];
  }

  validate() {
    // Optional fields — validate only if provided

    if (this.className && (typeof this.className !== "string" || this.className.length < 1)) {
      return { status: 0, message: "If provided, class name must be a non-empty string." };
    }

    if (this.section && (typeof this.section !== "string" || this.section.length < 1)) {
      return { status: 0, message: "If provided, section must be a non-empty string." };
    }

    if (this.classTeacher && !/^[0-9a-fA-F]{24}$/.test(this.classTeacher)) {
      return { status: 0, message: "Invalid class teacher ID format." };
    }

    for (let studentId of this.students) {
      if (!/^[0-9a-fA-F]{24}$/.test(studentId)) {
        return { status: 0, message: "One or more student IDs are invalid." };
      }
    }

    return { status: 1, message: "Validation successful." };
  }

  toDatabaseFormat() {
    const updateData = {};
    if (this.className) updateData.className = this.className;
    if (this.section) updateData.section = this.section;
    if (this.classTeacher !== undefined) updateData.classTeacher = this.classTeacher;
    if (this.students.length > 0) updateData.students = this.students;
    return updateData;
  }
}

export default ClassUpdateRequest;
