class ClassCreateRequest {
  constructor({ className, section }) {
    this.className = className?.trim() || "";
    this.section = section?.trim() || "";
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

    return { status: 1, message: "Validation successful." };
  }

  toDatabaseFormat() {
    return {
      className: this.className,
      section: this.section,
    };
  }
}

export default ClassCreateRequest;
