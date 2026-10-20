
import mongoose from "mongoose";
import { hlsDir } from "../../constants/index.js";

const mediaSchema = new mongoose.Schema(
  {
    mediaName: {
      type: String,
      required: true,
      trim: true,
    },

    mediaType: {
      type: String,
      enum: ["video", "audio"],
      required: true,
    },

    resourceType: {
      type: String,
      enum: ["media", "video", "audio"],
      default: "media",
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

    cloudURL: {
      type: String,
      required: true,
    },

    fileStatus: {
      type: String,
      enum: ["UPLOADING", "UPLOADED", "QUEUED", "PROCESSING", "READY", "FAILED"],
      default: "UPLOADING",
      required: true,
    },
    outputDir: { type: String },
    masterPlaylistPath: { type: String },
    variant: [
      { 
        resolution: {type: Number},
        url: { type: String },
        publicId: { type: String },
        playlistPath: { type: String },
    }
    ],
    hlsURL: { type: String }
  },
  {
    timestamps: true,
  }
);

mediaSchema.pre("save", async function() {
    this.hlsURL = `http://localhost:8000/hls${this.outputDir?.substring(hlsDir.length)}`;
});


mediaSchema.index({
  "artist.artistObjectID": 1,
  createdAt: -1,
});

mediaSchema.index({ fileStatus: 1 });

const mediaModel = mongoose.model("media", mediaSchema);

export default mediaModel;
