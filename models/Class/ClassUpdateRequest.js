class ClassUpdateRequest {
  constructor({ 
    className,
    studentCount,
    teacherCount 
  }) {
    this.className = className?.trim();
    this.studentCount = studentCount;
    this.teacherCount = teacherCount;
  }

  validate() {
    // Validate className if provided
    if (this.className !== undefined) {
      if (typeof this.className !== 'string' || this.className.length < 1) {
        return { 
          status: 0, 
          message: "Class name must be a non-empty string if provided." 
        };
      }
      
      if (!/^[a-zA-Z0-9\s]+$/.test(this.className)) {
        return {
          status: 0,
          message: "Class name can only contain letters, numbers, and spaces."
        };
      }
    }

    // Validate studentCount if provided
    if (this.studentCount !== undefined) {
      if (typeof this.studentCount !== 'number' || !Number.isInteger(this.studentCount)) {
        return {
          status: 0,
          message: "Student count must be an integer if provided."
        };
      }
      
      if (this.studentCount < 0) {
        return {
          status: 0,
          message: "Student count cannot be negative."
        };
      }
    }

    // Validate teacherCount if provided
    if (this.teacherCount !== undefined) {
      if (typeof this.teacherCount !== 'number' || !Number.isInteger(this.teacherCount)) {
        return {
          status: 0,
          message: "Teacher count must be an integer if provided."
        };
      }
      
      if (this.teacherCount < 0) {
        return {
          status: 0,
          message: "Teacher count cannot be negative."
        };
      }
    }

    return { 
      status: 1, 
      message: "Validation successful." 
    };
  }

  toDatabaseFormat() {
    const updateData = {};
    
    if (this.className !== undefined) {
      updateData.className = this.className;
    }
    
    if (this.studentCount !== undefined) {
      updateData.studentCount = this.studentCount;
    }
    
    if (this.teacherCount !== undefined) {
      updateData.teacherCount = this.teacherCount;
    }

    return updateData;
  }
}

export default ClassUpdateRequest;