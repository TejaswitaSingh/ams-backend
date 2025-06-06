import mongoose from "mongoose";

const ClassDatabaseSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      trim: true,
      unique: true // Ensure class names are unique
    },
    classCode: {
      type: String,
      unique: true,
    },
    studentCount: {
      type: Number,
      default: 0
    },
    teacherCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Pre-save hook to auto-generate class code
ClassDatabaseSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("className")) {
    // Extract numeric part (e.g., "10" from "Class 10" or "10th Grade")
    const numberMatch = this.className.match(/\d+/);
    const classNumber = numberMatch ? numberMatch[0] : 
      this.className.replace(/\s+/g, "").toLowerCase();
    
    // Generate clean code (e.g., "c-10")
    this.classCode = `c-${classNumber}`;
  }
  next();
});

const ClassDatabaseRecord = mongoose.model("Class", ClassDatabaseSchema);

export default ClassDatabaseRecord;