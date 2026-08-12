import Message from "../models/Message";
import User from "../models/User";
import { Op } from "sequelize";

class MessageService {
  // Busca todas as conversas do usuário (último msg de cada conversa)
  async getConversations(meId) {
    const db = Message.sequelize;

    const rows = await db.query(
      `SELECT
         CASE WHEN from_id = :me THEN to_id ELSE from_id END AS other_id,
         MAX(id) AS last_id
       FROM messages
       WHERE from_id = :me OR to_id = :me
       GROUP BY other_id`,
      { replacements: { me: meId }, type: db.QueryTypes.SELECT }
    );

    if (rows.length === 0) return [];

    const otherIds = rows.map((r) => r.other_id);

    const users = await User.findAll({
      where: { id: { [Op.in]: otherIds } },
      attributes: ["id", "name", "avatar_url"],
    });

    const lastMessages = await Message.findAll({
      where: { id: { [Op.in]: rows.map((r) => r.last_id) } },
    });

    return users.map((u) => {
      const row = rows.find((r) => r.other_id === u.id);
      const lastMsg = lastMessages.find((m) => m.id === row.last_id);
      return {
        user: { id: u.id, name: u.name, avatar_url: u.avatar_url },
        last_message: lastMsg ? lastMsg.content : null,
        last_at: lastMsg ? lastMsg.created_at : null,
      };
    }).sort((a, b) => new Date(b.last_at) - new Date(a.last_at));
  }

  // Busca mensagens entre dois usuários
  async getConversation(meId, otherId) {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { from_id: meId, to_id: otherId },
          { from_id: otherId, to_id: meId },
        ],
      },
      include: [
        { model: User, as: "sender", attributes: ["id", "name", "avatar_url"] },
      ],
      order: [["created_at", "ASC"]],
    });

    return messages.map((m) => ({
      id: m.id,
      content: m.content,
      from_id: m.from_id,
      to_id: m.to_id,
      from_me: m.from_id === meId,
      sender: m.sender,
      created_at: m.created_at,
    }));
  }

  async send(fromId, toId, content) {
    if (!content || content.trim() === "") {
      throw { status: 400, message: "Mensagem não pode estar vazia." };
    }

    const recipient = await User.findByPk(toId);
    if (!recipient) throw { status: 404, message: "Usuário destinatário não encontrado." };

    const msg = await Message.create({
      from_id: fromId,
      to_id: toId,
      content: content.trim(),
    });

    return {
      id: msg.id,
      content: msg.content,
      from_id: msg.from_id,
      to_id: msg.to_id,
      from_me: true,
      created_at: msg.created_at,
    };
  }
}

export default new MessageService();
