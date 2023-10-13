import { Schema } from "../../services/validation/validation.service";
//{ username?: string, avatar?: string, privilege?: string } 
const userUpdateSchema: Schema = {
  id: {
    type: 'number',
    attributes: {
      required: true
    }
  },
  update: {
    type: {
      username: {
        type: 'string',
        attributes: {
          required: false,
          strLength: { minLength: 6 }
        }
      },
      avatar: {
        type: 'string',
        attributes: {
          required: false
        }
      },
      privilege: {
        type: ['guest', 'user', 'admin'],
        attributes: {
          required: false
        }
      }
    },
    attributes: {
      required: false
    }
  }
}

export default userUpdateSchema;