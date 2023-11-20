import { Schema } from "../../services/validation/validation.service";

const updateUpdateSchema: Schema = {
  id: {
    type: 'number',
    attributes: {
      required: true
    }
  },
  update: {
    type: {
      subject: { type: 'string', attributes: { required: false, strLength: { maxLength: 48, minLength: 0 }}},
      date: { type: 'string', attributes: { required: false, strLength: { maxLength: 48, minLength: 0 }}},
      update: { type: 'string', attributes: { required: false, strLength: { minLength: 0 }}}
    },
    attributes: {
      required: false
    }
  }
}

export default updateUpdateSchema;