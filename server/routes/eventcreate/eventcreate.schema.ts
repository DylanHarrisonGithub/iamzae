import { timeData } from "../../models/models"
import { Schema } from "../../services/validation/validation.service";

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

const eventCreateSchema: Schema = {
  day: { type: 'number', attributes: { required: true, range: { min: 1, max: 31 } } },
  month: { type: [...months], attributes: { required: true } },
  year: { type: 'number', attributes: { required: true, range: { min: 2020, max: 2120 } } },
  time: { type: [...times], attributes: { required: true }},
  location: { type: 'string', attributes: { required: true } },
  thumbnail: { type: 'string', attributes: { required: false } },
  description: { type: 'string', attributes: { required: true, strLength: { minLength: 5 } }},
  website: { type: 'string', attributes: { required: false }},
  period: { type: [...periods], attributes: { required: true } },
  media: { type: 'string', attributes: { required: false, array: { minLength: 0 }}}
};

export default eventCreateSchema;