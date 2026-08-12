import MessageService from "../services/MessageService";

class MessageController {
  async conversations(req, res, next) {
    try {
      const list = await MessageService.getConversations(req.userId);
      return res.json(list);
    } catch (err) { next(err); }
  }

  async index(req, res, next) {
    try {
      const messages = await MessageService.getConversation(req.userId, req.params.userId);
      return res.json(messages);
    } catch (err) { next(err); }
  }

  async store(req, res, next) {
    try {
      const msg = await MessageService.send(req.userId, req.params.userId, req.body.content);
      return res.json(msg);
    } catch (err) { next(err); }
  }
}

export default new MessageController();
