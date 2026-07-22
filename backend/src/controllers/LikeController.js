import PostLike from "../models/PostLike";
import Post from "../models/Post";
class LikeController {
  async toggle(req, res) {
    const postExiste = await Post.findByPk(post_id);
    if (!postExiste) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    const post_id = req.params.id;
    const user_id = req.userId;
    const like = await PostLike.findOne({ where: { post_id, user_id } });

    if (!like) {
      await PostLike.create({
        post_id,
        user_id,
        is_deleted: false,
        liked_at: new Date(),
      });
    } else {
      like.is_deleted = !like.is_deleted;
      like.liked_at = new Date();
      await like.save();
    }
    return res.json({ message: "Like atualizado" });
  }
}

export default new LikeController();
