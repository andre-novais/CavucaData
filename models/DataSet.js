var mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
var slug = require("slug");

var DataSetSchema = new mongoose.Schema(
  {
    slug: { type: String, lowercase: true, unique: true },
    name: String,
    organization: String,
    group: String,
    tags: [{ type: String }],
    source: String,
    author: String,
    maintainer: String,
    version: String,
    last_update: String,
    created_at: String,
    data: [
      {
        name: String,
        description: String,
        format: String,
        download_url: String,
      },
    ],
  },
  { timestamps: true }
);

DataSetSchema.plugin(uniqueValidator, { message: "is already taken" });

mongoose.model("DataSet", DataSetSchema);
