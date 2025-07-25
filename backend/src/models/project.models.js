import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    memberCount: {
      type: Number,
      required: true,
      default: 0,
    },
    dueDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 day from now
    },
    status: {
      type: String,
      enum: ["not started", "in progress", "completed", "on hold"],
      default: "not started",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
  },
  {
    timestamps: true,
  },
);

// Optional: Keep memberCount in sync automatically
projectSchema.pre("save", function (next) {
  this.memberCount = this.members.length;
  next();
});

export const Project = mongoose.model("Project", projectSchema);
