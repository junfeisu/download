import Joi from 'joi'
import Boom from 'boom'

const testApi = {
  path: '/index',
  method: 'GET',
  handler: (req, h) => {
    return 'This is index API'
  }
}

export default [
  testApi,
]
