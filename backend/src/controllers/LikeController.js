import PostLike from "../models/PostLike";


class LikeController {
  async toggle(req, res) {
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
