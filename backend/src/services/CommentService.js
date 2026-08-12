import Comment from "../models/Comment";
import Post from "../models/Post";
import User from "../models/User";
import { COMMENT_MESSAGES } from "../constants/messages";

class CommentService {
  async findByPost(postId) {
    const post = await Post.findByPk(postId);
    if (!post) throw { status: 404, message: COMMENT_MESSAGES.POST_NOT_FOUND };

    const comments = await Comment.findAll({
      where: { post_id: postId },
      include: [
        { model: User, as: "user", attributes: ["id", "name", "avatar_url"] },
      ],
      order: [["created_at", "ASC"]],
    });

    return comments.map((c) => ({
      id: c.id,
      content: c.content,
      user_id: c.user_id,
      user_name: c.user ? c.user.name : null,
      user_avatar: c.user ? c.user.avatar_url : null,
      created_at: c.created_at,
    }));
  }

  async store(postId, userId, content) {
    if (!content || content.trim() === "") {
      throw { status: 400, message: COMMENT_MESSAGES.COMMENT_EMPTY };
    }

    const post = await Post.findByPk(postId);
    if (!post) throw { status: 404, message: COMMENT_MESSAGES.POST_NOT_FOUND };

    const autor = await User.findByPk(userId, {
      attributes: ["id", "name", "avatar_url"],
    });

    const comentario = await Comment.create({
      post_id: postId,
      user_id: userId,
      content: content.trim(),
    });

    return {
      id: comentario.id,
      content: comentario.content,
      user_id: userId,
      user_name: autor.name,
      user_avatar: autor.avatar_url,
      created_at: comentario.created_at,
    };
  }

  async delete(postId, commentId, userId) {
    const post = await Post.findByPk(postId);
    if (!post) throw { status: 404, message: COMMENT_MESSAGES.POST_NOT_FOUND };

    const comentario = await Comment.findOne({
      where: { id: commentId, post_id: postId },
    });

    if (!comentario) throw { status: 404, message: COMMENT_MESSAGES.COMMENT_NOT_FOUND };

    if (comentario.user_id != userId && post.user_id != userId) {
      throw { status: 401, message: COMMENT_MESSAGES.NO_PERMISSION_DELETE };
    }

    await comentario.destroy();
  }
}

export default new CommentService();
