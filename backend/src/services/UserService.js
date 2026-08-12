import User from "../models/User";
import Post from "../models/Post";
import { USER_MESSAGES, AUTH_MESSAGES } from "../constants/messages";

class UserService {
  async create({ name, email, password }) {
    const emailExist = await User.findOne({ where: { email } });
    if (emailExist) throw { status: 400, message: USER_MESSAGES.EMAIL_ALREADY_EXISTS };
    const { id } = await User.create({ name, email, password });
    return { id, name, email };
  }

  async update(userId, body) {
    const { email, oldPassword } = body;
    const user = await User.findByPk(userId);

    if (email && email !== user.email) {
      const emailExist = await User.findOne({ where: { email } });
      if (emailExist) throw { status: 400, message: USER_MESSAGES.EMAIL_ALREADY_EXISTS };
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      throw { status: 401, message: AUTH_MESSAGES.WRONG_OLD_PASSWORD };
    }

    const { id, name, email: userEmail } = await user.update(body);
    return { id, name, email: userEmail };
  }

  async findMe(userId) {
    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "avatar_url"],
    });
    if (!user) throw { status: 404, message: USER_MESSAGES.USER_NOT_FOUND };
    return user;
  }

  async updateAvatar(userId, filename) {
    const user = await User.findByPk(userId);
    await user.update({ avatar_url: filename });
    const updated = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "avatar_url"],
    });
    return { id: updated.id, name: updated.name, email: updated.email, avatar_url: updated.avatar_url };
  }

  async findAll(meId) {
    const db = User.sequelize;
    const users = await User.findAll({ attributes: ["id", "name", "avatar_url"] });
    const following = await db.query(
      "SELECT followed_id FROM user_follows WHERE follower_id = :me",
      { replacements: { me: meId }, type: db.QueryTypes.SELECT }
    );
    const followingIds = following.map((r) => r.followed_id);
    return users
      .filter((u) => u.id !== meId)
      .map((u) => ({ id: u.id, name: u.name, avatar_url: u.avatar_url, jaSigo: followingIds.includes(u.id) }));
  }

  async findById(id, meId) {
    const db = User.sequelize;
    const user = await User.findByPk(id, { attributes: ["id", "name", "avatar_url"] });
    if (!user) throw { status: 404, message: USER_MESSAGES.USER_NOT_FOUND };

    const [followCheck] = await db.query(
      "SELECT id FROM user_follows WHERE follower_id = :me AND followed_id = :target",
      { replacements: { me: meId, target: id }, type: db.QueryTypes.SELECT }
    );
    const seguidoresResult = await db.query(
      "SELECT COUNT(*) as total_seguidores FROM user_follows WHERE followed_id = :id",
      { replacements: { id }, type: db.QueryTypes.SELECT }
    );
    const seguindoResult = await db.query(
      "SELECT COUNT(*) as total_seguindo FROM user_follows WHERE follower_id = :id",
      { replacements: { id }, type: db.QueryTypes.SELECT }
    );

    return {
      id: user.id, name: user.name, avatar_url: user.avatar_url,
      jaSigo: !!followCheck,
      total_seguidores: parseInt(seguidoresResult[0]?.total_seguidores ?? 0),
      total_seguindo: parseInt(seguindoResult[0]?.total_seguindo ?? 0),
    };
  }

  async findFollowing(meId) {
    const db = User.sequelize;
    return db.query(
      `SELECT u.id, u.name, u.avatar_url
       FROM users u
       INNER JOIN user_follows f ON u.id = f.followed_id
       WHERE f.follower_id = :me`,
      { replacements: { me: meId }, type: db.QueryTypes.SELECT }
    );
  }

  async toggleFollow(targetId, meId) {
    const db = User.sequelize;
    if (parseInt(targetId) === meId) throw { status: 400, message: USER_MESSAGES.CANNOT_FOLLOW_SELF };

    const [existing] = await db.query(
      "SELECT id FROM user_follows WHERE follower_id = :me AND followed_id = :target",
      { replacements: { me: meId, target: targetId }, type: db.QueryTypes.SELECT }
    );

    if (existing) {
      await db.query("DELETE FROM user_follows WHERE follower_id = :me AND followed_id = :target",
        { replacements: { me: meId, target: targetId } });
      return { seguindo: false };
    } else {
      await db.query(
        "INSERT INTO user_follows (follower_id, followed_id, created_at, updated_at) VALUES (:me, :target, NOW(), NOW())",
        { replacements: { me: meId, target: targetId } }
      );
      return { seguindo: true };
    }
  }

  async deleteAccount(userId) {
    const user = await User.findByPk(userId);
    if (!user) throw { status: 404, message: USER_MESSAGES.USER_NOT_FOUND };
    // Cascade deletes posts, likes, comments, follows via FK onDelete CASCADE
    await user.destroy();
  }
}

export default new UserService();
