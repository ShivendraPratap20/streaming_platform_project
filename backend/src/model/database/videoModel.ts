
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    videoName: {
      type: String,
      required: true,
      trim: true,
    },

    originalVideoName: {
      type: String,
      required: true,
    },

    mediaType: {
      type: String,
      enum: ["VIDEO", "AUDIO"],
      required: true,
    },

    resourceType: {
      type: String,
      enum: ["video"],
      default: "video",
      required: true,
    },

    artist: {
      artistName: {
        type: String,
        required: true,
        trim: true,
      },

      artistObjectID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      artistUserID: {
        type: String,
      },
    },

    mediaDetails: {
      format: {
        type: String,
        required: true,
      },

      duration: {
        type: Number,
        min: 0,
      },

      size: {
        type: Number,
        required: true,
        min: 0,
      },

      mimeType: {
        type: String,
        required: true,
      },
    },

    publicID: {
      type: String,
      required: true,
      unique: true,
    },

    url: {
      type: String,
      required: true,
    },

    fileStatus: {
      type: String,
      enum: ["UPLOADING", "UPLOADED", "QUEUED", "PROCESSING", "READY", "FAILED"],
      default: "UPLOADING",
      required: true,
    },
    variant: [
      { 
        resolution: {type: Number},
        url: { type: String },
        publicId: { type: String },
    }
    ]
  },
  {
    timestamps: true,
  }
);

videoSchema.index({
  "artist.artistObjectID": 1,
  createdAt: -1,
});

videoSchema.index({ fileStatus: 1 });

const videoModel = mongoose.model("Video", videoSchema);

export default videoModel;
