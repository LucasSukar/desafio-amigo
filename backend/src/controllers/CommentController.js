import Post from "../models/Post";
import User from "../models/User";
import { COMMENT_MESSAGES } from "../constants/messages";

class CommentController {
  async index(req, res) {
    const { id } = req.params;

    const post = await Post.findByPk(id, {
      attributes: ["id", "comments"],
    });

    if (!post) {
      return res.status(404).json({ error: COMMENT_MESSAGES.POST_NOT_FOUND });
    }

    const comentarios = JSON.parse(post.comments || "[]");
    return res.json(comentarios);
  }

  async store(req, res) {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: COMMENT_MESSAGES.COMMENT_EMPTY });
    }

    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: COMMENT_MESSAGES.POST_NOT_FOUND });
    }

    const autor = await User.findByPk(req.userId, {
      attributes: ["id", "name", "avatar_url"],
    });

    const comentarios = JSON.parse(post.comments || "[]");

    const novoComentario = {
      id: Date.now(),
      content: content.trim(),
      user_id: req.userId,
      user_name: autor.name,
      user_avatar: autor.avatar_url,
      created_at: new Date().toISOString(),
    };

    comentarios.push(novoComentario);
    await post.update({ comments: JSON.stringify(comentarios) });

    return res.json(novoComentario);
  }

  async delete(req, res) {
    const { postId, commentId } = req.params;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: COMMENT_MESSAGES.POST_NOT_FOUND });
    }

    const comentarios = JSON.parse(post.comments || "[]");
    const comentario = comentarios.find((c) => c.id == commentId);

    if (!comentario) {
      return res.status(404).json({ error: COMMENT_MESSAGES.COMMENT_NOT_FOUND });
    }

    if (comentario.user_id != req.userId && post.user_id != req.userId) {
      return res.status(401).json({ error: COMMENT_MESSAGES.NO_PERMISSION_DELETE });
    }

    const comentariosAtualizados = comentarios.filter((c) => c.id != commentId);
    await post.update({ comments: JSON.stringify(comentariosAtualizados) });

    return res.status(204).send();
  }
}

export default new CommentController();
