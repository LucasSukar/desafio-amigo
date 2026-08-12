import Post from "../models/Post";
import User from "../models/User";
import { COMMENT_MESSAGES } from "../constants/messages";

class CommentService {
  async findByPost(postId) {
    const post = await Post.findByPk(postId, {
      attributes: ["id", "comments"],
    });

    if (!post) {
      throw { status: 404, message: COMMENT_MESSAGES.POST_NOT_FOUND };
    }

    return JSON.parse(post.comments || "[]");
  }

  async store(postId, userId, content) {
    if (!content || content.trim() === "") {
      throw { status: 400, message: COMMENT_MESSAGES.COMMENT_EMPTY };
    }

    const post = await Post.findByPk(postId);
    if (!post) {
      throw { status: 404, message: COMMENT_MESSAGES.POST_NOT_FOUND };
    }

    const autor = await User.findByPk(userId, {
      attributes: ["id", "name", "avatar_url"],
    });

    const comentarios = JSON.parse(post.comments || "[]");

    const novoComentario = {
      id: Date.now(),
      content: content.trim(),
      user_id: userId,
      user_name: autor.name,
      user_avatar: autor.avatar_url,
      created_at: new Date().toISOString(),
    };

    comentarios.push(novoComentario);
    await post.update({ comments: JSON.stringify(comentarios) });

    return novoComentario;
  }

  async delete(postId, commentId, userId) {
    const post = await Post.findByPk(postId);
    if (!post) {
      throw { status: 404, message: COMMENT_MESSAGES.POST_NOT_FOUND };
    }

    const comentarios = JSON.parse(post.comments || "[]");
    const comentario = comentarios.find((c) => c.id == commentId);

    if (!comentario) {
      throw { status: 404, message: COMMENT_MESSAGES.COMMENT_NOT_FOUND };
    }

    if (comentario.user_id != userId && post.user_id != userId) {
      throw { status: 401, message: COMMENT_MESSAGES.NO_PERMISSION_DELETE };
    }

    const comentariosAtualizados = comentarios.filter((c) => c.id != commentId);
    await post.update({ comments: JSON.stringify(comentariosAtualizados) });
  }
}

export default new CommentService();
