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

    this.url = `https://s3-${config.region}.amazonaws.com/${config.bucket}/`;
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
    path,
    relation,
    type,
    relId,
  }) {
    return this.db.create({
      filename,
      path,
      url: `${this.url}${path}`,
      type,
      relation,
      [relation]: relId,
    });
  }

  deleteFile({
    path,
  }) {
    return this.S3.deleteObject({
      Key: path,
    }).promise();
  }

  remove(_id) {
    return this.db.findByIdAndDelete(_id);
  }
};
