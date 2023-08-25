const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  ownerId: String,
  guildId: String,
  projectName: String,
  categoryId: String,
  channels: {
    type: [
      {
        name: String,
        channelType: Number,
        id: String
      }
    ],
    default: []
  },
  users: {
    type: [],
    default: []
  }
},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Projects", projectSchema);