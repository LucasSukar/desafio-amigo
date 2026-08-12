import Post from "../models/Post";
import PostLike from "../models/PostLike";
import User from "../models/User";
import { Op } from "sequelize";
import { POST_MESSAGES } from "../constants/messages";

const POST_ATTRIBUTES = [
  "id", "title", "resume", "content", "created_at", "user_id", "data_publicacao", "image_url",
];

const POST_INCLUDES = [
  { model: User, as: "user", attributes: ["id", "name", "avatar_url"] },
  { model: PostLike, as: "likes", where: { is_deleted: false }, required: false },
];

function formatPost(postJSON, meId, forceOwner = false) {
  return {
    ...postJSON,
    total_likes: postJSON.likes.length,
    allowEdit: forceOwner || postJSON.user_id == meId,
    allowRemove: forceOwner || postJSON.user_id == meId,
    jaCurtiu: meId ? postJSON.likes.some((l) => l.user_id == meId) : false,
    likes: undefined,
  };
}

class PostService {
  async findAll(page = 1, meId) {
    const limit = 10;
    const offset = (page - 1) * limit;
    const posts = await Post.findAll({
      attributes: POST_ATTRIBUTES,
      include: POST_INCLUDES,
      limit, offset,
      order: [["data_publicacao", "DESC"]],
      where: { data_publicacao: { [Op.lte]: new Date() } },
    });
    return posts.map((p) => formatPost(p.toJSON(), meId));
  }

  async findMine(meId) {
    const posts = await Post.findAll({
      attributes: POST_ATTRIBUTES,
      include: POST_INCLUDES,
      order: [["data_publicacao", "DESC"]],
      where: { user_id: meId, data_publicacao: { [Op.lte]: new Date() } },
    });
    return posts.map((p) => formatPost(p.toJSON(), meId, true));
  }

  async findByUser(userId, meId) {
    const posts = await Post.findAll({
      attributes: POST_ATTRIBUTES,
      include: POST_INCLUDES,
      order: [["data_publicacao", "DESC"]],
      where: { user_id: userId, data_publicacao: { [Op.lte]: new Date() } },
    });
    return posts.map((p) => formatPost(p.toJSON(), meId));
  }

  async findFollowersPosts(meId, page = 1) {
    const db = Post.sequelize;
    const limit = 10;
    const offset = (page - 1) * limit;
    const seguidos = await db.query(
      "SELECT followed_id FROM user_follows WHERE follower_id = :me",
      { replacements: { me: meId }, type: db.QueryTypes.SELECT }
    );
    const seguidosIds = seguidos.map((s) => s.followed_id);
    if (seguidosIds.length === 0) return [];

    const posts = await Post.findAll({
      attributes: POST_ATTRIBUTES,
      include: POST_INCLUDES,
      limit, offset,
      order: [["data_publicacao", "DESC"]],
      where: { user_id: { [Op.in]: seguidosIds }, data_publicacao: { [Op.lte]: new Date() } },
    });
    return posts.map((p) => formatPost(p.toJSON(), meId));
  }

  async findById(id, meId) {
    const post = await Post.findOne({
      where: { id },
      attributes: ["id", "title", "resume", "content", "user_id", "data_publicacao", "image_url"],
      include: POST_INCLUDES,
    });
    if (!post) throw { status: 404, message: POST_MESSAGES.POST_NOT_FOUND };
    return formatPost(post.toJSON(), meId);
  }

  async create({ title, content, resume, data_publicacao, image_url }, meId) {
    return Post.create({ title, content, resume, data_publicacao, image_url, user_id: meId });
  }

  async update(id, meId, { title, content, resume }) {
    const post = await Post.findByPk(id);
    if (!post) throw { status: 404, message: POST_MESSAGES.POST_NOT_FOUND };
    if (post.user_id != meId) throw { status: 401, message: POST_MESSAGES.NO_PERMISSION_EDIT };
    await post.update({ title, content, resume });
    return post;
  }

  async delete(id, meId) {
    const post = await Post.findByPk(id);
    if (!post) throw { status: 404, message: POST_MESSAGES.POST_NOT_FOUND };
    if (post.user_id != meId) throw { status: 401, message: POST_MESSAGES.NO_PERMISSION_DELETE };
    await post.destroy();
  }
}

export default new PostService();
