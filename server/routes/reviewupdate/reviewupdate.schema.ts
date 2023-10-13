import { Schema } from "../../services/validation/validation.service";

const reviewUpdateSchema: Schema = {
  id: { type: 'string | number', attributes: { required: true, range: { min: 0 }}},
  update: {
    type: {
      approved: { type: 'boolean', attributes: { required: true } }
    },
    attributes: { required: true }
  }
};

export default reviewUpdateSchema;