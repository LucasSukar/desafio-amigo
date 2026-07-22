class PubliController {
  async index(req, res) {
    return res.sendStatus(200);
  }
}

export default new PubliController();
