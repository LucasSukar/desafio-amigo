import Post from "../models/Post";
import PostLike from "../models/PostLike";
import User from "../models/User";
import { Op } from "sequelize";
import * as Yup from "yup";

class PostController {
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
          attributes: ["id", "name"],
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
        likes: undefined,
      };
    });
    return res.json(todosPosts);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      content: Yup.string().required(),
      resume: Yup.string().required(),
      data_publicacao: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "falha na validacao" });
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
    const schema = Yup.object().shape({
      title: Yup.string(),
      content: Yup.string(),
      resume: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "falha na validacao" });
    }

    const { id } = req.params;
    const { content, title, resume } = req.body;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ error: "Post não encontrado" });
    }
    if (req.userId != post.user_id) {
      return res.status(401).json({ error: "voce nao tem permissao para editar esse post" });
    }

    await post.update({ content, title, resume });
    return res.json(post);
  }

  async delete(req, res) {
    const { id } = req.params;
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    if (req.userId != post.user_id) {
      return res.status(401).json({ error: "voce nao tem permissao para deletar esse post" });
    }

    await post.destroy();
    return res.status(204).send();
  }
}

export default new PostController();
