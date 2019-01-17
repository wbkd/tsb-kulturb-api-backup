const AWS = require('aws-sdk');

module.exports = class Upload {
  constructor(db, config) {
    this.db = db;

    AWS.config.update({
      region: config.region,
    });

    this.S3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {
        Bucket: config.bucket,
      },
    });
  }

  uploadFile({
    file,
    filename,
    relation,
    relId,
    mime,
  }) {
    return this.S3.upload({
      Key: `${relation}/${relId}/${filename}`,
      Body: file,
      ACL: 'public-read',
      ContentType: mime,
    }).promise();
  }

  async create({
    filename,
    url,
    relation,
    type,
    relId,
  }) {
    return this.db.create({
      filename,
      url,
      type,
      relation,
      [relation]: relId,
    });
  }

  deleteFile({
    url,
  }) {
    return this.S3.deleteObject({
      Key: url,
    }).promise();
  }

  remove(_id) {
    return this.db.findByIdAndDelete(_id);
  }
};
