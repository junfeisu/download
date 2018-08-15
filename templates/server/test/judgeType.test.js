import judgeType from '../utils/judgeType'
import Lab from 'lab'
import { expect } from 'chai'

const lab = exports.lab = Lab.script()
const { describe, it } = lab

describe('judgeType function test', () => {
  it('should return the boolean', done => {
    const result = judgeType('string')('string')
    expect(result).to.be.a('boolean')
    done()
  })
})