module.exports = class Controller {
  constructor(service) {
    this.service = service;
  }

  async create(request, h) {
    const {
      file,
      relation,
      relId,
      type,
    } = request.payload;
    const { filename } = file.hapi;
    const mime = file.hapi.headers['content-type'];

    const { key } = await this.service.uploadFile({
      file,
      filename,
      relation,
      relId,
      mime,
    });

    return this.service.create({
      filename,
      path: key,
      relation,
      relId,
      type,
    });
  }

  async remove(request, h) {
    const { _id } = request.params;
    const removed = await this.service.remove(_id);

    if (removed) {
      const { path } = removed;
      return this.service.deleteFile(path);
    }
    return h.notFound();
  }
};
