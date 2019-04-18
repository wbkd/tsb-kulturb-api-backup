module.exports = (mongoose) => {
  const { Schema } = mongoose;

  const File = new Schema({
    filename: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    path: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ['logo', 'teaser'],
      required: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Organisation',
    },
  }, { timestamps: true, toJSON: { virtuals: true } });

  return mongoose.model('File', File);
};
