import PostLike from "../models/PostLike";
import Post from "../models/Post";
import { POST_MESSAGES, LIKE_MESSAGES } from "../constants/messages";

class LikeService {
  async toggle(postId, userId) {
    const post = await Post.findByPk(postId);
    if (!post) {
      throw { status: 404, message: POST_MESSAGES.POST_NOT_FOUND };
    }

    const like = await PostLike.findOne({ where: { post_id: postId, user_id: userId } });

    if (!like) {
      await PostLike.create({
        post_id: postId,
        user_id: userId,
        is_deleted: false,
        liked_at: new Date(),
      });
    } else {
      like.is_deleted = !like.is_deleted;
      like.liked_at = new Date();
      await like.save();
    }

    return { message: LIKE_MESSAGES.LIKE_UPDATED };
  }
}

export default new LikeService();
