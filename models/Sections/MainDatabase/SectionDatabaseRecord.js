import mongoose from "mongoose";

const SectionDatabaseSchema = new mongoose.Schema(
  {
    // Required fields
    sectionName: {
      type: String,
      required: true,
      trim: true,
    },
    sectionCode: {
      type: String,
      unique: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class", // Reference to the Class model
      required: true,
    },

    // Optional fields
    studentCapacity: {
      type: Number,
      default: 30,
      min: 1,
    },
    currentStudentCount: {
      type: Number,
      default: 0,
      validate: {
        validator: function (value) {
          return value <= this.studentCapacity; // Ensure count <= capacity
        },
        message: "Student count exceeds capacity!",
      },
    },
    assignedTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher", // Optional reference to a Teacher model
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// Auto-generate sectionCode (e.g., "sec-a" for section "A")
SectionDatabaseSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("sectionName")) {
    const firstChar = this.sectionName.charAt(0).toLowerCase();
    this.sectionCode = `sec-${firstChar}`;
  }
  next();
});

// Ensure sectionName + classId is unique (no duplicate sections in a class)
SectionDatabaseSchema.index(
  { sectionName: 1, classId: 1 },
  { unique: true }
);

const SectionDatabaseRecord = mongoose.model("Section", SectionDatabaseSchema);

export default SectionDatabaseRecord;