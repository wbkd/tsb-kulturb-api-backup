module.exports = (mongoose) => {
  const { Schema } = mongoose;
  const { Organisation } = mongoose.models;

  const Change = new Schema({
    create: { type: Boolean },
    meta: {
      organisation: {
        type: Schema.Types.ObjectId,
        ref: 'Organisation',
        autopopulate: true,
      },
    },
    data: Organisation.schema,
  }, { timestamps: true, toJSON: { virtuals: true } });

  return mongoose.model('Change', Change);
};
