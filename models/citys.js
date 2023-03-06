const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let citysSchema = new Schema(
{
    name: {type: String, required: true},
    description: {type: String, required: true},
    KnownFor: {type: String, required: true},
    population: {type: Number},
    Capital: {type: Boolean}
}
    //name: string
    //description: string
    //KnownFor: String
    //population: Number
    //Capital: Boolean
)

citysSchema.pre('findOneAndUpdate', function() {
  const update = this.getUpdate();
  if (update.__v != null) {
    delete update.__v;
  }
  const keys = ['$set', '$setOnInsert'];
  for (const key of keys) {
    if (update[key] != null && update[key].__v != null) {
      delete update[key].__v;
      if (Object.keys(update[key]).length === 0) {
        delete update[key];
      }
    }
  }
  update.$inc = update.$inc || {};
  update.$inc.__v = 1;
});

module.exports = mongoose.model("citys", citysSchema);
