class ClassCreateRequest {
  constructor({ className }) {
    this.className = className?.trim() || "";
  }

  validate() {
    // Validate className exists and is a string
    if (!this.className || typeof this.className !== "string") {
      return { status: 0, message: "Class name is required and must be a string." };
    }

    // Validate className format (should contain at least one letter or number)
    if (!/^[a-zA-Z0-9\s]+$/.test(this.className)) {
      return { status: 0, message: "Class name can only contain letters, numbers, and spaces." };
    }

    return { status: 1, message: "Validation successful." };
  }

  toDatabaseFormat() {
    return {
      className: this.className,
      // No need for section field anymore
      // studentCount and teacherCount will default to 0 in schema
    };
  }
}

export default ClassCreateRequest;