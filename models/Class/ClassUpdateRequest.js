class ClassUpdateRequest {
  constructor({ className, section }) {
    this.className = className?.trim();
    this.section = section?.trim();
  }

  validate() {
    // Optional fields — validate only if provided

    if (this.className && (typeof this.className !== "string" || this.className.length < 1)) {
      return { status: 0, message: "If provided, class name must be a non-empty string." };
    }

    if (this.section && (typeof this.section !== "string" || this.section.length < 1)) {
      return { status: 0, message: "If provided, section must be a non-empty string." };
    }

    return { status: 1, message: "Validation successful." };
  }

  toDatabaseFormat() {
    const updateData = {};
    if (this.className) updateData.className = this.className;
    if (this.section) updateData.section = this.section;
    return updateData;
  }
}

export default ClassUpdateRequest;
