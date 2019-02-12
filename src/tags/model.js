module.exports = (mongoose) => {
  const { Schema, model } = mongoose;

  const Tag = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
  });

  return model('Tag', Tag);
};
