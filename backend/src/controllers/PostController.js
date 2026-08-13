import { put } from "@vercel/blob";
import PostService from "../services/PostService";


async function uploadFile(file) {
  if (!file) return null;
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(file.originalname, file.buffer, {
      access: "public",
      contentType: file.mimetype,
    });
    return blob.url; 
  }

  return null;
}

class PostController {
  async index(req, res, next) {
    try {
      const posts = await PostService.findAll(req.query.page, req.userId);
      return res.json(posts);
    } catch (err) { next(err); }
  }

  async me(req, res, next) {
    try {
      const posts = await PostService.findMine(req.userId);
      return res.json(posts);
    } catch (err) { next(err); }
  }

  async byUser(req, res, next) {
    try {
      const posts = await PostService.findByUser(req.params.userId, req.userId);
      return res.json(posts);
    } catch (err) { next(err); }
  }

  async postDosSeguidores(req, res, next) {
    try {
      const posts = await PostService.findFollowersPosts(req.userId, req.query.page);
      return res.json(posts);
    } catch (err) { next(err); }
  }

  async show(req, res, next) {
    try {
      const post = await PostService.findById(req.params.id, req.userId);
      return res.json(post);
    } catch (err) { next(err); }
  }

  async store(req, res, next) {
    try {
      const image_url = await uploadFile(req.file);
      const post = await PostService.create({ ...req.body, image_url }, req.userId);
      return res.json(post);
    } catch (err) { next(err); }
  }

  async update(req, res, next) {
    try {
      const post = await PostService.update(req.params.id, req.userId, req.body);
      return res.json(post);
    } catch (err) { next(err); }
  }

  async delete(req, res, next) {
    try {
      await PostService.delete(req.params.id, req.userId);
      return res.status(204).send();
    } catch (err) { next(err); }
  }
}

export default new PostController();
