function deleteEmptyValues() {
  Object.keys(this._update).forEach((key) => {
    if (this._update[key] === '') {
      if (!this._update.$unset) this._update.$unset = {};
      this._update.$unset[key] = 1;
      delete this._update[key];
    }
  });
}

const deleteEmptyValuesPlugin = (schema) => {
  schema.pre('update', deleteEmptyValues);
  schema.pre('findOneAndUpdate', deleteEmptyValues);
};

module.exports = deleteEmptyValuesPlugin;
