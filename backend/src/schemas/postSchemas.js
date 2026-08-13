import * as Yup from "yup";

export const postStoreSchema = Yup.object().shape({
  title: Yup.string().required(),
  content: Yup.string().required(),
  resume: Yup.string(),
  data_publicacao: Yup.date(),
});

export const postUpdateSchema = Yup.object().shape({
  title: Yup.string(),
  content: Yup.string(),
  resume: Yup.string(),
});
