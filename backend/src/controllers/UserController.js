import User from "../models/User";
import * as Yup from "yup";
class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "falha na validacao" });
    }

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
