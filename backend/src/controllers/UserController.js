import { put } from "@vercel/blob";
import UserService from "../services/UserService";


async function uploadFile(file) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(file.originalname, file.buffer, {
      access: "public",
      contentType: file.mimetype,
    });
    return blob.url; 
  }

  return file.originalname + "-" + Date.now();
}

class UserController {
  async store(req, res, next) {
    try {
      const data = await UserService.create(req.body);
      return res.json(data);
    } catch (err) { next(err); }
  }

  async update(req, res, next) {
    try {
      const data = await UserService.update(req.userId, req.body);
      return res.json(data);
    } catch (err) { next(err); }
  }

  async me(req, res, next) {
    try {
      const user = await UserService.findMe(req.userId);
      return res.json(user);
    } catch (err) { next(err); }
  }

  async avatar(req, res, next) {
    try {
      if (!req.file) return res.status(400).json({ error: "Nenhum arquivo enviado." });
      const avatarUrl = await uploadFile(req.file);
      const data = await UserService.updateAvatar(req.userId, avatarUrl);
      return res.json(data);
    } catch (err) { next(err); }
  }

  async index(req, res, next) {
    try {
      const users = await UserService.findAll(req.userId);
      return res.json(users);
    } catch (err) { next(err); }
  }

  async follow(req, res, next) {
    try {
      const result = await UserService.toggleFollow(req.params.id, req.userId);
      return res.json(result);
    } catch (err) { next(err); }
  }

  async following(req, res, next) {
    try {
      const result = await UserService.findFollowing(req.userId);
      return res.json(result);
    } catch (err) { next(err); }
  }

  async getById(req, res, next) {
    try {
      const user = await UserService.findById(req.params.id, req.userId);
      return res.json(user);
    } catch (err) { next(err); }
  }

  async destroy(req, res, next) {
    try {
      await UserService.deleteAccount(req.userId);
      return res.status(204).send();
    } catch (err) { next(err); }
  }
}

export default new UserController();
