import mongoose from "mongoose";

const ClassDatabaseSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      trim: true,
    },
    section: {
      type: String,
      required: true,
      trim: true,
    },
    classCode: {
      type: String,
      unique: true,
    },
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teachers",
      default: null,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Students",
        default: null,
      },
    ],
  },
  { timestamps: true }
);

// Pre-save hook to auto-generate classCode from className + section
ClassDatabaseSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("className") || this.isModified("section")) {
    const numberMatch = this.className.toLowerCase().match(/\d+/);
    const classPart = numberMatch ? numberMatch[0] : this.className.toLowerCase();
    const sectionPart = this.section.toLowerCase();
    this.classCode = `c-${classPart}-${sectionPart}`;
  }
  next();
});

const ClassDatabaseRecord = mongoose.model("Classes", ClassDatabaseSchema);

export default ClassDatabaseRecord;
