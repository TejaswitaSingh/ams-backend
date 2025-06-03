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
  },
  { timestamps: true }
);

// Pre-save hook to auto-generate classCode from className + section
ClassDatabaseSchema.pre("save", function (next) {
  if (
    this.className &&
    this.section &&
    (this.isNew || this.isModified("className") || this.isModified("section"))
  ) {
    const numberMatch = this.className.toLowerCase().match(/\d+/);
    const classPart = numberMatch
      ? numberMatch[0]
      : this.className.toLowerCase().replace(/\s+/g, "");
    const sectionPart = this.section.toLowerCase();
    this.classCode = `c-${classPart}-${sectionPart}`;
  }
  next();
});

const ClassDatabaseRecord = mongoose.model("Classes", ClassDatabaseSchema);

export default ClassDatabaseRecord;
