import { Schema } from "../../services/validation/validation.service";

const contactDeleteSchema: Schema = {
  id: { type: 'string | number', attributes: { required: true, range: { min: 0 } }},
};

export default contactDeleteSchema;