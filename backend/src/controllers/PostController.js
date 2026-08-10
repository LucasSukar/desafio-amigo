import Post from "../models/Post";
import PostLike from "../models/PostLike";
import User from "../models/User";
import { Op } from "sequelize";
import { postStoreSchema, postUpdateSchema } from "../schemas/postSchemas";
import { POST_MESSAGES } from "../constants/messages";

class PostController {
  async me(req, res) {
    const posts = await Post.findAll({
      attributes: [
        "id",
        "title",
        "resume",
        "content",
        "created_at",
        "user_id",
        "data_publicacao",
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "avatar_url"],
        },
        {
          model: PostLike,
          as: "likes",
          where: { is_deleted: false },
          required: false,
        },
      ],
      order: [["data_publicacao", "DESC"]],
      where: {
        user_id: req.userId,
        data_publicacao: { [Op.lte]: new Date() },
      },
    });

    const meusPosts = posts.map((post) => {
      const postJSON = post.toJSON();
      return {
        ...postJSON,
        total_likes: postJSON.likes.length,
        allowEdit: true,
        allowRemove: true,
        jaCurtiu: postJSON.likes.some((l) => l.user_id == req.userId),
        likes: undefined,
      };
    });

    return res.json(meusPosts);
  }

  async byUser(req, res) {
    const userId = req.params.userId;
    const posts = await Post.findAll({
      attributes: [
        "id",
        "title",
        "resume",
        "content",
        "created_at",
        "user_id",
        "data_publicacao",
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "avatar_url"],
        },
        {
          model: PostLike,
          as: "likes",
          where: { is_deleted: false },
          required: false,
        },
      ],
      order: [["data_publicacao", "DESC"]],
      where: {
        user_id: userId,
        data_publicacao: { [Op.lte]: new Date() },
      },
    });

    const userPosts = posts.map((post) => {
      const postJSON = post.toJSON();
      return {
        ...postJSON,
        total_likes: postJSON.likes.length,
        allowEdit: req.userId == userId,
        allowRemove: req.userId == userId,
        jaCurtiu: req.userId ? postJSON.likes.some((l) => l.user_id == req.userId) : false,
        likes: undefined,
      };
    });

    return res.json(userPosts);
  }

  async postDosSeguidores(req, res) {
    const db = Post.sequelize;
    const page = req.query.page || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const seguidos = await db.query(
      "SELECT followed_id FROM user_follows WHERE follower_id = :me",
      { replacements: { me: req.userId }, type: db.QueryTypes.SELECT }
    );

    const seguidosIds = seguidos.map((s) => s.followed_id);

    if (seguidosIds.length === 0) {
      return res.json([]);
    }

    const posts = await Post.findAll({
      attributes: ["id", "title", "resume", "content", "created_at", "user_id", "data_publicacao"],
      include: [
        { model: User, as: "user", attributes: ["id", "name", "avatar_url"] },
        { model: PostLike, as: "likes", where: { is_deleted: false }, required: false },
      ],
      limit,
      offset,
      order: [["data_publicacao", "DESC"]],
      where: {
        user_id: { [Op.in]: seguidosIds },
        data_publicacao: { [Op.lte]: new Date() },
      },
    });

    const resultado = posts.map((post) => {
      const postJSON = post.toJSON();
      return {
        ...postJSON,
        total_likes: postJSON.likes.length,
        allowEdit: postJSON.user_id == req.userId,
        allowRemove: postJSON.user_id == req.userId,
        jaCurtiu: postJSON.likes.some((l) => l.user_id == req.userId),
        likes: undefined,
      };
    });

    return res.json(resultado);
  }

  async index(req, res) {
    const page = req.query.page || 1;
    const limit = 10;
    let offset = (page - 1) * limit;

    const posts = await Post.findAll({
      attributes: [
        "id",
        "title",
        "resume",
        "content",
        "created_at",
        "user_id",
        "data_publicacao",
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "avatar_url"],
        },
        {
          model: PostLike,
          as: "likes",
          where: { is_deleted: false },
          required: false,
        },
      ],
      limit,
      offset,
      order: [["data_publicacao", "DESC"]],
      where: { data_publicacao: { [Op.lte]: new Date() } },
    });

    const todosPosts = posts.map((post) => {
      const postJSON = post.toJSON();
      return {
        ...postJSON,
        total_likes: postJSON.likes.length,
        allowEdit: postJSON.user_id == req.userId,
        allowRemove: postJSON.user_id == req.userId,
        jaCurtiu: postJSON.likes.some((l) => l.user_id == req.userId),
        likes: undefined,
      };
    });
    return res.json(todosPosts);
  }

  async show(req, res) {
    const { id } = req.params;

    const post = await Post.findOne({
      where: { id },
      attributes: ["id", "title", "resume", "content", "user_id", "data_publicacao"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "avatar_url"],
        },
        {
          model: PostLike,
          as: "likes",
          where: { is_deleted: false },
          required: false,
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: POST_MESSAGES.POST_NOT_FOUND });
    }

    const postJSON = post.toJSON();
    return res.json({
      ...postJSON,
      total_likes: postJSON.likes.length,
      allowEdit: postJSON.user_id == req.userId,
      allowRemove: postJSON.user_id == req.userId,
      jaCurtiu: postJSON.likes.some((l) => l.user_id == req.userId),
      likes: undefined,
    });
  }

  async store(req, res) {
    if (!(await postStoreSchema.isValid(req.body))) {
      return res.status(400).json({ error: POST_MESSAGES.VALIDATION_FAIL });
    }
    const { title, content, resume, data_publicacao } = req.body;

    const post = await Post.create({
      title,
      content,
      resume,
      data_publicacao,
      user_id: req.userId,
    });

    return res.json(post);
  }

  async update(req, res) {
    if (!(await postUpdateSchema.isValid(req.body))) {
      return res.status(400).json({ error: POST_MESSAGES.VALIDATION_FAIL });
    }

    const { id } = req.params;
    const { content, title, resume } = req.body;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ error: POST_MESSAGES.POST_NOT_FOUND });
    }
    if (req.userId != post.user_id) {
      return res
        .status(401)
        .json({ error: POST_MESSAGES.NO_PERMISSION_EDIT });
    }

    await post.update({ content, title, resume });
    return res.json(post);
  }

  async delete(req, res) {
    const { id } = req.params;
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ error: POST_MESSAGES.POST_NOT_FOUND });
    }

    if (req.userId != post.user_id) {
      return res
        .status(401)
        .json({ error: POST_MESSAGES.NO_PERMISSION_DELETE });
    }

    await post.destroy();
    return res.status(204).send();
  }
}

export default new PostController();
