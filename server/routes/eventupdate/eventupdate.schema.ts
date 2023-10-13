import { timeData } from "../../models/models"
import { Schema } from "../../services/validation/validation.service";

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

const eventUpdateSchema: Schema = {
  id: { type: 'string | number', attributes: { required: true, range: { min: 0 }}},
  update: {
    type: {
      day: { type: 'number', attributes: { required: false, range: { min: 1, max: 31 } } },
      month: { type: [...months], attributes: { required: false } },
      year: { type: 'number', attributes: { required: false, range: { min: 2020, max: 2120 } } },
      time: { type: [...times], attributes: { required: false }},
      location: { type: 'string', attributes: { required: false } },
      thumbnail: { type: 'string', attributes: { required: false } },
      description: { type: 'string', attributes: { required: false, strLength: { minLength: 5 } }},
      website: { type: 'string', attributes: { required: false }},
      period: { type: [...periods], attributes: { required: false } },
      media: { type: 'string', attributes: { required: false, array: { minLength: 0 }}}
    },
    attributes: { required: true }
  }
};

export default eventUpdateSchema;