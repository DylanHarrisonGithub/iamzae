import { Schema, COMMON_REGEXES } from "../../services/validation/validation.service";

const reviewCreateSchema: Schema = {
  event: { type: 'number', attributes: { required: true, range: { min: 0 }}},
  name: { type: COMMON_REGEXES.ALPHA_NUMERIC_SPACES, attributes: { required: true, strLength: { minLength: 3, maxLength: 32 }}},
  stars: { type: [0,1,2,3,4,5, '0', '1', '2', '3', '4', '5'], attributes: { required: true }},
  text: { type: COMMON_REGEXES.COMMON_WRITING, attributes: { required: true, strLength: { minLength: 4, maxLength: 512 }}}
};

export default reviewCreateSchema;