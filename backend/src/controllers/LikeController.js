import LikeService from "../services/LikeService";

class LikeController {
  async toggle(req, res, next) {
    try {
      const result = await LikeService.toggle(req.params.id, req.userId);
      return res.json(result);
    } catch (err) { next(err); }
  }
}

export default new LikeController();
