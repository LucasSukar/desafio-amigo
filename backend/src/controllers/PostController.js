import Post from "../models/Post";
import User from "../models/User";

class PostController {
  async index(req, res) {
    const posts = await Post.findAll({
      attributes: ["id", "content", "created_at"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
      ],
    });
    return res.json(posts);
  }

  async store(req, res) {
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
    const { id } = req.params;
    const { content, title, resume } = req.body;

    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ error: "Post não encontrado" });
    }
    if (req.userId !== post.user_id) {
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
