import { Schema, COMMON_REGEXES } from "../../services/validation/validation.service";

const contactCreateSchema: Schema = {
  email: { type: COMMON_REGEXES.EMAIL, attributes: { required: true, strLength: { minLength: 5, maxLength: 64 }}},
  subject: { type: COMMON_REGEXES.COMMON_WRITING, attributes: { required: false, strLength: { maxLength: 128 }}},
  message: { type: COMMON_REGEXES.COMMON_WRITING, attributes: { required: true, strLength: { minLength: 4, maxLength: 1024}}}
};

export default contactCreateSchema;