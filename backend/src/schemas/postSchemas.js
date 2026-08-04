import * as Yup from "yup";

export const postStoreSchema = Yup.object().shape({
  title: Yup.string().required(),
  content: Yup.string().required(),
  resume: Yup.string().required(),
  data_publicacao: Yup.date().required(),
});

export const postUpdateSchema = Yup.object().shape({
  title: Yup.string(),
  content: Yup.string(),
  resume: Yup.string(),
});
