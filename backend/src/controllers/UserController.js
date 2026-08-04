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

    const { id } = await User.create({
      name: name,
      email: email,
      password: password,
    });
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
      attributes: ["id", "name", "email", "avatar_url"]
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
}

export default new UserController();
