import User from "../models/User";

class UserController {
  async store(req, res) {
    const { name, email, password } = req.body;

    const emailExist = await User.findOne({ where: { email: email } });
    if (emailExist) {
      return res.status(400).json({ error: "email ja existe " });
    }

    const { id } = await User.create({
      name: name,
      email: email,
      password: password,
    });
    return res.json({ id, name, email });
  }
}

export default new UserController();
