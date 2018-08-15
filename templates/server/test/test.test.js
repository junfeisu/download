import Lab from 'lab'
import { expect } from 'chai'
import server from '../server'

const lab = exports.lab = Lab.script()
const { describe, it, before, after } = lab

describe('test route test', () => {
  before(done => {
    server.start()
    done()
  })

  it('should return the test string', async () => {
    const testResponse = await server.inject({
      method: 'GET',
      url: '/index'
    })

    expect(testResponse).to.have.property('statusCode', 200)
    expect(testResponse).to.have.property('payload', 'This is index API')
  })
})
