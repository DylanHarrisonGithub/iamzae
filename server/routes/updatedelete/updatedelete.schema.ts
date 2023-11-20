import { Schema } from "../../services/validation/validation.service";

const updateDeleteSchema: Schema = {
  id: { type: 'string | number', attributes: { required: true, range: { min: 0 } }},
};

export default updateDeleteSchema;