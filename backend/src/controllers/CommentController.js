import CommentService from "../services/CommentService";

class CommentController {
  async index(req, res, next) {
    try {
      const comentarios = await CommentService.findByPost(req.params.id);
      return res.json(comentarios);
    } catch (err) { next(err); }
  }

  async store(req, res, next) {
    try {
      const comentario = await CommentService.store(
        req.params.id,
        req.userId,
        req.body.content
      );
      return res.json(comentario);
    } catch (err) { next(err); }
  }

  async delete(req, res, next) {
    try {
      await CommentService.delete(req.params.postId, req.params.commentId, req.userId);
      return res.status(204).send();
    } catch (err) { next(err); }
  }
}

export default new CommentController();
