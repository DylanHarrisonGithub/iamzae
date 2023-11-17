import { Schema, COMMON_REGEXES } from "../../services/validation/validation.service";

const updateCreateSchema: Schema = {
  subject: { type: 'string', attributes: { required: true, strLength: { maxLength: 48, minLength: 0 }}},
  date: { type: 'string', attributes: { required: true, strLength: { maxLength: 48, minLength: 0 }}},
  update: { type: 'string', attributes: { required: true, strLength: { minLength: 0 }}}
};

export default updateCreateSchema;