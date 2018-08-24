const shell = require('shelljs')
const { expect } = require('chai')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const md5 = crypto.createHash('md5')
const exist = fs.existsSync

let hasSuffixImg = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
let noSuffixImg = 'https://avatar-static.segmentfault.com/368/601/3686016279-55649e72ee3cc_big64'

describe('download command test', () => {
  beforeEach(() => {
    let downloadTestPath = path.resolve(process.env.PWD, './downloadTest')
    if (exist(downloadTestPath)) {
      return
    } else {
      shell.mkdir('downloadTest')
    }
  })

  afterEach(() => {
    shell.rm('-rf', path.resolve(process.env.PWD, './downloadTest'))
  })

  it('should throw an error when download url not given', () => {
    const downloadResult = shell.exec('slj download')
    expect(downloadResult).to.have.property('stderr').equal('[slj-error]: download file url must be given.\n')
  })

  it("should return the file name itself", async () => {
    await shell.exec(`slj download -u ${hasSuffixImg} -d ./downloadTest`)
    expect(exist('./downloadTest/googlelogo_color_272x92dp.png')).to.be.true
  })

  it('the download file should be the specified name', async () => {
    await shell.exec(`slj download -u ${hasSuffixImg} -n test -d ./downloadTest`)
    expect(exist('./downloadTest/test.png')).to.be.true
  })

  it('the dwonload file should be in the specified destnation', async () => {
    await shell.exec(`slj download -u ${hasSuffixImg} -d ./test`)
    expect(exist('./test/googlelogo_color_272x92dp.png')).to.be.true
    shell.rm('-f', './test/googlelogo_color_272x92dp.png')
  })

  it('the download file should be the random name', async () => {
    let randomName = 'slj-' + md5.update(noSuffixImg).digest('hex').slice(0, 7)
    const downloadResut = await shell.exec(`slj download -u ${noSuffixImg} -d ./downloadTest`)
    expect(exist(`./downloadTest/${randomName}.png`)).to.be.true
  })
})
