/**
 * Middleware de validação de schema Yup.
 * Uso nas rotas: validate(meuSchema)
 * Rejeita a requisição com 400 se os dados do body forem inválidos.
 */
export const validate = (schema) => async (req, res, next) => {
  const valid = await schema.isValid(req.body);
  if (!valid) {
    return res.status(400).json({ error: "Dados inválidos. Verifique os campos enviados." });
  }
  next();
};
