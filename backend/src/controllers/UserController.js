import User from "../models/User";
import { userStoreSchema, userUpdateSchema } from "../schemas/userSchemas";
import { AUTH_MESSAGES, USER_MESSAGES } from "../constants/messages";

class UserController {
  async store(req, res) {
    if (!(await userStoreSchema.isValid(req.body))) {
      return res.status(400).json({ error: USER_MESSAGES.VALIDATION_FAIL });
    }

    const { name, email, password } = req.body;

    const emailExist = await User.findOne({ where: { email: email } });
    if (emailExist) {
      return res.status(400).json({ error: USER_MESSAGES.EMAIL_ALREADY_EXISTS });
    }

    const { id } = await User.create({ name, email, password });
    return res.json({ id, name, email });
  }

  async update(req, res) {
    if (!(await userUpdateSchema.isValid(req.body))) {
      return res.status(400).json({ error: USER_MESSAGES.VALIDATION_FAIL });
    }

    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const emailExist = await User.findOne({ where: { email } });
      if (emailExist) {
        return res.status(400).json({ error: USER_MESSAGES.EMAIL_ALREADY_EXISTS });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: AUTH_MESSAGES.WRONG_OLD_PASSWORD });
    }

    const { id, name, email: userEmail } = await user.update(req.body);
    return res.json({ id, name, email: userEmail });
  }

  async me(req, res) {
    const user = await User.findByPk(req.userId, {
      attributes: ["id", "name", "email", "avatar_url"],
    });
    if (!user) return res.status(404).json({ error: USER_MESSAGES.USER_NOT_FOUND });
    return res.json(user);
  }

  async avatar(req, res) {
    const avatar_url = req.file.filename;
    const user = await User.findByPk(req.userId);
    await user.update({ avatar_url });
    return res.json({ id: user.id, name: user.name, email: user.email, avatar_url: user.avatar_url });
  }

  async index(req, res) {
    const db = User.sequelize;

    const users = await User.findAll({
      attributes: ["id", "name", "avatar_url"],
    });

    const following = await db.query(
      "SELECT followed_id FROM user_follows WHERE follower_id = :me",
      { replacements: { me: req.userId }, type: db.QueryTypes.SELECT }
    );

    const followingIds = following.map((r) => r.followed_id);

    const result = users
      .filter((u) => u.id !== req.userId)
      .map((u) => ({
        id: u.id,
        name: u.name,
        avatar_url: u.avatar_url,
        jaSigo: followingIds.includes(u.id),
      }));

    return res.json(result);
  }

  async follow(req, res) {
    const { id } = req.params;
    const db = User.sequelize;

    if (parseInt(id) === req.userId) {
      return res.status(400).json({ error: "Você não pode se seguir." });
    }

    const [existing] = await db.query(
      "SELECT id FROM user_follows WHERE follower_id = :me AND followed_id = :target",
      { replacements: { me: req.userId, target: id }, type: db.QueryTypes.SELECT }
    );

    if (existing) {
      await db.query(
        "DELETE FROM user_follows WHERE follower_id = :me AND followed_id = :target",
        { replacements: { me: req.userId, target: id } }
      );
      return res.json({ seguindo: false });
    } else {
      await db.query(
        "INSERT INTO user_follows (follower_id, followed_id, created_at, updated_at) VALUES (:me, :target, NOW(), NOW())",
        { replacements: { me: req.userId, target: id } }
      );
      return res.json({ seguindo: true });
    }
  }

  async following(req, res) {
    const db = User.sequelize;

    const result = await db.query(
      `SELECT u.id, u.name, u.avatar_url
       FROM users u
       INNER JOIN user_follows f ON u.id = f.followed_id
       WHERE f.follower_id = :me`,
      { replacements: { me: req.userId }, type: db.QueryTypes.SELECT }
    );

    return res.json(result);
  }

  async getById(req, res) {
    const { id } = req.params;
    const db = User.sequelize;

    const user = await User.findByPk(id, {
      attributes: ["id", "name", "avatar_url"],
    });

    if (!user) return res.status(404).json({ error: USER_MESSAGES.USER_NOT_FOUND });

    const [followCheck] = await db.query(
      "SELECT id FROM user_follows WHERE follower_id = :me AND followed_id = :target",
      { replacements: { me: req.userId, target: id }, type: db.QueryTypes.SELECT }
    );

    const seguidoresResult = await db.query(
      "SELECT COUNT(*) as total_seguidores FROM user_follows WHERE followed_id = :id",
      { replacements: { id }, type: db.QueryTypes.SELECT }
    );

    const seguindoResult = await db.query(
      "SELECT COUNT(*) as total_seguindo FROM user_follows WHERE follower_id = :id",
      { replacements: { id }, type: db.QueryTypes.SELECT }
    );

    const total_seguidores = seguidoresResult[0] ? seguidoresResult[0].total_seguidores : 0;
    const total_seguindo = seguindoResult[0] ? seguindoResult[0].total_seguindo : 0;

    return res.json({
      id: user.id,
      name: user.name,
      avatar_url: user.avatar_url,
      jaSigo: !!followCheck,
      total_seguidores: parseInt(total_seguidores),
      total_seguindo: parseInt(total_seguindo),
    });
  }
}

export default new UserController();
