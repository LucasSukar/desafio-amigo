import jwt from "jsonwebtoken";
import User from "../models/User";

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "usuário não encontrado" });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: "senha incorreta" });
    }

    const { id, name } = user;

    const token = jwt.sign({ id }, "teste", { expiresIn: "7d" });

    return res.json({
      id,
      name,
      email,
      token,
    });
  }
}

export default new SessionController();
