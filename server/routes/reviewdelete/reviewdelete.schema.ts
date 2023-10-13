import { Schema } from "../../services/validation/validation.service";

const reviewDeleteSchema: Schema = {
  id: { type: 'string | number', attributes: { required: true, range: { min: 0 } }},
};

export default reviewDeleteSchema;