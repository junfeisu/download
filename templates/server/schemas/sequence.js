const mongoose = require('mongoose')
const Schema = mongoose.Schema
const models = {}

const testGenerateSchema = new Schema({
  _id: string,
  next: {
    type: Number,
    default: 1
  }
})

const increase = function (SchemaName, cb) {
  return this.collection.findOneAndUpdate(
    {_id: SchemaName},
    {$inc: {next: 1}},
    {upsert: true, returnNewDocument: true},
    cb
  )
}

testGenerateSchema.statics.increase = increase

models.test = mongoose.model('TestGenerate', testGenerateSchema)

module.exports = models
