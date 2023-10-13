import { Schema } from "../../services/validation/validation.service";

const contactStreamSchema: Schema = {
  afterID: { type: 'string | number', attributes: { required: true, range: { min: 0 } }},
  numrows: { type: 'string | number', attributes: { required: true, range: { min: 0, max: 50 }}},
  search: { type: 'string', attributes: { required: false }},
  id: { type: 'string', attributes: { required: false }}
};

export default contactStreamSchema;